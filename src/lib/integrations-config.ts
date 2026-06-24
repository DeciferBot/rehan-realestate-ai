/**
 * Integration registry — the set of services a tenant can connect, and the
 * fields each one needs. Pure data (no secrets, no server deps) so both the
 * admin UI and the server can import it.
 */

export type FieldType = "secret" | "text";

export type IntegrationField = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  help?: string;
};

export type ProviderDef = {
  id: string;
  label: string;
  category: "ai" | "email" | "messaging" | "voice" | "leadsource";
  blurb: string;
  status: "active" | "stored"; // active = used now; stored = wired when channel ships
  fields: IntegrationField[];
  webhookPath?: string; // show the URL the provider must call
  docsUrl?: string;
};

export const SECRET_MASK = "••••••••";

export function maskSecret(value: string | undefined | null): string {
  if (!value) return "";
  const last = value.slice(-4);
  return `${SECRET_MASK}${last}`;
}

/** A submitted secret left untouched still carries the mask — don't overwrite it. */
export function isMasked(value: string): boolean {
  return value.startsWith("••");
}

export const PROVIDERS: ProviderDef[] = [
  {
    id: "anthropic",
    label: "Anthropic (Claude)",
    category: "ai",
    blurb: "The brain. Powers the AI agent's replies and qualification.",
    status: "active",
    docsUrl: "https://console.anthropic.com/settings/keys",
    fields: [
      { key: "api_key", label: "API key", type: "secret", placeholder: "sk-ant-…", required: true },
    ],
  },
  {
    id: "resend",
    label: "Resend (Email)",
    category: "email",
    blurb: "Sends the agent's emails and receives replies. Sender domain must be verified in Resend.",
    status: "active",
    docsUrl: "https://resend.com/api-keys",
    webhookPath: "/api/webhooks/email",
    fields: [
      { key: "api_key", label: "API key", type: "secret", placeholder: "re_…", required: true },
      { key: "from_email", label: "From address", type: "text", placeholder: "acre@yourdomain.com" },
      { key: "reply_to", label: "Reply-to", type: "text", placeholder: "sales@yourdomain.com" },
    ],
  },
  {
    id: "whatsapp",
    label: "WhatsApp (Meta Cloud API)",
    category: "messaging",
    blurb: "Two-way WhatsApp. The channel UAE buyers actually use. Requires a Meta Business app + approved templates.",
    status: "stored",
    docsUrl: "https://developers.facebook.com/docs/whatsapp/cloud-api",
    webhookPath: "/api/webhooks/whatsapp",
    fields: [
      { key: "phone_number_id", label: "Phone number ID", type: "text", required: true },
      { key: "business_account_id", label: "WhatsApp Business Account ID", type: "text" },
      { key: "access_token", label: "Access token", type: "secret", placeholder: "EAAB…", required: true },
      { key: "app_secret", label: "App secret", type: "secret", required: true },
      { key: "verify_token", label: "Webhook verify token", type: "text", required: true, help: "You choose this; paste the same value into Meta's webhook setup." },
    ],
  },
  {
    id: "meta_lead_ads",
    label: "Meta Lead Ads",
    category: "leadsource",
    blurb: "Auto-pull leads from Facebook/Instagram lead forms straight into the inbox.",
    status: "stored",
    docsUrl: "https://developers.facebook.com/docs/marketing-api/guides/lead-ads",
    webhookPath: "/api/webhooks/meta-leads",
    fields: [
      { key: "page_id", label: "Page ID", type: "text" },
      { key: "access_token", label: "Page access token", type: "secret", required: true },
      { key: "app_secret", label: "App secret", type: "secret", required: true },
      { key: "verify_token", label: "Webhook verify token", type: "text", required: true },
    ],
  },
  {
    id: "vapi",
    label: "Vapi (Voice)",
    category: "voice",
    blurb: "AI phone calls — inbound and outbound. Last channel on the roadmap.",
    status: "stored",
    docsUrl: "https://docs.vapi.ai",
    webhookPath: "/api/webhooks/vapi",
    fields: [
      { key: "api_key", label: "API key", type: "secret", required: true },
      { key: "phone_number_id", label: "Phone number ID", type: "text" },
      { key: "assistant_id", label: "Assistant ID", type: "text" },
    ],
  },
];

export function getProvider(id: string): ProviderDef | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

/** Required fields all present → connected. */
export function computeConnected(provider: ProviderDef, config: Record<string, string>): boolean {
  return provider.fields.filter((f) => f.required).every((f) => Boolean(config[f.key]?.trim()));
}
