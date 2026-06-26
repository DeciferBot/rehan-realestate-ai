import "server-only";

/**
 * Render the pages of a PDF to PNG images. Used by the ingestion pipeline to
 * pull the renders / site plans / floor plates out of a developer availability
 * sheet so they can populate a property's gallery (the sheets carry no
 * per-unit photos, but their pages do carry usable imagery).
 *
 * mupdf is a pure-WASM build (no native binaries), so it runs in a serverless
 * Node route without a node-gyp/canvas toolchain. The import is dynamic so a
 * load failure is contained by the caller rather than crashing the module.
 */

export type RenderedPage = { index: number; png: Uint8Array };

export async function renderPdfPages(
  base64: string,
  opts: { scale?: number; maxPages?: number } = {}
): Promise<RenderedPage[]> {
  const scale = opts.scale ?? 2;
  const maxPages = opts.maxPages ?? 12;

  const mupdf = await import("mupdf");
  const buf = Buffer.from(base64, "base64");
  const doc = mupdf.Document.openDocument(buf, "application/pdf");

  const total = Math.min(doc.countPages(), maxPages);
  const out: RenderedPage[] = [];
  const matrix = mupdf.Matrix.scale(scale, scale);

  for (let i = 0; i < total; i++) {
    const page = doc.loadPage(i);
    const pix = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB, false, true);
    out.push({ index: i, png: pix.asPNG() });
    pix.destroy();
    page.destroy();
  }
  doc.destroy();
  return out;
}
