import { NextResponse } from "next/server";
import { intakeLead } from "@/lib/intake";
import { checkIntakeRequest } from "@/lib/intake-guard";

export const maxDuration = 120;

export async function POST(req: Request) {
  const blocked = checkIntakeRequest(req);
  if (blocked) return blocked;

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const str = (k: string) => (typeof data[k] === "string" ? (data[k] as string).trim() : undefined);
  const name = str("name");
  if (!name) {
    return NextResponse.json({ ok: false, error: "missing_name" }, { status: 400 });
  }

  try {
    const result = await intakeLead({
      name,
      phone: str("phone"),
      email: str("email"),
      language: str("language"),
      flag: str("flag"),
      source: str("source"),
      investType: str("investType"),
      budget: str("budget"),
      propertyInterest: str("propertyInterest"),
      channel: str("channel"),
      autoEngage: Boolean(data.autoEngage),
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "server_error";
    console.error("lead intake failed:", message);
    const notConfigured = message.includes("ANTHROPIC_API_KEY");
    return NextResponse.json(
      { ok: false, error: notConfigured ? "not_configured" : "server_error", detail: message },
      { status: notConfigured ? 503 : 500 }
    );
  }
}
