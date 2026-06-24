"use client";

/**
 * Audit log — the explainability + trust surface. Every AI and operator action
 * the spine records, rendered as a tenant-isolated timeline: what happened, to
 * whom, when, and *why* (pulled from each event's payload). This is the view
 * that lets a brokerage trust an AI with their leads.
 */

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Card, CardHeader, Row, Stack, Text, Badge } from "@/ui";
import type { AuditEvent } from "@/lib/audit";
import {
  Bot, UserCog, Inbox, CheckCircle2, AlertTriangle, ShieldCheck, Mail,
  Sparkles, Activity, type LucideIcon,
} from "lucide-react";

type Tone = "neutral" | "primary" | "accent" | "success" | "warning" | "info" | "purple";

type TypeMeta = {
  label: string;
  tone: Tone;
  icon: LucideIcon;
  describe: (p: Record<string, unknown>) => string;
};

const s = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));

const TYPES: Record<string, TypeMeta> = {
  lead_arrived: {
    label: "Lead arrived", tone: "info", icon: Inbox,
    describe: (p) => [s(p.channel) && `via ${s(p.channel)}`, s(p.source) && `· ${s(p.source)}`].filter(Boolean).join(" "),
  },
  agent_reply: {
    label: "AI replied", tone: "primary", icon: Bot,
    describe: (p) => {
      const g = p.guardrail as { fired?: boolean; grounded?: boolean } | undefined;
      const model = s(p.model);
      if (g?.fired) return `${model} · guardrail corrected the draft${g.grounded ? " (resolved)" : ""}`;
      return model ? `${model}` : "Generated and sent a reply";
    },
  },
  human_reply: {
    label: "Operator replied", tone: "purple", icon: UserCog,
    describe: (p) => (s(p.channel) ? `Take-over via ${s(p.channel)}` : "Human operator replied"),
  },
  qualified: {
    label: "Lead qualified", tone: "success", icon: CheckCircle2,
    describe: (p) => s(p.summary) || s(p.reason) || `Status → ${s(p.status) || "qualified"}`,
  },
  escalated: {
    label: "Escalated to human", tone: "warning", icon: Sparkles,
    describe: (p) => [s(p.reason), s(p.assigned_member) && `→ ${s(p.assigned_member)}`].filter(Boolean).join(" ") || "Handed to a closer",
  },
  closer_notified: {
    label: "Closer notified", tone: "info", icon: Mail,
    describe: (p) => (p.ok ? `Email sent to ${s(p.to)}` : `Notify failed: ${s(p.error) || "unknown"}`),
  },
  guardrail_flag: {
    label: "Guardrail flag", tone: "warning", icon: ShieldCheck,
    describe: (p) => {
      const blocking = (p.blocking as unknown[]) ?? [];
      const warnings = (p.warnings as unknown[]) ?? [];
      const head = blocking.length ? s(blocking[0]) : warnings.length ? s(warnings[0]) : "Grounding check";
      return `${head}${p.resolved ? " · resolved" : ""}`;
    },
  },
};

function metaFor(type: string): TypeMeta {
  return (
    TYPES[type] ?? {
      label: type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      tone: "neutral",
      icon: Activity,
      describe: () => "",
    }
  );
}

function relTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function exactTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

