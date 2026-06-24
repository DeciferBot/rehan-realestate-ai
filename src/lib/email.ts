import "server-only";
import { getIntegrationConfig } from "./integrations";

/**
 * Email channel via Resend (simmerproperties.com is a verified sender).
 * The agent's outbound replies and operator take-overs are sent as real email;
 * inbound replies arrive at /api/webhooks/email and continue the conversation.
 * Credentials resolve from the tenant's Integrations panel, falling back to env.
 */

export const ACRE_FROM = "Acre · Simmer Properties <acre@simmerproperties.com>";
export const ACRE_REPLY_TO = "acre@simmerproperties.com";

/** Resolve Resend credentials: tenant Integrations panel → environment default. */
export async function resolveEmailCreds(
  tenantId?: string
): Promise<{ apiKey?: string; from: string; replyTo: string }> {
  const cfg = await getIntegrationConfig("resend", tenantId);
  const from = cfg.from_email
    ? `Acre · Simmer Properties <${cfg.from_email}>`
    : ACRE_FROM;
  return {
    apiKey: cfg.api_key || process.env.RESEND_API_KEY,
    from,
    replyTo: cfg.reply_to || ACRE_REPLY_TO,
  };
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  apiKey?: string;
  from?: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const key = opts.apiKey || process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "no_resend_key" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: opts.from ?? ACRE_FROM,
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
