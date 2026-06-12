"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate, useInView } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { IconArrowRight, IconCheck } from "@/components/AitaasIcons";

const AitaasCanvas = dynamic(() => import("@/components/AitaasCanvas"), { ssr: false });

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref} className={className}
      initial={{ opacity: 1, y: 18 }}
      animate={inView ? { y: 0 } : { y: 18 }}
      transition={{ duration: 0.55, ease: E, delay }}
    >
      {children}
    </motion.div>
  );
}

function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [inView]); // eslint-disable-line
  return <motion.span ref={ref}>{display}</motion.span>;
}

const AGENTS = [
  {
    name: "Property Sales Agent",
    vertical: "Real Estate",
    body: "Calls every inbound lead within 60 seconds. Qualifies budget and preferences, delivers property brochures to WhatsApp mid-call, and books viewings on your calendar.",
    proof: "78% of deals go to the first responder",
    featured: true,
  },
  {
    name: "Revenue Recovery Agent",
    vertical: "Finance",
    body: "Parses aging receivables, runs a 15-day collection cadence over voice and WhatsApp, and generates payment links in-call.",
    proof: "3× faster collection cycles",
    featured: false,
  },
  {
    name: "Healthcare Booking Agent",
    vertical: "Clinics",
    body: "Handles inbound appointment calls 24/7. Matches patient to doctor, sends brochures, confirms bookings.",
    proof: "Zero missed calls after hours",
    featured: false,
  },
  {
    name: "Cart Recovery Agent",
    vertical: "E-commerce",
    body: "Calls abandoned cart customers within minutes, addresses objections in their language, generates BNPL payment links.",
    proof: "Reaches buyers before they're gone",
    featured: false,
  },
  {
    name: "Admissions Agent",
    vertical: "Education",
    body: "Qualifies prospects, scores scholarship eligibility, answers FAQs in 7 languages, books campus tours.",
    proof: "35%+ appointment conversion",
    featured: false,
  },
  {
    name: "Social Media Executive",
    vertical: "Marketing",
    body: "Creates, schedules, and publishes content autonomously. Writes copy, generates imagery, optimises performance.",
    proof: "24/7 autonomous operations",
    featured: false,
  },
];

const INDUSTRIES = [
  "Real Estate", "Healthcare", "Retail", "Education", "Finance", "Automotive", "Enterprise"
];

