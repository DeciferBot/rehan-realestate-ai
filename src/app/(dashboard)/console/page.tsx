import Header from "@/components/Header";
import Link from "next/link";
import { getDashboardSummary } from "@/lib/dashboard";
import {
  Users, Calendar, TrendingUp, Layers,
  Target, Phone, MessageSquare, CheckCircle2, Bot, Inbox, ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

const activityTypeConfig: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  lead:        { label: "Lead",    cls: "badge-accent",  icon: <Target size={13} /> },
  agent:       { label: "AI",      cls: "badge-info",    icon: <Bot size={13} /> },
  whatsapp:    { label: "Human",   cls: "badge-purple",  icon: <MessageSquare size={13} /> },
  appointment: { label: "Escal.",  cls: "badge-success", icon: <CheckCircle2 size={13} /> },
  call:        { label: "Call",    cls: "badge-primary", icon: <Phone size={13} /> },
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
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--border)", background: "var(--bg)", height: 52, padding: "0 28px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 28 }}>
          <Users size={14} style={{ color: "var(--dim)" }} />
          <span className="mono" style={{ fontSize: 19, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>{s.activeLeads}</span>
          <span style={{ fontSize: 12, color: "var(--dim)" }}>Active leads</span>
        </div>
        <div className="divider-v" style={{ height: 28, marginRight: 28 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 28 }}>
          <span className={s.liveCalls > 0 ? "live-dot live-dot-red" : "live-dot"} />
          <span className="mono" style={{ fontSize: 19, fontWeight: 700, color: "var(--primary)", lineHeight: 1 }}>{s.liveCalls}</span>
          <span style={{ fontSize: 12, color: "var(--dim)" }}>Live calls</span>
        </div>
        <div className="divider-v" style={{ height: 28, marginRight: 28 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 28 }}>
          <Calendar size={14} style={{ color: "var(--dim)" }} />
          <span className="mono" style={{ fontSize: 19, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>{s.appointments}</span>
          <span style={{ fontSize: 12, color: "var(--dim)" }}>Appointments</span>
        </div>
        <div className="divider-v" style={{ height: 28, marginRight: 28 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <TrendingUp size={14} style={{ color: "var(--dim)" }} />
          <span style={{ fontSize: 12, color: "var(--dim)" }}>Pipeline</span>
          <span className="mono" style={{ fontSize: 19, fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>{aed(s.pipelineAed)}</span>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ padding: "24px 28px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Conversion pipeline */}
          <div className="panel-lg" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Conversion pipeline</span>
              <span style={{ fontSize: 11, color: "var(--dim)" }}>All time</span>
            </div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 4 }}>
              {s.funnel.map((step, i) => (
                <div key={step.label} style={{ display: "flex", alignItems: "center", flex: i === 0 ? 1.5 : 1 }}>
                  <div style={{ flex: 1, padding: "14px 14px 12px", background: `color-mix(in oklch, var(--surface-2) ${Math.round((1 - i * 0.17) * 100)}%, var(--bg))`, borderRadius: 8, border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
                    {i === s.funnel.length - 1 && step.count > 0 && (
                      <div style={{ position: "absolute", inset: 0, background: "var(--success-dim)", borderRadius: 8 }} />
                    )}
                    <div style={{ position: "relative" }}>
                      <div className="mono" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1, marginBottom: 5, color: i === s.funnel.length - 1 ? "var(--success)" : i === 0 ? "var(--accent)" : "var(--ink)" }}>{step.count}</div>
                      <div style={{ fontSize: 11, color: "var(--dim)", marginBottom: 3 }}>{step.label}</div>
                      <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 500 }}>{step.pct}%</div>
                    </div>
                  </div>
                  {i < s.funnel.length - 1 && <ChevronRight size={13} style={{ color: "var(--border-strong)", flexShrink: 0, margin: "0 2px" }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="panel-lg" style={{ overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 16px 12px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Live activity</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="live-dot live-dot-green" />
                <span style={{ fontSize: 11, color: "var(--success)", fontWeight: 500 }}>Real-time</span>
              </div>
            </div>
            {s.activity.length === 0 && (
              <div style={{ padding: 20, fontSize: 13, color: "var(--dim)" }}>No activity yet — leads and agent actions will appear here.</div>
            )}
            {s.activity.map((item, i) => {
              const tc = activityTypeConfig[item.type] || activityTypeConfig.lead;
              return (
                <div key={i} className="activity-row">
                  <span style={{ width: 28, height: 28, borderRadius: 7, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", flexShrink: 0 }}>{tc.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.4 }}>{item.text}</div>
                    <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 3 }}>{item.time}</div>
                  </div>
                  <span className={`badge ${tc.cls}`} style={{ flexShrink: 0 }}>{tc.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Acre at a glance */}
          <div className="panel-lg" style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>Acre at a glance</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { icon: <Layers size={13} />, n: s.unitsCount, l: "Units in inventory" },
                { icon: <Users size={13} />, n: s.activeLeads, l: "Active leads" },
                { icon: <Inbox size={13} />, n: s.funnel[1]?.count ?? 0, l: "Engaged" },
                { icon: <CheckCircle2 size={13} />, n: s.funnel[3]?.count ?? 0, l: "Appointed" },
              ].map((x) => (
                <div key={x.l} style={{ padding: "10px 12px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                  <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>{x.n}</div>
                  <div style={{ fontSize: 10, color: "var(--dim)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>{x.icon}{x.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Language breakdown */}
          <div className="panel-lg" style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>Language breakdown</div>
            {s.languages.length === 0 && <div style={{ fontSize: 12, color: "var(--dim)" }}>No leads yet.</div>}
            {s.languages.map((l) => (
              <div key={l.lang} style={{ marginBottom: 11 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "var(--muted)", fontFamily: "var(--font-mono)", background: "var(--surface-2)", border: "1px solid var(--border)", padding: "1px 5px", borderRadius: 3, letterSpacing: "0.04em" }}>{l.code}</span>
                    <span style={{ fontSize: 12, color: "var(--ink)" }}>{l.lang}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{l.count}</span>
                    <span className="mono" style={{ fontSize: 11, color: "var(--dim)", width: 28, textAlign: "right" }}>{l.pct}%</span>
                  </div>
                </div>
                <div style={{ height: 2, background: "var(--border)", borderRadius: 1 }}>
                  <div style={{ height: "100%", width: `${l.pct}%`, background: "var(--primary)", borderRadius: 1 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions → the real work */}
          <div className="panel-lg" style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>Jump to</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Open conversations", href: "/inbox", cls: "btn-outline-primary" },
                { label: "Browse inventory", href: "/settings/inventory", cls: "btn-ghost" },
                { label: "Configure the agent", href: "/settings/agent", cls: "btn-ghost" },
              ].map(({ label, href, cls }) => (
                <Link key={href} href={href} className={`btn btn-sm ${cls}`} style={{ justifyContent: "flex-start" }}>{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
