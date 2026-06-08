"use client";
import { ChevronRight, Users, Phone, Calendar, TrendingUp, Search, Bell, LayoutDashboard, Building2, FolderOpen, Settings, LogOut } from "lucide-react";

// ─── Light theme tokens ───────────────────────────────────────────────────────
//
//  bg:       pure white
//  surface:  oklch(0.97 0.000 0)  — barely-off-white panel
//  border:   oklch(0.90 0.003 55) — warm light grey
//  ink:      oklch(0.16 0.006 55) — near-black with warmth
//  muted:    oklch(0.45 0.008 55) — secondary text
//  dim:      oklch(0.64 0.006 55) — placeholder / tertiary
//  primary:  oklch(0.52 0.195 13) — crimson, slightly deeper for light mode
//  accent:   oklch(0.60 0.110 52) — amber, deeper for light mode contrast
//  success:  oklch(0.45 0.140 148)
//  warning:  oklch(0.52 0.120 75)

const T = {
  bg:              "oklch(1.000 0.000 0)",
  surface:         "oklch(0.972 0.002 55)",
  surface2:        "oklch(0.945 0.003 55)",
  border:          "oklch(0.888 0.005 55)",
  borderStrong:    "oklch(0.800 0.007 55)",
  ink:             "oklch(0.155 0.008 55)",
  muted:           "oklch(0.44 0.009 55)",
  dim:             "oklch(0.63 0.007 55)",
  primary:         "oklch(0.50 0.200 13)",
  primaryDim:      "oklch(0.50 0.200 13 / 0.10)",
  primaryBorder:   "oklch(0.50 0.200 13 / 0.28)",
  accent:          "oklch(0.52 0.130 52)",
  accentDim:       "oklch(0.52 0.130 52 / 0.10)",
  success:         "oklch(0.42 0.145 148)",
  successDim:      "oklch(0.42 0.145 148 / 0.10)",
  successBorder:   "oklch(0.42 0.145 148 / 0.28)",
  warning:         "oklch(0.50 0.120 75)",
  warningDim:      "oklch(0.50 0.120 75 / 0.10)",
  info:            "oklch(0.44 0.125 245)",
  infoDim:         "oklch(0.44 0.125 245 / 0.10)",
  purple:          "oklch(0.44 0.150 295)",
  purpleDim:       "oklch(0.44 0.150 295 / 0.10)",
};

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, active: true },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/agent-console", label: "Agent Console", icon: Phone },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/developers", label: "Developers", icon: FolderOpen },
];

const recentActivity = [
  { text: "New lead: Fatima Al-Zahra clicked Palm Jumeirah ad", time: "3 min ago", icon: "🎯", type: "lead" },
  { text: "AI Agent Alpha initiated call to Mohammed Al-Rashid (+971 50...)", time: "5 min ago", icon: "📞", type: "call" },
  { text: "School mapping complete for Priya Sharma — 3 schools found nearby", time: "18 min ago", icon: "🏫", type: "agent" },
  { text: "Brochure sent via WhatsApp to Chen Wei (DAMAC Hills 2)", time: "45 min ago", icon: "📲", type: "whatsapp" },
  { text: "Appointment confirmed: James Morrison + Ahmed Khalil, 14:00 today", time: "1 hr ago", icon: "✅", type: "appointment" },
  { text: "Mortgage report generated: AED 1.8M at 4.5% — 25yr term", time: "2 hrs ago", icon: "🏦", type: "mortgage" },
];

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  lead:        { label: "Lead",    color: T.accent,  bg: T.accentDim },
  call:        { label: "Call",    color: T.primary, bg: T.primaryDim },
  agent:       { label: "AI",      color: T.info,    bg: T.infoDim },
  whatsapp:    { label: "WA",      color: T.purple,  bg: T.purpleDim },
  appointment: { label: "Appt",   color: T.success, bg: T.successDim },
  mortgage:    { label: "Finance", color: T.warning, bg: T.warningDim },
};

const agentPerformance = [
  { name: "Agent Alpha", calls: 42, qualified: 18, appointments: 7, conv: 16.7 },
  { name: "Agent Beta",  calls: 38, qualified: 15, appointments: 5, conv: 13.2 },
  { name: "Agent Gamma", calls: 31, qualified: 11, appointments: 4, conv: 12.9 },
];

