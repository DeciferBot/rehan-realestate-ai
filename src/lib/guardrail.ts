/**
 * Grounding guardrail — stops the agent promising inventory we don't have.
 *
 * Pure functions (no server deps) so they can be unit-tested without API cost.
 * Two checks, by severity:
 *   - BLOCKING: a price above anything we actually list. High precision — a
 *     figure larger than our top unit means we literally cannot fulfil it.
 *   - WARNING:  a development-style name ("X Residences") not in our projects.
 *     Heuristic, lower precision, so it never hard-blocks a reply on its own.
 *
 * A blocking violation triggers one corrective regeneration; if it still
 * violates, the caller swaps in a safe fallback and escalates to a human.
 */

export type InventoryFacts = {
  minPrice: number;
  maxPrice: number;
  projectNames: string[];
};

export type Grounding = {
  ok: boolean;          // no blocking violations
  blocking: string[];
  warnings: string[];
};

const DEV_SUFFIX =
  "Residences?|Tower|Towers|Heights|Hills|Villas?|Mall|Gardens?|Park|Hotels?|Suites?|Plaza|Boulevard|District|Estates?|Lagoons?|Marina";

/** Parse property-magnitude AED amounts from free text. Returns numbers in AED. */
export function parseAedAmounts(text: string): number[] {
  const out: number[] = [];
  const push = (raw: string, suffix?: string) => {
    const n = parseFloat(raw.replace(/,/g, ""));
    if (!isFinite(n)) return;
    const s = (suffix || "").toLowerCase();
    let val = n;
    if (s === "k" || s === "thousand") val = n * 1_000;
    else if (s === "m" || s === "million") val = n * 1_000_000;
    else if (s === "bn" || s === "billion") val = n * 1_000_000_000;
    if (val > 0) out.push(Math.round(val));
  };

  // "AED 4,960,000" | "AED 4.96M" | "AED 250 million"
  const reAed = /aed\s*([\d][\d,]*(?:\.\d+)?)\s*(m|million|k|thousand|bn|billion)?/gi;
  // "250 million" | "4.96M" possibly trailed by AED/dirhams
  const reSuffix = /([\d][\d,]*(?:\.\d+)?)\s*(m|million|bn|billion)\b/gi;

  let m: RegExpExecArray | null;
  while ((m = reAed.exec(text))) push(m[1], m[2]);
  while ((m = reSuffix.exec(text))) push(m[1], m[2]);
  return out;
}

const STOPWORDS = new Set([
  "the", "and", "with", "from", "your", "our", "this", "that", "dubai", "sharjah",
  "abu", "dhabi", "uae", "new", "city", "downtown", "business", "bay",
]);

export function checkGrounding(reply: string, facts: InventoryFacts): Grounding {
  const blocking: string[] = [];
  const warnings: string[] = [];

  // 1) Price above our top listing → cannot fulfil.
  if (facts.maxPrice > 0) {
    const ceiling = facts.maxPrice * 1.3;
    for (const amt of parseAedAmounts(reply)) {
      if (amt >= 1_000_000 && amt > ceiling) {
        blocking.push(
          `Quotes AED ${amt.toLocaleString()} — above our top listing (AED ${facts.maxPrice.toLocaleString()}).`
        );
      }
    }
  }

  // 2) Development-style name not in inventory → likely fabricated.
  const realTokens = new Set(
    facts.projectNames
      .flatMap((n) => n.toLowerCase().split(/[^a-z0-9]+/i))
      .filter((w) => w.length > 3 && !STOPWORDS.has(w))
  );
  const phraseRe = new RegExp(
    `\\b([A-Z][a-zA-Z]+(?:\\s+[A-Z][a-zA-Z&]+){0,3}\\s+(?:${DEV_SUFFIX}))\\b`,
    "g"
  );
  let pm: RegExpExecArray | null;
  const seen = new Set<string>();
  while ((pm = phraseRe.exec(reply))) {
    const phrase = pm[1];
    if (seen.has(phrase)) continue;
    seen.add(phrase);
    const words = phrase
      .toLowerCase()
      .split(/[^a-z0-9]+/i)
      .filter((w) => w.length > 3 && !STOPWORDS.has(w) && !new RegExp(`^(?:${DEV_SUFFIX})$`, "i").test(w));
    const known =
      words.some((w) => realTokens.has(w)) ||
      facts.projectNames.some((n) => n.toLowerCase().includes(phrase.toLowerCase().split(/\s+/)[0]));
    if (words.length && !known) warnings.push(`Mentions "${phrase}", not in inventory.`);
  }

  return { ok: blocking.length === 0, blocking, warnings };
}

/** A safe, honest message when grounding can't be guaranteed. */
export function safeFallback(firstName: string, language: string | null): string {
  const name = firstName ? `${firstName}, ` : "";
  // Keep English; the agent regeneration handles language. This is a last resort.
  void language;
  return `${name}let me confirm exact availability and pricing on that with our team and come right back to you — I want to make sure I give you accurate, current numbers. In the meantime, could you share the area and number of bedrooms you'd prefer?`;
}
