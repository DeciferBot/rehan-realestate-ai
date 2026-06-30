import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth callback for Supabase email links — magic-link sign-in and password
 * recovery both land here. The email link carries a one-time `?code` (PKCE
 * flow); we exchange it for a session cookie, then forward the browser on to
 * `next`. Without this route the email links have nowhere to complete the
 * exchange, which is why magic-link sign-in never worked.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = sanitizeNext(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=link_invalid", origin));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/login?error=link_expired", origin));
  }

  return NextResponse.redirect(new URL(next, origin));
}

// Only allow same-site, relative destinations — never an attacker-supplied
// absolute URL (open-redirect guard).
function sanitizeNext(value: string | null): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/console";
}
