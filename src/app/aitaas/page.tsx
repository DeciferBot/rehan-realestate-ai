"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { IconArrowRight, IconCheck } from "@/components/AitaasIcons";

const AitaasCanvas = dynamic(() => import("@/components/AitaasCanvas"), { ssr: false });
const AitaasCallDemo = dynamic(() => import("@/components/AitaasCallDemo"), { ssr: false });
const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 1, y: 24 }}
      animate={inView ? { y: 0 } : { y: 24 }}
      transition={{ duration: 0.6, ease: E, delay }}
    >{children}</motion.div>
  );
}

function ImgWithFallback({
  src, alt, className, style, srcSet, sizes, eager = false,
}: {
  src: string; alt: string; className?: string; style?: React.CSSProperties;
  srcSet?: string; sizes?: string; eager?: boolean;
}) {
  const [loaded, setLoaded] = useState(true);
  if (!loaded) return null;
  return (
    <img
      src={src} alt={alt} className={className} style={style}
      srcSet={srcSet} sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      onError={() => setLoaded(false)}
    />
  );
}

const AGENTS = [
  { name: "Property Sales Agent", vertical: "Real Estate", proof: "Speaks Arabic, English, Russian, Hindi, and Mandarin" },
  { name: "Revenue Recovery Agent", vertical: "Finance", proof: "Chases overdue invoices politely, relentlessly, in four languages" },
  { name: "Healthcare Booking Agent", vertical: "Clinics", proof: "Fills the diary while reception is closed" },
  { name: "Cart Recovery Agent", vertical: "E-commerce", proof: "Wins back abandoned carts over WhatsApp" },
  { name: "Admissions Agent", vertical: "Education", proof: "Turns programme enquiries into campus tours" },
  { name: "Social Media Executive", vertical: "Marketing", proof: "Replies to every DM and comment, around the clock" },
];

const INDUSTRIES = ["Real Estate", "Healthcare", "Retail", "Education", "Finance", "Automotive", "Enterprise"];

const INTEGRATIONS = [
  "WhatsApp", "Salesforce", "Google Calendar", "HubSpot",
  "Property Finder", "Bayut", "Twilio", "Zapier", "Zoho CRM",
];

const PILOT_STEPS = [
  {
    day: "Day 0",
    name: "Discovery",
    body: "A 30-minute call. We map your sales process, scripts, inventory sources, and where leads currently fall through.",
  },
  {
    day: "Days 1–3",
    name: "Build",
    body: "Your agent is configured on your listings, calendar, and CRM. You hear the voice and approve every script before it speaks to a customer.",
  },
  {
    day: "Days 4–14",
    name: "Live",
    body: "The agent answers your real enquiries. Every recording and transcript reaches you as it happens, so nothing runs unseen.",
  },
  {
    day: "Day 14",
    name: "Decision",
    body: "You get the full report: every call, booking, and outcome. Keep all of it whether you continue or not.",
  },
];

const FAQS = [
  {
    q: "What happens when a caller asks something the agent can't answer?",
    a: "It escalates to your team with the full transcript and context attached, and the lead is flagged in your CRM. The customer is never left at a dead end, and your staff never start a conversation blind.",
  },
  {
    q: "Which languages does it actually speak?",
    a: "Arabic and English are standard on every agent. Hindi, Urdu, Russian, French, Mandarin, and Tagalog are available per agent depending on your market. The Essential tier covers English plus one language, Professional covers three, and Enterprise covers all of them.",
  },
  {
    q: "Do we have to replace our CRM or phone system?",
    a: "No. The agents connect to your existing stack from day one: WhatsApp, Salesforce, HubSpot, Zoho, Google Calendar, Property Finder, Bayut, Twilio, and Zapier for everything else.",
  },
  {
    q: "Who owns the recordings, transcripts, and leads?",
    a: "You do, unconditionally. Every lead, booking, recording, and transcript generated during the pilot or a paid plan belongs to you, including if you walk away on day 14.",
  },
  {
    q: "How long until we're live?",
    a: "Fourteen days from contract to first call, and the free pilot follows the same timeline on your real enquiries. Most of that window is us configuring scripts and integrations to your approval, not you doing work.",
  },
  {
    q: "What does it cost to try?",
    a: "Nothing. The 14-day pilot is free with no setup fees. After that, plans start at AED 2,500 per month, or a revenue-share model where you pay only on results.",
  },
];

