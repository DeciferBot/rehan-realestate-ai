"use client";

import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { IconCheck, IconArrowRight, IconClock, IconGlobe, IconChart } from "@/components/AitaasIcons";

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 1, y: 18 }}
      animate={inView ? { y: 0 } : { y: 18 }}
      transition={{ duration: 0.55, ease: E, delay }}
    >{children}</motion.div>
  );
}

const INTERESTS = [
  "Lead Recovery & Follow-Up",
  "Appointment Booking Agent",
  "Customer Support Agent",
  "Revenue Recovery Agent",
  "Leasing & Property Enquiries",
  "Cart Recovery",
  "Admissions Agent",
  "Custom / Multiple Solutions",
];

const TEAM_SIZES = [
  "Just me / Sole trader",
  "2–10 employees",
  "11–50 employees",
  "51–200 employees",
  "200+ employees",
];

const PROMISES = [
  { icon: IconClock, label: "Response within 4 hours", sub: "On business days. We review every submission personally." },
  { icon: IconGlobe, label: "14-day free pilot", sub: "Live agent on real enquiries, no commitment required." },
  { icon: IconChart, label: "Full performance report", sub: "You keep every lead, booking, and call recording." },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", company: "", phone: "",
    teamSize: "", interest: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.interest.trim()) {
      setError(true);
      return;
    }
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch("/api/aitaas-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{`
        .ct-hero {
          padding: clamp(120px, 18vw, 180px) 0 clamp(64px, 8vw, 96px);
          border-bottom: 1px solid var(--c-border);
        }
        .ct-hero-eyebrow {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--c-copper); margin-bottom: 20px;
        }
        .ct-hero-h {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; text-transform: uppercase;
          font-size: clamp(3rem, 8vw, 5.5rem);
          letter-spacing: -0.02em; line-height: 0.95;
          color: var(--c-ink); margin-bottom: 24px; text-wrap: balance;
        }
        .ct-hero-sub {
          font-size: clamp(15px, 2vw, 17px);
          color: var(--c-ink-2); line-height: 1.65; max-width: 560px;
        }

        /* Main layout */
        .ct-main {
          padding: clamp(72px, 10vw, 120px) 0;
        }
        .ct-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: clamp(48px, 8vw, 96px);
          align-items: start;
        }
        @media (max-width: 900px) {
          .ct-grid { grid-template-columns: 1fr; }
        }

        /* Form */
        .ct-form { display: flex; flex-direction: column; gap: 20px; }
        .ct-form-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
        }
        @media (max-width: 600px) { .ct-form-row { grid-template-columns: 1fr; } }

        .ct-field { display: flex; flex-direction: column; gap: 6px; }
        .ct-label {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--c-muted);
        }
        .ct-input, .ct-select, .ct-textarea {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          color: var(--c-ink);
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 14px; font-weight: 400;
          padding: 12px 14px;
          outline: none;
          transition: border-color 0.15s;
          width: 100%; box-sizing: border-box;
          -webkit-appearance: none;
        }
        .ct-input::placeholder, .ct-textarea::placeholder { color: var(--c-muted); }
        .ct-input:focus, .ct-select:focus, .ct-textarea:focus {
          border-color: var(--c-copper);
        }
        .ct-select { cursor: pointer; }
        .ct-textarea { min-height: 120px; resize: vertical; }

        .ct-submit {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--c-copper); color: var(--c-bg);
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 14px 28px;
          border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          align-self: flex-start;
        }
        .ct-submit:hover:not(:disabled) { opacity: 0.86; }
        .ct-submit:active:not(:disabled) { transform: scale(0.97); }
        .ct-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Success state */
        .ct-success {
          padding: 48px 40px;
          border: 1px solid var(--c-copper);
          background: var(--c-surface);
          display: flex; flex-direction: column; gap: 16px;
        }
        .ct-success-icon {
          width: 40px; height: 40px;
          border: 1px solid var(--c-copper);
          display: flex; align-items: center; justify-content: center;
          color: var(--c-copper);
        }
        .ct-success-h {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; text-transform: uppercase;
          font-size: 2rem; letter-spacing: -0.01em;
          color: var(--c-ink); line-height: 1;
        }
        .ct-success-body { font-size: 14px; color: var(--c-ink-2); line-height: 1.7; max-width: 400px; }

        /* Sidebar */
        .ct-sidebar { display: flex; flex-direction: column; gap: 0; }
        .ct-promise {
          padding: 28px 0;
          border-top: 1px solid var(--c-border);
          display: flex; gap: 16px; align-items: flex-start;
        }
        .ct-promise:last-child { border-bottom: 1px solid var(--c-border); }
        .ct-promise-icon {
          flex-shrink: 0;
          width: 36px; height: 36px;
          border: 1px solid var(--c-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--c-copper);
        }
        .ct-promise-label {
          font-family: 'Hanken Grotesk', sans-serif;
          font-weight: 600; font-size: 14px; color: var(--c-ink);
          margin-bottom: 4px;
        }
        .ct-promise-sub { font-size: 12px; color: var(--c-muted); line-height: 1.5; }

        .ct-sidebar-note {
          margin-top: 32px;
          padding: 24px;
          background: var(--c-surface);
          border-left: 2px solid var(--c-copper);
        }
        .ct-sidebar-note-label {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--c-copper); margin-bottom: 8px;
        }
        .ct-sidebar-note-body { font-size: 13px; color: var(--c-ink-2); line-height: 1.65; }
      `}</style>

      {/* Hero */}
      <section className="ct-hero">
        <div className="c-wrap">
          <Reveal>
            <p className="ct-hero-eyebrow">Get in touch</p>
            <h1 className="ct-hero-h">Book your<br />discovery call</h1>
            <p className="ct-hero-sub">Tell us what you're trying to solve. We'll map the right agent to your revenue gap and show you a working demo — before any commitment.</p>
          </Reveal>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="ct-main">
        <div className="c-wrap">
          <div className="ct-grid">
            {/* Form */}
            <Reveal>
              {submitted ? (
                <motion.div
                  className="ct-success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: E }}
                >
                  <div className="ct-success-icon">
                    <IconCheck size={18} />
                  </div>
                  <h2 className="ct-success-h">We've got your request</h2>
                  <p className="ct-success-body">
                    Expect a message from us within 4 hours on business days. We review every submission ourselves — no automated replies.
                  </p>
                  <p className="ct-success-body" style={{ marginTop: 0 }}>
                    In the meantime, explore our <a href="/aitaas/solutions" style={{ color: "var(--c-copper)", textDecoration: "none" }}>full agent catalogue</a> or <a href="/aitaas/pricing" style={{ color: "var(--c-copper)", textDecoration: "none" }}>pricing options</a>.
                  </p>
                </motion.div>
              ) : (
                <form className="ct-form" onSubmit={handleSubmit} noValidate>
                  <div className="ct-form-row">
                    <div className="ct-field">
                      <label className="ct-label" htmlFor="name">Full name</label>
                      <input
                        id="name" name="name" type="text"
                        className="ct-input" placeholder="Ahmed Al Mansouri"
                        value={form.name} onChange={handleChange} required
                      />
                    </div>
                    <div className="ct-field">
                      <label className="ct-label" htmlFor="company">Company</label>
                      <input
                        id="company" name="company" type="text"
                        className="ct-input" placeholder="Emaar Properties"
                        value={form.company} onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="ct-form-row">
                    <div className="ct-field">
                      <label className="ct-label" htmlFor="email">Work email</label>
                      <input
                        id="email" name="email" type="email"
                        className="ct-input" placeholder="ahmed@yourcompany.com"
                        value={form.email} onChange={handleChange} required
                      />
                    </div>
                    <div className="ct-field">
                      <label className="ct-label" htmlFor="phone">Phone (optional)</label>
                      <input
                        id="phone" name="phone" type="tel"
                        className="ct-input" placeholder="+971 50 000 0000"
                        value={form.phone} onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="ct-form-row">
                    <div className="ct-field">
                      <label className="ct-label" htmlFor="interest">Agent of interest</label>
                      <select
                        id="interest" name="interest"
                        className="ct-select"
                        value={form.interest} onChange={handleChange} required
                      >
                        <option value="">Select an agent</option>
                        {INTERESTS.map((i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    <div className="ct-field">
                      <label className="ct-label" htmlFor="teamSize">Team size</label>
                      <select
                        id="teamSize" name="teamSize"
                        className="ct-select"
                        value={form.teamSize} onChange={handleChange}
                      >
                        <option value="">Select team size</option>
                        {TEAM_SIZES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="ct-field">
                    <label className="ct-label" htmlFor="message">What problem are you trying to solve?</label>
                    <textarea
                      id="message" name="message"
                      className="ct-textarea"
                      placeholder="Describe the gap in your sales or operations process — the more specific, the better our recommendation."
                      value={form.message} onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="ct-submit" disabled={submitting}>
                    {submitting ? "Sending..." : <>Send request <IconArrowRight size={13} /></>}
                  </button>
                  {error && (
                    <p style={{ fontSize: 13, color: "var(--c-copper)", lineHeight: 1.6 }}>
                      We couldn&apos;t send your request. Check the required fields, or email us
                      directly at{" "}
                      <a href="mailto:chopraa@gmail.com" style={{ color: "var(--c-copper)" }}>
                        chopraa@gmail.com
                      </a>.
                    </p>
                  )}
                </form>
              )}
            </Reveal>

            {/* Sidebar */}
            <Reveal delay={0.1}>
              <div className="ct-sidebar">
                {PROMISES.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="ct-promise">
                    <div className="ct-promise-icon">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="ct-promise-label">{label}</p>
                      <p className="ct-promise-sub">{sub}</p>
                    </div>
                  </div>
                ))}
                <div className="ct-sidebar-note">
                  <p className="ct-sidebar-note-label">How the pilot works</p>
                  <p className="ct-sidebar-note-body">
                    We deploy a live agent on your real inbound enquiries for 14 days at no charge. You receive a full performance report at the end with call recordings, booking data, and a cost-per-lead breakdown. No commitment required to continue.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
