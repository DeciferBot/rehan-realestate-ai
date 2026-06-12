"use client";

import { motion, useInView, useMotionValue, useTransform, animate, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import Link from "next/link";

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ── helpers ── */
function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: E, delay }}
    >{children}</motion.div>
  );
}

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.7, ease: E, delay }}
    >{children}</motion.div>
  );
}

function CountUp({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const val = useMotionValue(0);
  const display = useTransform(val, (v) => `${prefix}${Math.round(v)}${suffix}`);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  useEffect(() => {
    if (!inView) return;
    const c = animate(val, to, { duration: 1.6, ease: E });
    return () => c.stop();
  }, [inView]); // eslint-disable-line
  return <motion.span ref={ref}>{display}</motion.span>;
}

const PRODUCTS = [
  {
    num: "01",
    name: "Property Sales Agent",
    industry: "Real Estate",
    desc: "Calls inbound leads within 60 seconds, qualifies budget and preferences, delivers property brochures to WhatsApp mid-call, and books in-office viewings on your calendar.",
    stat: "78% win rate when first to respond",
  },
  {
    num: "02",
    name: "Revenue Recovery Agent",
    industry: "Finance & Collections",
    desc: "Parses aging receivables, generates personalised statements of account, and runs a 15-day collection cadence via voice and WhatsApp — with payment links delivered in-call.",
    stat: "Up to 3× faster collection cycles",
  },
  {
    num: "03",
    name: "Healthcare Booking Agent",
    industry: "Clinics & Healthcare",
    desc: "Handles inbound appointment calls for clinics and dental practices. Confirms availability, matches room and doctor, sends brochures, and books patients — 24/7.",
    stat: "Zero missed calls after hours",
  },
  {
    num: "04",
    name: "Cart Recovery Agent",
    industry: "Retail & E-commerce",
    desc: "Calls abandoned cart customers within minutes, addresses objections in their language, generates BNPL payment links, and bridges to WhatsApp for seamless follow-up.",
    stat: "Reaches buyers before they're gone",
  },
  {
    num: "05",
    name: "Admissions Agent",
    industry: "Education",
    desc: "Matches prospects to the right programme, scores scholarship eligibility, answers FAQs in 7 languages, and books campus tours — turning enquiries into enrolments.",
    stat: "35%+ appointment conversion target",
  },
  {
    num: "06",
    name: "Social Media Executive",
    industry: "Marketing & Media",
    desc: "Creates, schedules, and publishes content across platforms autonomously. Writes copy, generates images and video, and optimises performance — daily, weekly, monthly.",
    stat: "24/7 autonomous content operations",
  },
];

const INDUSTRIES = [
  { name: "Real Estate", icon: "◈", desc: "Lead qualification, brochure delivery, viewing bookings. Revenue share model available — you pay only when deals close." },
  { name: "Healthcare", icon: "◉", desc: "Appointment booking, reminder calls, post-visit follow-up. Multilingual support for international patient bases." },
  { name: "Retail & E-commerce", icon: "◇", desc: "Cart recovery, loyalty outreach, abandoned browse campaigns. BNPL link generation mid-call." },
  { name: "Education", icon: "◎", desc: "Admissions qualification, scholarship scoring, campus tour booking. Arabic, Hindi, Urdu, English." },
  { name: "Enterprise", icon: "◈", desc: "Inbound qualification, proposal generation, executive approval flows. Multilingual outbound sales fleet in 7 languages." },
];

const METRICS = [
  { val: 9, suffix: "", label: "Agent products" },
  { val: 7, suffix: "", label: "Languages supported" },
  { val: 92, suffix: "%+", label: "Intent accuracy" },
  { val: 60, suffix: "%+", label: "Contact rate target" },
];

export default function AitaasHome() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gX = useSpring(mouseX, { stiffness: 35, damping: 25 });
  const gY = useSpring(mouseY, { stiffness: 35, damping: 25 });

  return (
    <>
      <style>{`
        /* ── hero ── */
        .ah-hero {
          min-height: 100svh; display: flex; flex-direction: column;
          justify-content: flex-end;
          padding: 0 clamp(20px, 6vw, 88px) clamp(64px, 8vh, 100px);
          position: relative; overflow: hidden;
        }
        .ah-hero-inner { position: relative; z-index: 2; max-width: 1100px; }
        .ah-hero-glow {
          position: absolute; width: 800px; height: 800px;
          left: -250px; top: -200px; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, oklch(0.75 0.145 88 / 0.10) 0%, transparent 65%);
          filter: blur(60px);
        }
        .ah-hero-glow2 {
          position: absolute; width: 500px; height: 500px;
          right: 5%; bottom: 10%; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, oklch(0.50 0.100 255 / 0.08) 0%, transparent 65%);
          filter: blur(80px);
          animation: glowFloat 14s ease-in-out infinite;
        }
        @keyframes glowFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.07); }
        }
        .ah-eyebrow {
          display: flex; align-items: center; gap: 12px; margin-bottom: 36px;
          flex-wrap: wrap;
        }
        .ah-eyebrow-tag {
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--a-amber); border: 1px solid var(--a-amber-dim);
          padding: 4px 12px; font-family: 'DM Sans', sans-serif; font-weight: 500;
        }
        .ah-eyebrow-sep { color: var(--a-border); }
        .ah-eyebrow-text {
          font-size: 11px; color: var(--a-muted); letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .ah-h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(3rem, 7.5vw, 6rem);
          font-weight: 400; line-height: 1.0; letter-spacing: -0.03em;
          color: var(--a-ink); margin-bottom: 36px;
          text-wrap: balance; max-width: 820px;
        }
        .ah-h1 em { font-style: italic; color: var(--a-amber); }
        .ah-body {
          font-size: clamp(15px, 1.8vw, 17px); line-height: 1.75;
          color: var(--a-ink-2); max-width: 560px; margin-bottom: 48px;
        }
        .ah-ctas { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 72px; }
        .ah-metrics {
          display: flex; border-top: 1px solid var(--a-border); flex-wrap: wrap;
        }
        .ah-metric {
          display: flex; flex-direction: column; padding: 24px 40px 24px 0;
          gap: 6px; flex-shrink: 0;
        }
        .ah-metric:not(:last-child) { border-right: 1px solid var(--a-border); margin-right: 40px; }
        .ah-metric-num {
          font-family: 'DM Serif Display', serif;
          font-size: 2.4rem; font-weight: 400; color: var(--a-amber); line-height: 1;
        }
        .ah-metric-label { font-size: 11px; color: var(--a-muted); letter-spacing: 0.05em; }

        /* ── ticker ── */
        .ah-ticker {
          background: var(--a-surface); border-top: 1px solid var(--a-border);
          border-bottom: 1px solid var(--a-border);
          padding: 14px 0; overflow: hidden; position: relative;
        }
        .ah-ticker-track {
          display: flex; gap: 0; white-space: nowrap;
          animation: tickerScroll 28s linear infinite;
        }
        .ah-ticker-track:hover { animation-play-state: paused; }
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ah-ticker-item {
          display: inline-flex; align-items: center; gap: 16px;
          padding: 0 40px; font-size: 12px; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--a-muted); flex-shrink: 0;
        }
        .ah-ticker-dot { color: var(--a-amber); font-size: 8px; }

        /* ── problem ── */
        .ah-problem { background: var(--a-surface); border-top: 1px solid var(--a-border); }
        .ah-problem-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start;
        }
        .ah-problem-label {
          font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--a-muted); margin-bottom: 24px;
        }
        .ah-problem-head {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 400; line-height: 1.15; letter-spacing: -0.025em;
          color: var(--a-ink); text-wrap: balance;
        }
        .ah-problem-head em { font-style: italic; color: var(--a-amber); }
        .ah-problem-body { font-size: 15px; line-height: 1.8; color: var(--a-ink-2); margin-top: 24px; max-width: 50ch; }
        .ah-compare { display: flex; flex-direction: column; gap: 0; border: 1px solid var(--a-border); }
        .ah-compare-row {
          display: grid; grid-template-columns: 1fr 1px 1fr;
          border-bottom: 1px solid var(--a-border);
        }
        .ah-compare-row:last-child { border-bottom: none; }
        .ah-compare-cell {
          padding: 18px 20px; font-size: 13px; line-height: 1.5;
        }
        .ah-compare-cell.old { color: var(--a-muted); }
        .ah-compare-cell.new { color: var(--a-ink); }
        .ah-compare-div { width: 1px; background: var(--a-border); }
        .ah-compare-head {
          display: grid; grid-template-columns: 1fr 1px 1fr;
          background: var(--a-surface2); border-bottom: 1px solid var(--a-border);
        }
        .ah-compare-head-cell {
          padding: 12px 20px; font-size: 10px; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--a-muted); font-weight: 500;
        }
        .ah-compare-head-cell.new-h { color: var(--a-amber); }

        /* ── how it works ── */
        .ah-how-label {
          font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--a-muted); margin-bottom: 20px;
        }
        .ah-how-head {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 400; line-height: 1.1; letter-spacing: -0.025em;
          color: var(--a-ink); max-width: 600px; text-wrap: balance; margin-bottom: 64px;
        }
        .ah-how-head em { font-style: italic; color: var(--a-amber); }
        .ah-steps {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--a-border);
          border: 1px solid var(--a-border); position: relative;
        }
        .ah-step {
          background: var(--a-bg); padding: clamp(28px, 4vw, 48px);
          position: relative;
        }
        .ah-step-num {
          font-family: 'DM Serif Display', serif;
          font-size: 3.5rem; font-weight: 400; line-height: 1;
          color: oklch(0.14 0.007 255); letter-spacing: -0.02em;
          margin-bottom: 24px; user-select: none;
        }
        .ah-step-tag {
          font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--a-amber); margin-bottom: 14px;
        }
        .ah-step-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem; font-weight: 400; letter-spacing: -0.015em;
          color: var(--a-ink); margin-bottom: 12px;
        }
        .ah-step-body { font-size: 14px; line-height: 1.75; color: var(--a-muted); max-width: 38ch; }
        .ah-step-arrow {
          position: absolute; right: -13px; top: 50%;
          transform: translateY(-50%);
          z-index: 2; color: var(--a-amber); font-size: 20px;
          display: none;
        }

        /* ── products ── */
        .ah-prod-section { background: var(--a-surface); border-top: 1px solid var(--a-border); }
        .ah-prod-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 56px; flex-wrap: wrap; gap: 24px;
        }
        .ah-prod-head {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 400; line-height: 1.1; letter-spacing: -0.025em;
          color: var(--a-ink); max-width: 480px; text-wrap: balance;
        }
        .ah-prod-head em { font-style: italic; color: var(--a-amber); }
        .ah-prod-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--a-border); border: 1px solid var(--a-border);
        }
        .ah-prod-card {
          background: var(--a-bg); padding: clamp(24px, 3.5vw, 40px);
          transition: background 0.22s;
        }
        @media (hover: hover) and (pointer: fine) {
          .ah-prod-card:hover { background: oklch(0.09 0.008 255); }
        }
        .ah-prod-num {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--a-amber); margin-bottom: 8px;
        }
        .ah-prod-industry {
          font-size: 10px; letter-spacing: 0.10em; text-transform: uppercase;
          color: var(--a-muted); margin-bottom: 16px;
        }
        .ah-prod-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.45rem; font-weight: 400; color: var(--a-ink);
          letter-spacing: -0.015em; margin-bottom: 12px; line-height: 1.2;
        }
        .ah-prod-body { font-size: 13px; line-height: 1.75; color: var(--a-muted); max-width: 38ch; margin-bottom: 20px; }
        .ah-prod-stat {
          font-size: 11px; color: var(--a-amber); letter-spacing: 0.04em;
          border-top: 1px solid var(--a-border); padding-top: 16px; margin-top: auto;
        }

        /* ── industries ── */
        .ah-ind-head {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 400; line-height: 1.1; letter-spacing: -0.025em;
          color: var(--a-ink); margin-bottom: 56px; text-wrap: balance; max-width: 500px;
        }
        .ah-ind-head em { font-style: italic; color: var(--a-amber); }
        .ah-ind-list { display: flex; flex-direction: column; }
        .ah-ind-row {
          display: grid; grid-template-columns: 48px 1fr auto;
          align-items: center; gap: 28px;
          padding: 28px 0; border-bottom: 1px solid var(--a-border);
          transition: background 0.18s; position: relative;
          cursor: default;
        }
        .ah-ind-row:first-child { border-top: 1px solid var(--a-border); }
        .ah-ind-icon {
          font-size: 22px; color: var(--a-amber); text-align: center;
          font-weight: 300; line-height: 1; flex-shrink: 0;
        }
        .ah-ind-content { min-width: 0; }
        .ah-ind-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.2rem; color: var(--a-ink); letter-spacing: -0.01em;
          margin-bottom: 4px;
        }
        .ah-ind-desc { font-size: 13px; color: var(--a-muted); line-height: 1.6; max-width: 55ch; }
        .ah-ind-arrow { color: var(--a-border); font-size: 18px; flex-shrink: 0; transition: color 0.18s, transform 0.22s; }
        @media (hover: hover) and (pointer: fine) {
          .ah-ind-row:hover .ah-ind-arrow { color: var(--a-amber); transform: translateX(4px); }
          .ah-ind-row:hover .ah-ind-name { color: var(--a-amber); }
        }

        /* ── trust ── */
        .ah-trust { background: var(--a-surface); border-top: 1px solid var(--a-border); border-bottom: 1px solid var(--a-border); }
        .ah-trust-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px; background: var(--a-border); border: 1px solid var(--a-border);
        }
        .ah-trust-card {
          background: var(--a-bg); padding: clamp(28px, 4vw, 48px);
          display: flex; flex-direction: column; gap: 8px;
        }
        .ah-trust-num {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 400; color: var(--a-amber); line-height: 1;
        }
        .ah-trust-label { font-size: 13px; color: var(--a-ink-2); line-height: 1.5; max-width: 18ch; }
        .ah-trust-sub { font-size: 12px; color: var(--a-muted); margin-top: 4px; }

        /* ── pricing teaser ── */
        .ah-price-head {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 400; line-height: 1.1; letter-spacing: -0.025em;
          color: var(--a-ink); margin-bottom: 16px; text-wrap: balance; max-width: 520px;
        }
        .ah-price-head em { font-style: italic; color: var(--a-amber); }
        .ah-price-sub { font-size: 15px; color: var(--a-ink-2); margin-bottom: 56px; max-width: 52ch; line-height: 1.7; }
        .ah-price-cards {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--a-border); border: 1px solid var(--a-border);
          margin-bottom: 48px;
        }
        .ah-price-card {
          background: var(--a-bg); padding: clamp(28px, 3.5vw, 44px);
        }
        .ah-price-card.featured { background: var(--a-surface); }
        .ah-price-tier {
          font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--a-muted); margin-bottom: 24px;
        }
        .ah-price-tier.featured-t { color: var(--a-amber); }
        .ah-price-amount {
          font-family: 'DM Serif Display', serif;
          font-size: 2.4rem; font-weight: 400; color: var(--a-ink);
          line-height: 1; letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .ah-price-cadence { font-size: 12px; color: var(--a-muted); margin-bottom: 28px; }
        .ah-price-features { display: flex; flex-direction: column; gap: 10px; }
        .ah-price-feature {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; color: var(--a-ink-2); line-height: 1.5;
        }
        .ah-price-check { color: var(--a-amber); flex-shrink: 0; font-size: 14px; }
        .ah-price-note {
          display: flex; gap: 40px; flex-wrap: wrap;
          padding: 28px 28px; border: 1px solid var(--a-border);
          background: var(--a-surface);
        }
        .ah-price-note-item { display: flex; flex-direction: column; gap: 4px; }
        .ah-price-note-label { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--a-amber); }
        .ah-price-note-val { font-size: 14px; color: var(--a-ink-2); line-height: 1.5; max-width: 32ch; }

        /* ── final cta ── */
        .ah-cta-section { border-top: 1px solid var(--a-border); }
        .ah-cta-inner {
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
          align-items: center;
        }
        .ah-cta-head {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 3.5vw, 3.2rem);
          font-weight: 400; line-height: 1.05; letter-spacing: -0.03em;
          color: var(--a-ink); text-wrap: balance;
        }
        .ah-cta-head em { font-style: italic; color: var(--a-amber); }
        .ah-cta-body { font-size: 14px; color: var(--a-muted); line-height: 1.75; margin-top: 20px; max-width: 44ch; }
        .ah-cta-right { display: flex; flex-direction: column; gap: 24px; }
        .ah-cta-feature {
          display: flex; align-items: flex-start; gap: 16px;
          padding-bottom: 20px; border-bottom: 1px solid var(--a-border);
        }
        .ah-cta-feature:last-child { border-bottom: none; padding-bottom: 0; }
        .ah-cta-feature-icon { color: var(--a-amber); font-size: 18px; flex-shrink: 0; margin-top: 2px; }
        .ah-cta-feature-title { font-size: 14px; font-weight: 500; color: var(--a-ink); margin-bottom: 4px; }
        .ah-cta-feature-desc { font-size: 13px; color: var(--a-muted); line-height: 1.6; }

        /* ── responsive ── */
        @media (max-width: 900px) {
          .ah-problem-grid, .ah-cta-inner { grid-template-columns: 1fr; gap: 40px; }
          .ah-steps { grid-template-columns: 1fr; }
          .ah-prod-grid { grid-template-columns: repeat(2, 1fr); }
          .ah-trust-grid { grid-template-columns: repeat(2, 1fr); }
          .ah-price-cards { grid-template-columns: 1fr; }
        }
        @media (max-width: 580px) {
          .ah-prod-grid { grid-template-columns: 1fr; }
          .ah-trust-grid { grid-template-columns: 1fr; }
          .ah-ctas { flex-direction: column; align-items: flex-start; }
          .ah-metrics { flex-direction: column; gap: 0; }
          .ah-metric { border-right: none !important; border-bottom: 1px solid var(--a-border); margin-right: 0 !important; padding: 16px 0 !important; }
          .ah-metric:last-child { border-bottom: none; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        className="ah-hero"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mouseX.set((e.clientX - r.left - r.width / 2) * 0.04);
          mouseY.set((e.clientY - r.top - r.height / 2) * 0.04);
        }}
      >
        <motion.div className="ah-hero-glow" style={{ x: gX, y: gY }} aria-hidden />
        <div className="ah-hero-glow2" aria-hidden />

        <div className="ah-hero-inner">
          <motion.div className="ah-eyebrow"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="ah-eyebrow-tag">AI Workers</span>
            <span className="ah-eyebrow-sep">·</span>
            <span className="ah-eyebrow-text">9 Products · 7 Languages · Deployed in 2 Weeks</span>
          </motion.div>

          <motion.h1 className="ah-h1"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: E, delay: 0.4 }}
          >
            Your Business<br />
            Running <em>24/7</em>.<br />
            Without Adding Headcount.
          </motion.h1>

          <motion.p className="ah-body"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: E, delay: 0.7 }}
          >
            AI-powered workers that call your leads, qualify prospects, collect payments, book appointments,
            and close pipeline — in 7 languages, in real time, around the clock.
          </motion.p>

          <motion.div className="ah-ctas"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: E, delay: 0.95 }}
          >
            <Link href="/aitaas/contact" className="a-btn">Book a Discovery Call</Link>
            <Link href="/aitaas/solutions" className="a-btn a-btn--ghost">Explore Products →</Link>
          </motion.div>

          <motion.div className="ah-metrics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.25 }}
          >
            {METRICS.map((m, i) => (
              <div className="ah-metric" key={m.label}>
                <span className="ah-metric-num">
                  <CountUp to={m.val} suffix={m.suffix} />
                </span>
                <span className="ah-metric-label">{m.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ah-ticker" aria-hidden>
        <div className="ah-ticker-track">
          {[...Array(2)].map((_, set) =>
            ["Real Estate", "Healthcare", "E-commerce", "Education", "Finance", "Automotive", "Enterprise Sales", "Social Media", "Property Investment"].map((item) => (
              <span key={`${set}-${item}`} className="ah-ticker-item">
                {item}<span className="ah-ticker-dot">◆</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── PROBLEM / SOLUTION ── */}
      <section className="a-section ah-problem">
        <div className="a-inner">
          <div className="ah-problem-grid">
            <FadeUp>
              <div className="ah-problem-label">The Problem</div>
              <h2 className="ah-problem-head">
                The best leads go cold<br />in <em>minutes.</em> Most businesses respond in hours.
              </h2>
              <p className="ah-problem-body">
                Every missed call, delayed response, or language barrier is a lost deal. Your team cannot
                be everywhere, at all times, in every language. The businesses winning today are the ones
                that removed that constraint entirely — by deploying AI workers that never sleep.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="ah-compare">
                <div className="ah-compare-head">
                  <div className="ah-compare-head-cell">The old model</div>
                  <div />
                  <div className="ah-compare-head-cell new-h">With AITaaS</div>
                </div>
                {[
                  ["Hours or days to respond", "Responds in 60 seconds"],
                  ["Works 9–5 in one language", "24/7 in 7 languages"],
                  ["Cost per hire, every time", "AED 2,500/month, all-in"],
                  ["Build from scratch each project", "Deploy in ~2 weeks"],
                  ["No recurring pipeline data", "Every call improves the next"],
                  ["Manual qualification", "Fully automated, scored"],
                ].map(([old, neu]) => (
                  <div className="ah-compare-row" key={old}>
                    <div className="ah-compare-cell old">{old}</div>
                    <div className="ah-compare-div" />
                    <div className="ah-compare-cell new">{neu}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="a-section">
        <div className="a-inner">
          <FadeUp>
            <div className="ah-how-label">How It Works</div>
            <h2 className="ah-how-head">
              One call. <em>Parallel intelligence.</em><br />Every action completed before it ends.
            </h2>
          </FadeUp>
          <div className="ah-steps">
            {[
              {
                num: "01",
                tag: "Front Agent",
                title: "Lead Interacts",
                body: "A voice agent or chat agent handles the interaction — qualifying, questioning, and building rapport. Human-quality voice in the lead's language from the first word.",
              },
              {
                num: "02",
                tag: "Master Orchestrator",
                title: "Intelligence Activates",
                body: "Our proprietary orchestration layer decomposes the conversation into parallel tasks — research, calendar, documents, payments — and dispatches them simultaneously.",
              },
              {
                num: "03",
                tag: "Sub-Agents",
                title: "Actions Complete",
                body: "Calendar bookings, WhatsApp messages, property brochures, payment links, and qualification scores are all delivered before the call ends. No human required.",
              },
            ].map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.1} className="ah-step">
                <div className="ah-step-num">{step.num}</div>
                <div className="ah-step-tag">{step.tag}</div>
                <h3 className="ah-step-title">{step.title}</h3>
                <p className="ah-step-body">{step.body}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="a-section ah-prod-section">
        <div className="a-inner">
          <div className="ah-prod-header">
            <FadeUp>
              <h2 className="ah-prod-head">
                <em>Nine</em> AI workers.<br />Ready to deploy.
              </h2>
            </FadeUp>
            <FadeIn delay={0.1}>
              <Link href="/aitaas/solutions" className="a-btn a-btn--ghost">View all solutions →</Link>
            </FadeIn>
          </div>
          <div className="ah-prod-grid">
            {PRODUCTS.map((p, i) => (
              <FadeUp key={p.num} delay={i * 0.06} className="ah-prod-card">
                <div className="ah-prod-num">{p.num}</div>
                <div className="ah-prod-industry">{p.industry}</div>
                <h3 className="ah-prod-name">{p.name}</h3>
                <p className="ah-prod-body">{p.desc}</p>
                <div className="ah-prod-stat">{p.stat}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section className="a-section">
        <div className="a-inner">
          <FadeUp>
            <h2 className="ah-ind-head">
              Built for the industries where speed and language decide the deal.
            </h2>
          </FadeUp>
          <div className="ah-ind-list">
            {INDUSTRIES.map((ind, i) => (
              <FadeUp key={ind.name} delay={i * 0.06}>
                <Link href="/aitaas/solutions" style={{ textDecoration: "none" }}>
                  <div className="ah-ind-row">
                    <div className="ah-ind-icon">{ind.icon}</div>
                    <div className="ah-ind-content">
                      <div className="ah-ind-name">{ind.name}</div>
                      <div className="ah-ind-desc">{ind.desc}</div>
                    </div>
                    <div className="ah-ind-arrow">→</div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST METRICS ── */}
      <section className="a-section ah-trust">
        <div className="a-inner">
          <div className="ah-trust-grid">
            {[
              { val: 7, suffix: "", label: "Projects deployed", sub: "Across UAE verticals" },
              { val: 92, suffix: "%+", label: "Intent accuracy", sub: "First-attempt recognition" },
              { val: 1.5, suffix: "s", label: "Response latency", sub: "p95 target (< 1.5 seconds)" },
              { val: 35, suffix: "%+", label: "Appointment rate", sub: "From qualified conversations" },
            ].map((m) => (
              <FadeIn key={m.label} className="ah-trust-card">
                <div className="ah-trust-num">
                  <CountUp to={m.val} suffix={m.suffix} />
                </div>
                <div className="ah-trust-label">{m.label}</div>
                <div className="ah-trust-sub">{m.sub}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section className="a-section">
        <div className="a-inner">
          <FadeUp>
            <h2 className="ah-price-head">
              Replace a hire with an <em>AI worker.</em><br />Starting at AED 2,500 / month.
            </h2>
            <p className="ah-price-sub">
              Three subscription tiers. A revenue-share model for real estate and automotive.
              A performance model for digital media. No setup fees on the platform.
            </p>
          </FadeUp>
          <div className="ah-price-cards">
            {[
              {
                tier: "Essential", amount: "AED 2,500", cadence: "per month",
                features: ["1 AI agent deployed", "Up to 3 sub-agents active", "English + 1 additional language", "WhatsApp + Calendar integration", "Monthly KPI report"],
              },
              {
                tier: "Professional", amount: "AED 5,000", cadence: "per month", featured: true,
                features: ["Up to 3 AI agents", "Full sub-agent library", "3 languages supported", "Full integration suite", "Weekly performance dashboard", "Dedicated onboarding"],
              },
              {
                tier: "Enterprise", amount: "AED 7,500", cadence: "per month",
                features: ["Unlimited AI agents", "All 9 products available", "All 7 languages", "Custom integrations", "Dedicated account manager", "SLA guarantee"],
              },
            ].map((p) => (
              <FadeUp key={p.tier} className={`ah-price-card${p.featured ? " featured" : ""}`}>
                <div className={`ah-price-tier${p.featured ? " featured-t" : ""}`}>{p.tier}</div>
                <div className="ah-price-amount">{p.amount}</div>
                <div className="ah-price-cadence">{p.cadence}</div>
                <div className="ah-price-features">
                  {p.features.map((f) => (
                    <div key={f} className="ah-price-feature">
                      <span className="ah-price-check">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeIn delay={0.1}>
            <div className="ah-price-note">
              <div className="ah-price-note-item">
                <div className="ah-price-note-label">Revenue Share</div>
                <div className="ah-price-note-val">Deploy free. ENG takes 2.5% of closed deal value. Real estate and automotive.</div>
              </div>
              <div className="ah-price-note-item">
                <div className="ah-price-note-label">Performance Model</div>
                <div className="ah-price-note-val">15% of documented savings vs current spend. Proven via A/B test first.</div>
              </div>
              <div className="ah-price-note-item">
                <div className="ah-price-note-label">Full Pricing</div>
                <div className="ah-price-note-val"><Link href="/aitaas/pricing" style={{ color: "var(--a-amber)", textDecoration: "none" }}>View detailed pricing and models →</Link></div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="a-section ah-cta-section">
        <div className="a-inner">
          <div className="ah-cta-inner">
            <FadeUp>
              <h2 className="ah-cta-head">
                The first cohort is limited.<br /><em>Apply now.</em>
              </h2>
              <p className="ah-cta-body">
                We onboard a small number of clients per vertical to ensure quality.
                Early clients shape the product and lock in founding-tier pricing permanently.
              </p>
              <div style={{ marginTop: "36px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link href="/aitaas/contact" className="a-btn">Book a Discovery Call</Link>
                <Link href="/aitaas/pricing" className="a-btn a-btn--ghost">View Pricing</Link>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="ah-cta-right">
                {[
                  { icon: "◎", title: "Deployed in ~2 weeks", desc: "From signed agreement to live agent. Not months — weeks." },
                  { icon: "◉", title: "7 languages on day one", desc: "Arabic, English, Hindi, Urdu, and more. No retrofitting." },
                  { icon: "◈", title: "Configuration, not code", desc: "Your industry vertical is configured from a battle-tested platform — not rebuilt from scratch." },
                ].map((f) => (
                  <div key={f.title} className="ah-cta-feature">
                    <div className="ah-cta-feature-icon">{f.icon}</div>
                    <div>
                      <div className="ah-cta-feature-title">{f.title}</div>
                      <div className="ah-cta-feature-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}
