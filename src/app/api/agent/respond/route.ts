import { NextResponse } from "next/server";
import { generateAgentReply } from "@/lib/agent";

export const maxDuration = 60;

export async function POST(req: Request) {
  let data: { conversationId?: string };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const conversationId = data.conversationId?.trim();
  if (!conversationId) {
    return NextResponse.json({ ok: false, error: "missing_conversationId" }, { status: 400 });
  }
  try {
    const { text } = await generateAgentReply(conversationId);
    return NextResponse.json({ ok: true, text });
  } catch (e) {
    const message = e instanceof Error ? e.message : "server_error";
    console.error("agent/respond failed:", message);
    const notConfigured = message.includes("ANTHROPIC_API_KEY");
    return NextResponse.json(
      { ok: false, error: notConfigured ? "not_configured" : "server_error", detail: message },
      { status: notConfigured ? 503 : 500 }
    );
  }
}
