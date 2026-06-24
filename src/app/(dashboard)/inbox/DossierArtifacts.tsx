"use client";

/**
 * Generative-UI dossier artifacts — the "intelligence as artifacts" layer.
 *
 * Renders the *real* sub-agent output (already computed server-side from live
 * Supabase inventory) as visual instruments instead of text rows:
 *   · LeadScoreGauge — instant, explainable qualification score (no LLM)
 *   · BudgetFitBars  — each match placed spatially against the lead's budget
 *   · MortgageDonut  — down-payment vs loan split, monthly at the centre
 *
 * Motion is earned: values spring to position once, the score counts up, and
 * everything snaps to its final state under prefers-reduced-motion.
 */

import { useEffect, useState } from "react";
import { motion, useReducedMotion, animate } from "framer-motion";
import { Row, Stack, Text, Badge } from "@/ui";
import { scoreLead, parseBudgetAed, type ScoreInput, type LeadScore } from "@/lib/leadScore";
import type { Recommendation, Mortgage } from "@/lib/subagents";

const bandTone = { hot: "var(--primary)", warm: "var(--accent)", cold: "var(--info)" } as const;
const bandLabel = { hot: "Hot", warm: "Warm", cold: "Cold" } as const;
const bandBadge = { hot: "success", warm: "warning", cold: "info" } as const;

