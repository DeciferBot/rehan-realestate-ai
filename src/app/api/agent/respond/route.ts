import { NextResponse } from "next/server";
import { generateAgentReply } from "@/lib/agent";

export const maxDuration = 60;

export async function POST(req: Request) {
  let data: { conversationId?: string; deliver?: boolean };
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
    // Dashboard-triggered replies do not deliver a real email unless the
    // operator explicitly opted in; testing the agent stays internal.
    const { text } = await generateAgentReply(conversationId, { deliver: data.deliver === true });
    return NextResponse.json({ ok: true, text });
  } catch (e) {
    const message = e instanceof Error ? e.message : "server_error";
    console.error("agent/respond failed:", message);
    const notConfigured = message.includes("ANTHROPIC_API_KEY");
    const paused = message === "ai_paused";
    return NextResponse.json(
      { ok: false, error: paused ? "ai_paused" : notConfigured ? "not_configured" : "server_error", detail: message },
      { status: paused ? 409 : notConfigured ? 503 : 500 }
    );
  }
}
