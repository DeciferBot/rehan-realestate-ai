import type { Property } from "./data";

/**
 * Build a WhatsApp "share this listing to a client" message + deep link.
 * Pure (type-only import of Property), so it is safe to use in client components.
 * No number is preset — `wa.me/?text=…` opens WhatsApp's contact picker so the
 * agent forwards the listing to whichever buyer they choose.
 */

export function listingMessage(p: Property, url?: string): string {
  const price = `AED ${(p.price / 1_000_000).toFixed(1)}M`;
  const handover =
    p.completion && p.completion !== "—"
      ? p.completion === "Ready"
        ? "Ready to move"
        : `Handover: ${p.completion}`
      : "";
  return [
    `*${p.name}* — ${p.location}`,
    `${price} · ${p.bedrooms} BR · ${p.sqft.toLocaleString()} sqft · ${p.type}`,
    handover,
    p.description,
    url,
  ]
    .filter(Boolean)
    .join("\n");
}

export function whatsappShareUrl(p: Property, url?: string): string {
  return `https://wa.me/?text=${encodeURIComponent(listingMessage(p, url))}`;
}
