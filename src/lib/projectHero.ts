/**
 * Project hero images extracted from the developer availability PDFs (one render
 * per master community, since the sheets carry no per-unit photos). Stored as
 * static assets under /public/projects and mapped by project `ref`.
 *
 * Projects without a usable render in their PDF (e.g. the W Residences sheets,
 * which only contained a logo) fall back to the colored card header.
 */

const HERO_BY_REF: Record<string, string> = {
  // Masaar 3 cluster (DANA / LAREEN / LAURA / LAYAN / SEDRA)
  dana: "/projects/masaar-3.jpg",
  lareen: "/projects/masaar-3.jpg",
  laura: "/projects/masaar-3.jpg",
  layan: "/projects/masaar-3.jpg",
  sedra: "/projects/masaar-3.jpg",
  // Masaar (earlier phases)
  kaya: "/projects/masaar-1.jpg",
  saro: "/projects/masaar-1.jpg",
  sequoia: "/projects/masaar-1.jpg",
  masaar2: "/projects/masaar-2.jpg",
  // Standalone towers
  inaura: "/projects/inaura.jpg",
  "akala-hotels-and-residences": "/projects/akala.jpg",
};

export function heroForRef(ref?: string | null): string | null {
  if (!ref) return null;
  return HERO_BY_REF[ref.toLowerCase()] ?? null;
}
