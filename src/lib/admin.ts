import "server-only";
import { getSupabaseAdmin } from "./supabase-server";
import { getActiveTenantId, ACTIVE_TENANT_SLUG } from "./spine";

/** Tenant + agent-config administration (the "program your agent" surface). */

export type AgentConfig = {
  id: string;
  name: string;
  persona: string;
  systemPrompt: string;
  model: string;
  languages: string[];
  channels: string[];
  capture: string[];
  escalateWhen: string[];
  active: boolean;
};

export type TenantInfo = {
  id: string;
  slug: string;
  name: string;
  contacts: number;
  projects: number;
  units: number;
};

export async function getTenantInfo(): Promise<TenantInfo> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();
  const { data: t } = await sb
    .from("tenants")
    .select("id,slug,name")
    .eq("id", tenantId)
    .single();
  const counts = await Promise.all(
    ["contacts", "projects", "units"].map((tbl) =>
      sb.from(tbl).select("id", { count: "exact", head: true }).eq("tenant_id", tenantId)
    )
  );
  const row = t as unknown as { id: string; slug: string; name: string };
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    contacts: counts[0].count ?? 0,
    projects: counts[1].count ?? 0,
    units: counts[2].count ?? 0,
  };
}

export async function getAgentConfig(): Promise<AgentConfig | null> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();
  const { data, error } = await sb
    .from("agent_configs")
    .select("id,name,persona,system_prompt,model,languages,channels,qualification_schema,escalation_rules,active")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const r = data as unknown as {
    id: string;
    name: string;
    persona: string | null;
    system_prompt: string | null;
    model: string | null;
    languages: string[] | null;
    channels: string[] | null;
    qualification_schema: { capture?: string[] } | null;
    escalation_rules: { escalate_when?: string[] } | null;
    active: boolean;
  };
  return {
    id: r.id,
    name: r.name,
    persona: r.persona ?? "",
    systemPrompt: r.system_prompt ?? "",
    model: r.model ?? "claude-opus-4-8",
    languages: r.languages ?? [],
    channels: r.channels ?? [],
    capture: r.qualification_schema?.capture ?? [],
    escalateWhen: r.escalation_rules?.escalate_when ?? [],
    active: r.active,
  };
}

export type AgentConfigPatch = {
  id: string;
  name: string;
  persona: string;
  systemPrompt: string;
  model: string;
  languages: string[];
  channels: string[];
  capture: string[];
  escalateWhen: string[];
  active: boolean;
};

export async function updateAgentConfig(patch: AgentConfigPatch): Promise<void> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();
  const { error } = await sb
    .from("agent_configs")
    .update({
      name: patch.name,
      persona: patch.persona,
      system_prompt: patch.systemPrompt,
      model: patch.model,
      languages: patch.languages,
      channels: patch.channels,
      qualification_schema: { capture: patch.capture },
      escalation_rules: { escalate_when: patch.escalateWhen },
      active: patch.active,
    })
    .eq("tenant_id", tenantId)
    .eq("id", patch.id);
  if (error) throw error;
}

export { ACTIVE_TENANT_SLUG };
