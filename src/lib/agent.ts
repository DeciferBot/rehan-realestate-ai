import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabaseAdmin } from "./supabase-server";
import { getActiveTenantId } from "./spine";
import { sendEmail, threadSubject, resolveEmailCreds } from "./email";
import { checkGrounding, safeFallback, type InventoryFacts } from "./guardrail";
import { getSecret } from "./integrations";

/**
 * The agent runtime — the brain of the command center.
 *
 * Loads the tenant's programmable agent_config, the conversation memory, and
 * the real inventory, calls Claude, and writes the agent's reply back into the
 * conversation as a message. Channel-agnostic: the same runtime drives voice,
 * WhatsApp, and email once each adapter feeds messages into the spine.
 */

const MODEL = "claude-opus-4-8";

function getAnthropic(key?: string | null) {
  const apiKey = key || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY");
  return new Anthropic({ apiKey });
}

type AgentConfigRow = {
  name: string;
  persona: string | null;
  system_prompt: string | null;
  model: string | null;
  languages: string[] | null;
  channels: string[] | null;
  qualification_schema: Record<string, unknown> | null;
  escalation_rules: Record<string, unknown> | null;
};

async function buildInventoryCatalog(tenantId: string): Promise<{ catalog: string; facts: InventoryFacts }> {
  const sb = getSupabaseAdmin();
  const { data: projects } = await sb
    .from("projects")
    .select("id,name,developer,location,completion,description")
    .eq("tenant_id", tenantId)
    .order("name");
  const { data: units } = await sb
    .from("units")
    .select("project_id,bedrooms,type,price,sqft,amenities,status")
    .eq("tenant_id", tenantId);

  type P = { id: string; name: string; developer: string; location: string; completion: string; description: string };
  type U = { project_id: string; bedrooms: number; type: string; price: number; sqft: number; amenities: string[]; status: string };
  const projRows = (projects ?? []) as unknown as P[];
  const unitRows = (units ?? []) as unknown as U[];

  const lines: string[] = [];
  const prices: number[] = [];
  for (const p of projRows) {
    const us = unitRows.filter((u) => u.project_id === p.id);
    lines.push(`• ${p.name} — ${p.developer}, ${p.location}; handover ${p.completion}. ${p.description ?? ""}`);
    for (const u of us) {
      const view = (u.amenities ?? [])[0] ?? "";
      prices.push(Number(u.price));
      lines.push(
        `    – ${u.bedrooms}BR ${u.type}, ${u.sqft} sqft, AED ${Number(u.price).toLocaleString()}${view ? ` (${view})` : ""}`
      );
    }
  }
  const valid = prices.filter((n) => isFinite(n) && n > 0);
  const facts: InventoryFacts = {
    minPrice: valid.length ? Math.min(...valid) : 0,
    maxPrice: valid.length ? Math.max(...valid) : 0,
    projectNames: projRows.map((p) => p.name),
  };
  return { catalog: lines.join("\n"), facts };
}

