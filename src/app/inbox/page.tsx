import Header from "@/components/Header";
import { getConversations, getConversationThread } from "@/lib/spine";
import Composer from "./Composer";
import AgentRespondButton from "./AgentRespondButton";
import Link from "next/link";
import { Phone, MessageSquare, Mail, Bot, User, UserCog, Inbox as InboxIcon, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

const statusBadge: Record<string, string> = {
  calling: "badge-primary",
  new: "badge-accent",
  called: "badge-info",
  qualified: "badge-purple",
  appointed: "badge-warning",
  closed: "badge-success",
};

const channelIcon: Record<string, React.ReactNode> = {
  voice: <Phone size={11} />,
  whatsapp: <MessageSquare size={11} />,
  email: <Mail size={11} />,
};

function roleLabel(role: string, contactName: string) {
  if (role === "contact") return contactName;
  if (role === "human") return "Operator";
  if (role === "system") return "System";
  return "AI Agent";
}

function roleIcon(role: string) {
  if (role === "contact") return <User size={10} />;
  if (role === "human") return <UserCog size={10} />;
  return <Bot size={10} />;
}

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  const conversations = await getConversations();
  const selectedId = c ?? conversations[0]?.id ?? null;
  const thread = selectedId ? await getConversationThread(selectedId) : null;

  return (
    <div>
      <Header
        title="Conversations"
        subtitle="Every lead, every channel, one thread — voice · WhatsApp · email"
      />
      <div style={{ padding: "20px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 16, height: "calc(100dvh - 150px)" }}>

          {/* Conversation list */}
          <div className="panel-lg" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <InboxIcon size={13} style={{ color: "var(--dim)" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Inbox</span>
              <span className="badge badge-muted" style={{ marginLeft: "auto" }}>{conversations.length}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {conversations.map((cv) => {
                const active = cv.id === selectedId;
                return (
                  <Link
                    key={cv.id}
                    href={`/inbox?c=${cv.id}`}
                    style={{
                      display: "block", padding: "12px 16px",
                      borderBottom: "1px solid var(--border)",
                      borderLeft: `2px solid ${active ? "var(--primary)" : "transparent"}`,
                      background: active ? "var(--surface-2)" : "transparent",
                      textDecoration: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                      <span style={{ fontSize: 14 }}>{cv.contact.flag}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cv.contact.fullName}
                      </span>
                      {cv.contact.status === "calling" && <span className="live-dot live-dot-red" />}
                      <span className={`badge ${statusBadge[cv.contact.status] ?? "badge-muted"}`}>{cv.contact.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 5 }}>
                      {cv.snippetRole && cv.snippetRole !== "contact" ? "↩ " : ""}{cv.snippet}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: "var(--dim)" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                        {channelIcon[cv.lastChannel ?? ""] ?? <Globe size={11} />}
                        {cv.lastChannel ?? "—"}
                      </span>
                      <span>·</span>
                      <span>{cv.messageCount} msgs</span>
                      {cv.contact.budget && <span style={{ marginLeft: "auto", color: "var(--accent)", fontWeight: 600 }} className="mono">{cv.contact.budget}</span>}
                    </div>
                  </Link>
                );
              })}
              {conversations.length === 0 && (
                <div style={{ padding: 24, fontSize: 13, color: "var(--dim)", textAlign: "center" }}>No conversations yet.</div>
              )}
            </div>
          </div>

          {/* Thread */}
          <div className="panel-lg" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {thread ? (
              <>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{thread.contact.flag}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{thread.contact.fullName}</div>
                    <div style={{ fontSize: 11, color: "var(--dim)", display: "flex", alignItems: "center", gap: 6 }}>
                      <Globe size={10} />{thread.contact.language}
                      {thread.contact.source && <><span>·</span>{thread.contact.source}</>}
                      {thread.contact.assignedLabel && <><span>·</span>{thread.contact.assignedLabel}</>}
                    </div>
                  </div>
                  <span className={`badge ${statusBadge[thread.contact.status] ?? "badge-muted"}`} style={{ marginLeft: "auto" }}>
                    {thread.contact.status}
                  </span>
                  <AgentRespondButton conversationId={thread.id} />
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {thread.messages.map((m) => {
                    const fromContact = m.role === "contact";
                    const isArabic = m.lang === "Arabic";
                    return (
                      <div key={m.id} style={{ display: "flex", justifyContent: fromContact ? "flex-start" : "flex-end" }}>
                        <div style={{ maxWidth: "76%" }}>
                          <div style={{
                            fontSize: 10, color: "var(--dim)", marginBottom: 4,
                            display: "flex", gap: 6, alignItems: "center",
                            flexDirection: fromContact ? "row" : "row-reverse",
                          }}>
                            {roleIcon(m.role)}
                            <span>{roleLabel(m.role, thread.contact.fullName)}</span>
                            <span>·</span>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                              {channelIcon[m.channel] ?? null}{m.channel}
                            </span>
                            {m.ts && <><span>·</span><span className="mono">{m.ts}</span></>}
                          </div>
                          <div
                            dir={isArabic ? "rtl" : "ltr"}
                            style={{
                              padding: "10px 14px",
                              borderRadius: fromContact ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
                              fontSize: 13, lineHeight: 1.5, color: "var(--ink)",
                              background: fromContact ? "var(--surface-2)" : "var(--primary-dim)",
                              border: `1px solid ${fromContact ? "var(--border)" : "var(--primary-border)"}`,
                            }}
                          >
                            {m.body}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {thread.messages.length === 0 && (
                    <div style={{ fontSize: 13, color: "var(--dim)", textAlign: "center", marginTop: 24 }}>
                      No messages yet — the agent hasn&apos;t engaged this contact.
                    </div>
                  )}
                </div>

                <Composer conversationId={thread.id} channel={thread.lastChannel} />
              </>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dim)", fontSize: 13 }}>
                Select a conversation
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