export default function AitaasHome() {
  return (
    <>
      <style>{`
        /* ────────────────────────────────────────────────
           HERO
        ──────────────────────────────────────────────── */
        .hp-hero {
          min-height: 100svh; position: relative;
          display: grid; grid-template-columns: 1fr 1fr;
          overflow: hidden;
        }
        /* dot grid overlay */
        .hp-hero::before {
          content: '';
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image: radial-gradient(circle, oklch(0.36 0.007 260) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: linear-gradient(to right, transparent 0%, black 30%, black 60%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 30%, black 60%, transparent 100%);
          opacity: 0.35;
        }
        /* copper ambient glow right side */
        .hp-hero::after {
          content: '';
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 70% at 75% 50%, oklch(0.72 0.17 34 / 0.07) 0%, transparent 70%);
        }
        .hp-hero-left {
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 120px clamp(20px, 5vw, 72px) clamp(56px, 8vh, 88px);
          position: relative; z-index: 2;
        }
        .hp-hero-right {
          position: relative; z-index: 1;
        }
        .hp-hero-canvas {
          position: absolute; inset: 0;
        }
        .hp-tag {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--c-copper);
          margin-bottom: 28px;
        }
        .hp-tag::before {
          content: ''; display: block; width: 20px; height: 1px;
          background: var(--c-copper);
        }
        .hp-h1 {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; text-transform: uppercase;
          font-size: clamp(3.4rem, 5.5vw, 6rem);
          line-height: 0.95; letter-spacing: -0.01em;
          color: var(--c-ink); margin-bottom: 28px;
          text-wrap: balance;
        }
        .hp-h1 em { font-style: normal; color: var(--c-copper); }
        .hp-sub {
          font-size: clamp(15px, 1.5vw, 17px); line-height: 1.7;
          color: var(--c-ink-2); max-width: 52ch; margin-bottom: 40px;
        }
        .hp-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
        .hp-divider {
          margin-top: clamp(48px, 7vh, 80px);
          border-top: 1px solid var(--c-border);
          padding-top: 24px;
          display: flex; gap: 40px; flex-wrap: wrap;
        }
        .hp-spec {
          font-size: 11px; font-weight: 500; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--c-muted);
        }
        .hp-spec strong {
          display: block; font-size: 22px; font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; color: var(--c-copper); letter-spacing: 0; line-height: 1.1;
          margin-bottom: 2px;
        }

        @media (max-width: 860px) {
          .hp-hero { grid-template-columns: 1fr; min-height: auto; }
          .hp-hero-left { padding-bottom: 0; }
          .hp-hero-right { height: 380px; }
          .hp-hero-canvas { position: absolute; }
        }
        @media (max-width: 480px) {
          .hp-hero-right { height: 280px; }
          .hp-h1 { font-size: 3rem; }
          .hp-ctas { flex-direction: column; }
        }

        /* ────────────────────────────────────────────────
           INTEGRATIONS STRIP
        ──────────────────────────────────────────────── */
        .hp-integrations {
          border-bottom: 1px solid var(--c-border);
          padding: clamp(32px,5vw,56px) 0;
          background: var(--c-surface);
        }
        .hp-int-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--c-muted);
          margin-bottom: 28px;
        }
        .hp-int-logos {
          display: flex; align-items: center; gap: 0;
          flex-wrap: wrap;
          border: 1px solid var(--c-border);
        }
        .hp-int-logo {
          display: flex; align-items: center; gap: 10px;
          padding: 18px 28px;
          border-right: 1px solid var(--c-border);
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 13px; font-weight: 600;
          color: var(--c-muted);
          transition: color 0.15s;
          white-space: nowrap;
        }
        .hp-int-logo:last-child { border-right: none; }
        .hp-int-logo:hover { color: var(--c-ink-2); }
        .hp-int-logo svg { flex-shrink: 0; }

        /* ────────────────────────────────────────────────
           LIVE CALL VISUAL
        ──────────────────────────────────────────────── */
        .hp-visual {
          background: var(--c-surface);
          border-top: 1px solid var(--c-border);
        }
        .hp-visual-inner {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: clamp(48px, 8vw, 96px); align-items: center;
        }
        @media (max-width: 860px) { .hp-visual-inner { grid-template-columns: 1fr; } }
        .hp-visual-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2rem, 3.5vw, 3.2rem);
          letter-spacing: -0.01em; color: var(--c-ink); line-height: 1;
          margin-bottom: 20px;
        }
        .hp-visual-h em { color: var(--c-copper); font-style: normal; }
        .hp-visual-body {
          font-size: 15px; line-height: 1.75; color: var(--c-ink-2);
          margin-bottom: 32px; max-width: 46ch;
        }
        /* Phone call mockup */
        .hp-call-card {
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          padding: 0;
          overflow: hidden;
          position: relative;
        }
        .hp-call-header {
          background: oklch(0.72 0.17 34 / 0.12);
          border-bottom: 1px solid oklch(0.72 0.17 34 / 0.3);
          padding: 14px 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .hp-call-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: oklch(0.72 0.17 34);
          animation: pulse-dot 1.8s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
        .hp-call-status {
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: oklch(0.72 0.17 34);
        }
        .hp-call-timer {
          margin-left: auto; font-size: 11px;
          font-family: 'Barlow Condensed', sans-serif;
          color: var(--c-muted); letter-spacing: 0.1em;
        }
        .hp-call-lines {
          padding: 20px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .hp-call-line {
          display: flex; gap: 12px; align-items: flex-start;
        }
        .hp-call-speaker {
          font-size: 9px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--c-muted);
          min-width: 32px; padding-top: 2px; flex-shrink: 0;
        }
        .hp-call-speaker.ai { color: var(--c-copper); }
        .hp-call-bubble {
          font-size: 12px; line-height: 1.5; color: var(--c-ink-2);
          background: var(--c-surface2);
          padding: 8px 12px;
          border-radius: 0;
          flex: 1;
        }
        .hp-call-bubble.ai {
          background: oklch(0.72 0.17 34 / 0.1);
          color: var(--c-ink);
          border-left: 2px solid oklch(0.72 0.17 34 / 0.5);
        }
        .hp-call-footer {
          border-top: 1px solid var(--c-border);
          padding: 14px 20px;
          display: flex; gap: 16px; align-items: center;
        }
        .hp-call-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 500; color: var(--c-muted);
          letter-spacing: 0.04em;
        }
        .hp-call-badge-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--c-copper-dim);
        }

        /* ────────────────────────────────────────────────
           TICKER
        ──────────────────────────────────────────────── */
        .hp-ticker {
          background: var(--c-surface);
          border-top: 1px solid var(--c-border);
          border-bottom: 1px solid var(--c-border);
          padding: 12px 0; overflow: hidden;
        }
        .hp-ticker-track {
          display: flex; white-space: nowrap;
          animation: ticker 32s linear infinite;
        }
        @keyframes ticker { to { transform: translateX(-50%); } }
        .hp-ticker-item {
          display: inline-flex; align-items: center; gap: 20px;
          padding: 0 32px; font-size: 11px; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--c-muted); flex-shrink: 0;
        }
        .hp-ticker-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--c-copper-dim);
        }

        /* ────────────────────────────────────────────────
           PROBLEM
        ──────────────────────────────────────────────── */
        .hp-problem-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
          align-items: start;
        }
        .hp-problem-stat {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; text-transform: uppercase;
          font-size: clamp(4rem, 8vw, 8rem);
          line-height: 0.9; letter-spacing: -0.01em;
          color: var(--c-copper); margin-bottom: 16px;
        }
        .hp-problem-sub {
          font-size: 14px; color: var(--c-muted); letter-spacing: 0.04em;
          text-transform: uppercase; font-weight: 500; margin-bottom: 32px;
        }
        .hp-problem-h {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600; text-transform: uppercase;
          font-size: clamp(1.6rem, 2.5vw, 2.4rem);
          letter-spacing: -0.005em; color: var(--c-ink); margin-bottom: 16px;
        }
        .hp-problem-body {
          font-size: 15px; line-height: 1.75; color: var(--c-ink-2); max-width: 50ch;
        }
        .hp-fact-list { margin-top: 32px; display: flex; flex-direction: column; gap: 0; }
        .hp-fact {
          display: flex; align-items: flex-start; gap: 16px; padding: 18px 0;
          border-top: 1px solid var(--c-border);
        }
        .hp-fact:last-child { border-bottom: 1px solid var(--c-border); }
        .hp-fact-num {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          font-size: 1.6rem; color: var(--c-copper); line-height: 1;
          min-width: 64px; flex-shrink: 0;
        }
        .hp-fact-text { font-size: 14px; color: var(--c-ink-2); line-height: 1.6; }

        @media (max-width: 860px) {
          .hp-problem-grid { grid-template-columns: 1fr; gap: 40px; }
        }

        /* ────────────────────────────────────────────────
           AGENTS SHOWCASE
        ──────────────────────────────────────────────── */
        .hp-agents-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 56px; flex-wrap: wrap; gap: 16px;
        }
        .hp-agents-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2rem, 3.5vw, 3.2rem);
          letter-spacing: -0.01em; color: var(--c-ink); max-width: 480px;
          line-height: 1.0;
        }
        .hp-agents-h em { color: var(--c-copper); font-style: normal; }

        /* Featured + sidebar layout */
        .hp-agents-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1px; background: var(--c-border);
          border: 1px solid var(--c-border);
        }
        .hp-agent-featured {
          background: var(--c-surface); padding: clamp(36px, 5vw, 64px);
          display: flex; flex-direction: column; gap: 24px;
        }
        .hp-agent-featured-vertical {
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--c-copper); font-weight: 600;
        }
        .hp-agent-featured-name {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2rem, 3vw, 3rem);
          letter-spacing: -0.01em; color: var(--c-ink); line-height: 1.0;
        }
        .hp-agent-featured-body {
          font-size: 16px; line-height: 1.75; color: var(--c-ink-2); max-width: 52ch;
        }
        .hp-agent-featured-proof {
          font-size: 13px; color: var(--c-copper); letter-spacing: 0.04em;
          padding-top: 24px; border-top: 1px solid var(--c-border);
        }
        .hp-agent-list {
          background: var(--c-bg); display: flex; flex-direction: column;
        }
        .hp-agent-row {
          padding: 20px 28px; border-bottom: 1px solid var(--c-border);
          cursor: default; transition: background 0.15s; flex: 1;
          display: flex; flex-direction: column; justify-content: space-between;
          gap: 6px; min-height: 80px;
        }
        .hp-agent-row:last-child { border-bottom: none; }
        @media (hover: hover) {
          .hp-agent-row:hover { background: var(--c-surface); }
        }
        .hp-agent-row-name {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 600;
          font-size: 1.05rem; text-transform: uppercase; letter-spacing: 0.02em;
          color: var(--c-ink); line-height: 1.1;
        }
        .hp-agent-row-vertical {
          font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--c-muted);
        }

        @media (max-width: 900px) {
          .hp-agents-layout { grid-template-columns: 1fr; }
          .hp-agent-list { flex-direction: row; flex-wrap: wrap; }
          .hp-agent-row { min-height: auto; flex: 1 1 calc(50% - 1px); }
        }
        @media (max-width: 500px) {
          .hp-agent-row { flex: 1 1 100%; }
        }

        /* ────────────────────────────────────────────────
           HOW IT WORKS
        ──────────────────────────────────────────────── */
        .hp-how { background: var(--c-surface); border-top: 1px solid var(--c-border); }
        .hp-how-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2rem, 3.5vw, 3.2rem);
          letter-spacing: -0.01em; color: var(--c-ink); margin-bottom: 64px;
          max-width: 560px; line-height: 1.0;
        }
        .hp-how-h em { color: var(--c-copper); font-style: normal; }
        .hp-steps-row {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0; border: 1px solid var(--c-border);
          background: var(--c-border);
        }
        .hp-step {
          background: var(--c-bg); padding: clamp(28px, 4vw, 48px);
        }
        .hp-step-label {
          font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--c-copper); margin-bottom: 28px; font-weight: 600;
        }
        .hp-step-name {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: 1.6rem; letter-spacing: -0.005em;
          color: var(--c-ink); margin-bottom: 12px; line-height: 1.0;
        }
        .hp-step-body { font-size: 14px; line-height: 1.75; color: var(--c-muted); }
        @media (max-width: 760px) { .hp-steps-row { grid-template-columns: 1fr; } }

        /* ────────────────────────────────────────────────
           INDUSTRIES
        ──────────────────────────────────────────────── */
        .hp-ind-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(1.4rem, 2vw, 2rem);
          letter-spacing: 0.02em; color: var(--c-muted); margin-bottom: 32px;
        }
        .hp-ind-list {
          display: flex; flex-direction: column;
          border-top: 1px solid var(--c-border);
        }
        .hp-ind-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 0; border-bottom: 1px solid var(--c-border);
          text-decoration: none; transition: padding-left 0.22s var(--c-ease);
          cursor: pointer;
        }
        @media (hover: hover) {
          .hp-ind-row:hover { padding-left: 16px; }
          .hp-ind-row:hover .hp-ind-name { color: var(--c-copper); }
          .hp-ind-row:hover .hp-ind-arrow { color: var(--c-copper); }
        }
        .hp-ind-name {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(1.8rem, 4vw, 3.6rem);
          letter-spacing: -0.01em; color: var(--c-ink); line-height: 1;
          transition: color 0.18s;
        }
        .hp-ind-arrow { color: var(--c-border); transition: color 0.18s; flex-shrink: 0; }

        /* ────────────────────────────────────────────────
           RESULTS STRIP
        ──────────────────────────────────────────────── */
        .hp-results {
          background: var(--c-surface2); border-top: 1px solid var(--c-border);
          border-bottom: 1px solid var(--c-border);
        }
        .hp-results-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 0; border-left: 1px solid var(--c-border);
        }
        .hp-result-cell {
          padding: clamp(28px, 4vw, 48px) clamp(20px, 3vw, 40px);
          border-right: 1px solid var(--c-border);
          border-bottom: none;
        }
        .hp-result-num {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          font-size: clamp(2.4rem, 4vw, 3.8rem); letter-spacing: -0.01em;
          color: var(--c-copper); line-height: 1; margin-bottom: 8px;
        }
        .hp-result-label { font-size: 13px; color: var(--c-ink-2); line-height: 1.4; }
        .hp-result-sub { font-size: 11px; color: var(--c-muted); margin-top: 4px; }
        @media (max-width: 860px) {
          .hp-results-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 500px) {
          .hp-results-grid { grid-template-columns: 1fr; }
        }

        /* ────────────────────────────────────────────────
           PRICING OVERVIEW
        ──────────────────────────────────────────────── */
        .hp-price-intro {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; margin-bottom: 64px; align-items: start;
        }
        .hp-price-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2rem, 3.5vw, 3.2rem);
          letter-spacing: -0.01em; color: var(--c-ink); line-height: 1.0;
        }
        .hp-price-h em { color: var(--c-copper); font-style: normal; }
        .hp-price-desc {
          font-size: 15px; line-height: 1.75; color: var(--c-ink-2);
          padding-top: 8px;
        }
        .hp-price-cols {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0; background: var(--c-border); border: 1px solid var(--c-border);
        }
        .hp-price-col {
          background: var(--c-bg); padding: clamp(28px, 4vw, 44px);
        }
        .hp-price-col.hp-price-featured { background: var(--c-surface); }
        .hp-price-tier {
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--c-muted); margin-bottom: 20px; font-weight: 600;
        }
        .hp-price-featured .hp-price-tier { color: var(--c-copper); }
        .hp-price-amount {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          font-size: 2.2rem; letter-spacing: -0.01em; color: var(--c-ink);
          line-height: 1; margin-bottom: 4px;
        }
        .hp-price-cadence { font-size: 11px; color: var(--c-muted); margin-bottom: 28px; }
        .hp-price-features { display: flex; flex-direction: column; gap: 10px; }
        .hp-price-feat {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; color: var(--c-ink-2); line-height: 1.5;
        }
        .hp-price-check { color: var(--c-copper); flex-shrink: 0; margin-top: 1px; }
        @media (max-width: 860px) {
          .hp-price-intro { grid-template-columns: 1fr; gap: 24px; }
          .hp-price-cols { grid-template-columns: 1fr; }
        }

        /* ────────────────────────────────────────────────
           FINAL CTA
        ──────────────────────────────────────────────── */
        .hp-cta-sect {
          background: var(--c-surface); border-top: 1px solid var(--c-border);
        }
        .hp-cta-inner {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center;
        }
        .hp-cta-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2.4rem, 4vw, 4rem);
          letter-spacing: -0.01em; color: var(--c-ink); line-height: 0.95;
        }
        .hp-cta-h em { color: var(--c-copper); font-style: normal; }
        .hp-cta-body {
          font-size: 15px; line-height: 1.75; color: var(--c-ink-2);
          margin-top: 20px; margin-bottom: 36px; max-width: 46ch;
        }
        .hp-cta-facts { display: flex; flex-direction: column; gap: 0; }
        .hp-cta-fact {
          padding: 20px 0; border-top: 1px solid var(--c-border);
          display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: start;
        }
        .hp-cta-fact:last-child { border-bottom: 1px solid var(--c-border); }
        .hp-cta-fact-icon { color: var(--c-copper); margin-top: 1px; flex-shrink: 0; }
        .hp-cta-fact-title { font-size: 14px; font-weight: 500; color: var(--c-ink); margin-bottom: 2px; }
        .hp-cta-fact-body { font-size: 13px; color: var(--c-muted); line-height: 1.6; }
        @media (max-width: 860px) {
          .hp-cta-inner { grid-template-columns: 1fr; gap: 48px; }
        }
      `}</style>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="hp-hero">
        <div className="hp-hero-left">
          <motion.div
            initial={{ y: 14 }} animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: E }}
          >
            <span className="hp-tag">AI Workers for Business</span>
          </motion.div>

          <motion.h1
            className="hp-h1"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.65, ease: E, delay: 0.3 }}
          >
            Your Next Hire<br />
            is an <em>AI Agent.</em><br />
            Working at 3am.
          </motion.h1>

          <motion.p
            className="hp-sub"
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: E, delay: 0.5 }}
          >
            Voice and digital agents that call your leads in 60 seconds, book appointments overnight,
            recover overdue payments, and run customer follow-ups — in 7 languages, every hour of the day.
          </motion.p>

          <motion.div
            className="hp-ctas"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: E, delay: 0.7 }}
          >
            <Link href="/aitaas/contact" className="c-btn">Book a Live Demo</Link>
            <Link href="/aitaas/solutions" className="c-btn c-btn--ghost">
              View all agents <IconArrowRight size={13} color="currentColor" />
            </Link>
          </motion.div>

          <motion.div
            className="hp-divider"
            initial={{ y: 8 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.9, ease: E }}
          >
            {[
              { val: 9, suffix: "", label: "Agent products" },
              { val: 7, suffix: "", label: "Languages" },
              { val: 60, suffix: "s", label: "Response time" },
              { val: 14, suffix: " days", label: "To go live" },
            ].map((s) => (
              <div className="hp-spec" key={s.label}>
                <strong><Count to={s.val} suffix={s.suffix} /></strong>
                {s.label}
              </div>
            ))}
          </motion.div>
        </div>

        <div className="hp-hero-right">
          <div className="hp-hero-canvas">
            <AitaasCanvas />
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ────────────────────────────────── */}
      <section className="hp-integrations">
        <div className="c-wrap">
          <p className="hp-int-label">Connects to your existing stack</p>
          <div className="hp-int-logos">
            {[
              { name: "WhatsApp", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="oklch(0.72 0.17 34)"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.12 1.522 5.852L.057 23.998l6.302-1.453A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.869 9.869 0 01-5.031-1.378l-.36-.214-3.742.863.936-3.636-.235-.374A9.855 9.855 0 012.106 12C2.106 6.54 6.54 2.106 12 2.106S21.894 6.54 21.894 12 17.46 21.894 12 21.894z"/></svg> },
              { name: "Salesforce", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="2" fill="oklch(0.72 0.17 34 / 0.2)"/><text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill="oklch(0.72 0.17 34)" fontFamily="sans-serif">SF</text></svg> },
              { name: "Google Calendar", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="18" rx="1" stroke="oklch(0.72 0.17 34)" strokeWidth="1.5"/><path d="M8 2v4M16 2v4M2 10h20" stroke="oklch(0.72 0.17 34)" strokeWidth="1.5"/></svg> },
              { name: "HubSpot", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="17" cy="7" r="3" fill="oklch(0.72 0.17 34 / 0.7)"/><path d="M14.5 9.5L9 13M9 11a4 4 0 100 6 4 4 0 000-6z" stroke="oklch(0.72 0.17 34)" strokeWidth="1.5" fill="none"/></svg> },
              { name: "Property Finder", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V21H15v-5h-6v5H3V9.5z" stroke="oklch(0.72 0.17 34)" strokeWidth="1.5"/></svg> },
              { name: "Bayut", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="oklch(0.72 0.17 34)" strokeWidth="1.5"/><path d="M8 12h8M12 8v8" stroke="oklch(0.72 0.17 34)" strokeWidth="1.5"/></svg> },
              { name: "Twilio", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="oklch(0.72 0.17 34)" strokeWidth="1.5"/><circle cx="9" cy="9" r="1.5" fill="oklch(0.72 0.17 34)"/><circle cx="15" cy="9" r="1.5" fill="oklch(0.72 0.17 34)"/><circle cx="9" cy="15" r="1.5" fill="oklch(0.72 0.17 34)"/><circle cx="15" cy="15" r="1.5" fill="oklch(0.72 0.17 34)"/></svg> },
              { name: "Zapier", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2v6M12 16v6M2 12h6M16 12h6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" stroke="oklch(0.72 0.17 34)" strokeWidth="1.5" strokeLinecap="round"/></svg> },
            ].map(({ name, icon }) => (
              <div key={name} className="hp-int-logo">
                {icon} {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ──────────────────────────────────────── */}
      <div className="hp-ticker" aria-hidden>
        <div className="hp-ticker-track">
          {[...Array(2)].map((_, s) =>
            ["Real Estate", "Healthcare", "E-commerce", "Education", "Finance", "Automotive", "Enterprise Sales", "Collections", "Property Investment"].map((item) => (
              <span key={`${s}-${item}`} className="hp-ticker-item">
                {item}<span className="hp-ticker-dot" />
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── PROBLEM ─────────────────────────────────────── */}
      <section className="c-sect">
        <div className="c-wrap">
          <div className="hp-problem-grid">
            <Reveal>
              <div className="hp-problem-stat"><Count to={78} suffix="%" /></div>
              <div className="hp-problem-sub">of deals go to the first responder</div>
              <h2 className="hp-problem-h">Most businesses respond in hours.<br />Your competitors respond in minutes.</h2>
              <p className="hp-problem-body">
                Every delayed callback, every missed call after hours, every language barrier
                is a deal your competitor closes instead. The businesses winning in the UAE
                today removed that constraint entirely.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="hp-fact-list">
                {[
                  { stat: "60s", text: "The window to reach a lead before intent drops. Our agents call within 60 seconds of enquiry." },
                  { stat: "7", text: "Languages spoken by our agents on day one: Arabic, English, Hindi, Urdu, Russian, Mandarin, French." },
                  { stat: "24/7", text: "Operating hours. Evenings, weekends, public holidays — your pipeline never stops." },
                  { stat: "AED 2,500", text: "Starting monthly investment. Less than two days of a human salary, with full reporting." },
                ].map((f) => (
                  <div className="hp-fact" key={f.stat}>
                    <div className="hp-fact-num">{f.stat}</div>
                    <div className="hp-fact-text">{f.text}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── AGENTS ──────────────────────────────────────── */}
      <section className="c-sect" style={{ background: "var(--c-surface)", borderTop: "1px solid var(--c-border)" }}>
        <div className="c-wrap">
          <div className="hp-agents-header">
            <Reveal>
              <h2 className="hp-agents-h">
                Nine AI agents.<br />
                <em>Ready to deploy.</em>
              </h2>
            </Reveal>
            <Link href="/aitaas/solutions" className="c-btn c-btn--ghost">
              Full details <IconArrowRight size={13} color="currentColor" />
            </Link>
          </div>

          <div className="hp-agents-layout">
            {/* Featured agent */}
            {(() => {
              const f = AGENTS[0];
              return (
                <div className="hp-agent-featured">
                  <div className="hp-agent-featured-vertical">{f.vertical}</div>
                  <h3 className="hp-agent-featured-name">{f.name}</h3>
                  <p className="hp-agent-featured-body">{f.body}</p>
                  <div className="hp-agent-featured-proof">{f.proof}</div>
                  <div>
                    <Link href="/aitaas/solutions" className="c-btn" style={{ marginTop: 8 }}>
                      See how it works <IconArrowRight size={13} color="currentColor" />
                    </Link>
                  </div>
                </div>
              );
            })()}

            {/* List of remaining agents */}
            <div className="hp-agent-list">
              {AGENTS.slice(1).map((a) => (
                <Link href="/aitaas/solutions" key={a.name} className="hp-agent-row" style={{ textDecoration: "none" }}>
                  <div className="hp-agent-row-vertical">{a.vertical}</div>
                  <div className="hp-agent-row-name">{a.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE CALL VISUAL ────────────────────────────── */}
      <section className="c-sect hp-visual">
        <div className="c-wrap">
          <div className="hp-visual-inner">
            <Reveal>
              <h2 className="hp-visual-h">
                A call that qualifies,<br />
                books, and <em>delivers</em><br />
                — before it ends.
              </h2>
              <p className="hp-visual-body">
                Every inbound enquiry triggers a full workflow in parallel: the agent is speaking
                to the lead while simultaneously querying live inventory, dispatching a brochure
                to WhatsApp, and blocking a viewing slot on your calendar.
              </p>
              <Link href="/aitaas/contact" className="c-btn">
                See a live demo <IconArrowRight size={13} color="currentColor" />
              </Link>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="hp-call-card">
                <div className="hp-call-header">
                  <div className="hp-call-dot" />
                  <span className="hp-call-status">Live call · Property Sales Agent</span>
                  <span className="hp-call-timer">02:14</span>
                </div>
                <div className="hp-call-lines">
                  <div className="hp-call-line">
                    <span className="hp-call-speaker">Lead</span>
                    <div className="hp-call-bubble">Hi, I saw your ad for the Dubai Hills villa. What's the price?</div>
                  </div>
                  <div className="hp-call-line">
                    <span className="hp-call-speaker ai">Agent</span>
                    <div className="hp-call-bubble ai">Good afternoon! The Villa starts at AED 4.2M. We have two units available right now. Are you looking for a 4 or 5-bedroom?</div>
                  </div>
                  <div className="hp-call-line">
                    <span className="hp-call-speaker">Lead</span>
                    <div className="hp-call-bubble">Five bedroom. What's the payment plan?</div>
                  </div>
                  <div className="hp-call-line">
                    <span className="hp-call-speaker ai">Agent</span>
                    <div className="hp-call-bubble ai">I'm sending the full brochure and payment schedule to your WhatsApp now. Can we schedule a viewing for Saturday?</div>
                  </div>
                </div>
                <div className="hp-call-footer">
                  <div className="hp-call-badge"><div className="hp-call-badge-dot" />Brochure sent via WhatsApp</div>
                  <div className="hp-call-badge"><div className="hp-call-badge-dot" />Viewing slot held</div>
                  <div className="hp-call-badge"><div className="hp-call-badge-dot" />CRM updated</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section className="c-sect hp-how">
        <div className="c-wrap">
          <Reveal>
            <h2 className="hp-how-h">
              One call triggers<br />
              <em>parallel intelligence.</em>
            </h2>
          </Reveal>
          <div className="hp-steps-row">
            {[
              {
                label: "Front Agent",
                name: "Lead Connects",
                body: "A voice or chat agent handles the interaction in the lead's language. Human-quality voice, on-brand, from the first word.",
              },
              {
                label: "Master Orchestrator",
                name: "Intelligence Routes",
                body: "Our orchestration layer decomposes the conversation into parallel tasks — calendar, documents, CRM, payments — and dispatches them simultaneously.",
              },
              {
                label: "Sub-Agents",
                name: "Actions Complete",
                body: "Calendar bookings, WhatsApp messages, property brochures, payment links, and lead scores are all delivered before the call ends.",
              },
            ].map((s, i) => (
              <Reveal key={s.name} delay={i * 0.08} className="hp-step">
                <div className="hp-step-label">{s.label}</div>
                <div className="hp-step-name">{s.name}</div>
                <p className="hp-step-body">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ──────────────────────────────────── */}
      <section className="c-sect">
        <div className="c-wrap">
          <Reveal>
            <div className="hp-ind-h">Industries Served</div>
          </Reveal>
          <div className="hp-ind-list">
            {INDUSTRIES.map((ind, i) => (
              <Reveal key={ind} delay={i * 0.04}>
                <Link href="/aitaas/solutions" className="hp-ind-row">
                  <span className="hp-ind-name">{ind}</span>
                  <span className="hp-ind-arrow"><IconArrowRight size={20} color="currentColor" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS STRIP ───────────────────────────────── */}
      <section className="hp-results">
        <div className="hp-results-grid">
          {[
            { val: 92, suffix: "%+", label: "Intent accuracy", sub: "First-attempt recognition" },
            { val: 1, suffix: ".5s", label: "Response latency", sub: "p95 target" },
            { val: 35, suffix: "%+", label: "Appointment rate", sub: "From qualified conversations" },
            { val: 7,  suffix: "",  label: "Projects live", sub: "Across UAE verticals" },
          ].map((r) => (
            <Reveal key={r.label} className="hp-result-cell">
              <div className="hp-result-num"><Count to={r.val} suffix={r.suffix} /></div>
              <div className="hp-result-label">{r.label}</div>
              <div className="hp-result-sub">{r.sub}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────── */}
      <section className="c-sect">
        <div className="c-wrap">
          <div className="hp-price-intro">
            <Reveal>
              <h2 className="hp-price-h">
                Replace a hire.<br />
                <em>Starting at AED 2,500.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="hp-price-desc">
                Three monthly tiers. A revenue-share model for real estate and automotive
                where you pay only on closed deals. A performance model for digital media.
                No setup fees on the platform.
              </p>
            </Reveal>
          </div>

          <div className="hp-price-cols">
            {[
              {
                tier: "Essential", amount: "AED 2,500", cadence: "per month", featured: false,
                features: ["1 AI agent", "Up to 3 sub-agents", "English + 1 language", "WhatsApp + Calendar", "Monthly report"],
              },
              {
                tier: "Professional", amount: "AED 5,000", cadence: "per month", featured: true,
                features: ["Up to 3 AI agents", "Full sub-agent library", "3 languages", "Full integration suite", "Weekly dashboard", "Dedicated onboarding"],
              },
              {
                tier: "Enterprise", amount: "AED 7,500", cadence: "per month", featured: false,
                features: ["Unlimited agents", "All 9 products", "All 7 languages", "Custom integrations", "Account manager", "SLA guarantee"],
              },
            ].map((p) => (
              <Reveal key={p.tier} className={`hp-price-col${p.featured ? " hp-price-featured" : ""}`}>
                <div className="hp-price-tier">{p.tier}</div>
                <div className="hp-price-amount">{p.amount}</div>
                <div className="hp-price-cadence">{p.cadence}</div>
                <div className="hp-price-features">
                  {p.features.map((f) => (
                    <div className="hp-price-feat" key={f}>
                      <span className="hp-price-check"><IconCheck size={13} color="currentColor" /></span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/aitaas/pricing" className="c-btn c-btn--ghost">
              Full pricing breakdown <IconArrowRight size={13} color="currentColor" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────── */}
      <section className="c-sect hp-cta-sect">
        <div className="c-wrap">
          <div className="hp-cta-inner">
            <Reveal>
              <h2 className="hp-cta-h">
                The first cohort<br />
                is limited.<br />
                <em>Apply now.</em>
              </h2>
              <p className="hp-cta-body">
                We onboard a small number of clients per vertical to ensure quality.
                Early clients shape the product and lock in founding-tier pricing permanently.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/aitaas/contact" className="c-btn">Book a Discovery Call</Link>
                <Link href="/aitaas/pricing" className="c-btn c-btn--ghost">View Pricing</Link>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="hp-cta-facts">
                {[
                  { title: "Deployed in ~2 weeks", body: "From signed agreement to live agent. Not months, weeks." },
                  { title: "7 languages on day one", body: "Arabic, English, Hindi, Urdu, Russian, Mandarin, French. No retrofitting." },
                  { title: "Configuration, not code", body: "Your vertical is configured from a battle-tested platform, not rebuilt from scratch." },
                ].map((f) => (
                  <div className="hp-cta-fact" key={f.title}>
                    <span className="hp-cta-fact-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M5 8l2.5 2.5L11 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <div className="hp-cta-fact-title">{f.title}</div>
                      <div className="hp-cta-fact-body">{f.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
