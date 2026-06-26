/**
 * Public Supabase Storage bucket holding the page renders extracted from
 * developer availability sheets at ingest time. Written by the ingest pipeline
 * (see lib/ingest.ts) and read back, keyed by the project `ref`/folder, to
 * populate the property gallery (see lib/data.ts). Kept dependency-free so both
 * the heavy ingest route and the per-request data layer can share it without
 * dragging extra modules into either bundle.
 */
export const PROJECT_IMAGE_BUCKET = "project-images";
