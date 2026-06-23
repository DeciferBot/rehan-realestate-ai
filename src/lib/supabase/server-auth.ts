import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase auth client (Server Components / Route Handlers).
 * Reads the session from cookies so server code can know who is signed in.
 * This is the AUTH client (publishable key) — distinct from getSupabaseAdmin()
 * in supabase-server.ts, which uses the secret key to read the spine.
 */
export async function getSupabaseAuthServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_* env vars");

  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — cookies are read-only here.
          // The session refresh in middleware handles writes.
        }
      },
    },
  });
}