export default function AuditClient({ events }: { events: AuditEvent[] }) {
  const [filter, setFilter] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of events) map.set(e.type, (map.get(e.type) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [events]);

  const shown = filter ? events.filter((e) => e.type === filter) : events;

  return (
    <div>
      <Header
        title="Audit log"
        subtitle="Every AI and operator action — logged, explainable, isolated per tenant"
      />
      <div style={{ padding: "20px 28px", maxWidth: 940 }}>
        <Stack gap={5}>
          {/* Trust banner */}
          <Row gap={3} align="center" style={{ padding: "var(--space-4) var(--space-5)", borderRadius: "var(--radius-md)", background: "var(--primary-dim)", border: "1px solid var(--primary-border)" }}>
            <ShieldCheck size={16} className="u-tone-primary" style={{ flexShrink: 0 }} />
            <Text size="sm" tone="ink">
              Row-level security isolates this log to your tenant at the database layer — no other brokerage can read it, even with a key.
            </Text>
          </Row>

          {/* Filter chips */}
          <Row gap={2} align="center" style={{ flexWrap: "wrap" }}>
            <Chip active={filter === null} onClick={() => setFilter(null)} label="All" count={events.length} tone="neutral" />
            {counts.map(([type, n]) => (
              <Chip key={type} active={filter === type} onClick={() => setFilter(type)} label={metaFor(type).label} count={n} tone={metaFor(type).tone} />
            ))}
          </Row>

          {/* Timeline */}
          <Card flush>
            <CardHeader>
              <Activity size={13} className="u-tone-dim" />
              <Text size="base" weight="semibold">Activity</Text>
              <Badge style={{ marginLeft: "auto" }}>{shown.length}</Badge>
            </CardHeader>

            {shown.length === 0 ? (
              <Text size="base" tone="dim" as="div" style={{ padding: "var(--space-9)", textAlign: "center" }}>
                No events yet — actions will appear here as the agent works.
              </Text>
            ) : (
              <div>
                {shown.map((e, i) => {
                  const m = metaFor(e.type);
                  const Icon = m.icon;
                  const desc = m.describe(e.payload);
                  return (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.3), ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Row gap={4} align="start" style={{ padding: "var(--space-5) var(--space-7)", borderBottom: "1px solid var(--border)" }}>
                        <div style={{ width: 28, height: 28, borderRadius: "var(--radius-md)", flexShrink: 0, display: "grid", placeItems: "center", background: `var(--${m.tone === "neutral" ? "surface-3" : m.tone}-dim, var(--surface-3))`, border: `1px solid var(--${m.tone === "neutral" ? "border" : m.tone}-border, var(--border))` }}>
                          <Icon size={14} style={{ color: `var(--${m.tone === "neutral" ? "muted" : m.tone})` }} />
                        </div>
                        <Stack gap={1} style={{ flex: 1, minWidth: 0 }}>
                          <Row gap={2} align="center" style={{ flexWrap: "wrap" }}>
                            <Text size="sm" weight="semibold">{m.label}</Text>
                            {e.contactName && (
                              <>
                                <Text size="2xs" tone="dim">·</Text>
                                <Text size="sm" tone="accent">{e.contactName}</Text>
                              </>
                            )}
                          </Row>
                          {desc && <Text size="sm" tone="muted" as="div">{desc}</Text>}
                        </Stack>
                        <Stack gap={1} style={{ flexShrink: 0, alignItems: "flex-end" }}>
                          <Text size="2xs" tone="dim">{relTime(e.createdAt)}</Text>
                          <Text size="2xs" tone="dim" mono>{exactTime(e.createdAt)}</Text>
                        </Stack>
                      </Row>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>
        </Stack>
      </div>
    </div>
  );
}

function Chip({ active, onClick, label, count, tone }: { active: boolean; onClick: () => void; label: string; count: number; tone: Tone }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 10px", borderRadius: "var(--radius-full, 999px)",
        cursor: "pointer", font: "inherit", fontSize: "var(--text-sm, 13px)",
        background: active ? `var(--${tone === "neutral" ? "surface-3" : tone}-dim, var(--surface-3))` : "var(--surface-2)",
        border: `1px solid ${active ? `var(--${tone === "neutral" ? "border-strong" : tone}-border, var(--border-strong))` : "var(--border)"}`,
        color: active ? `var(--${tone === "neutral" ? "ink" : tone})` : "var(--muted)",
      }}
    >
      <span>{label}</span>
      <span style={{ fontSize: 11, opacity: 0.8, fontVariantNumeric: "tabular-nums" }}>{count}</span>
    </button>
  );
}
