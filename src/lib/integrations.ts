import "server-only";
import { getSupabaseAdmin } from "./supabase-server";
import { getActiveTenantId } from "./spine";
import {
  PROVIDERS,
  getProvider,
  computeConnected,
  maskSecret,
  isMasked,
  type ProviderDef,
} from "./integrations-config";

/**
 * Integration credentials store (service-role only — never reachable from the
 * browser except through the gated admin API, which masks secrets).
 *
 * NOTE: secrets are stored in the `integrations.config` jsonb. For GA, move them
 * into Supabase Vault / encrypt at rest. Today the table is RLS-locked with no
 * policies, so only the service role can read it.
 */

type Row = { provider: string; config: Record<string, string>; connected: boolean; updated_at: string };

async function loadAll(tenantId: string): Promise<Record<string, Row>> {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("integrations")
    .select("provider,config,connected,updated_at")
    .eq("tenant_id", tenantId);
  const map: Record<string, Row> = {};
  for (const r of (data ?? []) as Row[]) map[r.provider] = r;
  return map;
}

/** Raw config for one provider (server use only — includes secrets). */
export async function getIntegrationConfig(
  provider: string,
  tenantId?: string
): Promise<Record<string, string>> {
  const tid = tenantId ?? (await getActiveTenantId());
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("integrations")
    .select("config")
    .eq("tenant_id", tid)
    .eq("provider", provider)
    .maybeSingle();
  return ((data as { config?: Record<string, string> } | null)?.config ?? {}) as Record<string, string>;
}

/** One secret value, or null. Runtime helper: tenant integration → caller falls back to env. */
export async function getSecret(provider: string, key: string, tenantId?: string): Promise<string | null> {
  const cfg = await getIntegrationConfig(provider, tenantId);
  const v = cfg[key];
  return v && v.trim() ? v : null;
}

export type AdminProviderView = ProviderDef & {
  connected: boolean;
  updatedAt: string | null;
  values: Record<string, string>; // secrets masked
};

/** Every provider with its current (masked) values — for the admin panel. */
export async function listForAdmin(tenantId?: string): Promise<AdminProviderView[]> {
  const tid = tenantId ?? (await getActiveTenantId());
  const rows = await loadAll(tid);
  return PROVIDERS.map((p) => {
    const row = rows[p.id];
    const stored = row?.config ?? {};
    const values: Record<string, string> = {};
    for (const f of p.fields) {
      const raw = stored[f.key] ?? "";
      values[f.key] = f.type === "secret" ? maskSecret(raw) : raw;
    }
    return {
      ...p,
      connected: row?.connected ?? false,
      updatedAt: row?.updated_at ?? null,
      values,
    };
  });
}

/** Upsert a provider's config. Masked secrets (untouched in the form) are preserved. */
export async function upsertIntegration(
  provider: string,
  incoming: Record<string, string>,
  tenantId?: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const def = getProvider(provider);
  if (!def) return { ok: false, error: "unknown_provider" };
  const tid = tenantId ?? (await getActiveTenantId());

  const existing = await getIntegrationConfig(provider, tid);
  const merged: Record<string, string> = { ...existing };
  for (const f of def.fields) {
    if (!(f.key in incoming)) continue;
    const val = (incoming[f.key] ?? "").trim();
    // A secret left as its mask means "unchanged" — keep what we have.
    if (f.type === "secret" && isMasked(val)) continue;
    merged[f.key] = val;
  }

  const sb = getSupabaseAdmin();
  const { error } = await sb
    .from("integrations")
    .upsert(
      {
        tenant_id: tid,
        provider,
        config: merged,
        connected: computeConnected(def, merged),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "tenant_id,provider" }
    );
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
