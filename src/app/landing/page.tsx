"use client";

import { useEffect, useRef, useState } from "react";

const LANGS = [
  { code: "AR", name: "Arabic", flag: "🇦🇪" },
  { code: "EN", name: "English", flag: "🇬🇧" },
  { code: "HI", name: "Hindi", flag: "🇮🇳" },
  { code: "RU", name: "Russian", flag: "🇷🇺" },
  { code: "ZH", name: "Mandarin", flag: "🇨🇳" },
];

const STEPS = [
  {
    n: "01",
    title: "Lead Captured",
    body: "A prospect clicks your Meta or Instagram ad. Simmer catches the webhook in under 200ms and queues your AI agent instantly.",
  },
  {
    n: "02",
    title: "AI Calls in 60 Seconds",
    body: "Before your competitor even sees the notification, Simmer's voice AI has already introduced itself in the lead's preferred language.",
  },
  {
    n: "03",
    title: "Live Qualification",
    body: "The AI asks about budget, lifestyle, and investment goals — while four parallel sub-agents silently research schools, mortgages, and matching properties.",
  },
  {
    n: "04",
    title: "Brochures Sent Mid-Call",
    body: "WhatsApp delivers property brochures, school reports, and EMI breakdowns during the conversation. The lead feels heard before the call even ends.",
  },
  {
    n: "05",
    title: "Appointment Booked",
    body: "The AI proposes calendar slots, confirms the booking, and emails both the lead and your agent — all without human intervention.",
  },
  {
    n: "06",
    title: "14-Day Nurture Sequence",
    body: "Multi-channel follow-ups across WhatsApp, email, and AI callbacks run automatically for two weeks, keeping warm leads warm.",
  },
  {
    n: "07",
    title: "Your Agent Closes",
    body: "When a human finally steps in, they receive a full dossier: transcript, mortgage data, and property interest — ready to close.",
  },
];

const AGENTS = [
  {
    icon: "🏫",
    name: "School Mapper",
    desc: "Commute times, tuition fees, and school ratings — pulled from Google Maps in real time for families on the call.",
  },
  {
    icon: "📊",
    name: "Mortgage Calculator",
    desc: "Instant EMI breakdowns tailored to the lead's budget, currency, and local lending rates.",
  },
  {
    icon: "🏠",
    name: "Property Recommender",
    desc: "Filters your entire inventory against the lead's stated preferences and surfaces the top matches while they're still on the line.",
  },
  {
    icon: "👤",
    name: "Profile Builder",
    desc: "Captures demographics, intent signals, and conversation sentiment — so your CRM is already enriched before you say hello.",
  },
];

