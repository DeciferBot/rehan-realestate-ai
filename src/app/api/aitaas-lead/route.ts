import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { name, email, company, phone, teamSize, interest, message } = data ?? {};
  if (!name?.trim() || !email?.trim() || !interest?.trim()) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("aitaas-lead: RESEND_API_KEY not configured");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const lines = [
    `Name:      ${name}`,
    `Email:     ${email}`,
    `Company:   ${company || "-"}`,
    `Phone:     ${phone || "-"}`,
    `Team size: ${teamSize || "-"}`,
    `Interest:  ${interest}`,
    "",
    "Message:",
    message || "-",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "AITaaS Website <leads@simmerproperties.com>",
      to: ["chopraa@gmail.com"],
      reply_to: email,
      subject: `New AITaaS lead: ${name}${company ? ` (${company})` : ""}`,
      text: lines,
    }),
  });

  if (!res.ok) {
    console.error("aitaas-lead: resend failed", res.status, await res.text());
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
