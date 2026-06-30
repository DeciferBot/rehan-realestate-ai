import { NextResponse } from "next/server";

/**
 * Abuse guard for the public lead-intake endpoints (/api/leads,
 * /api/aitaas-lead, /api/waitlist).
 *
 * These are public browser forms — they can't carry a server-side secret — so
 * we can't hard-authenticate them. Instead we apply a speed-bump:
 *
 *  1. Server-to-server callers may pass `x-intake-secret: <INTAKE_API_SECRET>`
 *     to bypass the origin check entirely (used by trusted integrations).
 *  2. Browser submissions must carry an `Origin` (or `Referer`) belonging to
 *     one of our own hosts. Real browsers always send `Origin` on a `fetch`
 *     POST; bots hitting the API directly usually send none or a foreign one.
 *
 * NOTE: `Origin` is spoofable by non-browser clients, so this stops casual
 * cross-site abuse, not a determined attacker. For real bot defense add a
 * Turnstile/captcha token or per-IP rate limiting on top of this.
 */

const ALLOWED_HOSTS = [
  "simmerproperties.com",
  "www.simmerproperties.com",
  "acre.simmerproperties.com",
];

function hostAllowed(host: string): boolean {
  const h = host.toLowerCase();
  if (ALLOWED_HOSTS.includes(h)) return true;
  if (h === "localhost" || h.startsWith("localhost:") || h === "127.0.0.1") return true;
  // Vercel preview deployments for this project.
  if (h.endsWith(".vercel.app")) return true;
  return false;
}

function originHost(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}

/**
 * Returns a 403 `NextResponse` when the request should be rejected, or `null`
 * when it is allowed to proceed.
 */
export function checkIntakeRequest(req: Request): NextResponse | null {
  // 1. Trusted server-to-server bypass.
  const secret = process.env.INTAKE_API_SECRET;
  if (secret && req.headers.get("x-intake-secret") === secret) return null;

  // 2. Same-origin browser check (Origin first, Referer as a fallback).
  const host = originHost(req.headers.get("origin")) ?? originHost(req.headers.get("referer"));
  if (host && hostAllowed(host)) return null;

  return NextResponse.json({ ok: false, error: "forbidden_origin" }, { status: 403 });
}
