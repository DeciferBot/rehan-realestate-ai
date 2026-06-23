import Header from "@/components/Header";
import { getConversations, getConversationThread } from "@/lib/spine";
import { getContactDossier } from "@/lib/subagents";
import Composer from "./Composer";
import AgentRespondButton from "./AgentRespondButton";
import QualifyButton from "./QualifyButton";
import Link from "next/link";
import { Phone, MessageSquare, Mail, Bot, User, UserCog, Inbox as InboxIcon, Globe, Building2, Calculator, Gauge, ChevronLeft } from "lucide-react";

function aed(n: number): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 2)}M`;
  return `AED ${Math.round(n / 1000)}K`;
}
const fitBadge: Record<string, string> = { "at-budget": "badge-success", stretch: "badge-warning", below: "badge-info" };

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
  const dossier = thread ? await getContactDossier(thread.contact.budget) : null;

  return (
    <div>
      <Header
        title="Conversations"
        subtitle="Every lead, every channel, one thread — voice · WhatsApp · email"
      />
      <div style={{ padding: "20px 28px" }}>
        <div className={`inbox-grid${c ? " has-thread" : ""}`} style={{ display: "grid", gridTemplateColumns: thread ? "300px 1fr 300px" : "340px 1fr", gap: 16, height: "calc(100dvh - 150px)" }}>

          {/* Conversation list */}
          <div className="panel-lg inbox-list" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
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
          <div className="panel-lg inbox-thread" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {thread ? (
              <>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                  <Link href="/inbox" className="inbox-back" style={{ alignItems: "center", color: "var(--muted)", textDecoration: "none", marginRight: 2 }} aria-label="Back to conversations"><ChevronLeft size={18} /></Link>
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
                  <QualifyButton conversationId={thread.id} />
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

          {/* Dossier — live sub-agent output */}
          {thread && dossier && (
            <div className="panel-lg inbox-dossier" style={{ overflowY: "auto", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                Lead dossier
              </div>

              {thread.contact.assignedLabel?.startsWith("Human:") && (
                <div style={{ margin: 14, marginBottom: 0, padding: "8px 10px", borderRadius: 8, background: "var(--primary-dim)", border: "1px solid var(--primary-border)", display: "flex", alignItems: "center", gap: 8 }}>
                  <UserCog size={13} style={{ color: "var(--primary)" }} />
                  <span style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600 }}>Escalated · {thread.contact.assignedLabel.replace("Human: ", "")}</span>
                </div>
              )}

              <div style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <User size={12} style={{ color: "var(--dim)" }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>Profile</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[
                    { label: "Language", value: thread.contact.language ?? "—" },
                    { label: "Status", value: thread.contact.status },
                    { label: "Budget", value: thread.contact.budget ?? "—", accent: true },
                    { label: "Intent", value: thread.contact.investType === "investment" ? "Investment" : thread.contact.investType === "live-in" ? "Live-in" : "—" },
                    { label: "Source", value: thread.contact.source ?? "—" },
                  ].map(({ label, value, accent }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontSize: 12, color: "var(--dim)" }}>{label}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: accent ? "var(--accent)" : "var(--ink)", textAlign: "right" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {(() => {
                const q = thread.contact.qualification as Record<string, unknown>;
                const labels: [string, string][] = [["budget", "Budget"], ["intent", "Intent"], ["timeline", "Timeline"], ["financing", "Financing"], ["preferred_area", "Area"], ["family", "Family"]];
                const known = labels.filter(([k]) => {
                  const v = q[k];
                  return typeof v === "string" && v.trim() && v.toLowerCase() !== "unknown";
                });
                if (!known.length) return null;
                return (
                  <div style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                      <Gauge size={12} style={{ color: "var(--dim)" }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>Qualification</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {known.map(([k, label]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <span style={{ fontSize: 12, color: "var(--dim)", flexShrink: 0 }}>{label}</span>
                          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)", textAlign: "right" }}>{String(q[k])}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <Building2 size={12} style={{ color: "var(--dim)" }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>Best matches</span>
                  <span className="live-dot live-dot-green" style={{ marginLeft: "auto" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {dossier.recommendations.map((r) => (
                    <div key={r.id} style={{ padding: "9px 10px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.project}</span>
                        <span className={`badge ${fitBadge[r.fit] ?? "badge-muted"}`} style={{ flexShrink: 0 }}>{r.fit === "at-budget" ? "fits" : r.fit}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "var(--dim)" }}>
                        <span>{r.bedrooms}BR · {r.location}</span>
                        <span className="mono" style={{ fontWeight: 600, color: "var(--accent)" }}>{aed(r.price)}</span>
                      </div>
                    </div>
                  ))}
                  {dossier.recommendations.length === 0 && (
                    <div style={{ fontSize: 11, color: "var(--dim)" }}>No matching inventory.</div>
                  )}
                </div>
              </div>

              {dossier.mortgage && (
                <div style={{ padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                    <Calculator size={12} style={{ color: "var(--dim)" }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>Mortgage</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--dim)" }}>on top match</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { label: "Property value", value: aed(dossier.mortgage.value) },
                      { label: "Down payment (20%)", value: aed(dossier.mortgage.downPayment) },
                      { label: "Loan amount", value: aed(dossier.mortgage.loanAmount) },
                      { label: "Rate (est.)", value: `${dossier.mortgage.ratePct}% p.a.` },
                      { label: "Term", value: `${dossier.mortgage.years} years` },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "var(--dim)" }}>{label}</span>
                        <span style={{ fontSize: 12, color: "var(--ink)" }}>{value}</span>
                      </div>
                    ))}
                    <div style={{ paddingTop: 8, marginTop: 2, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>Monthly</span>
                      <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>AED {dossier.mortgage.monthly.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
