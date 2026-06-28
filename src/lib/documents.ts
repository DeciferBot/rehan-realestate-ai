import "server-only";
import { getSupabaseAdmin } from "./supabase-server";
import { getActiveTenantId } from "./spine";
import { DOC_CATEGORIES, type DocItem } from "./documents-shared";

/**
 * Developer Portal document library. Files live in the private `developer-docs`
 * storage bucket; metadata lives in the `documents` table (tenant-scoped, keyed
 * by developer name + kind). All access is brokered here with the service-role
 * client — downloads are handed out as short-lived signed URLs, never public.
 */

const BUCKET = "developer-docs";
const SIGNED_TTL = 60 * 60; // 1 hour

type Row = {
  id: string;
  kind: string;
  title: string | null;
  file_name: string | null;
  size_bytes: number | null;
  storage_path: string | null;
  source_url: string | null;
  developer: string | null;
  project_id: string | null;
  created_at: string;
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/**
 * Resolve each document's developer = its own `developer` column, falling back
 * to the developer of its linked project (covers rows ingested before the
 * developer column existed). Returns per-developer counts keyed by kind.
 */
export async function getDocCountsByDeveloper(): Promise<Record<string, Record<string, number>>> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();

  const [{ data: docs }, { data: projects }] = await Promise.all([
    sb.from("documents").select("kind,developer,project_id").eq("tenant_id", tenantId),
    sb.from("projects").select("id,developer").eq("tenant_id", tenantId),
  ]);

  const projDev = new Map<string, string>();
  for (const p of (projects ?? []) as { id: string; developer: string }[]) projDev.set(p.id, p.developer);

  const out: Record<string, Record<string, number>> = {};
  for (const d of (docs ?? []) as Pick<Row, "kind" | "developer" | "project_id">[]) {
    const dev = d.developer ?? (d.project_id ? projDev.get(d.project_id) : undefined);
    if (!dev) continue;
    (out[dev] ??= {})[d.kind] = ((out[dev] ??= {})[d.kind] ?? 0) + 1;
  }
  return out;
}

/** List one developer's documents for a given kind, with download URLs. */
export async function listDeveloperDocuments(developer: string, kind: string): Promise<DocItem[]> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();

  // Match rows scoped directly to the developer, OR ingested rows whose project
  // belongs to this developer.
  const { data: projects } = await sb
    .from("projects")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("developer", developer);
  const projectIds = ((projects ?? []) as { id: string }[]).map((p) => p.id);

  const orParts = [`developer.eq.${developer}`];
  if (projectIds.length) orParts.push(`project_id.in.(${projectIds.join(",")})`);

  const { data, error } = await sb
    .from("documents")
    .select("id,kind,title,file_name,size_bytes,storage_path,source_url,developer,project_id,created_at")
    .eq("tenant_id", tenantId)
    .eq("kind", kind)
    .or(orParts.join(","))
    .order("created_at", { ascending: false });
  if (error) throw error;

  const rows = (data ?? []) as Row[];

  return Promise.all(
    rows.map(async (r): Promise<DocItem> => {
      let url: string | null = null;
      let downloadable = false;
      if (r.storage_path) {
        const { data: signed } = await sb.storage.from(BUCKET).createSignedUrl(r.storage_path, SIGNED_TTL);
        url = signed?.signedUrl ?? null;
        downloadable = !!url;
      } else if (r.source_url && /^https?:\/\//i.test(r.source_url)) {
        url = r.source_url;
        downloadable = true;
      }
      return {
        id: r.id,
        kind: r.kind,
        title: r.title ?? r.file_name ?? "Untitled",
        fileName: r.file_name,
        sizeBytes: r.size_bytes,
        createdAt: r.created_at,
        url,
        downloadable,
      };
    }),
  );
}

/** Upload a file to a developer's folder and record it in `documents`. */
export async function uploadDeveloperDocument(input: {
  developer: string;
  kind: string;
  file: File;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const validKind = DOC_CATEGORIES.some((c) => c.kind === input.kind);
  if (!validKind) return { ok: false, error: "Unknown document category" };
  if (!input.file || input.file.size === 0) return { ok: false, error: "No file provided" };

  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();

  const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
  const path = `${tenantId}/${slug(input.developer)}/${input.kind}/${Date.now()}-${safeName}`;

  const bytes = new Uint8Array(await input.file.arrayBuffer());
  const { error: upErr } = await sb.storage.from(BUCKET).upload(path, bytes, {
    contentType: input.file.type || "application/octet-stream",
    upsert: false,
  });
  if (upErr) return { ok: false, error: upErr.message };

  const { error: insErr } = await sb.from("documents").insert({
    tenant_id: tenantId,
    developer: input.developer,
    kind: input.kind,
    title: input.file.name,
    file_name: input.file.name,
    size_bytes: input.file.size,
    content_type: input.file.type || null,
    storage_path: path,
  });
  if (insErr) {
    // Roll back the orphaned object so storage and table stay consistent.
    await sb.storage.from(BUCKET).remove([path]);
    return { ok: false, error: insErr.message };
  }
  return { ok: true };
}
