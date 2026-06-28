/**
 * Document categories for the Developer Portal library. Plain module (no
 * server-only) so both the server loader (documents.ts) and the client UI
 * (DevelopersClient) share one source of truth for the folder list.
 *
 * `kind` is the value stored in documents.kind. "availability" already exists
 * from ingestion; the rest are created by uploads through the portal.
 */

export type DocCategory = { label: string; kind: string };

export const DOC_CATEGORIES: DocCategory[] = [
  { label: "Floor Plans", kind: "floor_plan" },
  { label: "Brochures", kind: "brochure" },
  { label: "Payment Plans", kind: "payment_plan" },
  { label: "Legal Documents", kind: "legal" },
  { label: "Media Assets", kind: "media" },
  { label: "Availability", kind: "availability" },
];

export const KIND_TO_LABEL: Record<string, string> = Object.fromEntries(
  DOC_CATEGORIES.map((c) => [c.kind, c.label]),
);

export type DocItem = {
  id: string;
  kind: string;
  title: string;
  fileName: string | null;
  sizeBytes: number | null;
  createdAt: string;
  /** Signed download URL (stored files) or external link; null if not downloadable. */
  url: string | null;
  /** Whether the row points at a real, downloadable file. */
  downloadable: boolean;
};

export function formatBytes(n: number | null): string {
  if (!n || n <= 0) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
