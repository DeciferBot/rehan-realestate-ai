import { NextResponse } from "next/server";
import { postHumanMessage } from "@/lib/spine";

export async function POST(req: Request) {
  let data: { conversationId?: string; body?: string; channel?: string };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const conversationId = data.conversationId?.trim();
  const body = data.body?.trim();
  if (!conversationId || !body) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  try {
    await postHumanMessage(conversationId, body, data.channel);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("messages: failed to post", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
