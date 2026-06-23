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

export type InventoryProject = {
  id: string;
  name: string;
  developer: string;
  location: string;
  completion: string;
  units: number;
  bedsMin: number;
  bedsMax: number;
  priceMin: number;
  priceMax: number;
};

export async function getInventoryProjects(): Promise<InventoryProject[]> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();
  const { data: projects } = await sb
    .from("projects")
    .select("id,name,developer,location,completion")
    .eq("tenant_id", tenantId)
    .order("developer")
    .order("name");
  const { data: units } = await sb
    .from("units")
    .select("project_id,bedrooms,price")
    .eq("tenant_id", tenantId);

  type P = { id: string; name: string; developer: string; location: string; completion: string };
  type U = { project_id: string; bedrooms: number; price: number };
  const projRows = (projects ?? []) as unknown as P[];
  const unitRows = (units ?? []) as unknown as U[];

  return projRows.map((p) => {
    const us = unitRows.filter((u) => u.project_id === p.id);
    const beds = us.map((u) => u.bedrooms).filter((n) => typeof n === "number");
    const prices = us.map((u) => Number(u.price)).filter((n) => !Number.isNaN(n));
    return {
      id: p.id,
      name: p.name,
      developer: p.developer,
      location: p.location,
      completion: p.completion,
      units: us.length,
      bedsMin: beds.length ? Math.min(...beds) : 0,
      bedsMax: beds.length ? Math.max(...beds) : 0,
      priceMin: prices.length ? Math.min(...prices) : 0,
      priceMax: prices.length ? Math.max(...prices) : 0,
    };
  });
}

export { ACTIVE_TENANT_SLUG };
