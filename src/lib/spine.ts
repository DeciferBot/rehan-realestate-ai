import "server-only";
import { getSupabaseAdmin } from "./supabase-server";
import { getSupabaseAuthServer } from "./supabase/server-auth";
import { sendEmail, threadSubject, resolveEmailCreds } from "./email";

/**
 * Server-side access to the multi-tenant platform spine.
 * Tenant is resolved from the signed-in user's membership row.
 * Public webhook routes (no session) fall back to FALLBACK_TENANT_SLUG.
 */
const FALLBACK_TENANT_SLUG = "rehan";

export type TenantContext = {
  tenantId: string;
  tenantName: string;
  memberName: string | null;
  memberRole: string | null;
};

/** Resolve tenant from the auth session, or throw "no_tenant" if signed-in user has no membership. */
export async function getActiveTenantId(): Promise<string> {
  return (await resolveTenantContext()).tenantId;
}

export async function resolveTenantContext(): Promise<TenantContext> {
  const sb = getSupabaseAdmin();

  // Try session first.
  try {
    const authClient = await getSupabaseAuthServer();
    const { data: { user } } = await authClient.auth.getUser();
    if (user?.email) {
      const { data: member } = await sb
        .from("members")
        .select("tenant_id,name,role,tenants(id,name)")
        .eq("email", user.email)
        .limit(1)
        .maybeSingle();
      if (member) {
        const m = member as unknown as {
          tenant_id: string;
          name: string;
          role: string;
          tenants: { id: string; name: string } | { id: string; name: string }[];
        };
        const t = Array.isArray(m.tenants) ? m.tenants[0] : m.tenants;
        return { tenantId: m.tenant_id, tenantName: t?.name ?? "", memberName: m.name, memberRole: m.role };
      }
      // Signed in but no membership row → show the no-tenant screen.
      throw Object.assign(new Error("no_tenant"), { code: "no_tenant" });
    }
  } catch (e) {
    if ((e as { code?: string }).code === "no_tenant") throw e;
    // No session (public webhook path) — fall through to slug fallback.
  }

  // Fallback for public routes (intake, webhook) — no user session.
  const { data, error } = await sb
    .from("tenants")
    .select("id,name")
    .eq("slug", FALLBACK_TENANT_SLUG)
    .single();
  if (error) throw error;
  const t = data as { id: string; name: string };
  return { tenantId: t.id, tenantName: t.name, memberName: null, memberRole: null };
}

export type ThreadMessage = {
  id: string;
  channel: string;
  direction: string;
  role: string; // contact | agent | human | system
  body: string;
  lang: string | null;
  seq: number | null;
  ts: string | null;
  createdAt: string;
};

export type ConversationContact = {
  id: string;
  fullName: string;
  flag: string | null;
  language: string | null;
  status: string;
  source: string | null;
  budget: string | null;
  investType: string | null;
  assignedLabel: string | null;
  qualification: Record<string, unknown>;
  notes: string | null;
};

export type ConversationListItem = {
  id: string;
  status: string;
  lastChannel: string | null;
  lastMessageAt: string | null;
  contact: ConversationContact;
  snippet: string;
  snippetRole: string | null;
  messageCount: number;
};

export type ConversationThread = {
  id: string;
  status: string;
  aiPaused: boolean;
  lastChannel: string | null;
  contact: ConversationContact;
  messages: ThreadMessage[];
};

function mapContact(c: Record<string, unknown>): ConversationContact {
  return {
    id: c.id as string,
    fullName: c.full_name as string,
    flag: (c.flag as string) ?? null,
    language: (c.primary_language as string) ?? null,
    status: (c.status as string) ?? "new",
    source: (c.source as string) ?? null,
    budget: (c.budget as string) ?? null,
    investType: (c.invest_type as string) ?? null,
    assignedLabel: (c.assigned_label as string) ?? null,
    qualification: (c.qualification as Record<string, unknown>) ?? {},
    notes: (c.notes as string) ?? null,
  };
}

