import "server-only";
import { getSupabaseAdmin } from "./supabase-server";
import { getActiveTenantId } from "./spine";
import { computeReturns, defaultInputs, round1 } from "./investment";
import { heroForRef, galleryForRef } from "./projectHero";
import { PROJECT_IMAGE_BUCKET } from "./projectImages";

/**
 * Server-side data access for the legacy console pages (Leads, Properties,
 * Developers, Appointments). These now read the real multi-tenant spine
 * (contacts / units+projects / bookings) and map to the camelCase shapes the
 * existing pages already render — so the UI is unchanged, just real.
 */

export type Lead = {
  id: string;
  name: string;
  phone: string;
  language: string;
  flag: string;
  status: string;
  propertyInterest: string;
  investType: string;
  source: string;
  assignedAgent: string;
  time: string;
  budget: string;
};

export type Property = {
  id: string;
  developer: string;
  name: string;
  location: string;
  type: string;
  bedrooms: number;
  price: number;
  currency: string;
  roi: number;
  rentalYield: number;
  image: string;
  heroImage: string | null;
  gallery: string[]; // hero + any PDF-extracted page renders, in display order
  tags: string[];
  completion: string;
  sqft: number;
  description: string;
  amenities: string[];
  floors: string;
  unitCount: number; // how many available units share this floorplan (same project/type/beds/sqft)
  priceFrom: boolean; // true when units in the group have differing prices → show "From AED …"
};

export type Appointment = {
  id: string;
  lead: string;
  type: string;
  agent: string;
  date: string;
  time: string;
  property: string;
  status: string;
  notes: string;
};