function useCounter(target: number, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.round(p * p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return val;
}

function StatCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const count = useCounter(value, 1600, started);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ animationDelay: `${delay}ms` }} className="stat-card">
      <span className="stat-number">{count}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #07080A;
          --bg2: #0E0F12;
          --bg3: #131418;
          --gold: #C89B3C;
          --gold-dim: #8C6B24;
          --gold-light: #E0B86A;
          --text: #EDE8DF;
          --muted: #6A655E;
          --border: #1E1E24;
          --border-gold: rgba(200,155,60,0.22);
        }

        html { scroll-behavior: smooth; }

        body, .landing-root {
          background: var(--bg);
          color: var(--text);
          font-family: 'Outfit', sans-serif;
          font-weight: 300;
          -webkit-font-smoothing: antialiased;
        }

        .landing-root { min-height: 100vh; overflow-x: hidden; }

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5vw; height: 68px;
          transition: background 0.3s, border-color 0.3s;
          border-bottom: 1px solid transparent;
        }
        .nav.scrolled {
          background: rgba(7,8,10,0.88);
          backdrop-filter: blur(14px);
          border-bottom-color: var(--border);
        }
        .nav-logo {
          font-family: 'Cormorant Garant', serif;
          font-weight: 500; font-size: 22px; letter-spacing: 0.02em;
          color: var(--text); text-decoration: none;
        }
        .nav-logo span { color: var(--gold); }
        .nav-cta {
          background: var(--gold); color: #07080A;
          border: none; padding: 10px 24px; font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; cursor: pointer; text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          display: inline-block;
        }
        .nav-cta:hover { background: var(--gold-light); transform: translateY(-1px); }

        /* HERO */
        .hero {
          min-height: 100vh; display: flex; flex-direction: column;
          justify-content: flex-end; padding: 0 5vw 80px;
          position: relative; overflow: hidden;
        }
        .hero-grid-bg {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(200,155,60,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,155,60,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 0%, transparent 100%);
        }
        .hero-glow {
          position: absolute; width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(200,155,60,0.07) 0%, transparent 70%);
          top: -100px; left: -100px; z-index: 0; pointer-events: none;
        }
        .hero-content { position: relative; z-index: 1; max-width: 900px; }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          color: var(--gold); font-size: 12px; font-weight: 500;
          letter-spacing: 0.15em; text-transform: uppercase;
          margin-bottom: 28px;
        }
        .hero-eyebrow::before {
          content: ''; display: block; width: 32px; height: 1px; background: var(--gold);
        }
        .hero-h1 {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(56px, 9vw, 120px);
          font-weight: 300; line-height: 0.95; letter-spacing: -0.02em;
          color: var(--text); margin-bottom: 32px;
        }
        .hero-h1 em { font-style: italic; color: var(--gold); }
        .hero-sub {
          max-width: 560px; font-size: 16px; line-height: 1.75;
          color: var(--muted); margin-bottom: 48px; font-weight: 300;
        }
        .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
        .btn-primary {
          background: var(--gold); color: #07080A; border: none;
          padding: 15px 36px; font-family: 'Outfit', sans-serif;
          font-size: 14px; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; cursor: pointer; text-decoration: none;
          transition: background 0.2s, transform 0.15s; display: inline-block;
        }
        .btn-primary:hover { background: var(--gold-light); transform: translateY(-2px); }
        .btn-ghost {
          background: transparent; color: var(--text);
          border: 1px solid var(--border); padding: 15px 36px;
          font-family: 'Outfit', sans-serif; font-size: 14px;
          font-weight: 400; letter-spacing: 0.04em; cursor: pointer;
          text-decoration: none; display: inline-block;
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
        }
        .btn-ghost:hover { border-color: var(--gold-dim); color: var(--gold); transform: translateY(-2px); }

        /* STATS STRIP */
        .stats-strip {
          background: var(--bg2); border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          display: grid; grid-template-columns: repeat(4, 1fr);
        }
        .stat-card {
          display: flex; flex-direction: column; align-items: center;
          padding: 40px 20px; gap: 8px;
          border-right: 1px solid var(--border);
          animation: fadeUp 0.6s ease both;
        }
        .stat-card:last-child { border-right: none; }
        .stat-number {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(36px, 4vw, 56px); font-weight: 300; color: var(--gold);
        }
        .stat-label {
          font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted); text-align: center;
        }

        /* SECTIONS */
        section { padding: 100px 5vw; }
        .section-label {
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 20px; display: flex; align-items: center; gap: 12px;
        }
        .section-label::after { content: ''; flex: 1; max-width: 60px; height: 1px; background: var(--gold-dim); }
        .section-h2 {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(36px, 5vw, 64px); font-weight: 300;
          line-height: 1.05; letter-spacing: -0.01em; margin-bottom: 24px;
        }
        .section-h2 em { font-style: italic; color: var(--gold); }
        .section-body { font-size: 16px; line-height: 1.8; color: var(--muted); max-width: 520px; }

        /* PROBLEM SECTION */
        .problem-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
          margin-top: 60px; border: 1px solid var(--border);
        }
        .problem-col {
          padding: 48px 40px;
          background: var(--bg2);
        }
        .problem-col.right { background: var(--bg3); border-left: 1px solid var(--border-gold); }
        .problem-col-label {
          font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
          margin-bottom: 32px; display: flex; align-items: center; gap: 10px;
        }
        .problem-col-label .dot {
          width: 6px; height: 6px; border-radius: 50%;
        }
        .dot-red { background: #6B3030; }
        .dot-gold { background: var(--gold); }
        .problem-item {
          display: flex; gap: 16px; margin-bottom: 24px; align-items: flex-start;
        }
        .problem-item-icon { font-size: 18px; margin-top: 2px; flex-shrink: 0; }
        .problem-item-text { font-size: 14px; line-height: 1.7; color: var(--muted); }
        .problem-item-text strong { color: var(--text); font-weight: 500; display: block; margin-bottom: 2px; }

        /* HOW IT WORKS */
        .steps { margin-top: 60px; }
        .step {
          display: grid; grid-template-columns: 80px 1fr; gap: 32px;
          padding: 36px 0; border-bottom: 1px solid var(--border);
          transition: all 0.3s;
        }
        .step:last-child { border-bottom: none; }
        .step:hover { background: rgba(200,155,60,0.02); }
        .step-num {
          font-family: 'Cormorant Garant', serif; font-size: 14px;
          font-weight: 400; color: var(--gold-dim); letter-spacing: 0.05em;
          padding-top: 4px;
        }
        .step-content {}
        .step-title {
          font-family: 'Cormorant Garant', serif;
          font-size: 26px; font-weight: 400; margin-bottom: 10px; color: var(--text);
        }
        .step-body { font-size: 14px; line-height: 1.75; color: var(--muted); max-width: 640px; }

        /* AGENTS */
        .agents-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px;
          margin-top: 60px; border: 1px solid var(--border); overflow: hidden;
        }
        .agent-card {
          background: var(--bg2); padding: 40px 36px;
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          transition: background 0.25s;
        }
        .agent-card:hover { background: var(--bg3); }
        .agent-card:nth-child(2n) { border-right: none; }
        .agent-card:nth-child(3), .agent-card:nth-child(4) { border-bottom: none; }
        .agent-icon { font-size: 28px; margin-bottom: 20px; display: block; }
        .agent-name {
          font-family: 'Cormorant Garant', serif;
          font-size: 22px; font-weight: 400; margin-bottom: 12px; color: var(--text);
        }
        .agent-desc { font-size: 14px; line-height: 1.75; color: var(--muted); }

        /* LANGUAGES */
        .lang-section { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .lang-inner { max-width: 1200px; }
        .lang-grid {
          display: flex; gap: 0; margin-top: 48px;
          border: 1px solid var(--border); overflow: hidden;
        }
        .lang-item {
          flex: 1; padding: 36px 28px; text-align: center;
          border-right: 1px solid var(--border);
          transition: background 0.2s;
        }
        .lang-item:last-child { border-right: none; }
        .lang-item:hover { background: rgba(200,155,60,0.04); }
        .lang-flag { font-size: 32px; margin-bottom: 12px; display: block; }
        .lang-code { font-family: 'Cormorant Garant', serif; font-size: 28px; font-weight: 300; color: var(--gold); }
        .lang-name { font-size: 12px; letter-spacing: 0.08em; color: var(--muted); text-transform: uppercase; margin-top: 6px; }

        /* PIPELINE VISUAL */
        .pipeline {
          display: flex; align-items: center; gap: 0;
          overflow-x: auto; padding-bottom: 8px; margin-top: 60px;
        }
        .pipeline-node {
          flex-shrink: 0; background: var(--bg2);
          border: 1px solid var(--border); padding: 24px 20px;
          min-width: 140px; text-align: center;
          transition: border-color 0.2s, background 0.2s;
        }
        .pipeline-node:hover { border-color: var(--gold-dim); background: var(--bg3); }
        .pipeline-node-icon { font-size: 22px; margin-bottom: 10px; display: block; }
        .pipeline-node-label { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); line-height: 1.5; }
        .pipeline-arrow {
          flex-shrink: 0; color: var(--gold-dim); font-size: 16px; padding: 0 4px;
        }

        /* CTA */
        .cta-section {
          text-align: center; padding: 120px 5vw;
          position: relative; overflow: hidden;
          border-top: 1px solid var(--border);
        }
        .cta-section::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,155,60,0.06) 0%, transparent 70%);
        }
        .cta-section > * { position: relative; z-index: 1; }
        .cta-h2 {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(40px, 6vw, 80px); font-weight: 300;
          line-height: 1.05; margin-bottom: 24px;
        }
        .cta-h2 em { font-style: italic; color: var(--gold); }
        .cta-sub { font-size: 15px; color: var(--muted); max-width: 460px; margin: 0 auto 48px; line-height: 1.7; }
        .cta-form { display: flex; gap: 0; max-width: 460px; margin: 0 auto; }
        .cta-input {
          flex: 1; background: var(--bg2); border: 1px solid var(--border);
          color: var(--text); font-family: 'Outfit', sans-serif;
          font-size: 14px; padding: 15px 20px; outline: none;
          transition: border-color 0.2s;
        }
        .cta-input::placeholder { color: var(--muted); }
        .cta-input:focus { border-color: var(--gold-dim); }
        .cta-submit {
          background: var(--gold); color: #07080A; border: none;
          padding: 15px 28px; font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; cursor: pointer;
          white-space: nowrap; transition: background 0.2s;
        }
        .cta-submit:hover { background: var(--gold-light); }

        /* FOOTER */
        footer {
          padding: 40px 5vw; border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 16px;
        }
        .footer-logo {
          font-family: 'Cormorant Garant', serif; font-size: 18px; font-weight: 400;
          color: var(--muted); text-decoration: none;
        }
        .footer-logo span { color: var(--gold-dim); }
        .footer-copy { font-size: 12px; color: var(--muted); }

        /* REVEAL ANIMATIONS */
        .reveal {
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.visible { opacity: 1; transform: none; }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.2s; }
        .reveal-d3 { transition-delay: 0.3s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .hero-eyebrow { animation: fadeUp 0.6s ease 0.1s both; }
        .hero-h1 { animation: fadeUp 0.7s ease 0.2s both; }
        .hero-sub { animation: fadeUp 0.7s ease 0.35s both; }
        .hero-actions { animation: fadeUp 0.7s ease 0.48s both; }

        @media (max-width: 768px) {
          .stats-strip { grid-template-columns: repeat(2, 1fr); }
          .stat-card:nth-child(2) { border-right: none; }
          .stat-card:nth-child(3), .stat-card:nth-child(4) { border-top: 1px solid var(--border); }
          .problem-grid { grid-template-columns: 1fr; }
          .problem-col.right { border-left: none; border-top: 1px solid var(--border-gold); }
          .step { grid-template-columns: 56px 1fr; gap: 20px; }
          .agents-grid { grid-template-columns: 1fr; }
          .agent-card:nth-child(2n) { border-right: 1px solid var(--border); }
          .agent-card:nth-child(3) { border-bottom: 1px solid var(--border); }
          .lang-grid { flex-wrap: wrap; }
          .lang-item { flex: 1 1 calc(33.33% - 1px); }
          .cta-form { flex-direction: column; }
          footer { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="landing-root">
        {/* NAV */}
        <nav className={`nav${scrolled ? " scrolled" : ""}`}>
          <a href="#" className="nav-logo">Simmer<span>.</span></a>
          <a href="#waitlist" className="nav-cta">Request Demo</a>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-grid-bg" />
          <div className="hero-glow" />
          <div className="hero-content">
            <div className="hero-eyebrow">PropTech for Real Estate Agents</div>
            <h1 className="hero-h1">
              Close More Deals.<br />
              <em>Without Hiring</em><br />
              More People.
            </h1>
            <p className="hero-sub">
              Simmer's AI voice system qualifies every lead in 60 seconds, sends property brochures via WhatsApp mid-call, and books appointments — fully automated, around the clock.
            </p>
            <div className="hero-actions">
              <a href="#waitlist" className="btn-primary">Request Early Access</a>
              <a href="#how-it-works" className="btn-ghost">See How It Works</a>
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <div className="stats-strip">
          <StatCard value={60} suffix="s" label="First AI call after lead capture" delay={0} />
          <StatCard value={5} suffix="" label="Languages spoken natively" delay={100} />
          <StatCard value={14} suffix=" days" label="Automated nurture sequence" delay={200} />
          <StatCard value={100} suffix="%" label="Pipeline automated end-to-end" delay={300} />
        </div>

        {/* PROBLEM */}
        <section>
          <div className="reveal section-label">The Problem</div>
          <h2 className="reveal reveal-d1 section-h2">
            Your pipeline<br />has a <em>leak.</em>
          </h2>
          <p className="reveal reveal-d2 section-body">
            Most real estate agents respond to leads hours after they come in. By then, the prospect has already spoken to three competitors. Simmer eliminates the gap entirely.
          </p>

          <div className="problem-grid reveal">
            <div className="problem-col">
              <div className="problem-col-label">
                <span className="dot dot-red" />
                Without Simmer
              </div>
              {[
                ["Hours to first contact", "The average agent responds 3–5 hours after a lead comes in. The prospect is already cold."],
                ["Manual qualification", "Hours spent on calls with buyers who aren't serious — time you'll never get back."],
                ["Inconsistent follow-up", "Leads go cold because nobody remembered to send the brochure or book the callback."],
                ["Language barriers", "International buyers get lost in translation. Opportunities disappear."],
              ].map(([title, body]) => (
                <div className="problem-item" key={title}>
                  <span className="problem-item-icon">—</span>
                  <div className="problem-item-text">
                    <strong>{title}</strong>
                    {body}
                  </div>
                </div>
              ))}
            </div>
            <div className="problem-col right">
              <div className="problem-col-label" style={{ color: "var(--gold)" }}>
                <span className="dot dot-gold" />
                With Simmer
              </div>
              {[
                ["60-second response", "Your AI agent calls every new lead within 60 seconds of clicking your ad — every time, without exception."],
                ["Automated qualification", "Budget, lifestyle, and investment goals captured while four AI sub-agents silently do the research."],
                ["14-day nurture on autopilot", "WhatsApp, email, and AI callbacks run automatically. No lead falls through the cracks."],
                ["5 languages, native fluency", "Arabic, English, Hindi, Russian, and Mandarin — the AI adapts tone and language instantly."],
              ].map(([title, body]) => (
                <div className="problem-item" key={title}>
                  <span className="problem-item-icon" style={{ color: "var(--gold)" }}>✦</span>
                  <div className="problem-item-text">
                    <strong>{title}</strong>
                    {body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div className="reveal section-label">How It Works</div>
          <h2 className="reveal reveal-d1 section-h2">
            Seven steps.<br /><em>Zero manual effort.</em>
          </h2>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div className={`step reveal reveal-d${Math.min(i % 3 + 1, 3)}`} key={s.n}>
                <div className="step-num">{s.n}</div>
                <div className="step-content">
                  <div className="step-title">{s.title}</div>
                  <div className="step-body">{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PARALLEL AGENTS */}
        <section>
          <div className="reveal section-label">AI Sub-Agents</div>
          <h2 className="reveal reveal-d1 section-h2">
            Four agents working<br /><em>while you sleep.</em>
          </h2>
          <p className="reveal reveal-d2 section-body">
            The moment a qualification call begins, four specialised AI agents fire in parallel — each delivering a piece of the picture your lead didn't even know they needed.
          </p>
          <div className="agents-grid">
            {AGENTS.map((a, i) => (
              <div className={`agent-card reveal reveal-d${(i % 2) + 1}`} key={a.name}>
                <span className="agent-icon">{a.icon}</span>
                <div className="agent-name">{a.name}</div>
                <div className="agent-desc">{a.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* LANGUAGES */}
        <section className="lang-section">
          <div className="lang-inner">
            <div className="reveal section-label">Multi-Language</div>
            <h2 className="reveal reveal-d1 section-h2">
              Your AI speaks<br /><em>their language.</em>
            </h2>
            <p className="reveal reveal-d2 section-body">
              Dubai's buyers come from everywhere. Simmer's voice AI adapts in real time — matching language, dialect, and tone to each caller.
            </p>
            <div className="lang-grid reveal">
              {LANGS.map((l) => (
                <div className="lang-item" key={l.code}>
                  <span className="lang-flag">{l.flag}</span>
                  <div className="lang-code">{l.code}</div>
                  <div className="lang-name">{l.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PIPELINE VISUAL */}
        <section>
          <div className="reveal section-label">The Full Pipeline</div>
          <h2 className="reveal reveal-d1 section-h2">
            Lead to close,<br /><em>end to end.</em>
          </h2>
          <div className="pipeline reveal">
            {[
              { icon: "📱", label: "Ad Click" },
              { icon: "⚡", label: "Webhook Trigger" },
              { icon: "🤖", label: "AI Calls Lead" },
              { icon: "🧠", label: "Qualifies & Researches" },
              { icon: "📲", label: "Sends Brochure" },
              { icon: "📅", label: "Books Appointment" },
              { icon: "🔁", label: "14-Day Nurture" },
              { icon: "🤝", label: "Agent Closes" },
            ].map((node, i, arr) => (
              <div key={node.label} style={{ display: "flex", alignItems: "center" }}>
                <div className="pipeline-node">
                  <span className="pipeline-node-icon">{node.icon}</span>
                  <div className="pipeline-node-label">{node.label}</div>
                </div>
                {i < arr.length - 1 && <div className="pipeline-arrow">›</div>}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section" id="waitlist">
          <h2 className="cta-h2 reveal">
            Ready to automate<br />your <em>entire pipeline?</em>
          </h2>
          <p className="cta-sub reveal reveal-d1">
            Join the early access list. We onboard agents market by market. Dubai is first.
          </p>
          <div className="cta-form reveal reveal-d2">
            <input className="cta-input" type="email" placeholder="your@email.com" />
            <button className="cta-submit">Get Access</button>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <a href="#" className="footer-logo">Simmer Properties<span>.</span></a>
          <span className="footer-copy">© 2026 Simmer Properties. All rights reserved.</span>
        </footer>
      </div>
    </>
  );
}
