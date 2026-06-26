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

/**
 * The statically-known images for a project — currently just its hero render.
 * The property gallery layers any PDF-extracted page renders (stored at ingest
 * time) on top of this, so projects without ingested imagery still show their
 * curated hero.
 */
export function galleryForRef(ref?: string | null): string[] {
  const hero = heroForRef(ref);
  return hero ? [hero] : [];
}
