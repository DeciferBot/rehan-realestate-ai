import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    /* insert — ignore duplicates */
    const { error } = await supabase
      .from("waitlist")
      .insert({ email, source: "landing" });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "already_registered" }, { status: 409 });
      }
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "db_error" }, { status: 500 });
    }

    /* send confirmation to user */
    await resend.emails.send({
      from: "Simmer Properties <register@simmerproperties.com>",
      to: email,
      subject: "You're on the Simmer Properties waitlist",
      html: `
        <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;background:#06070D;color:#EDE8DF;padding:48px 40px;border:1px solid rgba(255,255,255,0.08)">
          <p style="font-size:22px;font-weight:300;color:#C8922A;margin:0 0 8px;letter-spacing:-0.01em">Simmer Properties</p>
          <h1 style="font-size:28px;font-weight:300;margin:0 0 24px;line-height:1.2">You're on the list.</h1>
          <p style="font-size:15px;color:#8A8580;line-height:1.7;margin:0 0 24px">
            We're building AI that qualifies every real estate lead in 60 seconds — calling them in their language, sending property brochures mid-call, and booking appointments while you sleep.
          </p>
          <p style="font-size:15px;color:#8A8580;line-height:1.7;margin:0 0 32px">
            We're onboarding agents in Dubai first. You'll hear from us when a spot opens up.
          </p>
          <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:24px;font-size:12px;color:#4A4540;letter-spacing:0.06em;text-transform:uppercase">
            Simmer Properties · Dubai, UAE
          </div>
        </div>
      `,
    });

    /* notify Rehan */
    await resend.emails.send({
      from: "Simmer Properties <register@simmerproperties.com>",
      to: "rehan.merchant@engworldwide.com",
      subject: `New waitlist signup: ${email}`,
      html: `
        <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:480px;margin:0 auto;background:#06070D;color:#EDE8DF;padding:36px 32px;border:1px solid rgba(255,255,255,0.08)">
          <p style="font-size:13px;color:#C8922A;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px">New Waitlist Signup</p>
          <p style="font-size:20px;font-weight:400;margin:0 0 8px">${email}</p>
          <p style="font-size:13px;color:#5C5850;margin:0">Source: simmerproperties.com landing page</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
