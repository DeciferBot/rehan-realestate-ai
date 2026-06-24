"use client";
import { useState, Fragment } from "react";
import Header from "@/components/Header";
import type { Appointment } from "@/lib/data";
import { Row, Stack, Text, Card, Badge, Button, Chip, EmptyState } from "@/ui";
import {
  Video, Phone, MapPin, Plus, ChevronLeft, ChevronRight,
  List, CalendarDays, Bell, FileText, Mail, MessageSquare, CalendarClock,
} from "lucide-react";

type BadgeTone = "neutral" | "primary" | "accent" | "success" | "warning" | "info" | "purple";

const typeConfig: Record<string, { icon: React.ReactNode; label: string; tone: BadgeTone; outline: string }> = {
  "video":      { icon: <Video size={12} />,  label: "Video call", tone: "info",    outline: "btn-outline-primary" },
  "site-visit": { icon: <MapPin size={12} />, label: "Site visit", tone: "success", outline: "btn-outline-success" },
  "phone":      { icon: <Phone size={12} />,  label: "Phone call", tone: "accent",  outline: "btn-outline-accent"  },
};

// Fallback so an unexpected booking type degrades to a generic badge instead of crashing.
const typeFallback: (typeof typeConfig)[string] = {
  icon: <CalendarClock size={12} />, label: "Appointment", tone: "neutral", outline: "btn-outline-primary",
};
const typeOf = (t: string) => typeConfig[t] ?? typeFallback;

const statusTone: Record<string, BadgeTone> = {
  confirmed: "success",
  scheduled: "info",
  pending:   "warning",
};

const followUpChannelConfig: Record<string, { icon: React.ReactNode; tone: BadgeTone }> = {
  Email:    { icon: <Mail size={10} />,          tone: "info"    },
  WhatsApp: { icon: <MessageSquare size={10} />, tone: "success" },
  Call:     { icon: <Phone size={10} />,         tone: "primary" },
};

