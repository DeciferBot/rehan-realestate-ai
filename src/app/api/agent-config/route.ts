import { NextResponse } from "next/server";
import { updateAgentConfig } from "@/lib/admin";

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const id = typeof data.id === "string" ? data.id.trim() : "";
  const name = typeof data.name === "string" ? data.name.trim() : "";
  if (!id || !name) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const asStrArray = (v: unknown): string[] =>
    Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : [];

  try {
    await updateAgentConfig({
      id,
      name,
      persona: typeof data.persona === "string" ? data.persona : "",
      systemPrompt: typeof data.systemPrompt === "string" ? data.systemPrompt : "",
      model: typeof data.model === "string" && data.model ? data.model : "claude-opus-4-8",
      languages: asStrArray(data.languages),
      channels: asStrArray(data.channels),
      capture: asStrArray(data.capture),
      escalateWhen: asStrArray(data.escalateWhen),
      active: Boolean(data.active),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("agent-config save failed:", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
