import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth gate for the Acre command center.
 *
 * - Marketing lives at the root (/, /pricing, /solutions, /contact) and /landing — all public.
 * - The command center lives under /console and the other dashboard pages; every
 *   dashboard page and the browser-facing admin APIs require a Supabase session, else → /login.
 * - Webhook + marketing APIs (lead intake, waitlist) stay public — they are
 *   hit by external systems and carry their own verification.
 */

// Gated dashboard pages.
const APP_PAGE_PREFIXES = [
  "/console",
  "/inbox",
  "/leads",
  "/properties",
  "/agent-console",
  "/appointments",
  "/developers",
  "/settings",
];

// Gated admin APIs (called from the dashboard by a signed-in user).
const APP_API_PREFIXES = [
  "/api/messages",
  "/api/agent-config",
  "/api/agent/respond",
  "/api/agent/qualify",
  "/api/ingest",
];

function isProtected(pathname: string): boolean {
  if (APP_PAGE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) return true;
  if (APP_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refreshes the session cookie if needed and validates the JWT.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Already signed in and hitting /login → send to the command center.
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/console", request.url));
  }

  if (!user && isProtected(pathname)) {
    // APIs get a clean 401; pages get redirected to the login screen.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Run on everything except Next internals and static asset files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf)).*)",
  ],
};
