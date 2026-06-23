import "server-only";
import { getSupabaseAdmin } from "./supabase-server";
import { getActiveTenantId } from "./spine";

/**
 * Deterministic sub-agents — the qualification helpers that sharpen the agent
 * and feed the operator dossier. No LLM, no credentials: pure functions over
 * the real spine inventory.
 */

/** Parse "AED 2.8M" / "AED 750K" / "AED 2.5M - 3M" → a number in AED. */
export function parseBudgetAed(s: string | null | undefined): number | null {
  if (!s) return null;
  const m = s.replace(/,/g, "").match(/([\d.]+)\s*(m|k)?/i);
  if (!m) return null;
  let n = parseFloat(m[1]);
  const unit = (m[2] || "").toLowerCase();
  if (unit === "m") n *= 1_000_000;
  else if (unit === "k") n *= 1_000;
  return Number.isNaN(n) ? null : n;
}

export type Recommendation = {
  id: string;
  project: string;
  developer: string;
  location: string;
  bedrooms: number;
  type: string;
  price: number;
  view: string;
  completion: string;
  fit: "at-budget" | "stretch" | "below";
};

export async function recommendUnits(opts: { budgetAed?: number | null; limit?: number }): Promise<Recommendation[]> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();
  const { data } = await sb
    .from("units")
    .select("id,bedrooms,type,price,amenities,status,projects(name,developer,location,completion)")
    .eq("tenant_id", tenantId)
    .eq("status", "available");

  type Row = {
    id: string;
    bedrooms: number;
    type: string;
    price: number;
    amenities: string[] | null;
    projects: Record<string, unknown> | Record<string, unknown>[];
  };
  const rows = (data ?? []) as unknown as Row[];
  const budget = opts.budgetAed ?? null;
  const limit = opts.limit ?? 4;

  const mapped = rows.map((r) => {
    const proj = (Array.isArray(r.projects) ? r.projects[0] : r.projects) as Record<string, unknown>;
    const price = Number(r.price);
    const fit: Recommendation["fit"] =
      budget == null ? "at-budget" : price <= budget * 1.05 ? (price >= budget * 0.7 ? "at-budget" : "below") : "stretch";
    return {
      id: r.id,
      project: (proj?.name as string) ?? "",
      developer: (proj?.developer as string) ?? "",
      location: (proj?.location as string) ?? "",
      bedrooms: r.bedrooms,
      type: r.type,
      price,
      view: (r.amenities ?? [])[0] ?? "",
      completion: (proj?.completion as string) ?? "",
      fit,
    };
  });

  if (budget == null) {
    return mapped.sort((a, b) => a.price - b.price).slice(0, limit);
  }
  // Closest to budget first, slightly preferring at-or-under.
  return mapped
    .sort((a, b) => {
      const da = Math.abs(a.price - budget) + (a.price > budget ? budget * 0.05 : 0);
      const db = Math.abs(b.price - budget) + (b.price > budget ? budget * 0.05 : 0);
      return da - db;
    })
    .slice(0, limit);
}

export type Mortgage = {
  value: number;
  downPayment: number;
  loanAmount: number;
  ratePct: number;
  years: number;
  monthly: number;
};

export function mortgageSnapshot(
  price: number,
  opts?: { downPct?: number; ratePct?: number; years?: number }
): Mortgage {
  const downPct = opts?.downPct ?? 0.2;
  const ratePct = opts?.ratePct ?? 4.49;
  const years = opts?.years ?? 25;
  const downPayment = price * downPct;
  const loanAmount = price - downPayment;
  const r = ratePct / 100 / 12;
  const n = years * 12;
  const monthly = r === 0 ? loanAmount / n : (loanAmount * r) / (1 - Math.pow(1 + r, -n));
  return { value: price, downPayment, loanAmount, ratePct, years, monthly: Math.round(monthly) };
}

export type Dossier = {
  budgetAed: number | null;
  recommendations: Recommendation[];
  mortgage: Mortgage | null;
};

export async function getContactDossier(budget: string | null): Promise<Dossier> {
  const budgetAed = parseBudgetAed(budget);
  const recommendations = await recommendUnits({ budgetAed, limit: 4 });
  const top = recommendations[0];
  const mortgage = top ? mortgageSnapshot(top.price) : budgetAed ? mortgageSnapshot(budgetAed) : null;
  return { budgetAed, recommendations, mortgage };
}
