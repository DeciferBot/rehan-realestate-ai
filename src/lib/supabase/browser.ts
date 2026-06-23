import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client for interactive auth (login / logout).
 * Uses the publishable key — never the secret key — and reads/writes the
 * session cookie that `middleware.ts` validates on every protected request.
 */
export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_* env vars");
  return createBrowserClient(url, key);
}