const languageBreakdown = [
  { lang: "Arabic",   count: 58, pct: 39, flag: "🇦🇪" },
  { lang: "English",  count: 44, pct: 30, flag: "🇬🇧" },
  { lang: "Hindi",    count: 22, pct: 15, flag: "🇮🇳" },
  { lang: "Russian",  count: 13, pct:  9, flag: "🇷🇺" },
  { lang: "Mandarin", count: 10, pct:  7, flag: "🇨🇳" },
];

const funnelSteps = [
  { label: "Leads",     count: 147, pct: 100, fromPrev: null },
  { label: "Called",    count:  98, pct:  67, fromPrev: 67 },
  { label: "Qualified", count:  44, pct:  30, fromPrev: 45 },
  { label: "Appointed", count:  21, pct:  14, fromPrev: 48 },
  { label: "Closed",    count:   8, pct:   5, fromPrev: 38 },
];

const panel: React.CSSProperties = {
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: 10,
};

export default function LightPreview() {
  return (
    <div style={{ display: "flex", minHeight: "100dvh", background: T.bg, fontFamily: "var(--font-sans, 'DM Sans', system-ui, sans-serif)", fontSize: 14 }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 256,
        flexShrink: 0,
        background: T.bg,
        borderRight: `1px solid ${T.border}`,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0, left: 0,
        height: "100dvh",
      }}>
        {/* App mark */}
        <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7,
              background: T.primary,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0,
            }}>R</div>
            <div>
              <div style={{ color: T.ink, fontWeight: 600, fontSize: 14, lineHeight: 1.1, letterSpacing: "-0.01em" }}>Rehan</div>
              <div style={{ color: T.dim, fontSize: 10, letterSpacing: "0.06em", marginTop: 2 }}>Real Estate AI</div>
            </div>
          </div>
          {/* System status */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 10px",
            background: T.successDim,
            border: `1px solid ${T.successBorder}`,
            borderRadius: 7,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.success, display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: T.success, fontWeight: 500 }}>3 agents live</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
              {["α","β","γ"].map((l) => (
                <span key={l} style={{ width: 6, height: 6, borderRadius: "50%", background: T.success, display: "inline-block", opacity: 0.7 }} />
              ))}
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.dim, letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 12px", marginBottom: 8 }}>
            Navigation
          </div>
          {navItems.map(({ href, label, icon: Icon, active }) => (
            <div key={href} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 12px", borderRadius: 8, marginBottom: 1,
              background: active ? T.surface2 : "transparent",
              color: active ? T.ink : T.muted,
              fontWeight: active ? 500 : 400, fontSize: 13.5,
              cursor: "pointer",
              position: "relative",
            }}>
              {active && (
                <div style={{
                  position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                  width: 3, height: "58%", background: T.primary, borderRadius: "0 2px 2px 0",
                }} />
              )}
              <Icon size={15} strokeWidth={active ? 2 : 1.5} style={{ flexShrink: 0 }} />
              <span>{label}</span>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "8px 8px 12px", borderTop: `1px solid ${T.border}` }}>
          {[{ label: "Settings", Icon: Settings }, { label: "Sign out", Icon: LogOut }].map(({ label, Icon }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, color: T.dim, cursor: "pointer" }}>
              <Icon size={15} strokeWidth={1.5} />
              <span style={{ fontSize: 13.5 }}>{label}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginTop: 6, borderTop: `1px solid ${T.border}` }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>R</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.ink, lineHeight: 1.1 }}>Rehan</div>
              <div style={{ fontSize: 10, color: T.dim }}>Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ marginLeft: 256, flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <header style={{
          position: "sticky", top: 0, zIndex: 30,
          background: T.bg,
          borderBottom: `1px solid ${T.border}`,
          height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 28px",
        }}>
          <div>
            <h1 style={{ fontSize: 15, fontWeight: 600, color: T.ink, lineHeight: 1, letterSpacing: "-0.01em" }}>Dashboard</h1>
            <p style={{ fontSize: 11, color: T.dim, marginTop: 3 }}>Real-time command overview</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={12} style={{ position: "absolute", left: 11, color: T.dim, pointerEvents: "none" }} />
              <input placeholder="Search leads, properties..." style={{
                background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
                padding: "7px 12px 7px 30px", fontSize: 13, color: T.ink, outline: "none", width: 200,
              }} />
            </div>
            <button style={{
              width: 34, height: 34, borderRadius: 8,
              background: T.surface, border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", position: "relative", color: T.muted,
            }}>
              <Bell size={14} strokeWidth={1.5} />
              <span style={{ position: "absolute", top: 8, right: 8, width: 5, height: 5, borderRadius: "50%", background: T.primary }} />
            </button>
            <div style={{ width: 1, height: 24, background: T.border }} />
            <div style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
              <div style={{ width: 30, height: 30, borderRadius: 7, background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white" }}>R</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.ink, lineHeight: 1.1 }}>Rehan</div>
                <div style={{ fontSize: 10, color: T.dim }}>Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Status rail */}
        <div style={{
          display: "flex", alignItems: "center",
          borderBottom: `1px solid ${T.border}`,
          background: T.bg, height: 52, padding: "0 28px",
        }}>
          {[
            { icon: <Users size={14} style={{ color: T.dim }} />, value: "147", valueColor: T.ink, label: "Active leads", extra: null },
            { icon: <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.primary, display: "inline-block" }} />, value: "3", valueColor: T.primary, label: "Live calls", extra: null },
            { icon: <Calendar size={14} style={{ color: T.dim }} />, value: "8", valueColor: T.ink, label: "Appointments today", extra: null },
            { icon: <TrendingUp size={14} style={{ color: T.dim }} />, value: "AED 89M", valueColor: T.accent, label: "Pipeline", extra: "+12M this week" },
          ].map(({ icon, value, valueColor, label, extra }, i, arr) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 28, paddingLeft: i > 0 ? 28 : 0 }}>
                {icon}
                <span style={{ fontSize: 19, fontWeight: 700, color: valueColor, lineHeight: 1, fontFamily: "var(--font-mono, 'DM Mono', monospace)" }}>{value}</span>
                <span style={{ fontSize: 12, color: T.dim }}>{label}</span>
                {extra && (
                  <span style={{ fontSize: 11, color: T.success, background: T.successDim, padding: "2px 7px", borderRadius: 4, fontWeight: 500 }}>{extra}</span>
                )}
              </div>
              {i < arr.length - 1 && <div style={{ width: 1, height: 28, background: T.border }} />}
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ padding: "24px 28px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Funnel */}
            <div style={{ ...panel, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Conversion pipeline</span>
                <span style={{ fontSize: 11, color: T.dim }}>This week</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                {funnelSteps.map((step, i) => (
                  <div key={step.label} style={{ display: "flex", alignItems: "center", flex: i === 0 ? 1.4 : 1 }}>
                    <div style={{ flex: 1, padding: "14px 16px", background: T.surface2, borderRadius: 8 }}>
                      <div style={{
                        fontSize: 26, fontWeight: 700, lineHeight: 1, marginBottom: 6,
                        fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                        color: i === funnelSteps.length - 1 ? T.success : i === 0 ? T.accent : T.ink,
                      }}>{step.count}</div>
                      <div style={{ fontSize: 11, color: T.dim, marginBottom: 4 }}>{step.label}</div>
                      {step.fromPrev !== null && (
                        <div style={{ fontSize: 10, color: step.fromPrev >= 40 ? T.success : T.warning }}>{step.fromPrev}% from prev</div>
                      )}
                    </div>
                    {i < funnelSteps.length - 1 && (
                      <ChevronRight size={14} style={{ color: T.borderStrong, flexShrink: 0, margin: "0 4px" }} />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, height: 2, background: T.border, borderRadius: 1 }}>
                <div style={{ height: "100%", width: "5%", background: T.success, borderRadius: 1 }} />
              </div>
              <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: T.dim }}>5% closed this week</span>
                <span style={{ fontSize: 10, color: T.dim }}>Target: 10%</span>
              </div>
            </div>

            {/* Activity feed */}
            <div style={{ ...panel, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 12px", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Live activity</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.success, display: "inline-block" }} />
                  <span style={{ fontSize: 11, color: T.success }}>Real-time</span>
                </div>
              </div>
              {recentActivity.map((item, i) => {
                const tc = typeConfig[item.type] || typeConfig.lead;
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 14,
                    padding: "13px 16px",
                    borderBottom: i < recentActivity.length - 1 ? `1px solid ${T.border}` : "none",
                  }}>
                    <span style={{ fontSize: 17, lineHeight: 1, marginTop: 1, flexShrink: 0 }}>{item.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: T.ink, lineHeight: 1.4 }}>{item.text}</div>
                      <div style={{ fontSize: 11, color: T.dim, marginTop: 3 }}>{item.time}</div>
                    </div>
                    <span style={{
                      flexShrink: 0, padding: "3px 8px", borderRadius: 5,
                      fontSize: 11, fontWeight: 600, letterSpacing: "0.02em",
                      color: tc.color, background: tc.bg,
                    }}>{tc.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Agent performance */}
            <div style={{ ...panel, overflow: "hidden" }}>
              <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Agent performance</span>
              </div>
              {agentPerformance.map((a, i) => (
                <div key={a.name} style={{ padding: "14px 16px", borderBottom: i < agentPerformance.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.success, display: "inline-block" }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{a.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mono, monospace)", color: T.primary }}>{a.conv}%</span>
                  </div>
                  <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
                    {[{ l: "Calls", v: a.calls }, { l: "Qualified", v: a.qualified }, { l: "Booked", v: a.appointments }].map(({ l, v }) => (
                      <div key={l}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, lineHeight: 1, fontFamily: "var(--font-mono, monospace)" }}>{v}</div>
                        <div style={{ fontSize: 10, color: T.dim, marginTop: 2 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 2, background: T.border, borderRadius: 1 }}>
                    <div style={{ height: "100%", width: `${a.conv * 4}%`, background: T.primary, borderRadius: 1 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Language breakdown */}
            <div style={{ ...panel, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 14 }}>Language breakdown</div>
              {languageBreakdown.map((l) => (
                <div key={l.lang} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ fontSize: 14 }}>{l.flag}</span>
                      <span style={{ fontSize: 12, color: T.ink }}>{l.lang}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: T.muted, fontFamily: "var(--font-mono, monospace)" }}>{l.count}</span>
                      <span style={{ fontSize: 11, color: T.dim, width: 26, textAlign: "right", fontFamily: "var(--font-mono, monospace)" }}>{l.pct}%</span>
                    </div>
                  </div>
                  <div style={{ height: 2, background: T.border, borderRadius: 1 }}>
                    <div style={{ height: "100%", width: `${l.pct}%`, background: T.primary, borderRadius: 1, opacity: 0.65 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div style={{ ...panel, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 12 }}>Quick actions</div>
              {[
                { label: "Launch AI call campaign", color: T.primary, bg: T.primaryDim, border: T.primaryBorder },
                { label: "Upload brochure to OneDrive", color: T.muted, bg: T.surface2, border: T.border },
                { label: "Schedule follow-up batch", color: T.muted, bg: T.surface2, border: T.border },
              ].map(({ label, color, bg, border }) => (
                <button key={label} style={{
                  display: "flex", alignItems: "center",
                  width: "100%", marginBottom: 6,
                  padding: "7px 12px", borderRadius: 7,
                  background: bg, border: `1px solid ${border}`,
                  fontSize: 13, fontWeight: 500, color,
                  cursor: "pointer", textAlign: "left",
                  fontFamily: "var(--font-sans, system-ui)",
                }}>{label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Compare note */}
        <div style={{
          margin: "0 28px 32px",
          padding: "14px 18px",
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}>
          <span style={{ fontSize: 13, color: T.muted }}>
            This is the light theme preview — same layout, same tokens, different surface. Compare with the dark theme at
          </span>
          <a href="/" style={{ fontSize: 13, fontWeight: 500, color: T.primary, textDecoration: "none" }}>
            View dark theme →
          </a>
        </div>
      </div>
    </div>
  );
}
