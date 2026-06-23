import "server-only";

/**
 * Email channel via Resend (simmerproperties.com is a verified sender).
 * The agent's outbound replies and operator take-overs are sent as real email;
 * inbound replies arrive at /api/webhooks/email and continue the conversation.
 */

export const ACRE_FROM = "Acre · Simmer Properties <acre@simmerproperties.com>";
export const ACRE_REPLY_TO = "acre@simmerproperties.com";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "no_resend_key" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: ACRE_FROM,
        to: [opts.to],
        subject: opts.subject,
        text: opts.text,
        reply_to: opts.replyTo ?? ACRE_REPLY_TO,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      return { ok: false, error: t.slice(0, 300) };
    }
    const j = (await res.json()) as { id?: string };
    return { ok: true, id: j.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "send_failed" };
  }
}

/** A stable, human subject line for a contact's email thread. */
export function threadSubject(contactName: string, isReply: boolean): string {
  const base = `Simmer Properties — your property search`;
  return isReply ? `Re: ${base}` : `${base}${contactName ? `, ${contactName.split(" ")[0]}` : ""}`;
}
