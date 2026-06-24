import "server-only";
import { getSupabaseAdmin } from "./supabase-server";
import { getActiveTenantId } from "./spine";

/**
 * Audit trail — every action the AI (or an operator) takes is written to the
 * `events` table by the agent runtime, qualifier, and spine. This reads that
 * log back, tenant-scoped, for the explainability view: *what* happened, *when*,
 * to *whom*, and *why*. The same isolation that protects the data (tenant RLS)
 * protects the audit trail.
 */

export type AuditEvent = {
  id: string;
  type: string;
  createdAt: string;
  contactId: string | null;
  contactName: string | null;
  conversationId: string | null;
  payload: Record<string, unknown>;
};

export async function getAuditEvents(limit = 300): Promise<AuditEvent[]> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();

  const { data: rows, error } = await sb
    .from("events")
    .select("id,type,payload,contact_id,conversation_id,created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;

  type Row = {
    id: string;
    type: string | null;
    payload: Record<string, unknown> | null;
    contact_id: string | null;
    conversation_id: string | null;
    created_at: string;
  };
  const evRows = (rows ?? []) as unknown as Row[];

  // Resolve contact names in one round-trip.
  const ids = [...new Set(evRows.map((r) => r.contact_id).filter(Boolean))] as string[];
  const names = new Map<string, string>();
  if (ids.length) {
    const { data: contacts } = await sb
      .from("contacts")
      .select("id,full_name")
      .eq("tenant_id", tenantId)
      .in("id", ids);
    for (const c of (contacts ?? []) as { id: string; full_name: string }[]) {
      names.set(c.id, c.full_name);
    }
  }

  return evRows.map((r) => ({
    id: r.id,
    type: r.type ?? "event",
    createdAt: r.created_at,
    contactId: r.contact_id,
    contactName: r.contact_id ? names.get(r.contact_id) ?? null : null,
    conversationId: r.conversation_id,
    payload: r.payload ?? {},
  }));
}