function aed(n: number): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 2)}M`;
  return `AED ${Math.round(n / 1000)}K`;
}

/* ----------------------------------------------------------------- gauge -- */

export function LeadScoreGauge(props: ScoreInput) {
  const reduce = useReducedMotion();
  const result: LeadScore = scoreLead(props);
  const { score, band, factors, nextBestAction } = result;
  const color = bandTone[band];

  // Semicircle arc geometry.
  const R = 52;
  const C = Math.PI * R; // half-circumference (180° sweep)
  const target = (score / 100) * C;

  const [display, setDisplay] = useState(reduce ? score : 0);
  const [dash, setDash] = useState(reduce ? target : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(score);
      setDash(target);
      return;
    }
    const a = animate(0, score, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        setDisplay(Math.round(v));
        setDash((v / 100) * C);
      },
    });
    return () => a.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, reduce]);

  return (
    <Stack gap={4} style={{ padding: "var(--space-7)", borderBottom: "1px solid var(--border)" }}>
      <Row gap={2} align="center">
        <Text size="sm" weight="semibold">Lead score</Text>
        <Text size="2xs" tone="dim">instant · on-device</Text>
        <Badge tone={bandBadge[band] as never} style={{ marginLeft: "auto" }}>{bandLabel[band]}</Badge>
      </Row>

      <Row gap={5} align="center">
        <div style={{ position: "relative", width: 124, height: 70, flexShrink: 0 }}>
          <svg width="124" height="70" viewBox="0 0 124 70" aria-hidden>
            {/* track */}
            <path
              d="M 10 64 A 52 52 0 0 1 114 64"
              fill="none"
              stroke="var(--surface-3)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* value */}
            <path
              d="M 10 64 A 52 52 0 0 1 114 64"
              fill="none"
              stroke={color}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C - dash}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, top: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Text size="2xl" weight="bold" mono style={{ color, lineHeight: 1 }}>{display}</Text>
            <Text size="2xs" tone="dim">/ 100</Text>
          </div>
        </div>

        {/* factor breakdown — the "why" behind the score */}
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          {factors.map((f, i) => {
            const pct = f.max ? f.points / f.max : 0;
            return (
              <Stack key={f.key} gap={1}>
                <Row between gap={2}>
                  <Text size="2xs" tone="dim" truncate>{f.label}</Text>
                  <Text size="2xs" tone={pct > 0 ? "ink" : "dim"} mono style={{ flexShrink: 0 }}>{f.points}</Text>
                </Row>
                <div style={{ height: 3, borderRadius: 3, background: "var(--surface-3)", overflow: "hidden" }}>
                  <motion.div
                    initial={{ scaleX: reduce ? pct : 0 }}
                    animate={{ scaleX: pct }}
                    transition={{ duration: 0.6, delay: reduce ? 0 : 0.2 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    style={{ height: "100%", transformOrigin: "left", borderRadius: 3, background: pct >= 1 ? color : "var(--border-strong)" }}
                  />
                </div>
              </Stack>
            );
          })}
        </Stack>
      </Row>

      {nextBestAction && (
        <Row gap={2} align="center" style={{ padding: "7px 10px", borderRadius: "var(--radius-md)", background: "var(--accent-dim)", border: "1px solid var(--accent-border)" }}>
          <Text size="2xs" weight="semibold" tone="accent">NEXT</Text>
          <Text size="xs" tone="ink">{nextBestAction}</Text>
        </Row>
      )}
    </Stack>
  );
}

/* ------------------------------------------------------------ budget fit -- */

export function BudgetFitBars({ recommendations, budget }: { recommendations: Recommendation[]; budget: string | null }) {
  const reduce = useReducedMotion();
  if (!recommendations.length) return <Text size="xs" tone="dim">No matching inventory.</Text>;

  const budgetAed = parseBudgetAed(budget);
  const prices = recommendations.map((r) => r.price);
  // Scale axis so both the budget marker and every unit fit with headroom.
  const max = Math.max(...prices, budgetAed ?? 0) * 1.12 || 1;
  const fitColor: Record<string, string> = { "at-budget": "var(--primary)", stretch: "var(--warning)", below: "var(--info)" };
  const markerPct = budgetAed ? (budgetAed / max) * 100 : null;

  return (
    <Stack gap={3}>
      {markerPct != null && (
        <Row gap={2} align="center">
          <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--accent)", flexShrink: 0 }} />
          <Text size="2xs" tone="dim">Budget marker · {aed(budgetAed!)}</Text>
        </Row>
      )}
      {recommendations.map((r, i) => {
        const pct = Math.min(100, (r.price / max) * 100);
        const color = fitColor[r.fit] ?? "var(--info)";
        return (
          <Stack key={r.id} gap={1}>
            <Row between gap={2} align="center">
              <Text size="xs" weight="medium" truncate>{r.project}</Text>
              <Text size="2xs" weight="semibold" mono style={{ color, flexShrink: 0 }}>{aed(r.price)}</Text>
            </Row>
            <div style={{ position: "relative", height: 8, borderRadius: 4, background: "var(--surface-3)", overflow: "hidden" }}>
              <motion.div
                initial={{ scaleX: reduce ? pct / 100 : 0 }}
                animate={{ scaleX: pct / 100 }}
                transition={{ duration: 0.7, delay: reduce ? 0 : i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: "100%", transformOrigin: "left", borderRadius: 4, background: color, opacity: 0.85 }}
              />
            </div>
            {markerPct != null && (
              <div style={{ position: "relative", height: 0 }}>
                <div style={{ position: "absolute", left: `${markerPct}%`, top: -12, width: 2, height: 12, background: "var(--accent)", transform: "translateX(-1px)" }} />
              </div>
            )}
            <Text size="2xs" tone="dim">{r.bedrooms}BR · {r.location}</Text>
          </Stack>
        );
      })}
    </Stack>
  );
}

/* -------------------------------------------------------------- mortgage -- */

export function MortgageDonut({ mortgage }: { mortgage: Mortgage }) {
  const reduce = useReducedMotion();
  const total = mortgage.downPayment + mortgage.loanAmount || 1;
  const fLoan = mortgage.loanAmount / total;
  const fDown = mortgage.downPayment / total;

  // Hand-rolled SVG donut — two normalized arcs (pathLength=1), a small gap
  // between them. Robust at any width, themeable with tokens, no chart lib.
  const gap = 0.012;
  const R = 52, SW = 16, CX = 66, CY = 66;
  const [draw, setDraw] = useState(reduce ? 1 : 0);

  useEffect(() => {
    if (reduce) { setDraw(1); return; }
    const a = animate(0, 1, { duration: 0.85, ease: [0.16, 1, 0.3, 1], onUpdate: setDraw });
    return () => a.stop();
  }, [reduce]);

  const loanLen = Math.max(0, fLoan - gap) * draw;
  const downLen = Math.max(0, fDown - gap) * draw;

  return (
    <Stack gap={3}>
      <div style={{ position: "relative", height: 144, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="132" height="132" viewBox="0 0 132 132" aria-hidden style={{ transform: "rotate(-90deg)" }}>
          {/* loan segment */}
          <circle
            cx={CX} cy={CY} r={R} fill="none" stroke="var(--primary)" strokeWidth={SW}
            strokeLinecap="round" pathLength={1}
            strokeDasharray={`${loanLen} ${1 - loanLen}`}
          />
          {/* down-payment segment, offset to start after the loan arc */}
          <circle
            cx={CX} cy={CY} r={R} fill="none" stroke="var(--accent)" strokeWidth={SW}
            strokeLinecap="round" pathLength={1}
            strokeDasharray={`${downLen} ${1 - downLen}`}
            strokeDashoffset={-(fLoan + gap / 2) * draw}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <Text size="2xs" tone="dim">Monthly</Text>
          <Text size="md" weight="bold" mono tone="accent" style={{ lineHeight: 1.1 }}>
            AED {mortgage.monthly.toLocaleString()}
          </Text>
        </div>
      </div>

      <Stack gap={2}>
        {[
          { label: "Property value", value: aed(mortgage.value), dot: null },
          { label: "Down payment (20%)", value: aed(mortgage.downPayment), dot: "var(--accent)" },
          { label: "Loan amount", value: aed(mortgage.loanAmount), dot: "var(--primary)" },
          { label: "Rate (est.)", value: `${mortgage.ratePct}% p.a.`, dot: null },
          { label: "Term", value: `${mortgage.years} years`, dot: null },
        ].map(({ label, value, dot }) => (
          <Row key={label} between gap={3} align="center">
            <Row gap={2} align="center">
              {dot && <span style={{ width: 7, height: 7, borderRadius: 2, background: dot, flexShrink: 0 }} />}
              <Text size="sm" tone="dim">{label}</Text>
            </Row>
            <Text size="sm">{value}</Text>
          </Row>
        ))}
      </Stack>
    </Stack>
  );
}
