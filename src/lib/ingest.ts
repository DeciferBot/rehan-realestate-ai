import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabaseAdmin } from "./supabase-server";
import { getActiveTenantId } from "./spine";

/**
 * Automated inventory ingestion: an availability sheet (PDF or extracted text)
 * → structured units (via Claude structured outputs) → upserted into the spine
 * (projects / units / documents). This is the repeatable version of the manual
 * extraction; it's what a "drop a developer's sheet" flow runs.
 */

const MODEL = "claude-sonnet-4-6";

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    projects: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          developer: { type: "string" },
          name: { type: "string" },
          location: { type: "string" },
          completion: { type: "string" },
          payment_plan: { type: "string" },
          units: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                ref: { type: "string" },
                bedrooms: { type: "integer" },
                unit_type: { type: "string" },
                view: { type: "string" },
                sqft: { type: "number" },
                price: { type: "number" },
              },
              required: ["ref", "bedrooms", "unit_type", "view", "sqft", "price"],
            },
          },
        },
        required: ["developer", "name", "location", "completion", "payment_plan", "units"],
      },
    },
  },
  required: ["projects"],
} as const;

const INSTRUCTION =
  "Extract every available unit from this real-estate availability report into the schema. " +
  "Create one entry in `projects` per distinct building / tower / cluster. " +
  "`ref` is the unit or plot number exactly as printed (e.g. 'WRDH1-0201', 'MEL-V047'). " +
  "`bedrooms` is the integer bedroom count ('2 BR + Maids' -> 2, '6 BR-PH' -> 6, '5BR Duplex' -> 5). " +
  "`unit_type` is the full type label. `view` is the View/Location column. " +
  "`sqft` is the saleable area as a number. `price` is the selling price in AED as a number (no commas). " +
  "`payment_plan` is a one-line summary of the installment plan. Include ALL units listed.";

type ParsedUnit = { ref: string; bedrooms: number; unit_type: string; view: string; sqft: number; price: number };
type ParsedProject = {
  developer: string;
  name: string;
  location: string;
  completion: string;
  payment_plan: string;
  units: ParsedUnit[];
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
}

export type IngestResult = {
  projects: { name: string; units: number }[];
  totalUnits: number;
};

export async function ingestAvailability(input: {
  text?: string;
  base64?: string;
  filename: string;
}): Promise<IngestResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("Missing ANTHROPIC_API_KEY");
  const client = new Anthropic({ apiKey: key });

  const content: unknown[] = [];
  if (input.base64) {
    content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: input.base64 } });
  }
  if (input.text) {
    content.push({ type: "text", text: "AVAILABILITY REPORT:\n\n" + input.text });
  }
  content.push({ type: "text", text: INSTRUCTION });

  const params = {
    model: MODEL,
    max_tokens: 16000,
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
    messages: [{ role: "user", content }],
  };
  const resp = await client.messages.create(
    params as unknown as Anthropic.Messages.MessageCreateParamsNonStreaming
  );
  const raw = resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  const parsed = JSON.parse(raw) as { projects: ParsedProject[] };

  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();
  const out: IngestResult = { projects: [], totalUnits: 0 };

  for (const p of parsed.projects ?? []) {
    const ref = slugify(p.name);
    const { data: proj, error } = await sb
      .from("projects")
      .upsert(
        {
          tenant_id: tenantId,
          ref,
          developer: p.developer || "Arada",
          name: p.name,
          location: p.location,
          completion: p.completion,
          description: p.payment_plan ? `Payment plan: ${p.payment_plan}.` : null,
        },
        { onConflict: "tenant_id,ref" }
      )
      .select("id")
      .single();
    if (error) throw error;
    const projectId = (proj as { id: string }).id;

    const unitRows = (p.units ?? []).map((u) => ({
      tenant_id: tenantId,
      project_id: projectId,
      ref: u.ref,
      type: (u.unit_type || "").toLowerCase().includes("villa") ? "Villa" : "Apartment",
      bedrooms: u.bedrooms,
      price: u.price,
      currency: "AED",
      sqft: Math.round(u.sqft || 0),
      amenities: [u.view, u.unit_type].filter(Boolean),
      tags: ["off-plan", "sale"],
      status: "available",
    }));
    if (unitRows.length) {
      const { error: uErr } = await sb.from("units").upsert(unitRows, { onConflict: "tenant_id,ref" });
      if (uErr) throw uErr;
    }

    await sb.from("documents").insert({
      tenant_id: tenantId,
      project_id: projectId,
      kind: "availability",
      title: input.filename,
      source_url: input.filename,
      extracted: {
        developer: p.developer,
        completion: p.completion,
        payment_plan: p.payment_plan,
        units: (p.units ?? []).length,
      },
    });

    out.projects.push({ name: p.name, units: unitRows.length });
    out.totalUnits += unitRows.length;
  }

  return out;
}