function FaqList() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="hp-faq-list">
      {FAQS.map((f, i) => (
        <div key={f.q} className={`hp-faq-item${open === i ? " open" : ""}`}>
          <button
            className="hp-faq-q"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            {f.q}
            <span className="hp-faq-q-icon" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </button>
          <div className="hp-faq-a" style={{ maxHeight: open === i ? 480 : 0, opacity: open === i ? 1 : 0 }}>
            <div className="hp-faq-a-inner">{f.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AitaasHome() {
  return (
    <>
      <style>{`
        /* ─── HERO ─────────────────────────────────────────── */
        .hp-hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hp-hero-bg {
          position: absolute; inset: 0;
          background: oklch(0.04 0.008 260);
          z-index: 0;
        }
        .hp-hero-photo {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center 30%;
          z-index: 1;
          opacity: 0.22;
          filter: saturate(0.3) brightness(0.65);
        }
        .hp-hero-overlay {
          position: absolute; inset: 0; z-index: 2;
          background:
            linear-gradient(to top, oklch(0.04 0.008 260) 0%, oklch(0.04 0.008 260 / 0.45) 45%, transparent 100%),
            linear-gradient(to right, oklch(0.04 0.008 260 / 0.9) 0%, oklch(0.04 0.008 260 / 0.3) 55%, transparent 100%);
        }
        .hp-hero-inner {
          position: relative; z-index: 4;
          width: 100%; max-width: 1320px; margin: 0 auto;
          padding: clamp(110px, 15vh, 170px) clamp(20px, 5vw, 72px) clamp(56px, 8vh, 96px);
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: clamp(40px, 6vw, 96px);
          align-items: center;
        }
        .hp-hero-demo { justify-self: end; width: 100%; display: flex; justify-content: flex-end; }

        .hp-tag {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--c-copper); margin-bottom: 28px;
        }
        .hp-tag::before {
          content: ''; display: block; width: 24px; height: 1px;
          background: var(--c-copper);
        }
        .hp-h1 {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; text-transform: uppercase;
          font-size: clamp(3.4rem, 6vw, 6rem);
          line-height: 0.94; letter-spacing: -0.02em;
          color: var(--c-ink); margin-bottom: 28px;
        }
        .hp-h1 em { font-style: normal; color: var(--c-copper); }

        /* Masked line reveal */
        .hp-line { display: block; overflow: hidden; padding-bottom: 0.06em; margin-bottom: -0.06em; }
        .hp-line-inner {
          display: inline-block;
          transform: translateY(112%);
          animation: hp-line-up 0.85s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @keyframes hp-line-up { to { transform: translateY(0); } }

        /* Rise-in for secondary content */
        .hp-rise {
          opacity: 0; transform: translateY(16px);
          animation: hp-rise-in 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @keyframes hp-rise-in { to { opacity: 1; transform: translateY(0); } }

        .hp-demo-in {
          opacity: 0; transform: translateY(28px);
          animation: hp-rise-in 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.55s forwards;
        }

        .hp-sub {
          font-size: clamp(15px, 1.6vw, 17px); line-height: 1.7;
          color: var(--c-ink-2); max-width: 42ch; margin-bottom: 36px;
        }
        .hp-ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 44px; }

        /* Inline proof row */
        .hp-proof {
          display: flex; align-items: center; gap: clamp(24px, 3vw, 40px);
          flex-wrap: wrap;
        }
        .hp-proof-item { display: flex; flex-direction: column; gap: 3px; }
        .hp-proof-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: clamp(1.6rem, 2.2vw, 2.1rem);
          letter-spacing: -0.01em; color: var(--c-ink); line-height: 1;
        }
        .hp-proof-num em { font-style: normal; color: var(--c-copper); }
        .hp-proof-label {
          font-size: 10.5px; font-weight: 500; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--c-muted);
        }
        .hp-proof-sep {
          width: 1px; height: 32px; background: var(--c-border);
          flex-shrink: 0;
        }

        @media (max-width: 1020px) {
          .hp-hero-inner { grid-template-columns: minmax(0, 1fr); gap: 56px; }
          .hp-hero-demo { justify-self: stretch; justify-content: center; }
        }
        @media (max-width: 860px) {
          .hp-h1 { font-size: clamp(3rem, 10vw, 5rem); }
          .hp-hero-inner {
            padding-top: clamp(96px, 14vh, 130px);
            padding-bottom: clamp(40px, 6vh, 64px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hp-line-inner, .hp-rise, .hp-demo-in {
            animation: none; opacity: 1; transform: none;
          }
        }

        /* ─── PROBLEM ───────────────────────────────────────── */
        .hp-problem {
          background: var(--c-bg);
          border-bottom: 1px solid var(--c-border);
          padding: clamp(80px, 12vw, 140px) 0;
          position: relative; overflow: hidden;
        }
        .hp-problem-bg-num {
          position: absolute; right: -0.02em; top: 50%; transform: translateY(-50%);
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: clamp(14rem, 28vw, 28rem);
          line-height: 1; letter-spacing: -0.04em;
          color: oklch(0.10 0.008 260); pointer-events: none; user-select: none;
          text-transform: uppercase;
        }
        .hp-problem-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: clamp(48px, 8vw, 120px);
          align-items: center; position: relative; z-index: 1;
        }
        .hp-problem-left {}
        .hp-problem-kicker {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--c-copper); margin-bottom: 24px;
        }
        .hp-problem-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2.4rem, 4vw, 4.2rem);
          letter-spacing: -0.015em; line-height: 0.95; color: var(--c-ink);
          margin-bottom: 24px; text-wrap: balance;
        }
        .hp-problem-h em { color: var(--c-copper); font-style: normal; }
        .hp-problem-body {
          font-size: 16px; line-height: 1.75; color: var(--c-ink-2);
          max-width: 46ch;
        }
        .hp-problem-photo {
          position: relative; border: 1px solid var(--c-border);
          overflow: hidden; aspect-ratio: 4/3;
        }
        .hp-problem-photo img {
          width: 100%; height: 100%; object-fit: cover;
          filter: saturate(0.4) brightness(0.75);
        }
        .hp-problem-photo-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, oklch(0.72 0.17 34 / 0.15) 0%, transparent 60%);
        }
        .hp-problem-photo-stat {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 24px 28px;
          background: linear-gradient(to top, oklch(0.04 0.008 260 / 0.95) 0%, transparent 100%);
        }
        .hp-problem-stat-num {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          font-size: 4rem; letter-spacing: -0.02em; color: var(--c-copper);
          line-height: 1;
        }
        .hp-problem-stat-label {
          font-size: 13px; color: var(--c-ink-2); margin-top: 4px;
        }
        @media (max-width: 860px) {
          .hp-problem-grid { grid-template-columns: 1fr; }
          .hp-problem-bg-num { display: none; }
        }

        /* ─── CALL DEMO ─────────────────────────────────────── */
        .hp-demo {
          background: var(--c-surface);
          border-bottom: 1px solid var(--c-border);
          padding: clamp(80px, 12vw, 140px) 0;
        }
        .hp-demo-inner {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: clamp(48px, 8vw, 96px); align-items: center;
        }
        .hp-demo-kicker {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--c-copper); margin-bottom: 24px;
        }
        .hp-demo-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2.4rem, 4vw, 4rem);
          letter-spacing: -0.015em; line-height: 0.95; color: var(--c-ink);
          margin-bottom: 20px; text-wrap: balance;
        }
        .hp-demo-h em { color: var(--c-copper); font-style: normal; }
        .hp-demo-body {
          font-size: 16px; line-height: 1.75; color: var(--c-ink-2);
          max-width: 44ch; margin-bottom: 36px;
        }
        .hp-demo-facts { display: flex; flex-direction: column; gap: 0; }
        .hp-demo-fact {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px 0; border-top: 1px solid var(--c-border);
        }
        .hp-demo-fact:last-child { border-bottom: 1px solid var(--c-border); }
        .hp-demo-fact-icon { color: var(--c-copper); margin-top: 2px; flex-shrink: 0; }
        .hp-demo-fact-text { font-size: 14px; color: var(--c-ink-2); line-height: 1.5; }
        /* Phone UI */
        .hp-phone {
          background: oklch(0.06 0.01 260);
          border: 1px solid var(--c-border);
          border-radius: 0;
          overflow: hidden;
          box-shadow: 0 32px 80px -20px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(0.72 0.17 34 / 0.12);
        }
        .hp-phone-topbar {
          padding: 14px 20px;
          background: oklch(0.10 0.012 260);
          border-bottom: 1px solid var(--c-border);
          display: flex; align-items: center; gap: 12px;
        }
        .hp-phone-dots { display: flex; gap: 5px; }
        .hp-phone-dot { width: 8px; height: 8px; border-radius: 50%; }
        .hp-phone-live {
          margin-left: auto;
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: oklch(0.72 0.17 34);
        }
        .hp-phone-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: oklch(0.72 0.17 34);
          animation: blink 1.6s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .hp-phone-meta {
          padding: 16px 20px;
          background: oklch(0.08 0.01 260);
          border-bottom: 1px solid var(--c-border);
          display: flex; align-items: center; gap: 12px;
        }
        .hp-phone-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: oklch(0.72 0.17 34 / 0.2);
          border: 1px solid oklch(0.72 0.17 34 / 0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: oklch(0.72 0.17 34);
          font-family: 'Barlow Condensed', sans-serif; letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        .hp-phone-caller { flex: 1; }
        .hp-phone-caller-name { font-size: 13px; font-weight: 600; color: var(--c-ink); }
        .hp-phone-caller-sub { font-size: 11px; color: var(--c-muted); margin-top: 1px; }
        .hp-phone-timer {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px; font-weight: 700; letter-spacing: 0.06em;
          color: var(--c-copper);
        }
        .hp-phone-chat {
          padding: 20px;
          display: flex; flex-direction: column; gap: 14px;
          min-height: 260px;
        }
        .hp-phone-msg { display: flex; gap: 10px; align-items: flex-start; }
        .hp-phone-msg.agent { flex-direction: row-reverse; }
        .hp-phone-msg-av {
          width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
          background: oklch(0.14 0.007 260);
          display: flex; align-items: center; justify-content: center;
          font-size: 8px; font-weight: 700; color: var(--c-muted);
          font-family: 'Barlow Condensed', sans-serif; letter-spacing: 0.04em;
          margin-top: 2px;
        }
        .hp-phone-msg.agent .hp-phone-msg-av {
          background: oklch(0.72 0.17 34 / 0.18);
          color: oklch(0.72 0.17 34);
        }
        .hp-phone-bubble {
          font-size: 12.5px; line-height: 1.55; color: var(--c-ink-2);
          background: oklch(0.10 0.01 260);
          padding: 10px 14px;
          max-width: 78%;
        }
        .hp-phone-msg.agent .hp-phone-bubble {
          background: oklch(0.72 0.17 34 / 0.12);
          color: var(--c-ink);
          border-left: 2px solid oklch(0.72 0.17 34 / 0.6);
        }
        .hp-phone-actions {
          border-top: 1px solid var(--c-border);
          padding: 14px 20px;
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .hp-phone-action-chip {
          font-size: 10px; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; color: oklch(0.72 0.17 34);
          background: oklch(0.72 0.17 34 / 0.1);
          padding: 5px 12px;
          display: flex; align-items: center; gap: 5px;
          border: 1px solid oklch(0.72 0.17 34 / 0.25);
        }
        .hp-phone-action-chip::before {
          content: ''; width: 5px; height: 5px; border-radius: 50%;
          background: oklch(0.72 0.17 34);
        }
        @media (max-width: 860px) {
          .hp-demo-inner { grid-template-columns: 1fr; }
        }

        /* ─── AGENTS ────────────────────────────────────────── */
        .hp-agents {
          padding: clamp(80px, 12vw, 140px) 0;
          border-bottom: 1px solid var(--c-border);
        }
        .hp-agents-hd {
          display: flex; align-items: flex-end;
          justify-content: space-between; flex-wrap: wrap; gap: 20px;
          margin-bottom: 56px;
        }
        .hp-agents-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2.4rem, 4vw, 4rem);
          letter-spacing: -0.015em; line-height: 0.95; color: var(--c-ink);
        }
        .hp-agents-h em { color: var(--c-copper); font-style: normal; }
        .hp-agents-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1px; background: var(--c-border);
          border: 1px solid var(--c-border);
        }
        .hp-agent-card {
          background: var(--c-bg); padding: clamp(28px, 4vw, 44px);
          display: flex; flex-direction: column; gap: 12px;
          transition: background 0.18s;
          text-decoration: none;
        }
        .hp-agent-card:hover { background: var(--c-surface); }
        .hp-agent-card.featured {
          grid-column: span 2;
          background: var(--c-surface);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 5vw, 64px);
          align-items: start;
        }
        .hp-agent-card.featured .hp-agent-info { display: flex; flex-direction: column; gap: 14px; }
        .hp-agent-card.featured .hp-agent-visual { position: relative; aspect-ratio: 4/3; overflow: hidden; border: 1px solid var(--c-border); }
        .hp-agent-card.featured .hp-agent-visual img {
          width: 100%; height: 100%; object-fit: cover;
          filter: saturate(0.35) brightness(0.65);
        }
        .hp-agent-card.featured .hp-agent-visual-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, oklch(0.08 0.008 260 / 0.9) 0%, transparent 50%);
        }
        .hp-agent-card.featured .hp-agent-visual-label {
          position: absolute; bottom: 16px; left: 20px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--c-copper);
        }
        .hp-agent-vertical {
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--c-copper);
        }
        .hp-agent-name {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; letter-spacing: -0.005em; color: var(--c-ink);
          font-size: clamp(1.4rem, 2.5vw, 2rem); line-height: 1;
        }
        .hp-agent-card.featured .hp-agent-name {
          font-size: clamp(2rem, 3.5vw, 3rem);
        }
        .hp-agent-body {
          font-size: 14px; line-height: 1.7; color: var(--c-ink-2);
        }
        .hp-agent-proof {
          font-size: 12px; color: var(--c-copper); letter-spacing: 0.04em;
          padding-top: 14px; border-top: 1px solid var(--c-border);
          margin-top: auto;
        }
        .hp-agent-card.featured .hp-agent-proof { padding-top: 0; border-top: none; }
        @media (max-width: 900px) {
          .hp-agents-grid { grid-template-columns: 1fr; }
          .hp-agent-card.featured { grid-column: span 1; grid-template-columns: 1fr; }
        }

        /* ─── NETWORK VISUAL ────────────────────────────────── */
        .hp-network {
          background: var(--c-surface);
          border-bottom: 1px solid var(--c-border);
          padding: clamp(64px, 8vw, 100px) 0;
        }
        .hp-network-inner {
          display: grid; grid-template-columns: 1fr 520px;
          gap: clamp(48px, 6vw, 80px); align-items: center;
        }
        .hp-network-kicker {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--c-copper); margin-bottom: 20px;
        }
        .hp-network-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2.4rem, 4vw, 4rem);
          letter-spacing: -0.015em; line-height: 0.95; color: var(--c-ink);
          margin-bottom: 20px; text-wrap: balance;
        }
        .hp-network-h em { color: var(--c-copper); font-style: normal; }
        .hp-network-body {
          font-size: 15px; line-height: 1.75; color: var(--c-ink-2); max-width: 44ch;
        }
        .hp-network-canvas-wrap {
          height: 400px;
          border: 1px solid var(--c-border);
          background: var(--c-bg);
          overflow: hidden;
          position: relative;
        }
        @media (max-width: 900px) {
          .hp-network-inner { grid-template-columns: 1fr; }
          .hp-network-canvas-wrap { height: 300px; }
        }

        /* ─── HOW ───────────────────────────────────────────── */
        .hp-how {
          border-bottom: 1px solid var(--c-border);
          padding: clamp(80px, 12vw, 140px) 0;
        }
        .hp-how-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2.4rem, 4vw, 4rem);
          letter-spacing: -0.015em; line-height: 0.95; color: var(--c-ink);
          margin-bottom: 64px; max-width: 520px;
        }
        .hp-how-h em { color: var(--c-copper); font-style: normal; }
        .hp-steps {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0; border: 1px solid var(--c-border);
          background: var(--c-border);
        }
        .hp-step {
          background: var(--c-bg); padding: clamp(28px, 4vw, 48px);
          position: relative;
        }
        .hp-step-num {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          font-size: 5rem; letter-spacing: -0.03em; line-height: 1;
          color: oklch(0.14 0.008 260);
          position: absolute; top: 20px; right: 20px;
          user-select: none;
        }
        .hp-step-kicker {
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--c-copper); margin-bottom: 20px;
        }
        .hp-step-name {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: 1.75rem; letter-spacing: -0.005em;
          color: var(--c-ink); margin-bottom: 14px; line-height: 1.0;
        }
        .hp-step-body { font-size: 14px; line-height: 1.75; color: var(--c-muted); }
        @media (max-width: 760px) { .hp-steps { grid-template-columns: 1fr; } }

        /* ─── INDUSTRIES ────────────────────────────────────── */
        .hp-industries {
          border-bottom: 1px solid var(--c-border);
          padding: clamp(80px, 12vw, 140px) 0;
          background: var(--c-surface);
        }
        .hp-ind-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 16px; margin-bottom: 48px;
        }
        .hp-ind-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2rem, 3.5vw, 3.2rem);
          letter-spacing: -0.01em; color: var(--c-ink);
        }
        .hp-ind-list { display: flex; flex-direction: column; }
        .hp-ind-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: clamp(18px,2.5vw,24px) 0;
          border-top: 1px solid var(--c-border);
          text-decoration: none; cursor: pointer;
          transition: padding-left 0.2s var(--c-ease);
        }
        .hp-ind-row:last-child { border-bottom: 1px solid var(--c-border); }
        @media (hover: hover) {
          .hp-ind-row:hover { padding-left: 16px; }
          .hp-ind-row:hover .hp-ind-name { color: var(--c-copper); }
        }
        .hp-ind-name {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2rem, 4.5vw, 4.5rem);
          letter-spacing: -0.01em; color: var(--c-ink); line-height: 1;
          transition: color 0.18s;
        }
        .hp-ind-arrow { color: var(--c-border); flex-shrink: 0; }
        @media (hover: hover) { .hp-ind-row:hover .hp-ind-arrow { color: var(--c-copper); } }

        /* ─── INTEGRATIONS ──────────────────────────────────── */
        .hp-int-strip {
          border-bottom: 1px solid var(--c-border);
          padding: clamp(40px, 6vw, 72px) 0;
        }
        .hp-int-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--c-muted); margin-bottom: 28px;
        }
        .hp-int-logos {
          display: flex; flex-wrap: wrap;
          border: 1px solid var(--c-border);
          background: var(--c-border); gap: 1px;
        }
        .hp-int-logo {
          flex: 1 1 120px;
          padding: 20px 24px;
          background: var(--c-surface);
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 13px; font-weight: 600;
          color: var(--c-muted);
          transition: color 0.15s, background 0.15s;
          white-space: nowrap; text-align: center;
        }
        .hp-int-logo:hover { color: var(--c-ink); background: var(--c-surface2); }

        /* ─── PRICING ───────────────────────────────────────── */
        .hp-pricing {
          padding: clamp(80px, 12vw, 140px) 0;
          border-bottom: 1px solid var(--c-border);
        }
        .hp-pricing-top {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: clamp(40px, 6vw, 80px); margin-bottom: 56px; align-items: end;
        }
        .hp-pricing-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2.4rem, 4vw, 4rem);
          letter-spacing: -0.015em; line-height: 0.95; color: var(--c-ink);
        }
        .hp-pricing-h em { color: var(--c-copper); font-style: normal; }
        .hp-pricing-sub {
          font-size: 15px; line-height: 1.75; color: var(--c-ink-2);
        }
        .hp-pricing-cols {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--c-border); border: 1px solid var(--c-border);
        }
        .hp-price-col {
          background: var(--c-surface); padding: clamp(28px, 4vw, 44px);
          display: flex; flex-direction: column;
        }
        .hp-price-col.featured { background: var(--c-surface2); position: relative; }
        .hp-price-badge {
          position: absolute; top: 0; left: 28px;
          background: var(--c-copper); color: var(--c-bg);
          font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 4px 12px;
        }
        .hp-price-name {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.04em;
          color: var(--c-muted); margin-bottom: 20px;
          padding-top: 6px;
        }
        .hp-price-col.featured .hp-price-name { padding-top: 26px; }
        .hp-price-amount {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          font-size: clamp(2rem, 3.5vw, 2.8rem); letter-spacing: -0.02em;
          color: var(--c-ink); line-height: 1; margin-bottom: 4px;
        }
        .hp-price-cadence { font-size: 11px; color: var(--c-muted); margin-bottom: 24px; }
        .hp-price-feats {
          display: flex; flex-direction: column; gap: 10px;
          margin-bottom: 32px; flex: 1;
        }
        .hp-price-feat {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; color: var(--c-ink-2); line-height: 1.5;
        }
        .hp-price-feat-icon { color: var(--c-copper); flex-shrink: 0; margin-top: 1px; }
        @media (max-width: 860px) {
          .hp-pricing-top { grid-template-columns: 1fr; gap: 24px; }
          .hp-pricing-cols { grid-template-columns: 1fr; }
        }

        /* ─── CTA ───────────────────────────────────────────── */
        .hp-cta {
          position: relative; overflow: hidden;
          padding: clamp(80px, 14vw, 160px) 0;
          background: oklch(0.04 0.008 260);
        }
        .hp-cta-bg-photo {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          opacity: 0.12; filter: saturate(0.2);
        }
        .hp-cta-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right, oklch(0.04 0.008 260) 30%, oklch(0.04 0.008 260 / 0.7) 100%);
        }
        .hp-cta-inner {
          position: relative; z-index: 1;
          max-width: 680px;
        }
        .hp-cta-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(3rem, 6vw, 6rem);
          letter-spacing: -0.02em; line-height: 0.92; color: var(--c-ink);
          margin-bottom: 24px;
        }
        .hp-cta-h em { color: var(--c-copper); font-style: normal; }
        .hp-cta-sub {
          font-size: clamp(15px, 1.6vw, 18px); line-height: 1.7;
          color: var(--c-ink-2); max-width: 44ch; margin-bottom: 40px;
        }
        .hp-cta-btns { display: flex; gap: 12px; flex-wrap: wrap; }

        /* ─── PILOT TIMELINE ────────────────────────────────── */
        .hp-pilot {
          border-bottom: 1px solid var(--c-border);
          background: var(--c-surface);
          padding: clamp(80px, 12vw, 140px) 0;
        }
        .hp-pilot-hd { margin-bottom: clamp(40px, 5vw, 64px); max-width: 640px; }
        .hp-pilot-kicker {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--c-copper); margin-bottom: 20px;
        }
        .hp-pilot-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2.4rem, 4vw, 4rem);
          letter-spacing: -0.015em; line-height: 0.95; color: var(--c-ink);
          margin-bottom: 20px; text-wrap: balance;
        }
        .hp-pilot-h em { color: var(--c-copper); font-style: normal; }
        .hp-pilot-sub { font-size: 16px; line-height: 1.7; color: var(--c-ink-2); max-width: 52ch; }
        .hp-pilot-steps {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1px; background: var(--c-border);
          border: 1px solid var(--c-border);
        }
        .hp-pilot-step { background: var(--c-bg); padding: clamp(24px, 3vw, 36px); }
        .hp-pilot-day {
          display: inline-block;
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--c-copper);
          border: 1px solid oklch(0.72 0.17 34 / 0.35);
          padding: 5px 12px; margin-bottom: 18px;
        }
        .hp-pilot-step-name {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: 1.4rem;
          color: var(--c-ink); margin-bottom: 10px; line-height: 1;
        }
        .hp-pilot-step-body { font-size: 13.5px; line-height: 1.7; color: var(--c-muted); }
        @media (max-width: 920px) { .hp-pilot-steps { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) { .hp-pilot-steps { grid-template-columns: 1fr; } }

        /* ─── FAQ ───────────────────────────────────────────── */
        .hp-faq {
          border-bottom: 1px solid var(--c-border);
          padding: clamp(80px, 12vw, 140px) 0;
        }
        .hp-faq-grid {
          display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr);
          gap: clamp(40px, 6vw, 96px); align-items: start;
        }
        .hp-faq-h {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          text-transform: uppercase; font-size: clamp(2.4rem, 4vw, 4rem);
          letter-spacing: -0.015em; line-height: 0.95; color: var(--c-ink);
          margin-bottom: 20px;
        }
        .hp-faq-h em { color: var(--c-copper); font-style: normal; }
        .hp-faq-sub { font-size: 15px; line-height: 1.7; color: var(--c-ink-2); max-width: 36ch; }
        .hp-faq-list { display: flex; flex-direction: column; }
        .hp-faq-item { border-top: 1px solid var(--c-border); }
        .hp-faq-item:last-child { border-bottom: 1px solid var(--c-border); }
        .hp-faq-q {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          gap: 20px; padding: 22px 0; background: none; border: none;
          cursor: pointer; text-align: left;
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 16px; font-weight: 600; color: var(--c-ink);
          transition: color 0.15s;
        }
        .hp-faq-q:hover { color: var(--c-copper); }
        .hp-faq-q-icon {
          flex-shrink: 0; width: 22px; height: 22px;
          display: flex; align-items: center; justify-content: center;
          color: var(--c-copper);
          transition: transform 0.25s var(--c-ease);
        }
        .hp-faq-item.open .hp-faq-q-icon { transform: rotate(45deg); }
        .hp-faq-a {
          overflow: hidden;
          transition: max-height 0.4s var(--c-ease), opacity 0.3s;
        }
        .hp-faq-a-inner {
          padding: 0 0 24px; font-size: 14.5px; line-height: 1.75;
          color: var(--c-ink-2); max-width: 62ch;
        }
        @media (max-width: 860px) { .hp-faq-grid { grid-template-columns: 1fr; gap: 40px; } }
        @media (prefers-reduced-motion: reduce) {
          .hp-faq-a { transition: none; }
          .hp-faq-q-icon { transition: none; }
        }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="hp-hero">
        <div className="hp-hero-bg" />
        <ImgWithFallback
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=50"
          srcSet={[800, 1200, 1600, 2000]
            .map((w) => `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=${w}&q=50 ${w}w`)
            .join(", ")}
          sizes="100vw"
          alt="Dubai skyline"
          className="hp-hero-photo"
          eager
        />
        <div className="hp-hero-overlay" />

        <div className="hp-hero-inner">
          <div>
            <span className="hp-tag hp-rise" style={{ animationDelay: "0.05s" }}>
              AI Workers for Business
            </span>
            <h1 className="hp-h1">
              <span className="hp-line">
                <span className="hp-line-inner" style={{ animationDelay: "0.12s" }}>Your next hire</span>
              </span>
              <span className="hp-line">
                <span className="hp-line-inner" style={{ animationDelay: "0.26s" }}>is an <em>AI agent.</em></span>
              </span>
            </h1>
            <p className="hp-sub hp-rise" style={{ animationDelay: "0.44s" }}>
              Voice and digital agents that call your leads in 60 seconds, book appointments
              overnight, recover overdue payments, and follow up in 7 languages, around the clock.
            </p>
            <div className="hp-ctas hp-rise" style={{ animationDelay: "0.56s" }}>
              <Link href="/aitaas/contact" className="c-btn">Book a live demo</Link>
              <Link href="/aitaas/solutions" className="c-btn c-btn--ghost">
                View all agents <IconArrowRight size={13} color="currentColor" />
              </Link>
            </div>
            <div className="hp-proof hp-rise" style={{ animationDelay: "0.7s" }}>
              {[
                { num: <>60<em>s</em></>, label: "First response" },
                { num: <>7</>, label: "Languages" },
                { num: <>24<em>/7</em></>, label: "Always on" },
                { num: <>14<em>d</em></>, label: "To go live" },
              ].map((p, i) => (
                <div key={p.label} style={{ display: "flex", alignItems: "center", gap: "clamp(24px, 3vw, 40px)" }}>
                  {i > 0 && <span className="hp-proof-sep" aria-hidden />}
                  <div className="hp-proof-item">
                    <span className="hp-proof-num">{p.num}</span>
                    <span className="hp-proof-label">{p.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hp-hero-demo hp-demo-in">
            <AitaasCallDemo />
          </div>
        </div>
      </section>

      {/* ══ PROBLEM ═══════════════════════════════════════════ */}
      <section className="hp-problem">
        <div className="hp-problem-bg-num" aria-hidden>78%</div>
        <div className="c-wrap">
          <div className="hp-problem-grid">
            <Reveal>
              <p className="hp-problem-kicker">The gap your competitors are closing</p>
              <h2 className="hp-problem-h">
                Most businesses<br />respond in <em>hours.</em><br />
                Deals close in minutes.
              </h2>
              <p className="hp-problem-body">
                Every delayed callback, every missed call after hours, every
                language barrier is a deal your competitor closes instead.
                The businesses winning in the UAE today removed that constraint entirely.
                They didn&apos;t hire more staff. They deployed agents.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="hp-problem-photo">
                <ImgWithFallback
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                  alt="Modern property interior"
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.4) brightness(0.65)" }}
                />
                <div className="hp-problem-photo-overlay" />
                <div className="hp-problem-photo-stat">
                  <div className="hp-problem-stat-num">78%</div>
                  <div className="hp-problem-stat-label">of buyers choose the vendor that responds first — industry lead-response research</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ CALL DEMO ═════════════════════════════════════════ */}
      <section className="hp-demo">
        <div className="c-wrap">
          <div className="hp-demo-inner">
            <Reveal>
              <p className="hp-demo-kicker">Beyond voice</p>
              <h2 className="hp-demo-h">
                The same agent,<br />on <em>WhatsApp.</em>
              </h2>
              <p className="hp-demo-body">
                Not every lead picks up the phone. The agent meets them where they
                already are: it answers portal enquiries over chat, sends brochures
                and payment plans mid-conversation, and holds viewing slots on your
                live calendar. Voice and chat share one memory, so a lead can start
                on a call and finish on WhatsApp without repeating a word.
              </p>
              <div className="hp-demo-facts">
                {[
                  "Answers portal and website enquiries instantly",
                  "Delivers brochures and payment plans mid-conversation",
                  "Books viewings on your live calendar",
                  "Hands off to voice with full context when the lead prefers a call",
                ].map((f) => (
                  <div key={f} className="hp-demo-fact">
                    <span className="hp-demo-fact-icon"><IconCheck size={14} /></span>
                    <span className="hp-demo-fact-text">{f}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="hp-phone">
                <div className="hp-phone-topbar">
                  <div className="hp-phone-dots">
                    <div className="hp-phone-dot" style={{ background: "oklch(0.65 0.2 25)" }} />
                    <div className="hp-phone-dot" style={{ background: "oklch(0.75 0.18 88)" }} />
                    <div className="hp-phone-dot" style={{ background: "oklch(0.65 0.2 145)" }} />
                  </div>
                  <span style={{ fontSize: 11, color: "var(--c-muted)", marginLeft: 8, letterSpacing: "0.04em" }}>Property Sales Agent · WhatsApp</span>
                  <div className="hp-phone-live">
                    <div className="hp-phone-live-dot" />
                    Live
                  </div>
                </div>
                <div className="hp-phone-meta">
                  <div className="hp-phone-avatar">AM</div>
                  <div className="hp-phone-caller">
                    <div className="hp-phone-caller-name">Ahmed Al Mansouri</div>
                    <div className="hp-phone-caller-sub">+971 50 ··· ···· · Inbound from Property Finder</div>
                  </div>
                  <div className="hp-phone-timer">02:47</div>
                </div>
                <div className="hp-phone-chat">
                  {[
                    { from: "lead", av: "AM", text: "Hi, I saw your listing for the villa in Dubai Hills. What's the starting price?" },
                    { from: "agent", av: "AI", text: "Good afternoon, Ahmed! The Dubai Hills villas start at AED 4.2M. We have two 5-bedroom units available right now. Are you looking for immediate transfer or off-plan?" },
                    { from: "lead", av: "AM", text: "Immediate. What does the payment plan look like?" },
                    { from: "agent", av: "AI", text: "I'm sending the full brochure and payment schedule to your WhatsApp right now. I also have a Saturday viewing at 10am — shall I hold that slot for you?" },
                  ].map((msg, i) => (
                    <div key={i} className={`hp-phone-msg${msg.from === "agent" ? " agent" : ""}`}>
                      <div className="hp-phone-msg-av">{msg.av}</div>
                      <div className="hp-phone-bubble">{msg.text}</div>
                    </div>
                  ))}
                </div>
                <div className="hp-phone-actions">
                  <div className="hp-phone-action-chip">Brochure sent · WhatsApp</div>
                  <div className="hp-phone-action-chip">Viewing held · Saturday 10am</div>
                  <div className="hp-phone-action-chip">CRM updated</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ AGENTS ════════════════════════════════════════════ */}
      <section className="hp-agents">
        <div className="c-wrap">
          <div className="hp-agents-hd">
            <Reveal>
              <h2 className="hp-agents-h">
                Six agents, one for<br /><em>each gap in your pipeline.</em>
              </h2>
            </Reveal>
            <Link href="/aitaas/solutions" className="c-btn c-btn--ghost">
              Full catalogue <IconArrowRight size={13} color="currentColor" />
            </Link>
          </div>
          <div className="hp-agents-grid">
            <Link href="/aitaas/solutions" className="hp-agent-card featured">
              <div className="hp-agent-info">
                <div className="hp-agent-vertical">{AGENTS[0].vertical}</div>
                <h3 className="hp-agent-name">{AGENTS[0].name}</h3>
                <p className="hp-agent-body">
                  Calls every inbound lead within 60 seconds of enquiry — in their language.
                  Qualifies budget and timeline, delivers matched property brochures to WhatsApp mid-call,
                  and books the viewing before the conversation ends.
                </p>
                <p className="hp-agent-proof">{AGENTS[0].proof}</p>
                <div style={{ marginTop: 8 }}>
                  <span className="c-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    See how it works <IconArrowRight size={13} color="currentColor" />
                  </span>
                </div>
              </div>
              <div className="hp-agent-visual">
                <ImgWithFallback
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=75"
                  alt="Dubai business district"
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.35) brightness(0.65)" }}
                />
                <div className="hp-agent-visual-overlay" />
                <div className="hp-agent-visual-label">Real Estate · UAE</div>
              </div>
            </Link>
            {AGENTS.slice(1).map((a) => (
              <Link key={a.name} href="/aitaas/solutions" className="hp-agent-card">
                <div className="hp-agent-vertical">{a.vertical}</div>
                <div className="hp-agent-name">{a.name}</div>
                <div className="hp-agent-proof">{a.proof}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NETWORK VISUAL ════════════════════════════════════ */}
      <section className="hp-network">
        <div className="c-wrap">
          <div className="hp-network-inner">
            <Reveal>
              <p className="hp-network-kicker">Orchestration layer</p>
              <h2 className="hp-network-h">
                Behind every call,<br /><em>an orchestrated team.</em>
              </h2>
              <p className="hp-network-body">
                Every conversation triggers a network of specialised sub-agents running in parallel.
                Calendar, documents, CRM, payments — all completed before the customer hangs up.
                No handoffs. No delays.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="hp-network-canvas-wrap">
                <AitaasCanvas />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════ */}
      <section className="hp-how">
        <div className="c-wrap">
          <Reveal>
            <h2 className="hp-how-h">
              From enquiry<br /><em>to booked meeting.</em>
            </h2>
          </Reveal>
          <div className="hp-steps">
            {[
              {
                num: "01", label: "Lead connects",
                name: "Instant response",
                body: "A voice or chat agent picks up within 60 seconds of enquiry — 24/7, in the lead's language. Human-quality voice, on-brand from the first word.",
              },
              {
                num: "02", label: "Orchestrator routes",
                name: "Parallel tasks fire",
                body: "Our orchestration layer decomposes the conversation into parallel tasks — calendar, documents, CRM, payment links — and dispatches them simultaneously.",
              },
              {
                num: "03", label: "Actions complete",
                name: "Everything delivered",
                body: "Booking confirmed, brochure sent, lead scored, CRM updated — all before the call ends. Your team wakes up to qualified leads with full context.",
              },
            ].map((s, i) => (
              <Reveal key={s.name} delay={i * 0.08} className="hp-step">
                <div className="hp-step-num" aria-hidden>{s.num}</div>
                <div className="hp-step-kicker">{s.label}</div>
                <div className="hp-step-name">{s.name}</div>
                <p className="hp-step-body">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ INDUSTRIES ════════════════════════════════════════ */}
      <section className="hp-industries">
        <div className="c-wrap">
          <div className="hp-ind-header">
            <Reveal>
              <h2 className="hp-ind-h">Built for</h2>
            </Reveal>
          </div>
          <div className="hp-ind-list">
            {INDUSTRIES.map((ind, i) => (
              <Reveal key={ind} delay={i * 0.04}>
                <Link href="/aitaas/solutions" className="hp-ind-row">
                  <span className="hp-ind-name">{ind}</span>
                  <span className="hp-ind-arrow"><IconArrowRight size={22} color="currentColor" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ INTEGRATIONS ══════════════════════════════════════ */}
      <section className="hp-int-strip">
        <div className="c-wrap">
          <Reveal>
            <p className="hp-int-label">Connects to your existing stack — day one</p>
            <div className="hp-int-logos">
              {INTEGRATIONS.map((name) => (
                <div key={name} className="hp-int-logo">{name}</div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ PRICING ═══════════════════════════════════════════ */}
      <section className="hp-pricing">
        <div className="c-wrap">
          <div className="hp-pricing-top">
            <Reveal>
              <h2 className="hp-pricing-h">
                A fraction of a hire,<br /><em>from AED 2,500<br />a month.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="hp-pricing-sub">
                Three monthly tiers, or a revenue-share model where you pay only on results.
                No setup fees. A 14-day free pilot for every new customer.
              </p>
            </Reveal>
          </div>
          <div className="hp-pricing-cols">
            {[
              {
                name: "Essential", amount: "AED 2,500", cadence: "per month", featured: false,
                features: ["1 AI agent product", "Up to 3 sub-agents", "English + 1 language", "WhatsApp + Calendar", "Monthly report"],
              },
              {
                name: "Professional", amount: "AED 5,000", cadence: "per month", featured: true,
                features: ["Up to 3 AI agents", "Full sub-agent library", "3 languages supported", "Full integration suite", "Weekly analytics", "Dedicated onboarding"],
              },
              {
                name: "Enterprise", amount: "Custom", cadence: "", featured: false,
                features: ["Unlimited agents", "All 7 languages", "Custom agent design", "Dedicated infrastructure", "SLA guarantee", "On-site onboarding"],
              },
            ].map((tier) => (
              <Reveal key={tier.name} className={`hp-price-col${tier.featured ? " featured" : ""}`}>
                {tier.featured && <span className="hp-price-badge">Most popular</span>}
                <p className="hp-price-name">{tier.name}</p>
                <p className="hp-price-amount">{tier.amount}</p>
                {tier.cadence && <p className="hp-price-cadence">{tier.cadence}</p>}
                <div className="hp-price-feats">
                  {tier.features.map((f) => (
                    <div key={f} className="hp-price-feat">
                      <span className="hp-price-feat-icon"><IconCheck size={13} /></span>
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/aitaas/contact" className={`c-btn${tier.featured ? "" : " c-btn--ghost"}`}>
                  Get started <IconArrowRight size={12} color="currentColor" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PILOT TIMELINE ════════════════════════════════════ */}
      <section className="hp-pilot">
        <div className="c-wrap">
          <Reveal>
            <div className="hp-pilot-hd">
              <p className="hp-pilot-kicker">The 14-day pilot</p>
              <h2 className="hp-pilot-h">
                Exactly what happens,<br /><em>day by day.</em>
              </h2>
              <p className="hp-pilot-sub">
                No commitment, no setup fee, and nothing runs without your approval.
                Here is the entire process from first call to decision.
              </p>
            </div>
          </Reveal>
          <div className="hp-pilot-steps">
            {PILOT_STEPS.map((s, i) => (
              <Reveal key={s.day} delay={i * 0.07} className="hp-pilot-step">
                <span className="hp-pilot-day">{s.day}</span>
                <div className="hp-pilot-step-name">{s.name}</div>
                <p className="hp-pilot-step-body">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════ */}
      <section className="hp-faq">
        <div className="c-wrap">
          <div className="hp-faq-grid">
            <Reveal>
              <h2 className="hp-faq-h">
                The questions<br /><em>everyone asks.</em>
              </h2>
              <p className="hp-faq-sub">
                Straight answers. Anything else, ask us directly and a person will reply
                within four hours on business days.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <FaqList />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════ */}
      <section className="hp-cta">
        <ImgWithFallback
          src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1400&q=50"
          srcSet={[800, 1400, 2000]
            .map((w) => `https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=${w}&q=50 ${w}w`)
            .join(", ")}
          sizes="100vw"
          alt="Dubai at dusk"
          className="hp-cta-bg-photo"
        />
        <div className="hp-cta-overlay" />
        <div className="c-wrap">
          <Reveal>
            <div className="hp-cta-inner">
              <h2 className="hp-cta-h">
                Prove it on<br /><em>your own leads.</em>
              </h2>
              <p className="hp-cta-sub">
                We deploy a live agent on your real enquiries for 14 days at no charge.
                You keep every lead, booking, and call recording — regardless of what you decide.
              </p>
              <div className="hp-cta-btns">
                <Link href="/aitaas/contact" className="c-btn">Apply for the pilot</Link>
                <Link href="/aitaas/pricing" className="c-btn c-btn--ghost">
                  View pricing <IconArrowRight size={13} color="currentColor" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
