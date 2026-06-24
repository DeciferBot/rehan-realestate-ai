import { NextResponse } from "next/server";
import { listForAdmin, upsertIntegration } from "@/lib/integrations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const providers = await listForAdmin();
    return NextResponse.json({ ok: true, providers });
  } catch (e) {
    const message = e instanceof Error ? e.message : "server_error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let body: { provider?: string; config?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body.provider || typeof body.config !== "object" || !body.config) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  const result = await upsertIntegration(body.provider, body.config);
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  const providers = await listForAdmin();
  return NextResponse.json({ ok: true, providers });
}
