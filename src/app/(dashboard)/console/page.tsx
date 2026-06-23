"use client";
import Header from "@/components/Header";
import {
  Users, Calendar, TrendingUp, ChevronRight,
  Target, Phone, School, Smartphone, CheckCircle2, Landmark, Building2,
} from "lucide-react";

const activityTypeConfig: Record<string, {
  label: string; cls: string; icon: React.ReactNode;
}> = {
  lead:        { label: "Lead",    cls: "badge-accent",  icon: <Target size={13} />        },
  call:        { label: "Call",    cls: "badge-primary", icon: <Phone size={13} />         },
  agent:       { label: "AI",      cls: "badge-info",    icon: <Building2 size={13} />     },
  whatsapp:    { label: "WA",      cls: "badge-purple",  icon: <Smartphone size={13} />    },
  appointment: { label: "Appt",   cls: "badge-success", icon: <CheckCircle2 size={13} />  },
  mortgage:    { label: "Finance", cls: "badge-warning", icon: <Landmark size={13} />      },
  school:      { label: "School",  cls: "badge-info",    icon: <School size={13} />        },
};

const recentActivity = [
  { text: "New lead: Fatima Al-Zahra clicked Palm Jumeirah ad",               time: "3 min ago",  type: "lead"        },
  { text: "AI Agent Alpha initiated call to Mohammed Al-Rashid (+971 50...)", time: "5 min ago",  type: "call"        },
  { text: "School mapping complete for Priya Sharma — 3 schools found",       time: "18 min ago", type: "school"      },
  { text: "Brochure sent via WhatsApp to Chen Wei (DAMAC Hills 2)",           time: "45 min ago", type: "whatsapp"    },
  { text: "Appointment confirmed: James Morrison + Ahmed Khalil, 14:00",      time: "1 hr ago",   type: "appointment" },
  { text: "Mortgage report generated: AED 1.8M at 4.5% — 25yr term",         time: "2 hrs ago",  type: "mortgage"    },
  { text: "Property match sent: 3 units in Dubai Hills, Irina Volkov",        time: "3 hrs ago",  type: "agent"       },
];

const agentPerformance = [
  { name: "Agent Alpha", calls: 42, qualified: 18, appointments: 7, conv: 16.7 },
  { name: "Agent Beta",  calls: 38, qualified: 15, appointments: 5, conv: 13.2 },
  { name: "Agent Gamma", calls: 31, qualified: 11, appointments: 4, conv: 12.9 },
];

const languageBreakdown = [
  { lang: "Arabic",   count: 58, pct: 39, code: "AR" },
  { lang: "English",  count: 44, pct: 30, code: "EN" },
  { lang: "Hindi",    count: 22, pct: 15, code: "HI" },
  { lang: "Russian",  count: 13, pct:  9, code: "RU" },
  { lang: "Mandarin", count: 10, pct:  7, code: "ZH" },
];

const funnelSteps = [
  { label: "Leads",     count: 147, pct: 100, fromPrev: null, bgOpacity: 1.00 },
  { label: "Called",    count:  98, pct:  67, fromPrev: 67,   bgOpacity: 0.80 },
  { label: "Qualified", count:  44, pct:  30, fromPrev: 45,   bgOpacity: 0.60 },
  { label: "Appointed", count:  21, pct:  14, fromPrev: 48,   bgOpacity: 0.45 },
  { label: "Closed",    count:   8, pct:   5, fromPrev: 38,   bgOpacity: 0.30 },
];

