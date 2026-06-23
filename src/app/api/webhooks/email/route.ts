import { NextResponse } from "next/server";
import { handleInboundEmail } from "@/lib/intake";

export const maxDuration = 120;

/**
 * Inbound email webhook (Resend `email.received`).
 *
 * Activates once Resend Inbound is configured for simmerproperties.com (MX
 * records → Resend). Resend's inbound `data` shape isn't strictly fixed across
 * versions, so we parse defensively: pull a from-address + body text from the
 * common locations and continue the conversation.
 */

function pickEmail(v: unknown): { email: string; name?: string } | null {
  if (!v) return null;
  if (typeof v === "string") {
    const m = v.match(/<([^>]+)>/);
    const email = (m ? m[1] : v).trim().toLowerCase();
    const name = m ? v.slice(0, v.indexOf("<")).trim().replace(/^"|"$/g, "") : undefined;
    return email.includes("@") ? { email, name: name || undefined } : null;
  }
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    const email = (o.email as string) ?? (o.address as string);
    if (typeof email === "string" && email.includes("@")) {
      return { email: email.toLowerCase(), name: (o.name as string) ?? undefined };
    }
  }
  if (Array.isArray(v) && v.length) return pickEmail(v[0]);
  return null;
}

function stripHtml(html: string): string {
  return html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function POST(req: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const type = payload.type as string | undefined;
  const data = (payload.data as Record<string, unknown>) ?? payload;

  // Only act on inbound received email.
  if (type && type !== "email.received") {
    return NextResponse.json({ ok: true, ignored: type });
  }

  const from = pickEmail(data.from);
  const rawText =
    (data.text as string) ||
    (typeof data.html === "string" ? stripHtml(data.html) : "") ||
    "";
  const text = rawText.trim();

  if (!from || !text) {
    return NextResponse.json({ ok: false, error: "missing_from_or_text" }, { status: 400 });
  }

  try {
    const result = await handleInboundEmail({ fromEmail: from.email, fromName: from.name, text });
    return NextResponse.json({ ok: true, conversationId: result.conversationId });
  } catch (e) {
    console.error("inbound email failed:", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
