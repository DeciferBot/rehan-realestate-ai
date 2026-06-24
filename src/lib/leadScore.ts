/**
 * Instant lead scoring — the "speed" layer.
 *
 * Pure, browser-safe, deterministic. No LLM, no server, no credentials, no
 * network. The broker sees a qualification score the instant the dossier
 * paints, and every point is explainable (each factor is surfaced), so the
 * score doubles as an audit trail for *why* a lead is hot.
 *
 * The heavy LLM (qualify.ts) still owns the hard synthesis — extracting the
 * structured qualification from free conversation. This module only turns that
 * already-extracted, real data into an instant, legible score.
 */

/** Parse "AED 2.8M" / "750K" / "AED 2.5M - 3M" → a number in AED (client-safe). */
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

const has = (v: unknown): v is string =>
  typeof v === "string" && v.trim() !== "" && v.trim().toLowerCase() !== "unknown";

/** Map free-text timeline → urgency in [0,1]. Higher = readier to transact. */
function timelineUrgency(v: string): number {
  const t = v.toLowerCase();
  if (/(immediat|asap|this week|ready now|now\b|urgent)/.test(t)) return 1;
  if (/(this month|few weeks|1[-\s]?2 month|next month)/.test(t)) return 0.8;
  if (/(1[-\s]?3 month|quarter|3 month|soon)/.test(t)) return 0.6;
  if (/(3[-\s]?6 month|6 month|this year|h[12])/.test(t)) return 0.4;
  if (/(next year|2026|2027|no rush|just (look|brows)|explor|research)/.test(t)) return 0.15;
  return 0.45; // stated but unclear → mild credit
}

/** Map free-text financing → readiness in [0,1]. */
function financingReadiness(v: string): number {
  const t = v.toLowerCase();
  if (/(cash|full payment|no mortgage|liquid)/.test(t)) return 1;
  if (/(pre[-\s]?approv|approved|in[-\s]?principle|aip)/.test(t)) return 0.85;
  if (/(mortgage|finance|loan|bank)/.test(t)) return 0.6;
  if (/(need|require|help|explor|unsure|tbd)/.test(t)) return 0.35;
  return 0.5;
}

export type ScoreFactor = {
  key: string;
  label: string;
  /** Points actually earned. */
  points: number;
  /** Maximum points this factor can contribute. */
  max: number;
  /** Short human reason, shown on the dossier. */
  detail: string;
};

export type LeadScore = {
  /** 0–100, rounded. */
  score: number;
  band: "hot" | "warm" | "cold";
  factors: ScoreFactor[];
  /** The single highest-leverage missing signal, or null if fully qualified. */
  nextBestAction: string | null;
};

export type ScoreInput = {
  qualification: Record<string, unknown>;
  budget: string | null;
  /** Number of inbound (lead) messages — engagement proxy. */
  contactMessages: number;
  /** True if at least one real inventory unit fits the lead's budget. */
  hasBudgetFit: boolean;
};

const WEIGHTS = {
  budget: 22,
  timeline: 20,
  financing: 16,
  intent: 12,
  area: 10,
  engagement: 12,
  fit: 8,
} as const;

/**
 * Compute an instant, explainable qualification score from already-extracted
 * data. Deterministic: same input → same score, every time.
 */
export function scoreLead(input: ScoreInput): LeadScore {
  const q = input.qualification ?? {};
  const factors: ScoreFactor[] = [];

  // Budget — the single biggest qualifier.
  {
    const stated = has(q.budget) || has(input.budget);
    const points = stated ? WEIGHTS.budget : 0;
    factors.push({
      key: "budget",
      label: "Budget",
      points,
      max: WEIGHTS.budget,
      detail: stated ? String(q.budget ?? input.budget) : "Not stated",
    });
  }

  // Timeline — urgency to transact.
  {
    const v = has(q.timeline) ? String(q.timeline) : null;
    const u = v ? timelineUrgency(v) : 0;
    factors.push({
      key: "timeline",
      label: "Timeline",
      points: Math.round(WEIGHTS.timeline * u),
      max: WEIGHTS.timeline,
      detail: v ?? "Not stated",
    });
  }

  // Financing — how ready the money is.
  {
    const v = has(q.financing) ? String(q.financing) : null;
    const r = v ? financingReadiness(v) : 0;
    factors.push({
      key: "financing",
      label: "Financing",
      points: Math.round(WEIGHTS.financing * r),
      max: WEIGHTS.financing,
      detail: v ?? "Not stated",
    });
  }

  // Intent — investment vs live-in, either way a real signal.
  {
    const v = has(q.intent) ? String(q.intent) : null;
    factors.push({
      key: "intent",
      label: "Intent",
      points: v ? WEIGHTS.intent : 0,
      max: WEIGHTS.intent,
      detail: v ?? "Not stated",
    });
  }

  // Preferred area — concreteness of the search.
  {
    const v = has(q.preferred_area) ? String(q.preferred_area) : null;
    factors.push({
      key: "area",
      label: "Area",
      points: v ? WEIGHTS.area : 0,
      max: WEIGHTS.area,
      detail: v ?? "Not stated",
    });
  }

  // Engagement — replies are the cheapest, truest interest signal.
  {
    const n = Math.max(0, input.contactMessages);
    const ratio = Math.min(1, n / 4); // 4+ inbound messages saturates
    factors.push({
      key: "engagement",
      label: "Engagement",
      points: Math.round(WEIGHTS.engagement * ratio),
      max: WEIGHTS.engagement,
      detail: n === 0 ? "No replies yet" : `${n} repl${n === 1 ? "y" : "ies"}`,
    });
  }

  // Budget fit — do we actually have something to sell them?
  {
    factors.push({
      key: "fit",
      label: "Inventory fit",
      points: input.hasBudgetFit ? WEIGHTS.fit : 0,
      max: WEIGHTS.fit,
      detail: input.hasBudgetFit ? "We have matching units" : "No at-budget match",
    });
  }

  const score = Math.round(factors.reduce((s, f) => s + f.points, 0));
  const band: LeadScore["band"] = score >= 68 ? "hot" : score >= 38 ? "warm" : "cold";

  // Next-best-action: the unfilled factor with the most points left on the table.
  const gaps = factors
    .filter((f) => f.points < f.max)
    .sort((a, b) => b.max - b.points - (a.max - a.points));
  const nextBestAction = gaps.length
    ? {
        budget: "Pin down their budget range",
        timeline: "Ask when they want to move",
        financing: "Confirm cash vs mortgage",
        intent: "Clarify investment vs living in",
        area: "Get their preferred area",
        engagement: "Re-engage — get them replying",
        fit: "Offer the closest real unit",
      }[gaps[0].key] ?? null
    : null;

  return { score, band, factors, nextBestAction };
}