const days  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export default function AppointmentsClient({ appointments }: { appointments: Appointment[] }) {
  const [view, setView] = useState<"list" | "calendar">("list");

  const today = appointments.filter(a => a.date === "2026-06-07");
  const upcoming = appointments.filter(a => a.date !== "2026-06-07");

  return (
    <div>
      <Header title="Appointments" subtitle="Scheduled calls, site visits & human agent meetings" />
      <Stack gap={6} style={{ padding: "var(--space-9) var(--space-10)" }}>

        {/* Top bar */}
        <Row between wrap gap={4}>
          <Row gap={2}>
            {(["list", "calendar"] as const).map(v => (
              <Chip key={v} on={view === v} onClick={() => setView(v)}>
                {v === "list" ? <><List size={12} />List view</> : <><CalendarDays size={12} />Calendar view</>}
              </Chip>
            ))}
          </Row>
          <Button variant="primary" size="sm" icon={<Plus size={13} />}>Book appointment</Button>
        </Row>

        {view === "list" ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-9)" }}>

            {/* Today */}
            <Stack gap={4}>
              <Text size="sm" weight="semibold">Today — June 7, 2026</Text>
              {today.length === 0 ? (
                <Card pad>
                  <EmptyState icon={<CalendarClock size={20} />} title="No appointments today">
                    Nothing on the calendar for today yet.
                  </EmptyState>
                </Card>
              ) : (
                <Stack gap={4}>
                  {today.map((apt) => {
                    const tc = typeOf(apt.type);
                    return (
                      <Card key={apt.id} style={{ padding: "var(--space-7)" }}>
                        <Row between align="flex-start" style={{ marginBottom: "var(--space-6)" }}>
                          <Stack gap={2}>
                            <Row gap={2}>
                              <Badge tone={tc.tone}>{tc.icon}{tc.label}</Badge>
                              <Badge tone={statusTone[apt.status] || "neutral"}>{apt.status}</Badge>
                            </Row>
                            <Text size="md" weight="semibold">{apt.lead}</Text>
                            <Text size="xs" tone="muted">{apt.property}</Text>
                          </Stack>
                          <Stack gap={1} style={{ textAlign: "right", flexShrink: 0 }}>
                            <Text size="lg" weight="bold" tone="accent" mono>{apt.time}</Text>
                            <Text size="2xs" tone="dim">with {apt.agent}</Text>
                          </Stack>
                        </Row>

                        {apt.notes && (
                          <Row
                            gap={2}
                            align="flex-start"
                            style={{
                              padding: "var(--space-4) var(--space-6)",
                              marginBottom: "var(--space-6)",
                              background: "var(--surface-2)",
                              border: "1px solid var(--border)",
                              borderRadius: "var(--radius-sm)",
                            }}
                          >
                            <FileText size={11} style={{ color: "var(--dim)", marginTop: 1, flexShrink: 0 }} />
                            <Text size="xs" tone="muted">{apt.notes}</Text>
                          </Row>
                        )}

                        <Row gap={2}>
                          <button className={`btn btn-sm ${tc.outline}`} style={{ flex: 1, justifyContent: "center" }}>
                            {tc.icon}Join {tc.label}
                          </button>
                          <Button variant="ghost" size="sm">Reschedule</Button>
                          <Button variant="ghost" size="sm" icon={<Bell size={12} />}>Remind</Button>
                        </Row>
                      </Card>
                    );
                  })}
                </Stack>
              )}
            </Stack>

            {/* Upcoming + follow-ups */}
            <Stack gap={6}>
              <Stack gap={4}>
                <Text size="sm" weight="semibold">Upcoming</Text>
                {upcoming.length === 0 ? (
                  <Card pad>
                    <EmptyState icon={<CalendarClock size={20} />} title="Nothing upcoming">
                      New bookings will appear here.
                    </EmptyState>
                  </Card>
                ) : (
                  <Stack gap={3}>
                    {upcoming.map((apt) => {
                      const tc = typeOf(apt.type);
                      const dateLabel = apt.date === "2026-06-08" ? "Tomorrow"
                        : new Date(apt.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                      return (
                        <Card key={apt.id} style={{ padding: "var(--space-5) var(--space-6)" }}>
                          <Row between gap={4}>
                            <Stack gap={1}>
                              <Row gap={2}>
                                <Text size="2xs" tone="dim">{dateLabel}</Text>
                                <Badge tone={tc.tone}>{tc.icon}{tc.label}</Badge>
                              </Row>
                              <Text size="sm" weight="medium">{apt.lead}</Text>
                              <Text size="2xs" tone="muted">{apt.property}</Text>
                            </Stack>
                            <Stack gap={1} align="flex-end" style={{ textAlign: "right", flexShrink: 0 }}>
                              <Text size="sm" weight="semibold" mono>{apt.time}</Text>
                              <Badge tone={statusTone[apt.status] || "neutral"}>{apt.status}</Badge>
                            </Stack>
                          </Row>
                        </Card>
                      );
                    })}
                  </Stack>
                )}
              </Stack>

              <Card style={{ padding: "var(--space-7)" }}>
                <Stack gap={4}>
                  <Text size="sm" weight="semibold">Auto follow-up sequences</Text>
                  <Stack gap={3}>
                    {[
                      { lead: "James Morrison", next: "Follow-up email in 24hrs",          via: "Email"    },
                      { lead: "Priya Sharma",   next: "WhatsApp check-in in 2 days",        via: "WhatsApp" },
                      { lead: "Chen Wei",       next: "Property brochure resend in 3 days", via: "WhatsApp" },
                      { lead: "Nikolai Petrov", next: "AI call follow-up in 48hrs",         via: "Call"     },
                    ].map((f) => {
                      const ch = followUpChannelConfig[f.via] || followUpChannelConfig.Call;
                      return (
                        <Row
                          key={f.lead}
                          between
                          style={{
                            padding: "var(--space-4) var(--space-6)",
                            background: "var(--surface-2)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                          }}
                        >
                          <Stack gap={1}>
                            <Text size="sm" weight="medium">{f.lead}</Text>
                            <Text size="2xs" tone="dim">{f.next}</Text>
                          </Stack>
                          <Badge tone={ch.tone}>{ch.icon}{f.via}</Badge>
                        </Row>
                      );
                    })}
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          </div>

        ) : (
          <Card flush>
            <Row between style={{ padding: "var(--space-6) var(--space-7)", borderBottom: "1px solid var(--border)" }}>
              <Button variant="ghost" size="sm" icon={<ChevronLeft size={16} />} aria-label="Previous month" />
              <Text size="md" weight="semibold">June 2026</Text>
              <Button variant="ghost" size="sm" icon={<ChevronRight size={16} />} aria-label="Next month" />
            </Row>
            <div style={{ display: "grid", gridTemplateColumns: "64px repeat(7, 1fr)" }}>
              <div style={{ padding: "var(--space-4) var(--space-3)", borderBottom: "1px solid var(--border)" }} />
              {days.map(d => (
                <div
                  key={d}
                  style={{
                    padding: "var(--space-4) var(--space-3)", textAlign: "center",
                    borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)",
                  }}
                >
                  <Text size="2xs" weight="semibold" tone="muted">{d}</Text>
                </div>
              ))}
              {hours.map(hour => (
                <Fragment key={hour}>
                  <div
                    key={`h-${hour}`}
                    style={{
                      padding: "var(--space-4) var(--space-3)", textAlign: "right",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <Text size="2xs" tone="dim" mono>{hour}</Text>
                  </div>
                  {days.map((_, dayIdx) => {
                    const apt = appointments.find(a =>
                      a.time === hour && (
                        dayIdx === 0 ? a.date === "2026-06-07" :
                        dayIdx === 1 ? a.date === "2026-06-08" :
                        dayIdx === 2 ? a.date === "2026-06-09" :
                        dayIdx === 3 ? a.date === "2026-06-10" : false
                      )
                    );
                    const tc = apt ? typeOf(apt.type) : null;
                    return (
                      <div
                        key={`${hour}-${dayIdx}`}
                        style={{
                          minHeight: 52, padding: "var(--space-1)",
                          borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)",
                          background: dayIdx === 0 ? "var(--primary-dim)" : undefined,
                        }}
                      >
                        {apt && tc && (
                          <Stack
                            gap={1}
                            style={{
                              padding: "var(--space-2) var(--space-3)",
                              borderRadius: "var(--radius-xs)",
                              background: "var(--surface-2)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <Text size="2xs" weight="semibold" truncate>{apt.lead}</Text>
                            <Badge tone={tc.tone}>{tc.icon}{tc.label}</Badge>
                          </Stack>
                        )}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </Card>
        )}
      </Stack>
    </div>
  );
}
