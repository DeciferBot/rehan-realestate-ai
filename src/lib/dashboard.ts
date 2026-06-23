import "server-only";
import { getSupabaseAdmin } from "./supabase-server";
import { getActiveTenantId } from "./spine";
import { parseBudgetAed } from "./subagents";

/** Real command-center summary for the dashboard home, computed from the spine. */

export type DashboardSummary = {
  activeLeads: number;
  liveCalls: number;
  appointments: number;
  pipelineAed: number;
  unitsCount: number;
  funnel: { label: string; count: number; pct: number }[];
  activity: { text: string; time: string; type: string }[];
  languages: { lang: string; code: string; count: number; pct: number }[];
};

function relativeTime(iso: string | null): string {
  if (!iso) return "";
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} days ago`;
}

const LANG_CODE: Record<string, string> = {
  Arabic: "AR", English: "EN", Hindi: "HI", Russian: "RU", Mandarin: "ZH", Urdu: "UR", French: "FR", Spanish: "ES",
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();

  const [{ data: contacts }, { data: events }, { count: bookings }, { count: unitsCount }] = await Promise.all([
    sb.from("contacts").select("id,full_name,status,source,primary_language,budget").eq("tenant_id", tenantId),
    sb.from("events").select("type,payload,created_at,contact_id").eq("tenant_id", tenantId).order("created_at", { ascending: false }).limit(8),
    sb.from("bookings").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId),
    sb.from("units").select("id", { count: "exact", head: true }).eq("tenant_id", tenantId),
  ]);

  type C = { id: string; full_name: string; status: string; source: string | null; primary_language: string | null; budget: string | null };
  const cs = (contacts ?? []) as unknown as C[];
  const name = new Map<string, string>();
  cs.forEach((c) => name.set(c.id, c.full_name));

  const tally = (pred: (c: C) => boolean) => cs.filter(pred).length;
  const total = cs.length;
  const activeLeads = tally((c) => !["closed", "lost"].includes(c.status));
  const liveCalls = tally((c) => c.status === "calling");
  const pipelineAed = cs
    .filter((c) => !["closed", "lost"].includes(c.status))
    .reduce((s, c) => s + (parseBudgetAed(c.budget) ?? 0), 0);

  const funnelRaw = [
    { label: "Leads", count: total },
    { label: "Engaged", count: tally((c) => ["calling", "called", "engaging", "qualified", "appointed", "closed"].includes(c.status)) },
    { label: "Qualified", count: tally((c) => ["qualified", "appointed", "closed"].includes(c.status)) },
    { label: "Appointed", count: tally((c) => ["appointed", "closed"].includes(c.status)) },
    { label: "Closed", count: tally((c) => c.status === "closed") },
  ];
  const funnel = funnelRaw.map((f) => ({ ...f, pct: total ? Math.round((f.count / total) * 100) : 0 }));

  type E = { type: string; payload: Record<string, unknown> | null; created_at: string; contact_id: string | null };
  const activity = ((events ?? []) as unknown as E[]).map((e) => {
    const who = e.contact_id ? name.get(e.contact_id) ?? "a lead" : "a lead";
    const p = e.payload ?? {};
    let text: string;
    let type: string;
    switch (e.type) {
      case "lead_arrived": text = `New lead: ${who}${p.source ? ` · ${p.source}` : ""}`; type = "lead"; break;
      case "agent_reply": text = `Acre agent replied to ${who}`; type = "agent"; break;
      case "qualified": text = `${who} qualified${p.status ? ` — ${p.status}` : ""}`; type = "agent"; break;
      case "escalated": text = `Escalated ${who} → ${(p.assigned_member as string) || "closer"}`; type = "appointment"; break;
      case "human_reply": text = `Operator replied to ${who}`; type = "whatsapp"; break;
      default: text = `${e.type.replace(/_/g, " ")} · ${who}`; type = "lead";
    }
    return { text, time: relativeTime(e.created_at), type };
  });

  const langCount = new Map<string, number>();
  cs.forEach((c) => {
    const l = c.primary_language ?? "Other";
    langCount.set(l, (langCount.get(l) ?? 0) + 1);
  });
  const languages = [...langCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, count]) => ({ lang, code: LANG_CODE[lang] ?? lang.slice(0, 2).toUpperCase(), count, pct: total ? Math.round((count / total) * 100) : 0 }));

  return {
    activeLeads,
    liveCalls,
    appointments: bookings ?? 0,
    pipelineAed,
    unitsCount: unitsCount ?? 0,
    funnel,
    activity,
    languages,
  };
}
