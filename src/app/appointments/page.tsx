"use client";
import { useState } from "react";
import Header from "@/components/Header";
import { appointments } from "@/lib/mock-data";
import {
  Video, Phone, MapPin, Plus, ChevronLeft, ChevronRight,
  List, CalendarDays, Bell, FileText, Mail, MessageSquare,
} from "lucide-react";

const typeConfig: Record<string, { icon: React.ReactNode; label: string; cls: string }> = {
  "video":      { icon: <Video size={12} />,  label: "Video call", cls: "badge-info"    },
  "site-visit": { icon: <MapPin size={12} />, label: "Site visit", cls: "badge-success" },
  "phone":      { icon: <Phone size={12} />,  label: "Phone call", cls: "badge-accent"  },
};

const statusCls: Record<string, string> = {
  confirmed: "badge-success",
  scheduled: "badge-warning",
  pending:   "badge-primary",
};

const followUpChannelConfig: Record<string, { icon: React.ReactNode; cls: string }> = {
  Email:    { icon: <Mail size={10} />,          cls: "badge-info"    },
  WhatsApp: { icon: <MessageSquare size={10} />, cls: "badge-success" },
  Call:     { icon: <Phone size={10} />,         cls: "badge-primary" },
};

const days  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export default function AppointmentsPage() {
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <div>
      <Header title="Appointments" subtitle="Scheduled calls, site visits & human agent meetings" />
      <div style={{ padding: "24px 28px" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {(["list", "calendar"] as const).map(v => (
              <button key={v} onClick={() => setView(v)} className={`filter-pill${view === v ? " active" : ""}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                {v === "list" ? <><List size={12} />List view</> : <><CalendarDays size={12} />Calendar view</>}
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm">
            <Plus size={13} />Book appointment
          </button>
        </div>

        {view === "list" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

            {/* Today */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>Today — June 7, 2026</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {appointments.filter(a => a.date === "2026-06-07").map((apt) => {
                  const tc = typeConfig[apt.type];
                  return (
                    <div key={apt.id} className="panel-lg" style={{ padding: 16 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                            <span className={`badge ${tc.cls}`} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                              {tc.icon}{tc.label}
                            </span>
                            <span className={`badge ${statusCls[apt.status] || "badge-muted"}`}>{apt.status}</span>
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{apt.lead}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{apt.property}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>{apt.time}</div>
                          <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 3 }}>with {apt.agent}</div>
                        </div>
                      </div>

                      {apt.notes && (
                        <div style={{
                          fontSize: 12, color: "var(--muted)",
                          padding: "8px 12px", marginBottom: 12,
                          background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 7,
                          display: "flex", alignItems: "flex-start", gap: 7,
                        }}>
                          <FileText size={11} style={{ color: "var(--dim)", marginTop: 1, flexShrink: 0 }} />
                          {apt.notes}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 6 }}>
                        <button className={`btn btn-sm ${tc.cls === "badge-info" ? "btn-outline-primary" : tc.cls === "badge-success" ? "btn-outline-success" : "btn-outline-accent"}`}
                          style={{ flex: 1, justifyContent: "center" }}>
                          {tc.icon}Join {tc.label}
                        </button>
                        <button className="btn btn-ghost btn-sm">Reschedule</button>
                        <button className="btn btn-ghost btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <Bell size={12} />Remind
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming + follow-ups */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>Upcoming</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {appointments.filter(a => a.date !== "2026-06-07").map((apt) => {
                  const tc = typeConfig[apt.type];
                  const dateLabel = apt.date === "2026-06-08" ? "Tomorrow"
                    : new Date(apt.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                  return (
                    <div key={apt.id} className="panel" style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: "var(--dim)" }}>{dateLabel}</span>
                          <span className={`badge ${tc.cls}`} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            {tc.icon}{tc.label}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{apt.lead}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{apt.property}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div className="mono" style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{apt.time}</div>
                        <span className={`badge ${statusCls[apt.status] || "badge-muted"}`} style={{ marginTop: 4 }}>{apt.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="panel-lg" style={{ padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>Auto follow-up sequences</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { lead: "James Morrison", next: "Follow-up email in 24hrs",          via: "Email"    },
                    { lead: "Priya Sharma",   next: "WhatsApp check-in in 2 days",        via: "WhatsApp" },
                    { lead: "Chen Wei",       next: "Property brochure resend in 3 days", via: "WhatsApp" },
                    { lead: "Nikolai Petrov", next: "AI call follow-up in 48hrs",         via: "Call"     },
                  ].map((f) => {
                    const ch = followUpChannelConfig[f.via] || followUpChannelConfig.Call;
                    return (
                      <div key={f.lead} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 12px", background: "var(--surface-2)",
                        border: "1px solid var(--border)", borderRadius: 8,
                      }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{f.lead}</div>
                          <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 2 }}>{f.next}</div>
                        </div>
                        <span className={`badge ${ch.cls}`} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          {ch.icon}{f.via}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        ) : (
          <div className="panel-lg" style={{ overflow: "hidden" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 20px", borderBottom: "1px solid var(--border)",
            }}>
              <button className="btn btn-ghost btn-sm"><ChevronLeft size={16} /></button>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>June 2026</span>
              <button className="btn btn-ghost btn-sm"><ChevronRight size={16} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "64px repeat(7, 1fr)" }}>
              <div style={{ padding: "10px 8px", fontSize: 11, color: "var(--dim)", borderBottom: "1px solid var(--border)" }} />
              {days.map(d => (
                <div key={d} style={{
                  padding: "10px 8px", textAlign: "center",
                  fontSize: 11, fontWeight: 600, color: "var(--muted)",
                  borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)",
                }}>{d}</div>
              ))}
              {hours.map(hour => (
                <>
                  <div key={`h-${hour}`} style={{
                    padding: "10px 8px", fontSize: 11, color: "var(--dim)",
                    borderBottom: "1px solid var(--border)", textAlign: "right",
                  }}>{hour}</div>
                  {days.map((_, dayIdx) => {
                    const apt = appointments.find(a =>
                      a.time === hour && (
                        dayIdx === 0 ? a.date === "2026-06-07" :
                        dayIdx === 1 ? a.date === "2026-06-08" :
                        dayIdx === 2 ? a.date === "2026-06-09" :
                        dayIdx === 3 ? a.date === "2026-06-10" : false
                      )
                    );
                    const tc = apt ? typeConfig[apt.type] : null;
                    return (
                      <div key={`${hour}-${dayIdx}`} style={{
                        minHeight: 52, borderBottom: "1px solid var(--border)",
                        borderLeft: "1px solid var(--border)", padding: 4,
                        background: dayIdx === 0 ? "var(--primary-dim)" : undefined,
                      }}>
                        {apt && tc && (
                          <div style={{
                            padding: "5px 7px", borderRadius: 6, fontSize: 10, lineHeight: 1.3,
                            background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--ink)",
                          }}>
                            <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{apt.lead}</div>
                            <span className={`badge ${tc.cls}`} style={{ marginTop: 3, display: "inline-flex", alignItems: "center", gap: 3 }}>
                              {tc.icon}{tc.label}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