export default function Dashboard() {
  return (
    <div>
      <Header title="Dashboard" subtitle="Real-time command overview" />

      {/* Status rail */}
      <div style={{
        display: "flex", alignItems: "center",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        height: 52, padding: "0 28px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 28 }}>
          <Users size={14} style={{ color: "var(--dim)" }} />
          <span className="mono" style={{ fontSize: 19, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>147</span>
          <span style={{ fontSize: 12, color: "var(--dim)" }}>Active leads</span>
        </div>
        <div className="divider-v" style={{ height: 28, marginRight: 28 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 28 }}>
          <span className="live-dot live-dot-red" />
          <span className="mono" style={{ fontSize: 19, fontWeight: 700, color: "var(--primary)", lineHeight: 1 }}>3</span>
          <span style={{ fontSize: 12, color: "var(--dim)" }}>Live calls</span>
        </div>
        <div className="divider-v" style={{ height: 28, marginRight: 28 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 28 }}>
          <Calendar size={14} style={{ color: "var(--dim)" }} />
          <span className="mono" style={{ fontSize: 19, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>8</span>
          <span style={{ fontSize: 12, color: "var(--dim)" }}>Appointments today</span>
        </div>
        <div className="divider-v" style={{ height: 28, marginRight: 28 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <TrendingUp size={14} style={{ color: "var(--dim)" }} />
          <span style={{ fontSize: 12, color: "var(--dim)" }}>Pipeline</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="mono" style={{ fontSize: 19, fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>AED 89M</span>
            <span style={{
              fontSize: 11, color: "var(--success)",
              background: "var(--success-dim)", border: "1px solid var(--success-border)",
              padding: "2px 7px", borderRadius: 4, fontWeight: 600, lineHeight: 1,
            }}>+12M wk</span>
          </div>
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
              <span style={{ fontSize: 11, color: "var(--dim)" }}>This week</span>
            </div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 4 }}>
              {funnelSteps.map((step, i) => (
                <div key={step.label} style={{ display: "flex", alignItems: "center", flex: i === 0 ? 1.5 : 1 }}>
                  <div style={{
                    flex: 1, padding: "14px 14px 12px",
                    background: `color-mix(in oklch, var(--surface-2) ${Math.round(step.bgOpacity * 100)}%, var(--bg))`,
                    borderRadius: 8, border: "1px solid var(--border)",
                    position: "relative", overflow: "hidden",
                  }}>
                    {i === funnelSteps.length - 1 && (
                      <div style={{ position: "absolute", inset: 0, background: "var(--success-dim)", borderRadius: 8 }} />
                    )}
                    <div style={{ position: "relative" }}>
                      <div className="mono" style={{
                        fontSize: 24, fontWeight: 700, lineHeight: 1, marginBottom: 5,
                        color: i === funnelSteps.length - 1 ? "var(--success)" : i === 0 ? "var(--accent)" : "var(--ink)",
                      }}>{step.count}</div>
                      <div style={{ fontSize: 11, color: "var(--dim)", marginBottom: step.fromPrev !== null ? 3 : 0 }}>{step.label}</div>
                      {step.fromPrev !== null && (
                        <div style={{ fontSize: 10, color: step.fromPrev >= 40 ? "var(--success)" : "var(--warning)", fontWeight: 500 }}>
                          {step.fromPrev}% kept
                        </div>
                      )}
                    </div>
                  </div>
                  {i < funnelSteps.length - 1 && (
                    <ChevronRight size={13} style={{ color: "var(--border-strong)", flexShrink: 0, margin: "0 2px" }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, height: 2, background: "var(--border)", borderRadius: 1, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "5%", background: "var(--success)", borderRadius: 1 }} />
            </div>
            <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: "var(--dim)" }}>5% closed this week</span>
              <span style={{ fontSize: 10, color: "var(--dim)" }}>Target: 10%</span>
            </div>
          </div>

          {/* Activity feed */}
          <div className="panel-lg" style={{ overflow: "hidden" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "15px 16px 12px", borderBottom: "1px solid var(--border)",
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Live activity</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="live-dot live-dot-green" />
                <span style={{ fontSize: 11, color: "var(--success)", fontWeight: 500 }}>Real-time</span>
              </div>
            </div>
            {recentActivity.map((item, i) => {
              const tc = activityTypeConfig[item.type] || activityTypeConfig.lead;
              return (
                <div key={i} className="activity-row">
                  <span style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: "var(--surface-2)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--muted)", flexShrink: 0,
                  }}>{tc.icon}</span>
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

          {/* Agent performance */}
          <div className="panel-lg" style={{ overflow: "hidden" }}>
            <div style={{ padding: "15px 16px 12px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Agent performance</span>
            </div>
            {agentPerformance.map((a, i) => (
              <div key={a.name} style={{ padding: "14px 16px", borderBottom: i < agentPerformance.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span className="live-dot live-dot-green" style={{ animationDelay: `${i * 0.4}s` }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{a.name}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>{a.conv}%</span>
                </div>
                <div style={{ display: "flex", gap: 18, marginBottom: 10 }}>
                  {[{ l: "Calls", v: a.calls }, { l: "Qualified", v: a.qualified }, { l: "Booked", v: a.appointments }].map(({ l, v }) => (
                    <div key={l}>
                      <div className="mono" style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>{v}</div>
                      <div style={{ fontSize: 10, color: "var(--dim)", marginTop: 3 }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ height: 2, background: "var(--border)", borderRadius: 1 }}>
                  <div style={{ height: "100%", width: `${a.conv * 4}%`, background: "var(--primary)", borderRadius: 1 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Language breakdown */}
          <div className="panel-lg" style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>Language breakdown</div>
            {languageBreakdown.map((l) => (
              <div key={l.lang} style={{ marginBottom: 11 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: "var(--muted)",
                      fontFamily: "var(--font-mono)",
                      background: "var(--surface-2)", border: "1px solid var(--border)",
                      padding: "1px 5px", borderRadius: 3, letterSpacing: "0.04em",
                    }}>{l.code}</span>
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

          {/* Quick actions */}
          <div className="panel-lg" style={{ padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>Quick actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Launch AI call campaign", cls: "btn-outline-primary" },
                { label: "Upload brochure to OneDrive", cls: "btn-ghost" },
                { label: "Schedule follow-up batch", cls: "btn-ghost" },
              ].map(({ label, cls }) => (
                <button key={label} className={`btn btn-sm ${cls}`} style={{ justifyContent: "flex-start" }}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
