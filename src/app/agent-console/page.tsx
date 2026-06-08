"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { callTranscript, subAgentStatus, customerProfile } from "@/lib/mock-data";
import {
  Phone, PhoneOff, Mic, Volume2,
  School, Calculator, Building2, MessageSquare, Calendar, User, ChevronRight,
  Bot, MapPin, Sunrise, CreditCard, Globe,
} from "lucide-react";

const subAgentIcons: Record<string, React.ReactNode> = {
  "School Mapper":        <School size={14} />,
  "Mortgage Calculator":  <Calculator size={14} />,
  "Property Recommender": <Building2 size={14} />,
  "WhatsApp Sender":      <MessageSquare size={14} />,
  "Calendar Scheduler":   <Calendar size={14} />,
};

export default function AgentConsolePage() {
  const [timer, setTimer]       = useState(92);
  const [speaking, setSpeaking] = useState(true);

  useEffect(() => {
    const id  = setInterval(() => setTimer(t => t + 1), 1000);
    const sid = setInterval(() => setSpeaking(s => !s), 2800);
    return () => { clearInterval(id); clearInterval(sid); };
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div>
      <Header title="Agent Console" subtitle="Live AI voice call monitoring & sub-agent orchestration" />
      <div style={{ padding: "24px 28px" }}>

        {/* Live call banner */}
        <div style={{
          padding: "16px 20px", marginBottom: 20,
          background: "var(--success-dim)", border: "1px solid var(--success-border)",
          borderRadius: 12, display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "var(--success-dim)", border: "2px solid var(--success)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }} className="call-ring-green">
              <Phone size={18} style={{ color: "var(--success)" }} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{customerProfile.name}</span>
                <span className="badge badge-success">Live</span>
                <span className="badge badge-muted" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Globe size={10} />Arabic
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                {customerProfile.phone} · AI Agent Alpha
              </div>
            </div>
            <div className="waveform" style={{ marginLeft: 12 }}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={speaking ? "waveform-bar" : ""}
                  style={{
                    width: 2, height: speaking ? undefined : 3,
                    background: "var(--accent)", borderRadius: 1,
                    animationDelay: `${(i * 0.1) % 0.4}s`,
                  }}
                />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "var(--success)", lineHeight: 1 }}>
                {formatTime(timer)}
              </div>
              <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 3 }}>Duration</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost"><Mic size={15} /></button>
              <button className="btn btn-ghost"><Volume2 size={15} /></button>
              <button className="btn btn-sm" style={{
                background: "var(--primary-dim)", border: "1px solid var(--primary-border)",
                color: "var(--primary)", display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: 7,
              }}>
                <PhoneOff size={14} />End call
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 304px", gap: 20 }}>

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Transcript */}
            <div className="panel-lg" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Live transcript</span>
                <span className="badge badge-muted" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Globe size={11} />Auto-translated
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 320, overflowY: "auto", paddingRight: 4 }}>
                {callTranscript.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.role === "agent" ? "flex-start" : "flex-end" }}>
                    <div style={{ maxWidth: "78%" }}>
                      <div style={{
                        fontSize: 10, color: "var(--dim)", marginBottom: 4,
                        display: "flex", gap: 6, alignItems: "center",
                        flexDirection: msg.role === "agent" ? "row" : "row-reverse",
                      }}>
                        {msg.role === "agent"
                          ? <Bot size={10} style={{ color: "var(--dim)" }} />
                          : <User size={10} style={{ color: "var(--dim)" }} />}
                        <span>{msg.role === "agent" ? "AI Agent" : "Lead"}</span>
                        <span>·</span>
                        <span>{msg.time}</span>
                      </div>
                      <div style={{
                        padding: "10px 14px",
                        borderRadius: msg.role === "agent" ? "4px 12px 12px 12px" : "12px 4px 12px 12px",
                        fontSize: 13, lineHeight: 1.5, color: "var(--ink)",
                        background: msg.role === "agent" ? "var(--surface-2)" : "var(--primary-dim)",
                        border: `1px solid ${msg.role === "agent" ? "var(--border)" : "var(--primary-border)"}`,
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Typing indicator */}
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    padding: "10px 14px", borderRadius: "4px 12px 12px 12px",
                    background: "var(--surface-2)", border: "1px solid var(--border)",
                    display: "flex", gap: 4, alignItems: "center",
                  }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 5, height: 5, borderRadius: "50%", background: "var(--dim)",
                        animation: "live-pulse 1s step-end infinite",
                        animationDelay: `${i * 0.2}s`,
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-agents */}
            <div className="panel-lg" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>Sub-agent orchestration</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {subAgentStatus.map((agent) => {
                  const isActive = agent.status === "active";
                  return (
                    <div key={agent.name} style={{
                      padding: "12px 14px", borderRadius: 10,
                      background: isActive ? "var(--primary-dim)" : "var(--surface-2)",
                      border: `1px solid ${isActive ? "var(--primary-border)" : "var(--border)"}`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ color: isActive ? "var(--primary)" : "var(--dim)" }}>
                            {subAgentIcons[agent.name]}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 500, color: isActive ? "var(--ink)" : "var(--muted)" }}>
                            {agent.name}
                          </span>
                        </div>
                        <span className={`badge ${isActive ? "badge-primary" : "badge-muted"}`}>
                          {isActive ? "Running" : "Idle"}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--dim)", marginBottom: isActive && agent.progress > 0 ? 8 : 0 }}>
                        {agent.task}
                      </div>
                      {isActive && agent.progress > 0 && (
                        <div style={{ height: 2, background: "var(--border)", borderRadius: 1 }}>
                          <div style={{ height: "100%", width: `${agent.progress}%`, background: "var(--primary)", borderRadius: 1, transition: "width 0.5s ease" }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Profile */}
            <div className="panel-lg" style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <User size={13} style={{ color: "var(--dim)" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Customer profile</span>
                <span className="badge badge-warning" style={{ marginLeft: "auto" }}>Building</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  { label: "Name",     value: customerProfile.name },
                  { label: "Language", value: customerProfile.language },
                  { label: "Budget",   value: customerProfile.budget, accent: true },
                  { label: "Purpose",  value: customerProfile.investType },
                  { label: "Status",   value: customerProfile.marital },
                  { label: "Children", value: `${customerProfile.kids} (${customerProfile.kidsAges.join(", ")})` },
                  { label: "Area",     value: customerProfile.preferredArea },
                ].map(({ label, value, accent }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--dim)" }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: accent ? "var(--accent)" : "var(--ink)", textAlign: "right" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Schools */}
            <div className="panel-lg" style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <School size={13} style={{ color: "var(--dim)" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Nearby schools</span>
                <span className="live-dot live-dot-green" style={{ marginLeft: "auto" }} />
              </div>
              {[
                { name: "GEMS World Academy",          distance: "1.2 km", morning: "8 min",  fees: "AED 65K/yr", rating: "Outstanding" },
                { name: "Jumeirah English School",     distance: "2.8 km", morning: "14 min", fees: "AED 52K/yr", rating: "Very Good"   },
                { name: "Dubai International Academy", distance: "3.5 km", morning: "18 min", fees: "AED 78K/yr", rating: "Outstanding" },
              ].map((school, i) => (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 8, marginBottom: 6, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{school.name}</span>
                    <span className="badge badge-success">{school.rating}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, fontSize: 10, color: "var(--dim)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MapPin size={9} />{school.distance}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Sunrise size={9} />{school.morning}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}><CreditCard size={9} />{school.fees}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mortgage */}
            <div className="panel-lg" style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Calculator size={13} style={{ color: "var(--dim)" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Mortgage snapshot</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Property value",    value: "AED 2.8M" },
                  { label: "Down payment (20%)", value: "AED 560K" },
                  { label: "Loan amount",        value: "AED 2.24M" },
                  { label: "Rate (est.)",        value: "4.49% p.a." },
                  { label: "Term",               value: "25 years" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "var(--dim)" }}>{label}</span>
                    <span style={{ fontSize: 12, color: "var(--ink)" }}>{value}</span>
                  </div>
                ))}
                <div style={{ paddingTop: 8, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>Monthly payment</span>
                  <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>AED 12,340</span>
                </div>
              </div>
            </div>

            {/* Escalate */}
            <button className="btn btn-primary" style={{ justifyContent: "center" }}>
              <User size={14} />Escalate to human agent<ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
