import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client. Prefers a privileged secret/service-role key
 * when one is configured (bypasses RLS — the historical behaviour). When only
 * the publishable key is available, it falls back to that: requests then run as
 * the `anon` role and are subject to row-level security and storage policies,
 * so the relevant tables/buckets must have policies granting the access the
 * server pages and ingest need.
 */
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key, { auth: { persistSession: false } });
}