export type Developer = {
  id: string;
  name: string;
  logo: string;
  properties: number;
  activeListings: number;
  totalValue: string;
  onedrive: boolean;
  lastSync: string;
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
  const d = Math.floor(h / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}

function aed(n: number): string {
  if (!n) return "AED 0";
  if (n >= 1_000_000_000) return `AED ${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `AED ${Math.round(n / 1_000_000)}M`;
  return `AED ${Math.round(n / 1000)}K`;
}

export async function getLeads(): Promise<Lead[]> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();
  const { data, error } = await sb
    .from("contacts")
    .select("id,full_name,primary_language,flag,status,source,invest_type,budget,assigned_label,qualification,created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const { data: ids } = await sb
    .from("contact_identities")
    .select("contact_id,value")
    .eq("tenant_id", tenantId)
    .eq("channel", "phone");
  const phone = new Map<string, string>();
  for (const r of (ids ?? []) as unknown as { contact_id: string; value: string }[]) {
    if (!phone.has(r.contact_id)) phone.set(r.contact_id, r.value);
  }

  type Row = {
    id: string; full_name: string; primary_language: string | null; flag: string | null;
    status: string; source: string | null; invest_type: string | null; budget: string | null;
    assigned_label: string | null; qualification: Record<string, unknown> | null; created_at: string;
  };
  return ((data ?? []) as unknown as Row[]).map((r) => {
    const q = r.qualification ?? {};
    const interest =
      (q.preferred_area as string) || (q.property_interest as string) || (q.area as string) || "—";
    return {
      id: r.id,
      name: r.full_name,
      phone: phone.get(r.id) ?? "—",
      language: r.primary_language ?? "—",
      flag: r.flag ?? "🏳️",
      status: r.status,
      propertyInterest: interest,
      investType: r.invest_type ?? "investment",
      source: r.source ?? "—",
      assignedAgent: r.assigned_label ?? "Unassigned",
      time: relativeTime(r.created_at),
      budget: r.budget ?? "—",
    };
  });
}

type UnitRow = {
  id: string; type: string | null; bedrooms: number | null; price: number | null;
  roi: number | null; rental_yield: number | null; sqft: number | null; floors: string | null;
  amenities: string[] | null; tags: string[] | null; image: string | null;
  projects: Record<string, unknown> | Record<string, unknown>[];
};

const UNIT_SELECT =
  "id,type,bedrooms,price,roi,rental_yield,sqft,floors,amenities,tags,image,status," +
  "projects(ref,name,developer,location,completion,description)";

const FALLBACK_IMAGES = ["downtown", "harbour", "palm", "lamer", "hills", "valley"];

// The ingested payment-plan summary carries a raw installment-day list, e.g.
// "...7 installments of 5% (at 30,210,390,570,750,930,1110 days), 60%...".
// Strip that parenthetical for display — it's noise to a buyer.
function cleanPaymentPlan(s: string): string {
  return s
    .replace(/\s*\(at[^)]*days?\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.])/g, "$1")
    .trim();
}

function rowToProperty(r: UnitRow, fallbackImage: string): Property {
  const p = (Array.isArray(r.projects) ? r.projects[0] : r.projects) as Record<string, unknown>;
  const image = r.image || fallbackImage;
  const price = Number(r.price ?? 0);
  const sqft = r.sqft ?? 0;
  // No rent data in inventory → estimate yield/ROI from an area-adjusted benchmark,
  // unless the unit carries explicit figures from the DB.
  const est = computeReturns(defaultInputs({ price, sqft }));
  const dbRoi = Number(r.roi ?? 0);
  const dbYield = Number(r.rental_yield ?? 0);
  return {
    id: r.id,
    developer: (p?.developer as string) ?? "—",
    name: (p?.name as string) ?? "—",
    location: (p?.location as string) ?? "—",
    type: r.type ?? "Apartment",
    bedrooms: r.bedrooms ?? 0,
    price,
    currency: "AED",
    roi: dbRoi || round1(est.roiAnnualizedPct),
    rentalYield: dbYield || round1(est.grossYieldPct),
    image,
    heroImage: heroForRef(p?.ref as string | undefined),
    gallery: galleryForRef(p?.ref as string | undefined),
    tags: r.tags ?? ["sale"],
    completion: (p?.completion as string) ?? "—",
    sqft,
    description: cleanPaymentPlan((p?.description as string) ?? ""),
    amenities: r.amenities ?? [],
    floors: r.floors ?? "",
    unitCount: 1,
    priceFrom: false,
  };
}

// Collapse units of the same floorplan (same project/type/beds/sqft) into one
// listing card carrying an availability count, so near-identical plots — which
// often differ only by a few thousand AED (different floor/plot) and render as
// the same rounded "AED 2.0M" — don't appear as duplicate cards. The cheapest
// unit represents the group; if prices differ the card shows "From AED …".
// Input is price-ascending, so the first unit seen per group is the cheapest.
function groupListings(props: Property[]): Property[] {
  const groups = new Map<string, { rep: Property; prices: Set<number> }>();
  for (const p of props) {
    const key = `${p.name}|${p.type}|${p.bedrooms}|${p.sqft}`;
    const g = groups.get(key);
    if (g) {
      g.rep.unitCount += 1;
      g.prices.add(p.price);
    } else {
      groups.set(key, { rep: { ...p }, prices: new Set([p.price]) });
    }
  }
  return [...groups.values()].map(({ rep, prices }) => ({ ...rep, priceFrom: prices.size > 1 }));
}

export async function getProperties(): Promise<Property[]> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();
  const { data, error } = await sb
    .from("units")
    .select(UNIT_SELECT)
    .eq("tenant_id", tenantId)
    .order("price", { ascending: true });
  if (error) throw error;

  const props = ((data ?? []) as unknown as UnitRow[]).map((r, i) =>
    rowToProperty(r, FALLBACK_IMAGES[i % FALLBACK_IMAGES.length])
  );
  return groupListings(props);
}

// The PDF-extracted page renders for a project live in the public storage
// bucket under a folder named for the project `ref` (written at ingest time).
// List them and resolve public URLs, sorted by the zero-padded page name so
// the gallery order matches the sheet. Best-effort: any failure (bucket absent,
// no imagery, storage error) yields an empty list and the caller falls back to
// the curated hero.
async function listIngestedImages(
  sb: ReturnType<typeof getSupabaseAdmin>,
  ref?: string | null
): Promise<string[]> {
  if (!ref) return [];
  try {
    const folder = ref.toLowerCase();
    const { data, error } = await sb.storage
      .from(PROJECT_IMAGE_BUCKET)
      .list(folder, { sortBy: { column: "name", order: "asc" } });
    if (error || !data) return [];
    return data
      .filter((f) => /\.(png|jpe?g|webp)$/i.test(f.name))
      .map((f) => sb.storage.from(PROJECT_IMAGE_BUCKET).getPublicUrl(`${folder}/${f.name}`).data.publicUrl);
  } catch {
    return [];
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();
  const { data, error } = await sb
    .from("units")
    .select(UNIT_SELECT)
    .eq("tenant_id", tenantId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const row = data as unknown as UnitRow;
  const property = rowToProperty(row, "downtown");
  const proj = (Array.isArray(row.projects) ? row.projects[0] : row.projects) as Record<string, unknown> | undefined;
  const ingested = await listIngestedImages(sb, proj?.ref as string | undefined);
  // Curated hero first, then ingested page renders, de-duplicated.
  const gallery = Array.from(new Set([...property.gallery, ...ingested]));
  return { ...property, gallery, heroImage: gallery[0] ?? property.heroImage };
}

export async function getAppointments(): Promise<Appointment[]> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();
  const { data, error } = await sb
    .from("bookings")
    .select("id,type,scheduled_at,status,notes,contacts(full_name),members(name),units(projects(name))")
    .eq("tenant_id", tenantId)
    .order("scheduled_at", { ascending: true });
  if (error) throw error;

  type Row = {
    id: string; type: string | null; scheduled_at: string | null; status: string; notes: string | null;
    contacts: { full_name?: string } | { full_name?: string }[] | null;
    members: { name?: string } | { name?: string }[] | null;
    units: { projects?: { name?: string } | { name?: string }[] } | { projects?: { name?: string } | { name?: string }[] }[] | null;
  };
  const one = <T,>(v: T | T[] | null | undefined): T | undefined =>
    Array.isArray(v) ? v[0] : (v ?? undefined);
  return ((data ?? []) as unknown as Row[]).map((r) => {
    const when = r.scheduled_at ? new Date(r.scheduled_at) : null;
    const contact = one(r.contacts);
    const member = one(r.members);
    const unit = one(r.units);
    const proj = one(unit?.projects);
    return {
      id: r.id,
      lead: contact?.full_name ?? "—",
      type: r.type ?? "video",
      agent: member?.name ?? "AI Agent",
      date: when ? when.toISOString().slice(0, 10) : "",
      time: when ? when.toISOString().slice(11, 16) : "",
      property: proj?.name ?? r.notes ?? "—",
      status: r.status,
      notes: r.notes ?? "",
    };
  });
}

export async function getDevelopers(): Promise<Developer[]> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();
  const { data: projects } = await sb
    .from("projects")
    .select("id,developer")
    .eq("tenant_id", tenantId);
  const { data: units } = await sb
    .from("units")
    .select("project_id,price,status")
    .eq("tenant_id", tenantId);

  type P = { id: string; developer: string };
  type U = { project_id: string; price: number | null; status: string | null };
  const projRows = (projects ?? []) as unknown as P[];
  const unitRows = (units ?? []) as unknown as U[];
  const projDev = new Map<string, string>();
  projRows.forEach((p) => projDev.set(p.id, p.developer));

  const byDev = new Map<string, { projects: Set<string>; active: number; total: number }>();
  projRows.forEach((p) => {
    if (!byDev.has(p.developer)) byDev.set(p.developer, { projects: new Set(), active: 0, total: 0 });
    byDev.get(p.developer)!.projects.add(p.id);
  });
  unitRows.forEach((u) => {
    const dev = projDev.get(u.project_id);
    if (!dev) return;
    const agg = byDev.get(dev)!;
    if ((u.status ?? "available") === "available") agg.active += 1;
    agg.total += Number(u.price ?? 0);
  });

  return [...byDev.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .map(([name, agg]) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      logo: name.charAt(0).toUpperCase(),
      properties: agg.projects.size,
      activeListings: agg.active,
      totalValue: aed(agg.total),
      onedrive: true,
      lastSync: "synced",
    }));
}