export async function getConversations(): Promise<ConversationListItem[]> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();

  const { data: convs, error } = await sb
    .from("conversations")
    .select(
      "id,status,last_channel,last_message_at,contact_id," +
        "contacts(id,full_name,flag,primary_language,status,source,budget,invest_type,assigned_label)"
    )
    .eq("tenant_id", tenantId);
  if (error) throw error;

  const { data: msgs, error: mErr } = await sb
    .from("messages")
    .select("conversation_id,body,role,seq,created_at")
    .eq("tenant_id", tenantId);
  if (mErr) throw mErr;

  type ConvRow = {
    id: string;
    status: string | null;
    last_channel: string | null;
    last_message_at: string | null;
    contact_id: string;
    contacts: Record<string, unknown> | Record<string, unknown>[];
  };
  type MsgRow = {
    conversation_id: string;
    body: string | null;
    role: string | null;
    seq: number | null;
    created_at: string;
  };
  const convRows = (convs ?? []) as unknown as ConvRow[];
  const msgRows = (msgs ?? []) as unknown as MsgRow[];

  const byConv = new Map<string, { body: string; role: string; created: string; seq: number }[]>();
  for (const m of msgRows) {
    const arr = byConv.get(m.conversation_id) ?? [];
    arr.push({
      body: m.body ?? "",
      role: m.role ?? "",
      created: m.created_at,
      seq: m.seq ?? 0,
    });
    byConv.set(m.conversation_id, arr);
  }

  const items: ConversationListItem[] = convRows.map((cv) => {
    const list = (byConv.get(cv.id as string) ?? []).sort(
      (a, b) => a.seq - b.seq || a.created.localeCompare(b.created)
    );
    const last = list[list.length - 1];
    const contactRaw = Array.isArray(cv.contacts) ? cv.contacts[0] : cv.contacts;
    return {
      id: cv.id as string,
      status: (cv.status as string) ?? "open",
      lastChannel: (cv.last_channel as string) ?? null,
      lastMessageAt: (cv.last_message_at as string) ?? null,
      contact: mapContact(contactRaw as Record<string, unknown>),
      snippet: last?.body ?? "No messages yet",
      snippetRole: last?.role ?? null,
      messageCount: list.length,
    };
  });

  // Live/active conversations float to the top, then by contact name.
  const rank = (s: string) =>
    s === "calling" ? 0 : s === "qualified" ? 1 : s === "new" ? 2 : 3;
  items.sort(
    (a, b) =>
      rank(a.contact.status) - rank(b.contact.status) ||
      a.contact.fullName.localeCompare(b.contact.fullName)
  );
  return items;
}

export async function getConversationThread(
  conversationId: string
): Promise<ConversationThread | null> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();

  const { data: cv, error } = await sb
    .from("conversations")
    .select(
      "id,status,ai_paused,last_channel,contact_id," +
        "contacts(id,full_name,flag,primary_language,status,source,budget,invest_type,assigned_label,qualification,notes)"
    )
    .eq("tenant_id", tenantId)
    .eq("id", conversationId)
    .maybeSingle();
  if (error) throw error;
  if (!cv) return null;

  const { data: msgs, error: mErr } = await sb
    .from("messages")
    .select("id,channel,direction,role,body,lang,seq,meta,created_at")
    .eq("conversation_id", conversationId)
    .order("seq", { ascending: true })
    .order("created_at", { ascending: true });
  if (mErr) throw mErr;

  type FullMsgRow = {
    id: string;
    channel: string | null;
    direction: string | null;
    role: string | null;
    body: string | null;
    lang: string | null;
    seq: number | null;
    meta: Record<string, unknown> | null;
    created_at: string;
  };
  const cvRow = cv as unknown as {
    id: string;
    status: string | null;
    ai_paused: boolean;
    last_channel: string | null;
    contacts: Record<string, unknown> | Record<string, unknown>[];
  };
  const msgRows = (msgs ?? []) as unknown as FullMsgRow[];

  const contactRaw = Array.isArray(cvRow.contacts) ? cvRow.contacts[0] : cvRow.contacts;
  return {
    id: cvRow.id,
    status: cvRow.status ?? "open",
    aiPaused: cvRow.ai_paused ?? false,
    lastChannel: cvRow.last_channel ?? null,
    contact: mapContact(contactRaw as Record<string, unknown>),
    messages: msgRows.map((m) => ({
      id: m.id,
      channel: m.channel ?? "",
      direction: m.direction ?? "",
      role: m.role ?? "",
      body: m.body ?? "",
      lang: m.lang ?? null,
      seq: m.seq ?? null,
      ts: (m.meta?.ts as string) ?? null,
      createdAt: m.created_at,
    })),
  };
}

