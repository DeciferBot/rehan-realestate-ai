import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabaseAdmin } from "./supabase-server";
import { getActiveTenantId } from "./spine";
import { sendEmail } from "./email";

const APP_URL = process.env.APP_URL || "https://simmerproperties.com";

/**
 * Qualification + escalation — the back of the loop. Reads a conversation,
 * extracts structured qualification into the contact, decides status, and
 * escalates hot leads to a human closer with a handoff dossier — per the
 * tenant's programmable escalation_rules.
 */

const MODEL = "claude-opus-4-8";

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    qualification: {
      type: "object",
      additionalProperties: false,
      properties: {
        budget: { type: "string" },
        intent: { type: "string" },
        timeline: { type: "string" },
        financing: { type: "string" },
        preferred_area: { type: "string" },
        family: { type: "string" },
      },
      required: ["budget", "intent", "timeline", "financing", "preferred_area", "family"],
    },
    status: { type: "string", enum: ["new", "engaging", "qualified", "appointed", "closed", "lost"] },
    escalate: { type: "boolean" },
    reason: { type: "string" },
    summary: { type: "string" },
  },
  required: ["qualification", "status", "escalate", "reason", "summary"],
} as const;

export type QualifyResult = {
  status: string;
  escalate: boolean;
  reason: string;
  summary: string;
  assignedMember: string | null;
  qualification: Record<string, unknown>;
};

export async function qualifyConversation(conversationId: string): Promise<QualifyResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("Missing ANTHROPIC_API_KEY");
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();

  const { data: cv, error: cvErr } = await sb
    .from("conversations")
    .select("contact_id, contacts(full_name,budget,invest_type,qualification)")
    .eq("tenant_id", tenantId)
    .eq("id", conversationId)
    .single();
  if (cvErr) throw cvErr;
  const cvRow = cv as unknown as { contact_id: string; contacts: Record<string, unknown> | Record<string, unknown>[] };
  const contact = (Array.isArray(cvRow.contacts) ? cvRow.contacts[0] : cvRow.contacts) as Record<string, unknown>;

  const { data: cfg } = await sb
    .from("agent_configs")
    .select("qualification_schema,escalation_rules")
    .eq("tenant_id", tenantId)
    .eq("active", true)
    .limit(1)
    .maybeSingle();
  const cfgRow = (cfg ?? {}) as { qualification_schema?: { capture?: string[] }; escalation_rules?: { escalate_when?: string[] } };
  const capture = (cfgRow.qualification_schema?.capture ?? []).join(", ");
  const escalate = (cfgRow.escalation_rules?.escalate_when ?? []).join("; ");

  const { data: msgs } = await sb
    .from("messages")
    .select("role,body,seq,created_at")
    .eq("conversation_id", conversationId)
    .order("seq", { ascending: true })
    .order("created_at", { ascending: true });
  const transcript = ((msgs ?? []) as unknown as { role: string; body: string }[])
    .map((m) => `${m.role === "contact" ? "Lead" : m.role === "human" ? "Operator" : "Agent"}: ${m.body}`)
    .join("\n");

  const system =
    "You are a real-estate sales-operations analyst. Read the conversation and return structured qualification. " +
    (capture ? `Capture these fields where stated: ${capture}. Use 'unknown' when not stated. ` : "") +
    (escalate ? `Escalate to a human closer when any of these hold: ${escalate}. ` : "") +
    "Set status: 'engaging' if mid-conversation, 'qualified' once key criteria are known, 'appointed' if a meeting is set. " +
    "summary is a 1-2 sentence handoff brief for the human closer.";

  const client = new Anthropic({ apiKey: key });
  const params = {
    model: MODEL,
    max_tokens: 2000,
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
    system,
    messages: [{ role: "user", content: `Lead: ${contact.full_name}\n\nConversation:\n${transcript}` }],
  };
  const resp = await client.messages.create(
    params as unknown as Anthropic.Messages.MessageCreateParamsNonStreaming
  );
  const raw = resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  const parsed = JSON.parse(raw) as {
    qualification: Record<string, string>;
    status: string;
    escalate: boolean;
    reason: string;
    summary: string;
  };

  const prevQual = (contact.qualification as Record<string, unknown>) ?? {};
  const mergedQual = { ...prevQual, ...parsed.qualification };

  let assignedMember: string | null = null;
  let assignedMemberId: string | null = null;
  let assignedMemberEmail: string | null = null;
  let assignedLabel: string | undefined;
  if (parsed.escalate) {
    const { data: members } = await sb
      .from("members")
      .select("id,name,email")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: true })
      .limit(1);
    const m = (members ?? [])[0] as { id: string; name: string; email: string | null } | undefined;
    if (m) {
      assignedMember = m.name;
      assignedMemberId = m.id;
      assignedMemberEmail = m.email ?? null;
      assignedLabel = `Human: ${m.name}`;
    }
  }

  const update: Record<string, unknown> = {
    qualification: mergedQual,
    status: parsed.status,
    updated_at: new Date().toISOString(),
  };
  if (parsed.qualification.budget && parsed.qualification.budget !== "unknown" && !contact.budget) {
    update.budget = parsed.qualification.budget;
  }
  if (parsed.qualification.intent && parsed.qualification.intent !== "unknown" && !contact.invest_type) {
    const intent = parsed.qualification.intent.toLowerCase();
    update.invest_type = intent.includes("invest") ? "investment" : intent.includes("live") ? "live-in" : contact.invest_type;
  }
  if (assignedMemberId) {
    update.assigned_member_id = assignedMemberId;
    update.assigned_label = assignedLabel;
  }
  await sb.from("contacts").update(update).eq("tenant_id", tenantId).eq("id", cvRow.contact_id);

  await sb.from("events").insert({
    tenant_id: tenantId,
    contact_id: cvRow.contact_id,
    conversation_id: conversationId,
    type: parsed.escalate ? "escalated" : "qualified",
    payload: { status: parsed.status, reason: parsed.reason, summary: parsed.summary, assigned_member: assignedMember },
  });

  // Close the loop: actually notify the assigned closer so the handoff reaches a human.
  if (parsed.escalate && assignedMemberEmail) {
    const leadName = String(contact.full_name ?? "the lead");
    const q = mergedQual as Record<string, string>;
    const line = (k: string, label: string) => (q[k] && q[k] !== "unknown" ? `- ${label}: ${q[k]}\n` : "");
    const text =
      `Acre handed you a lead that's ready for a human.\n\n` +
      `Lead: ${leadName}\n` +
      `Why now: ${parsed.reason}\n` +
      `Brief: ${parsed.summary}\n\n` +
      `Qualification:\n` +
      line("budget", "Budget") +
      line("intent", "Intent") +
      line("timeline", "Timeline") +
      line("financing", "Financing") +
      line("preferred_area", "Preferred area") +
      line("family", "Household") +
      `\nOpen the conversation:\n${APP_URL}/inbox?c=${conversationId}\n`;
    const sent = await sendEmail({ to: assignedMemberEmail, subject: `Lead ready for you: ${leadName}`, text });
    await sb.from("events").insert({
      tenant_id: tenantId,
      contact_id: cvRow.contact_id,
      conversation_id: conversationId,
      type: "closer_notified",
      payload: { to: assignedMemberEmail, ok: sent.ok, error: sent.error ?? null },
    });
  }

  return {
    status: parsed.status,
    escalate: parsed.escalate,
    reason: parsed.reason,
    summary: parsed.summary,
    assignedMember,
    qualification: mergedQual,
  };
}