/** One model turn → trimmed reply text. */
async function runModel(
  client: Anthropic,
  model: string,
  system: string,
  lead: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const response = await client.messages.create({
    model,
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    output_config: { effort: "low" },
    system,
    messages: lead,
  });
  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

function buildSystemPrompt(
  cfg: AgentConfigRow,
  inventory: string,
  contact: { full_name: string; primary_language: string | null; budget: string | null; invest_type: string | null; status: string }
): string {
  const langs = (cfg.languages ?? []).join(", ");
  const capture = ((cfg.qualification_schema?.capture as string[]) ?? []).join(", ");
  const escalate = ((cfg.escalation_rules?.escalate_when as string[]) ?? []).join("; ");

  return [
    cfg.system_prompt ?? "You are a real estate AI sales agent.",
    cfg.persona ? `Persona: ${cfg.persona}` : "",
    langs ? `You can converse in: ${langs}. ALWAYS reply in the lead's language (${contact.primary_language ?? "English"}).` : "",
    "",
    "Keep replies short, warm and natural — this is a live conversation, not an email. One or two sentences. Ask one question at a time.",
    capture ? `Over the conversation, naturally qualify the lead on: ${capture}.` : "",
    escalate ? `Escalate to a human closer when: ${escalate}.` : "",
    "",
    `Lead on file: ${contact.full_name}, budget ${contact.budget ?? "unknown"}, intent ${contact.invest_type ?? "unknown"}, status ${contact.status}.`,
    "",
    "GROUNDING RULES (strict): Only mention projects, unit types, and prices that appear verbatim in AVAILABLE INVENTORY below. Never invent a project name. Never state a price that isn't listed, and never quote a price higher than the most expensive listed unit. If the lead wants something we don't have, say so honestly and offer the closest real option — do not guess. If you're unsure of an exact figure, say you'll confirm it rather than estimating.",
    "AVAILABLE INVENTORY:",
    inventory || "(no inventory loaded)",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Generate the agent's next message in a conversation and persist it.
 *
 * `deliver` controls real outbound delivery (e.g. sending an email) for
 * email-channel conversations. It defaults to `true` so genuine inbound-email
 * and auto-engage paths keep replying to the lead. Dashboard/test surfaces
 * (e.g. the operator composer's "AI respond") pass `deliver: false` so testing
 * the agent never sends a real email per message.
 */
export async function generateAgentReply(
  conversationId: string,
  opts: { deliver?: boolean } = {}
): Promise<{ text: string; messageId: string }> {
  const deliver = opts.deliver ?? true;
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();

  const { data: cv, error: cvErr } = await sb
    .from("conversations")
    .select("id,contact_id,last_channel,contacts(full_name,primary_language,budget,invest_type,status)")
    .eq("tenant_id", tenantId)
    .eq("id", conversationId)
    .single();
  if (cvErr) throw cvErr;
  const cvRow = cv as unknown as {
    contact_id: string;
    last_channel: string | null;
    contacts: Record<string, unknown> | Record<string, unknown>[];
  };
  const contactRaw = (Array.isArray(cvRow.contacts) ? cvRow.contacts[0] : cvRow.contacts) as Record<string, unknown>;
  const contact = {
    full_name: contactRaw.full_name as string,
    primary_language: (contactRaw.primary_language as string) ?? null,
    budget: (contactRaw.budget as string) ?? null,
    invest_type: (contactRaw.invest_type as string) ?? null,
    status: (contactRaw.status as string) ?? "new",
  };

  const { data: cfgData, error: cfgErr } = await sb
    .from("agent_configs")
    .select("name,persona,system_prompt,model,languages,channels,qualification_schema,escalation_rules")
    .eq("tenant_id", tenantId)
    .eq("active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();
  if (cfgErr) throw cfgErr;
  const cfg = cfgData as unknown as AgentConfigRow;

  const { data: msgs, error: mErr } = await sb
    .from("messages")
    .select("role,body,seq,created_at")
    .eq("conversation_id", conversationId)
    .order("seq", { ascending: true })
    .order("created_at", { ascending: true });
  if (mErr) throw mErr;
  const history = (msgs ?? []) as unknown as { role: string; body: string; seq: number }[];

  const { catalog: inventory, facts } = await buildInventoryCatalog(tenantId);
  let system = buildSystemPrompt(cfg, inventory, contact);

  // Map conversation memory to Anthropic turns: lead = user, agent/human = assistant.
  // Anthropic requires the first turn to be `user`, so fold any leading
  // agent/human messages into the system prompt as prior context.
  const turns: { role: "user" | "assistant"; content: string }[] = history.map((m) => ({
    role: m.role === "contact" ? "user" : "assistant",
    content: m.body,
  }));
  const lead: { role: "user" | "assistant"; content: string }[] = [];
  let i = 0;
  const priorAgentLines: string[] = [];
  while (i < turns.length && turns[i].role === "assistant") {
    priorAgentLines.push(turns[i].content);
    i++;
  }
  if (priorAgentLines.length) {
    system += `\n\nEarlier in this conversation you already said: ${priorAgentLines.join(" / ")}`;
  }
  for (; i < turns.length; i++) lead.push(turns[i]);
  if (lead.length === 0 || lead[lead.length - 1].role === "assistant") {
    lead.push({ role: "user", content: "(Continue the conversation — send your next message to the lead.)" });
  }

  const model = cfg.model || MODEL;
  const client = getAnthropic(await getSecret("anthropic", "api_key", tenantId));
  let text = await runModel(client, model, system, lead);

  // Grounding guardrail: never let a hallucinated price/project reach the lead.
  let grounding = checkGrounding(text, facts);
  let guardrailFired = false;
  if (!grounding.ok) {
    guardrailFired = true;
    const corrective =
      system +
      `\n\nCORRECTION: a previous draft was rejected — ${grounding.blocking.join(" ")} ` +
      "Re-answer using ONLY the AVAILABLE INVENTORY. Never quote a price above the most expensive listed unit, and never name a project that isn't listed.";
    text = await runModel(client, model, corrective, lead);
    grounding = checkGrounding(text, facts);
    if (!grounding.ok) {
      // Still ungrounded after a correction → safe, honest fallback + human handoff.
      text = safeFallback(contact.full_name.split(" ")[0] ?? "", contact.primary_language);
    }
  }

  const channel = cvRow.last_channel || "whatsapp";
  const now = new Date().toISOString();
  const { count } = await sb
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", conversationId);

  const { data: inserted, error: insErr } = await sb
    .from("messages")
    .insert({
      tenant_id: tenantId,
      conversation_id: conversationId,
      contact_id: cvRow.contact_id,
      channel,
      direction: "outbound",
      role: "agent",
      body: text,
      lang: contact.primary_language,
      seq: (count ?? 0) + 1,
      meta: { model: cfg.model || MODEL, author: "ai" },
      created_at: now,
    })
    .select("id")
    .single();
  if (insErr) throw insErr;

  await sb.from("conversations").update({ last_channel: channel, last_message_at: now }).eq("id", conversationId);
  await sb.from("events").insert({
    tenant_id: tenantId,
    contact_id: cvRow.contact_id,
    conversation_id: conversationId,
    type: "agent_reply",
    payload: { model, guardrail: { fired: guardrailFired, grounded: grounding.ok } },
  });

  // Surface guardrail catches for audit (and a future "needs human" signal).
  if (guardrailFired || grounding.warnings.length) {
    await sb.from("events").insert({
      tenant_id: tenantId,
      contact_id: cvRow.contact_id,
      conversation_id: conversationId,
      type: "guardrail_flag",
      payload: {
        fired: guardrailFired,
        resolved: grounding.ok,
        blocking: grounding.blocking,
        warnings: grounding.warnings,
      },
    });
  }

  // Real delivery: if this conversation is on email, actually send the reply.
  // Skipped for dashboard/test runs (deliver=false) so testing the agent never
  // emails the lead one line at a time.
  if (channel === "email" && deliver) {
    const { data: idn } = await sb
      .from("contact_identities")
      .select("value")
      .eq("tenant_id", tenantId)
      .eq("contact_id", cvRow.contact_id)
      .eq("channel", "email")
      .limit(1)
      .maybeSingle();
    const to = (idn as { value?: string } | null)?.value;
    if (to) {
      const ec = await resolveEmailCreds(tenantId);
      const sent = await sendEmail({
        to,
        subject: threadSubject(contact.full_name, (count ?? 0) > 0),
        text,
        apiKey: ec.apiKey,
        from: ec.from,
        replyTo: ec.replyTo,
      });
      await sb
        .from("messages")
        .update({ meta: { model: cfg.model || MODEL, author: "ai", email: sent } })
        .eq("id", (inserted as { id: string }).id);
    }
  }

  return { text, messageId: (inserted as { id: string }).id };
}
