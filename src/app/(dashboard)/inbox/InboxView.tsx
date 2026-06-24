import Header from "@/components/Header";
import type { ConversationListItem, ConversationThread } from "@/lib/spine";
import type { Dossier } from "@/lib/subagents";
import Composer from "./Composer";
import AgentRespondButton from "./AgentRespondButton";
import QualifyButton from "./QualifyButton";
import Link from "next/link";
import { Phone, MessageSquare, Mail, Bot, User, UserCog, Inbox as InboxIcon, Globe, Building2, Calculator, Gauge, ChevronLeft } from "lucide-react";
import { Card, CardHeader, Row, Stack, Text, Badge, StatusDot } from "@/ui";

function aed(n: number): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 2)}M`;
  return `AED ${Math.round(n / 1000)}K`;
}

type BadgeTone = "neutral" | "primary" | "accent" | "success" | "warning" | "info" | "purple";
const fitTone: Record<string, BadgeTone> = { "at-budget": "success", stretch: "warning", below: "info" };

const statusTone: Record<string, BadgeTone> = {
  calling: "primary",
  new: "accent",
  called: "info",
  qualified: "purple",
  appointed: "warning",
  closed: "success",
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

/** Presentational inbox. Data-source agnostic so it renders from the live spine
 *  or a fixture (preview / tests) without divergence. */
export default function InboxView({
  conversations, thread, dossier, selectedId, c,
}: {
  conversations: ConversationListItem[];
  thread: ConversationThread | null;
  dossier: Dossier | null;
  selectedId: string | null;
  c?: string;
}) {
  return (
    <div>
      <Header
        title="Conversations"
        subtitle="Every lead, every channel, one thread — voice · WhatsApp · email"
      />
      <div style={{ padding: "20px 28px" }}>
        <div className={`inbox-grid${c ? " has-thread" : ""}`} style={{ display: "grid", gridTemplateColumns: thread ? "300px 1fr 300px" : "340px 1fr", gap: 16, height: "calc(100dvh - 150px)" }}>

          {/* Conversation list */}
          <Card flush className="inbox-list" style={{ display: "flex", flexDirection: "column" }}>
            <CardHeader>
              <InboxIcon size={13} className="u-tone-dim" />
              <Text size="base" weight="semibold">Inbox</Text>
              <Badge style={{ marginLeft: "auto" }}>{conversations.length}</Badge>
            </CardHeader>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {conversations.map((cv) => {
                const active = cv.id === selectedId;
                return (
                  <Link
                    key={cv.id}
                    href={`/inbox?c=${cv.id}`}
                    style={{
                      display: "block", padding: "var(--space-5) var(--space-7)",
                      borderBottom: "1px solid var(--border)",
                      borderLeft: `2px solid ${active ? "var(--primary)" : "transparent"}`,
                      background: active ? "var(--surface-2)" : "transparent",
                      textDecoration: "none",
                    }}
                  >
                    <Row gap={2} align="center" style={{ marginBottom: "var(--space-1)" }}>
                      <Text size="md">{cv.contact.flag}</Text>
                      <Text size="base" weight="semibold" truncate grow>{cv.contact.fullName}</Text>
                      {cv.contact.status === "calling" && <StatusDot state="live" />}
                      <Badge tone={statusTone[cv.contact.status] ?? "neutral"}>{cv.contact.status}</Badge>
                    </Row>
                    <Text size="sm" tone="muted" truncate as="div" style={{ marginBottom: "var(--space-2)" }}>
                      {cv.snippetRole && cv.snippetRole !== "contact" ? "↩ " : ""}{cv.snippet}
                    </Text>
                    <Row gap={3} align="center">
                      <Row gap={1} align="center" style={{ display: "inline-flex" }}>
                        {channelIcon[cv.lastChannel ?? ""] ?? <Globe size={11} />}
                        <Text size="2xs" tone="dim">{cv.lastChannel ?? "—"}</Text>
                      </Row>
                      <Text size="2xs" tone="dim">·</Text>
                      <Text size="2xs" tone="dim">{cv.messageCount} msgs</Text>
                      {cv.contact.budget && <Text size="2xs" weight="semibold" tone="accent" mono style={{ marginLeft: "auto" }}>{cv.contact.budget}</Text>}
                    </Row>
                  </Link>
                );
              })}
              {conversations.length === 0 && (
                <Text size="base" tone="dim" as="div" style={{ padding: "var(--space-9)", textAlign: "center" }}>No conversations yet.</Text>
              )}
            </div>
          </Card>

          {/* Thread */}
          <Card flush className="inbox-thread" style={{ display: "flex", flexDirection: "column" }}>
            {thread ? (
              <>
                <CardHeader>
                  <Link href="/inbox" className="inbox-back" style={{ alignItems: "center", color: "var(--muted)", textDecoration: "none", marginRight: 2 }} aria-label="Back to conversations"><ChevronLeft size={18} /></Link>
                  <Text size="xl">{thread.contact.flag}</Text>
                  <Stack gap={1}>
                    <Text size="md" weight="semibold">{thread.contact.fullName}</Text>
                    <Row gap={2} align="center">
                      <Globe size={10} className="u-tone-dim" />
                      <Text size="xs" tone="dim">{thread.contact.language}</Text>
                      {thread.contact.source && <><Text size="xs" tone="dim">·</Text><Text size="xs" tone="dim">{thread.contact.source}</Text></>}
                      {thread.contact.assignedLabel && <><Text size="xs" tone="dim">·</Text><Text size="xs" tone="dim">{thread.contact.assignedLabel}</Text></>}
                    </Row>
                  </Stack>
                  <Badge tone={statusTone[thread.contact.status] ?? "neutral"} style={{ marginLeft: "auto" }}>
                    {thread.contact.status}
                  </Badge>
                  <QualifyButton conversationId={thread.id} />
                  <AgentRespondButton conversationId={thread.id} />
                </CardHeader>

                <Stack gap={5} style={{ flex: 1, overflowY: "auto", padding: "var(--space-7)" }}>
                  {thread.messages.map((m) => {
                    const fromContact = m.role === "contact";
                    const isArabic = m.lang === "Arabic";
                    return (
                      <Row key={m.id} style={{ justifyContent: fromContact ? "flex-start" : "flex-end" }}>
                        <Stack gap={1} style={{ maxWidth: "76%" }}>
                          <Row gap={2} align="center" style={{ flexDirection: fromContact ? "row" : "row-reverse" }}>
                            {roleIcon(m.role)}
                            <Text size="2xs" tone="dim">{roleLabel(m.role, thread.contact.fullName)}</Text>
                            <Text size="2xs" tone="dim">·</Text>
                            <Row gap={1} align="center" style={{ display: "inline-flex" }}>
                              {channelIcon[m.channel] ?? null}
                              <Text size="2xs" tone="dim">{m.channel}</Text>
                            </Row>
                            {m.ts && <><Text size="2xs" tone="dim">·</Text><Text size="2xs" tone="dim" mono>{m.ts}</Text></>}
                          </Row>
                          <Text
                            as="div"
                            size="base"
                            dir={isArabic ? "rtl" : "ltr"}
                            style={{
                              padding: "10px 14px",
                              borderRadius: fromContact ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
                              lineHeight: 1.5, color: "var(--ink)",
                              background: fromContact ? "var(--surface-2)" : "var(--primary-dim)",
                              border: `1px solid ${fromContact ? "var(--border)" : "var(--primary-border)"}`,
                            }}
                          >
                            {m.body}
                          </Text>
                        </Stack>
                      </Row>
                    );
                  })}
                  {thread.messages.length === 0 && (
                    <Text size="base" tone="dim" as="div" style={{ textAlign: "center", marginTop: "var(--space-9)" }}>
                      No messages yet — the agent hasn&apos;t engaged this contact.
                    </Text>
                  )}
                </Stack>

                <Composer conversationId={thread.id} channel={thread.lastChannel} />
              </>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Text size="base" tone="dim">Select a conversation</Text>
              </div>
            )}
          </Card>

          {/* Dossier — live sub-agent output */}
          {thread && dossier && (
            <Card flush className="inbox-dossier" style={{ overflowY: "auto", display: "flex", flexDirection: "column" }}>
              <CardHeader>
                <Text size="base" weight="semibold">Lead dossier</Text>
              </CardHeader>

              {thread.contact.assignedLabel?.startsWith("Human:") && (
                <Row gap={3} align="center" style={{ margin: "var(--space-7)", marginBottom: 0, padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-md)", background: "var(--primary-dim)", border: "1px solid var(--primary-border)" }}>
                  <UserCog size={13} className="u-tone-primary" />
                  <Text size="sm" weight="semibold" tone="primary">Escalated · {thread.contact.assignedLabel.replace("Human: ", "")}</Text>
                </Row>
              )}

              <Stack gap={4} style={{ padding: "var(--space-7)", borderBottom: "1px solid var(--border)" }}>
                <Row gap={2} align="center">
                  <User size={12} className="u-tone-dim" />
                  <Text size="sm" weight="semibold">Profile</Text>
                </Row>
                <Stack gap={2}>
                  {[
                    { label: "Language", value: thread.contact.language ?? "—" },
                    { label: "Status", value: thread.contact.status },
                    { label: "Budget", value: thread.contact.budget ?? "—", accent: true },
                    { label: "Intent", value: thread.contact.investType === "investment" ? "Investment" : thread.contact.investType === "live-in" ? "Live-in" : "—" },
                    { label: "Source", value: thread.contact.source ?? "—" },
                  ].map(({ label, value, accent }) => (
                    <Row key={label} between gap={3}>
                      <Text size="sm" tone="dim">{label}</Text>
                      <Text size="sm" weight="medium" tone={accent ? "accent" : "ink"} style={{ textAlign: "right" }}>{value}</Text>
                    </Row>
                  ))}
                </Stack>
              </Stack>

              {(() => {
                const q = thread.contact.qualification as Record<string, unknown>;
                const labels: [string, string][] = [["budget", "Budget"], ["intent", "Intent"], ["timeline", "Timeline"], ["financing", "Financing"], ["preferred_area", "Area"], ["family", "Family"]];
                const known = labels.filter(([k]) => {
                  const v = q[k];
                  return typeof v === "string" && v.trim() && v.toLowerCase() !== "unknown";
                });
                if (!known.length) return null;
                return (
                  <Stack gap={4} style={{ padding: "var(--space-7)", borderBottom: "1px solid var(--border)" }}>
                    <Row gap={2} align="center">
                      <Gauge size={12} className="u-tone-dim" />
                      <Text size="sm" weight="semibold">Qualification</Text>
                    </Row>
                    <Stack gap={2}>
                      {known.map(([k, label]) => (
                        <Row key={k} between gap={4}>
                          <Text size="sm" tone="dim" style={{ flexShrink: 0 }}>{label}</Text>
                          <Text size="sm" weight="medium" style={{ textAlign: "right" }}>{String(q[k])}</Text>
                        </Row>
                      ))}
                    </Stack>
                  </Stack>
                );
              })()}

              <Stack gap={4} style={{ padding: "var(--space-7)", borderBottom: "1px solid var(--border)" }}>
                <Row gap={2} align="center">
                  <Building2 size={12} className="u-tone-dim" />
                  <Text size="sm" weight="semibold">Best matches</Text>
                  <StatusDot state="online" style={{ marginLeft: "auto" }} />
                </Row>
                <Stack gap={2}>
                  {dossier.recommendations.map((r) => (
                    <Stack key={r.id} gap={1} style={{ padding: "9px 10px", borderRadius: "var(--radius-md)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                      <Row between align="center" gap={2}>
                        <Text size="sm" weight="medium" truncate>{r.project}</Text>
                        <Badge tone={fitTone[r.fit] ?? "neutral"} style={{ flexShrink: 0 }}>{r.fit === "at-budget" ? "fits" : r.fit}</Badge>
                      </Row>
                      <Row between align="center">
                        <Text size="2xs" tone="dim">{r.bedrooms}BR · {r.location}</Text>
                        <Text size="2xs" weight="semibold" tone="accent" mono>{aed(r.price)}</Text>
                      </Row>
                    </Stack>
                  ))}
                  {dossier.recommendations.length === 0 && (
                    <Text size="xs" tone="dim">No matching inventory.</Text>
                  )}
                </Stack>
              </Stack>

              {dossier.mortgage && (
                <Stack gap={4} style={{ padding: "var(--space-7)" }}>
                  <Row gap={2} align="center">
                    <Calculator size={12} className="u-tone-dim" />
                    <Text size="sm" weight="semibold">Mortgage</Text>
                    <Text size="2xs" tone="dim" style={{ marginLeft: "auto" }}>on top match</Text>
                  </Row>
                  <Stack gap={2}>
                    {[
                      { label: "Property value", value: aed(dossier.mortgage.value) },
                      { label: "Down payment (20%)", value: aed(dossier.mortgage.downPayment) },
                      { label: "Loan amount", value: aed(dossier.mortgage.loanAmount) },
                      { label: "Rate (est.)", value: `${dossier.mortgage.ratePct}% p.a.` },
                      { label: "Term", value: `${dossier.mortgage.years} years` },
                    ].map(({ label, value }) => (
                      <Row key={label} between>
                        <Text size="sm" tone="dim">{label}</Text>
                        <Text size="sm">{value}</Text>
                      </Row>
                    ))}
                    <Row between style={{ paddingTop: "var(--space-3)", marginTop: 2, borderTop: "1px solid var(--border)" }}>
                      <Text size="base" weight="medium">Monthly</Text>
                      <Text size="md" weight="bold" tone="accent" mono>AED {dossier.mortgage.monthly.toLocaleString()}</Text>
                    </Row>
                  </Stack>
                </Stack>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
