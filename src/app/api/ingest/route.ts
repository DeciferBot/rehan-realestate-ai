import { NextResponse } from "next/server";
import { ingestAvailability } from "@/lib/ingest";

export const maxDuration = 300;

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") || "";
  let text: string | undefined;
  let base64: string | undefined;
  let filename = "upload.pdf";

  try {
    if (ct.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ ok: false, error: "no_file" }, { status: 400 });
      }
      filename = file.name || filename;
      const buf = Buffer.from(await file.arrayBuffer());
      base64 = buf.toString("base64");
    } else {
      const data = (await req.json()) as { text?: string; base64?: string; filename?: string };
      text = data.text;
      base64 = data.base64;
      if (data.filename) filename = data.filename;
    }
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }

  if (!text && !base64) {
    return NextResponse.json({ ok: false, error: "missing_content" }, { status: 400 });
  }

  try {
    const result = await ingestAvailability({ text, base64, filename });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "server_error";
    console.error("ingest failed:", message);
    const notConfigured = message.includes("ANTHROPIC_API_KEY");
    return NextResponse.json(
      { ok: false, error: notConfigured ? "not_configured" : "server_error", detail: message },
      { status: notConfigured ? 503 : 500 }
    );
  }
}
