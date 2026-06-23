import "server-only";
import { getSupabaseAdmin } from "./supabase-server";
import { getActiveTenantId } from "./spine";
import { generateAgentReply } from "./agent";

/**
 * Lead intake — the front of the loop. A lead arrives (Meta ad, inbound call,
 * WhatsApp, developer list); we resolve it to ONE contact across channel
 * identities, open a conversation, log the arrival, and optionally let the
 * agent make first contact. This is what a Meta Lead Ads webhook points at.
 */

export type IntakeInput = {
  name: string;
  phone?: string;
  email?: string;
  language?: string;
  flag?: string;
  source?: string;
  investType?: string;
  budget?: string;
  propertyInterest?: string;
  channel?: string;
  autoEngage?: boolean;
};

export type IntakeResult = {
  contactId: string;
  conversationId: string;
  created: boolean;
  agentReply?: string;
};

export async function intakeLead(input: IntakeInput): Promise<IntakeResult> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();

  const identities: { channel: string; value: string }[] = [];
  if (input.phone?.trim()) {
    const v = input.phone.trim();
    identities.push({ channel: "phone", value: v });
    identities.push({ channel: "whatsapp", value: v });
  }
  if (input.email?.trim()) {
    identities.push({ channel: "email", value: input.email.trim().toLowerCase() });
  }

  // Resolve an existing contact by any matching identity.
  let contactId: string | null = null;
  if (identities.length) {
    const { data: hit } = await sb
      .from("contact_identities")
      .select("contact_id,channel,value")
      .eq("tenant_id", tenantId)
      .in("value", identities.map((i) => i.value))
      .limit(1)
      .maybeSingle();
    if (hit) contactId = (hit as { contact_id: string }).contact_id;
  }

  let created = false;
  if (!contactId) {
    const { data: c, error } = await sb
      .from("contacts")
      .insert({
        tenant_id: tenantId,
        full_name: input.name,
        primary_language: input.language ?? null,
        flag: input.flag ?? null,
        status: "new",
        source: input.source ?? null,
        invest_type: input.investType ?? null,
        budget: input.budget ?? null,
        assigned_label: "AI Agent",
        qualification: input.propertyInterest ? { property_interest: input.propertyInterest } : {},
      })
      .select("id")
      .single();
    if (error) throw error;
    contactId = (c as { id: string }).id;
    created = true;

    if (identities.length) {
      // Ignore duplicate-identity conflicts (another lead sharing a number, etc.)
      await sb
        .from("contact_identities")
        .upsert(
          identities.map((i) => ({ tenant_id: tenantId, contact_id: contactId, channel: i.channel, value: i.value })),
          { onConflict: "tenant_id,channel,value", ignoreDuplicates: true }
        );
    }
  }

  // Reuse the contact's open conversation, or open one.
  const channel = input.channel || "whatsapp";
  const now = new Date().toISOString();
  const { data: existing } = await sb
    .from("conversations")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("contact_id", contactId)
    .eq("status", "open")
    .limit(1)
    .maybeSingle();

  let conversationId: string;
  if (existing) {
    conversationId = (existing as { id: string }).id;
  } else {
    const { data: conv, error: convErr } = await sb
      .from("conversations")
      .insert({ tenant_id: tenantId, contact_id: contactId, status: "open", last_channel: channel, last_message_at: now })
      .select("id")
      .single();
    if (convErr) throw convErr;
    conversationId = (conv as { id: string }).id;
  }

  await sb.from("events").insert({
    tenant_id: tenantId,
    contact_id: contactId,
    conversation_id: conversationId,
    type: "lead_arrived",
    payload: { source: input.source ?? null, channel },
  });

  const result: IntakeResult = { contactId, conversationId, created };

  if (input.autoEngage) {
    const { text } = await generateAgentReply(conversationId);
    result.agentReply = text;
  }
  return result;
}
