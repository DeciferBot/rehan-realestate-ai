"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconVideo, IconChart, IconRocket, IconShield, IconCheck, IconArrowRight } from "@/components/AitaasIcons";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const INTERESTS = [
  "Lead Recovery & Follow-Up",
  "Appointment Booking Agent",
  "Customer Support Agent",
  "Revenue Recovery Agent",
  "Leasing & Property Enquiries",
  "Custom / Multiple Solutions",
];

const TEAM_SIZE = [
  "Just me / Sole trader",
  "2–10 employees",
  "11–50 employees",
  "51–200 employees",
  "200+ employees",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    teamSize: "",
    interest: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <>
      <style>{`
        .ac-hero {
          padding: clamp(120px, 16vw, 180px) clamp(20px, 6vw, 88px) clamp(64px, 8vw, 96px);
          position: relative; overflow: hidden;
        }
        .ac-hero-inner { max-width: 680px; }
        .ac-kicker {
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--a-amber); margin-bottom: 24px;
          display: block;
        }
        .ac-hero h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.4rem, 5vw, 4rem);
          line-height: 1.08; letter-spacing: -0.02em;
          color: var(--a-ink); margin: 0 0 24px;
        }
        .ac-hero p {
          font-size: clamp(1rem, 1.5vw, 1.15rem);
          line-height: 1.7; color: var(--a-ink-2);
          max-width: 560px;
        }
        .ac-glow {
          position: absolute; border-radius: 50%; pointer-events: none;
          filter: blur(100px); opacity: 0.12;
        }
        .ac-glow-1 {
          width: 400px; height: 400px;
          background: var(--a-amber);
          top: -80px; right: 10%;
        }

        /* ── layout ── */
        .ac-body {
          padding: 0 clamp(20px, 6vw, 88px) clamp(72px, 10vw, 128px);
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: clamp(48px, 6vw, 96px);
          max-width: 1100px; margin: 0 auto;
          align-items: start;
        }
        @media (max-width: 860px) {
          .ac-body { grid-template-columns: 1fr; }
        }

        /* ── sidebar ── */
        .ac-sidebar {}
        .ac-sidebar-block { margin-bottom: 48px; }
        .ac-sidebar-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--a-muted); margin-bottom: 16px;
          display: block;
        }
        .ac-feature {
          display: flex; gap: 14px; align-items: flex-start;
          padding: 16px 0; border-bottom: 1px solid var(--a-border);
        }
        .ac-feature:last-child { border-bottom: none; }
        .ac-feature-icon {
          width: 36px; height: 36px; flex-shrink: 0;
          background: var(--a-amber-glow);
          border: 1px solid oklch(0.75 0.145 88 / 0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }
        .ac-feature-text h4 {
          font-size: 14px; font-weight: 600; color: var(--a-ink);
          margin: 0 0 4px;
        }
        .ac-feature-text p {
          font-size: 13px; color: var(--a-ink-2); line-height: 1.5; margin: 0;
        }
        .ac-quote {
          background: var(--a-surface);
          border: 1px solid var(--a-border);
          padding: 24px; position: relative;
        }
        .ac-quote::before {
          content: '"';
          font-family: 'DM Serif Display', serif;
          font-size: 48px; line-height: 1;
          color: var(--a-amber);
          position: absolute; top: 12px; left: 20px;
          opacity: 0.4;
        }
        .ac-quote p {
          font-size: 14px; line-height: 1.65;
          color: var(--a-ink-2); margin: 0 0 16px;
          padding-top: 16px;
        }
        .ac-quote-author {
          font-size: 12px; font-weight: 600; color: var(--a-amber);
          letter-spacing: 0.04em;
        }

        /* ── form ── */
        .ac-form-wrap {
          background: var(--a-surface);
          border: 1px solid var(--a-border);
          padding: clamp(28px, 4vw, 48px);
        }
        .ac-form-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem; letter-spacing: -0.01em;
          color: var(--a-ink); margin: 0 0 8px;
        }
        .ac-form-sub {
          font-size: 13px; color: var(--a-ink-2); margin: 0 0 32px;
        }
        .ac-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
          margin-bottom: 16px;
        }
        @media (max-width: 560px) { .ac-row { grid-template-columns: 1fr; } }
        .ac-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .ac-field label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--a-muted);
        }
        .ac-field input,
        .ac-field select,
        .ac-field textarea {
          background: var(--a-bg);
          border: 1px solid var(--a-border);
          color: var(--a-ink);
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          padding: 12px 16px; outline: none;
          transition: border-color 0.18s;
          width: 100%; box-sizing: border-box;
          appearance: none; -webkit-appearance: none;
        }
        .ac-field select {
          background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23705a2a' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 40px;
        }
        .ac-field input:focus,
        .ac-field select:focus,
        .ac-field textarea:focus {
          border-color: var(--a-amber-dim);
        }
        .ac-field textarea { resize: vertical; min-height: 120px; }
        .ac-field input::placeholder,
        .ac-field textarea::placeholder { color: var(--a-muted); }
        .ac-submit {
          width: 100%; margin-top: 8px;
          background: var(--a-amber); color: var(--a-bg);
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          padding: 16px 32px; border: none; cursor: pointer;
          transition: opacity 0.18s, transform 0.14s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .ac-submit:hover { opacity: 0.88; }
        .ac-submit:active { transform: scale(0.97); }
        .ac-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .ac-submit-note {
          font-size: 11px; color: var(--a-muted);
          text-align: center; margin-top: 12px;
        }

        /* ── success ── */
        .ac-success {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center;
          padding: 64px 32px; gap: 16px;
        }
        .ac-success-icon {
          width: 64px; height: 64px;
          background: var(--a-amber-glow);
          border: 1px solid oklch(0.75 0.145 88 / 0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; margin-bottom: 8px;
        }
        .ac-success h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.6rem; color: var(--a-ink); margin: 0;
        }
        .ac-success p { font-size: 14px; color: var(--a-ink-2); margin: 0; max-width: 360px; }

        /* ── offices / bottom ── */
        .ac-offices {
          padding: clamp(48px, 6vw, 80px) clamp(20px, 6vw, 88px);
          border-top: 1px solid var(--a-border);
        }
        .ac-offices-inner { max-width: 1100px; margin: 0 auto; }
        .ac-offices h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          color: var(--a-ink); margin: 0 0 40px;
          letter-spacing: -0.01em;
        }
        .ac-offices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 32px;
        }
        .ac-office-card {
          border-top: 1px solid var(--a-amber-dim);
          padding-top: 20px;
        }
        .ac-office-card h4 {
          font-size: 13px; font-weight: 600; color: var(--a-amber);
          letter-spacing: 0.06em; text-transform: uppercase; margin: 0 0 12px;
        }
        .ac-office-card p {
          font-size: 13px; color: var(--a-ink-2); line-height: 1.65; margin: 0;
        }
      `}</style>

      {/* Hero */}
      <section className="ac-hero">
        <div className="ac-glow ac-glow-1" />
        <div className="ac-hero-inner">
          <motion.span
            className="ac-kicker"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
          >
            Book a Demo
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
          >
            Let&apos;s Build Your AI<br />
            <em style={{ fontStyle: "italic", color: "var(--a-amber)" }}>Workforce.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.32 }}
          >
            Tell us about your business and we&apos;ll show you exactly which AI agents would
            work hardest for you — with a live demonstration, realistic projections, and
            a rollout timeline you can act on.
          </motion.p>
        </div>
      </section>

      {/* Body */}
      <div className="ac-body">
        {/* Sidebar */}
        <motion.aside
          className="ac-sidebar"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.3 }}
        >
          <div className="ac-sidebar-block">
            <span className="ac-sidebar-label">What to expect</span>
            {[
              { Icon: IconVideo, title: "Live demo", desc: "See your use-case scenario played out by a real AI agent in real time." },
              { Icon: IconChart, title: "ROI projection", desc: "We calculate hours recovered, revenue recaptured, and cost per interaction for your volume." },
              { Icon: IconRocket, title: "Deployment roadmap", desc: "A concrete 30-day plan — integration, QA, training, and go-live — specific to your stack." },
              { Icon: IconShield, title: "No obligation", desc: "The demo is free. If it's not a fit, we'll tell you directly rather than waste your time." },
            ].map((f) => (
              <div className="ac-feature" key={f.title}>
                <div className="ac-feature-icon"><f.Icon size={18} color="currentColor" /></div>
                <div className="ac-feature-text">
                  <h4>{f.title}</h4>
                  <p dangerouslySetInnerHTML={{ __html: f.desc }} />
                </div>
              </div>
            ))}
          </div>

          <div className="ac-sidebar-block">
            <span className="ac-sidebar-label">Typical timeline</span>
            {[
              ["Day 1", "Discovery call + demo"],
              ["Day 3–5", "Proposal + pricing scoped to your volume"],
              ["Day 7–14", "Configuration + integration"],
              ["Day 21", "QA + soft launch"],
              ["Day 30", "Full go-live + monitoring"],
            ].map(([day, label]) => (
              <div key={day} className="ac-feature" style={{ gap: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--a-amber)", letterSpacing: "0.06em", minWidth: 48, paddingTop: 2 }}>{day}</span>
                <span style={{ fontSize: 13, color: "var(--a-ink-2)" }}>{label}</span>
              </div>
            ))}
          </div>

          <div className="ac-quote">
            <p>
              Within three weeks of deploying the lead follow-up agent, our contact rate
              went from 31% to 79%. The system handled peak volume we couldn&apos;t staff for.
            </p>
            <span className="ac-quote-author">Real Estate Director, Dubai</span>
          </div>
        </motion.aside>

        {/* Form */}
        <motion.div
          className="ac-form-wrap"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.4 }}
        >
          {submitted ? (
            <div className="ac-success">
              <div className="ac-success-icon"><IconCheck size={28} color="currentColor" /></div>
              <h3>You&apos;re on the list.</h3>
              <p>
                Our team will reach out within one business day to confirm your demo
                time and send a short pre-call questionnaire.
              </p>
              <p style={{ marginTop: 8, color: "var(--a-muted)", fontSize: 12 }}>
                Check your inbox at {form.email}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="ac-form-title">Book a Demo</h2>
              <p className="ac-form-sub">30 minutes. Your use case. Real results.</p>

              <div className="ac-row">
                <div className="ac-field">
                  <label htmlFor="name">Full Name *</label>
                  <input id="name" name="name" required placeholder="Sarah Al-Mansoori" value={form.name} onChange={handleChange} />
                </div>
                <div className="ac-field">
                  <label htmlFor="email">Work Email *</label>
                  <input id="email" name="email" type="email" required placeholder="sarah@company.ae" value={form.email} onChange={handleChange} />
                </div>
              </div>

              <div className="ac-row">
                <div className="ac-field">
                  <label htmlFor="company">Company *</label>
                  <input id="company" name="company" required placeholder="Acme Properties LLC" value={form.company} onChange={handleChange} />
                </div>
                <div className="ac-field">
                  <label htmlFor="phone">Phone (WhatsApp preferred)</label>
                  <input id="phone" name="phone" placeholder="+971 50 000 0000" value={form.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="ac-row">
                <div className="ac-field">
                  <label htmlFor="teamSize">Team Size *</label>
                  <select id="teamSize" name="teamSize" required value={form.teamSize} onChange={handleChange}>
                    <option value="">Select…</option>
                    {TEAM_SIZE.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="ac-field">
                  <label htmlFor="interest">Primary Interest *</label>
                  <select id="interest" name="interest" required value={form.interest} onChange={handleChange}>
                    <option value="">Select…</option>
                    {INTERESTS.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <div className="ac-field">
                <label htmlFor="message">Tell us about your current challenge</label>
                <textarea
                  id="message" name="message"
                  placeholder="e.g. We receive 200 leads a month but only follow up with 30% within 24 hours. Our sales team is stretched thin…"
                  value={form.message}
                  onChange={handleChange}
                />
              </div>

              <motion.button
                type="submit"
                className="ac-submit"
                disabled={submitting}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.14 }}
              >
                {submitting ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 0.7s linear infinite" }}>
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>Request Demo <IconArrowRight size={14} color="currentColor" /></>
                )}
              </motion.button>
              <p className="ac-submit-note">We respond within 1 business day. No spam.</p>
            </form>
          )}
        </motion.div>
      </div>

      {/* Offices */}
      <section className="ac-offices">
        <div className="ac-offices-inner">
          <h2>Global Presence</h2>
          <div className="ac-offices-grid">
            {[
              { city: "Dubai, UAE", detail: "ENG Worldwide HQ\nDubai International Financial Centre\nPrimary operations hub" },
              { city: "London, UK", detail: "ENG Worldwide\nEuropean operations\nRegulatory & partnerships" },
              { city: "Toronto, Canada", detail: "ENG Worldwide\nNorth American operations\nAI research & development" },
              { city: "Singapore", detail: "ENG Worldwide\nSouth-East Asia hub\nPacific market expansion" },
            ].map((o) => (
              <div className="ac-office-card" key={o.city}>
                <h4>{o.city}</h4>
                <p style={{ whiteSpace: "pre-line" }}>{o.detail}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 56, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="mailto:hello@engworldwide.com" className="a-btn">Email Us Directly</a>
            <a href="/aitaas/pricing" className="a-btn a-btn--ghost">View Pricing</a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