export type QueueItem = {
  conversationId: string;
  contactId: string;
  contactName: string;
  flag: string | null;
  status: string;
  budget: string | null;
  assignedLabel: string | null;
  lastMessageAt: string | null;
  aiPaused: boolean;
  summary: string | null;
};

/** Leads that have been escalated or assigned — the human operator queue. */
export async function getQueue(): Promise<QueueItem[]> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();

  const { data: evts } = await sb
    .from("events")
    .select("contact_id")
    .eq("tenant_id", tenantId)
    .eq("type", "escalated");
  const escalatedIds = [...new Set(((evts ?? []) as { contact_id: string }[]).map((e) => e.contact_id))];
  if (!escalatedIds.length) return [];

  const { data, error } = await sb
    .from("contacts")
    .select(
      "id,full_name,flag,status,budget,assigned_label,assigned_member_id," +
        "conversations(id,last_message_at,ai_paused)"
    )
    .eq("tenant_id", tenantId)
    .in("id", escalatedIds)
    .not("status", "in", '("closed","lost")');
  if (error) throw error;

  type QRow = {
    id: string;
    full_name: string;
    flag: string | null;
    status: string;
    budget: string | null;
    assigned_label: string | null;
    conversations: { id: string; last_message_at: string | null; ai_paused: boolean }[];
  };

  const rows = (data ?? []) as unknown as QRow[];
  const items: QueueItem[] = rows.flatMap((c) =>
    (c.conversations ?? []).map((cv) => ({
      conversationId: cv.id,
      contactId: c.id,
      contactName: c.full_name,
      flag: c.flag,
      status: c.status,
      budget: c.budget,
      assignedLabel: c.assigned_label,
      lastMessageAt: cv.last_message_at,
      aiPaused: cv.ai_paused ?? false,
      summary: null,
    }))
  );
  items.sort((a, b) => (b.lastMessageAt ?? "").localeCompare(a.lastMessageAt ?? ""));
  return items;
}

export type Member = { id: string; name: string; email: string | null };

export async function getMembers(): Promise<Member[]> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();
  const { data } = await sb
    .from("members")
    .select("id,name,email")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true });
  return ((data ?? []) as unknown as Member[]);
}

/**
 * Insert an operator (human take-over) message and bump the conversation.
 *
 * `deliver` controls real outbound delivery for email-channel conversations.
 * It defaults to `false`: operator messages typed in the dashboard are logged
 * to the thread but NOT emailed unless the operator explicitly opts in.
 */
export async function postHumanMessage(
  conversationId: string,
  body: string,
  channel?: string,
  deliver: boolean = false
): Promise<void> {
  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();

  const { data: cv, error: cErr } = await sb
    .from("conversations")
    .select("id,contact_id,last_channel")
    .eq("tenant_id", tenantId)
    .eq("id", conversationId)
    .single();
  if (cErr) throw cErr;

  const { count } = await sb
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", conversationId);

  const ch = channel || cv.last_channel || "email";
  const now = new Date().toISOString();

  const { error: insErr } = await sb.from("messages").insert({
    tenant_id: tenantId,
    conversation_id: conversationId,
    contact_id: cv.contact_id,
    channel: ch,
    direction: "outbound",
    role: "human",
    body,
    seq: (count ?? 0) + 1,
    meta: { author: "operator" },
    created_at: now,
  });
  if (insErr) throw insErr;

  await sb
    .from("conversations")
    .update({ last_channel: ch, last_message_at: now })
    .eq("id", conversationId);

  await sb.from("events").insert({
    tenant_id: tenantId,
    contact_id: cv.contact_id,
    conversation_id: conversationId,
    type: "human_reply",
    payload: { channel: ch },
  });

  // Real delivery for operator take-over over email — only when the operator
  // explicitly opted in. Dashboard/test replies stay internal to the thread.
  if (ch === "email" && deliver) {
    const { data: idn } = await sb
      .from("contact_identities")
      .select("value")
      .eq("tenant_id", tenantId)
      .eq("contact_id", cv.contact_id)
      .eq("channel", "email")
      .limit(1)
      .maybeSingle();
    const to = (idn as { value?: string } | null)?.value;
    if (to) {
      const ec = await resolveEmailCreds(tenantId);
      await sendEmail({ to, subject: threadSubject("", true), text: body, apiKey: ec.apiKey, from: ec.from, replyTo: ec.replyTo });
    }
  }
}
