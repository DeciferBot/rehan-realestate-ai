import Header from "@/components/Header";
import Link from "next/link";
import { getDashboardSummary } from "@/lib/dashboard";
import {
  Stack, Row, Text, Card, Badge, StatusDot, cx,
} from "@/ui";
import {
  Users, Calendar, TrendingUp, Layers,
  Target, Phone, MessageSquare, CheckCircle2, Bot, Inbox, ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

const activityTypeConfig: Record<string, { label: string; tone: React.ComponentProps<typeof Badge>["tone"]; icon: React.ReactNode }> = {
  lead:        { label: "Lead",    tone: "accent",  icon: <Target size={13} /> },
  agent:       { label: "AI",      tone: "info",    icon: <Bot size={13} /> },
  whatsapp:    { label: "Human",   tone: "purple",  icon: <MessageSquare size={13} /> },
  appointment: { label: "Escal.",  tone: "success", icon: <CheckCircle2 size={13} /> },
  call:        { label: "Call",    tone: "primary", icon: <Phone size={13} /> },
};

function aed(n: number): string {
  if (!n) return "AED 0";
  if (n >= 1_000_000_000) return `AED ${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `AED ${Math.round(n / 1_000_000)}M`;
  return `AED ${Math.round(n / 1000)}K`;
}

export default async function Dashboard() {
  const s = await getDashboardSummary();

  return (
    <div>
      <Header title="Dashboard" subtitle="Real-time command overview" />

      {/* Status rail */}
      <Row wrap className="status-rail" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)", height: 52, padding: "0 var(--space-10)" }}>
        <Row gap={4} style={{ paddingRight: "var(--space-10)" }}>
          <Users size={14} style={{ color: "var(--dim)" }} />
          <Text size="xl" weight="bold" mono>{s.activeLeads}</Text>
          <Text size="xs" tone="dim">Active leads</Text>
        </Row>
        <div className="divider-v" style={{ height: 28, marginRight: "var(--space-10)" }} />
        <Row gap={4} style={{ paddingRight: "var(--space-10)" }}>
          <StatusDot state={s.liveCalls > 0 ? "live" : "idle"} />
          <Text size="xl" weight="bold" tone="primary" mono>{s.liveCalls}</Text>
          <Text size="xs" tone="dim">Live calls</Text>
        </Row>
        <div className="divider-v" style={{ height: 28, marginRight: "var(--space-10)" }} />
        <Row gap={4} style={{ paddingRight: "var(--space-10)" }}>
          <Calendar size={14} style={{ color: "var(--dim)" }} />
          <Text size="xl" weight="bold" mono>{s.appointments}</Text>
          <Text size="xs" tone="dim">Appointments</Text>
        </Row>
        <div className="divider-v" style={{ height: 28, marginRight: "var(--space-10)" }} />
        <Row gap={4}>
          <TrendingUp size={14} style={{ color: "var(--dim)" }} />
          <Text size="xs" tone="dim">Pipeline</Text>
          <Text size="xl" weight="bold" tone="accent" mono>{aed(s.pipelineAed)}</Text>
        </Row>
      </Row>

      {/* Main grid */}
      <div className="dash-grid" style={{ padding: "var(--space-9) var(--space-10)", display: "grid", gridTemplateColumns: "1fr 320px", gap: "var(--space-8)" }}>

        {/* LEFT */}
        <Stack gap={8}>

          {/* Conversion pipeline */}
          <Card style={{ padding: "var(--space-8)" }}>
            <Row between style={{ marginBottom: "var(--space-7)" }}>
              <Text size="sm" weight="semibold">Conversion pipeline</Text>
              <Text size="xs" tone="dim">All time</Text>
            </Row>
            <div style={{ display: "flex", alignItems: "stretch", gap: "var(--space-1)", overflowX: "auto", paddingBottom: 2 }}>
              {s.funnel.map((step, i) => (
                <Row key={step.label} style={{ flex: i === 0 ? 1.5 : 1, minWidth: i === 0 ? 116 : 92 }}>
                  <div style={{ flex: 1, padding: "var(--space-6) var(--space-6) var(--space-5)", background: `color-mix(in oklch, var(--surface-2) ${Math.round((1 - i * 0.17) * 100)}%, var(--bg))`, borderRadius: "var(--radius-md)", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
                    {i === s.funnel.length - 1 && step.count > 0 && (
                      <div style={{ position: "absolute", inset: 0, background: "var(--success-dim)", borderRadius: "var(--radius-md)" }} />
                    )}
                    <Stack gap={2} style={{ position: "relative" }}>
                      <Text size="2xl" weight="bold" mono tone={i === s.funnel.length - 1 ? "success" : i === 0 ? "accent" : "ink"}>{step.count}</Text>
                      <Text size="xs" tone="dim">{step.label}</Text>
                      <Text size="2xs" weight="medium" tone="muted">{step.pct}%</Text>
                    </Stack>
                  </div>
                  {i < s.funnel.length - 1 && <ChevronRight size={13} style={{ color: "var(--border-strong)", flexShrink: 0, margin: "0 2px" }} />}
                </Row>
              ))}
            </div>
          </Card>

          {/* Activity feed */}
          <Card flush>
            <Row between style={{ padding: "var(--space-6) var(--space-7) var(--space-5)", borderBottom: "1px solid var(--border)" }}>
              <Text size="sm" weight="semibold">Live activity</Text>
              <Row gap={2}>
                <StatusDot state="online" />
                <Text size="xs" weight="medium" tone="success">Real-time</Text>
              </Row>
            </Row>
            {s.activity.length === 0 && (
              <Text as="div" size="sm" tone="dim" style={{ padding: "var(--space-8)" }}>No activity yet — leads and agent actions will appear here.</Text>
            )}
            {s.activity.map((item, i) => {
              const tc = activityTypeConfig[item.type] || activityTypeConfig.lead;
              return (
                <div key={i} className="activity-row">
                  <span style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", flexShrink: 0 }}>{tc.icon}</span>
                  <Stack gap={2} grow>
                    <Text size="sm">{item.text}</Text>
                    <Text size="xs" tone="dim">{item.time}</Text>
                  </Stack>
                  <Badge tone={tc.tone} style={{ flexShrink: 0 }}>{tc.label}</Badge>
                </div>
              );
            })}
          </Card>
        </Stack>

        {/* RIGHT */}
        <Stack gap={8}>

          {/* Acre at a glance */}
          <Card style={{ padding: "var(--space-7)" }}>
            <Text as="div" size="sm" weight="semibold" style={{ marginBottom: "var(--space-6)" }}>Acre at a glance</Text>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)" }}>
              {[
                { icon: <Layers size={13} />, n: s.unitsCount, l: "Units in inventory" },
                { icon: <Users size={13} />, n: s.activeLeads, l: "Active leads" },
                { icon: <Inbox size={13} />, n: s.funnel[1]?.count ?? 0, l: "Engaged" },
                { icon: <CheckCircle2 size={13} />, n: s.funnel[3]?.count ?? 0, l: "Appointed" },
              ].map((x) => (
                <Stack key={x.l} gap={3} style={{ padding: "var(--space-4) var(--space-5)", borderRadius: "var(--radius-md)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                  <Text size="xl" weight="bold" mono>{x.n}</Text>
                  <Row gap={1} style={{ color: "var(--dim)" }}>{x.icon}<Text size="2xs" tone="dim">{x.l}</Text></Row>
                </Stack>
              ))}
            </div>
          </Card>

          {/* Language breakdown */}
          <Card style={{ padding: "var(--space-7)" }}>
            <Text as="div" size="sm" weight="semibold" style={{ marginBottom: "var(--space-6)" }}>Language breakdown</Text>
            {s.languages.length === 0 && <Text size="xs" tone="dim">No leads yet.</Text>}
            {s.languages.map((l) => (
              <Stack key={l.lang} gap={3} style={{ marginBottom: "var(--space-5)" }}>
                <Row between>
                  <Row gap={3}>
                    <Text size="2xs" weight="bold" mono tone="muted" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", padding: "1px 5px", borderRadius: "var(--radius-xs)", letterSpacing: "0.04em" }}>{l.code}</Text>
                    <Text size="xs">{l.lang}</Text>
                  </Row>
                  <Row gap={3}>
                    <Text size="xs" mono tone="muted">{l.count}</Text>
                    <Text size="xs" mono tone="dim" style={{ width: 28, textAlign: "right" }}>{l.pct}%</Text>
                  </Row>
                </Row>
                <div style={{ height: 2, background: "var(--border)", borderRadius: 1 }}>
                  <div style={{ height: "100%", width: `${l.pct}%`, background: "var(--primary)", borderRadius: 1 }} />
                </div>
              </Stack>
            ))}
          </Card>

          {/* Quick actions → the real work */}
          <Card style={{ padding: "var(--space-7)" }}>
            <Text as="div" size="sm" weight="semibold" style={{ marginBottom: "var(--space-5)" }}>Jump to</Text>
            <Stack gap={2}>
              {[
                { label: "Open conversations", href: "/inbox", variant: "u-btn--outline" },
                { label: "Browse inventory", href: "/settings/inventory", variant: "u-btn--ghost" },
                { label: "Configure the agent", href: "/settings/agent", variant: "u-btn--ghost" },
              ].map(({ label, href, variant }) => (
                <Link key={href} href={href} className={cx("u-btn", "u-btn--sm", variant)} style={{ justifyContent: "flex-start" }}>{label}</Link>
              ))}
            </Stack>
          </Card>
        </Stack>
      </div>
    </div>
  );
}
