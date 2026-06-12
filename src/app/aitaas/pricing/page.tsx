"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: E, delay }}
    >{children}</motion.div>
  );
}

const TIERS = [
  {
    name: "Essential",
    price: "AED 2,500",
    cadence: "/ month",
    desc: "One AI worker. Full platform included. Perfect for SMEs deploying their first agent.",
    features: [
      "1 AI agent product",
      "Up to 3 sub-agents active",
      "English + 1 additional language",
      "WhatsApp + Calendar integration",
      "Basic CRM push",
      "Monthly performance report",
      "Email support",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Professional",
    price: "AED 5,000",
    cadence: "/ month",
    desc: "Multiple agents, full language support, and dedicated onboarding. The choice for growing businesses.",
    features: [
      "Up to 3 AI agent products",
      "Full sub-agent library access",
      "3 languages supported",
      "WhatsApp, Calendar, Payment integrations",
      "Advanced CRM integration",
      "Weekly performance dashboard",
      "Dedicated onboarding specialist",
      "Priority support",
    ],
    cta: "Get started",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "AED 7,500",
    cadence: "/ month",
    desc: "Unlimited deployment. All 9 products. All 7 languages. Built for scale.",
    features: [
      "Unlimited AI agent products",
      "All 9 products available",
      "All 7 languages from day one",
      "Custom integration development",
      "Dedicated account manager",
      "Real-time analytics dashboard",
      "99.9% uptime SLA",
      "Quarterly strategy review",
    ],
    cta: "Contact us",
    featured: false,
  },
];

const ADDONS = [
  { item: "Configuration & Prompt Engineering", unit: "40–60 hours", price: "$100/hour" },
  { item: "Sub-Agent Activation", unit: "Per additional agent", price: "$500 flat" },
  { item: "Client-Specific Logic", unit: "Bespoke only", price: "Quoted" },
  { item: "QA & Handoff", unit: "~20 hours", price: "$2,000 fixed" },
  { item: "Call Usage", unit: "Per minute", price: "$0.15–0.30" },
  { item: "Sub-Agent Licenses", unit: "Per active sub-agent", price: "$200/month" },
];

const FAQ = [
  {
    q: "What's included in the platform fee?",
    a: "The platform — voice agent, orchestration layer, and integrations — is included in every tier. You are renting an AI worker, not buying engineering hours. Setup and configuration are billed separately based on complexity.",
  },
  {
    q: "How long does deployment take?",
    a: "Standard deployments take approximately 2 weeks from signed agreement to a live agent. This covers configuration, prompt engineering for your vertical, QA testing, and handoff. Complex custom integrations may extend this.",
  },
  {
    q: "What languages are available?",
    a: "Phase 1 (available now): English, Arabic (UAE), Arabic (Levant). Phase 2 (Q3 2026): Hindi, Urdu, Egyptian Arabic, Saudi Arabic, Mandarin. Language selection depends on your tier.",
  },
  {
    q: "How does the revenue share model work?",
    a: "For real estate and automotive verticals, we can deploy an agent at no upfront cost. ENG takes 2.5% of the closed deal value. The agent carries a killswitch — if commission is withheld, the agent pauses. You retain the client relationship; we retain the performance data.",
  },
  {
    q: "What is the performance fee model?",
    a: "For digital media and programmatic clients, we run a 50/50 budget split A/B test — your approach vs ours. If our AI outperforms, we charge 15% of documented savings going forward. You keep the rest and never pay for underperformance.",
  },
  {
    q: "Can I switch tiers or cancel?",
    a: "Tiers can be upgraded at any time. Downgrade or cancellation requires 30-days notice. Enterprise contracts are 12-month minimum with SLA guarantees.",
  },
  {
    q: "Who owns the data and conversation records?",
    a: "You own your lead and client data. ENG owns the platform IP, orchestration logic, and prompt engineering. All data is handled under PDPL (UAE) and GDPR-equivalent data minimisation principles.",
  },
];

export default function PricingPage() {
  return (
    <>
      <style>{`
        .pp-hero {
          padding: 140px clamp(20px, 6vw, 88px) 80px;
          border-bottom: 1px solid var(--a-border);
        }
        .pp-tag {
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--a-amber); margin-bottom: 24px;
        }
        .pp-head {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 400; line-height: 1.0; letter-spacing: -0.03em;
          color: var(--a-ink); text-wrap: balance; margin-bottom: 24px;
        }
        .pp-head em { font-style: italic; color: var(--a-amber); }
        .pp-sub {
          font-size: 16px; color: var(--a-ink-2); max-width: 56ch; line-height: 1.75;
        }
        .pp-tiers {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--a-border); border: 1px solid var(--a-border);
          margin-bottom: 80px;
        }
        .pp-tier {
          background: var(--a-bg); padding: clamp(28px, 4vw, 52px);
          display: flex; flex-direction: column; gap: 0;
        }
        .pp-tier.featured { background: var(--a-surface); }
        .pp-tier-badge {
          font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--a-amber); background: oklch(0.75 0.145 88 / 0.1);
          border: 1px solid var(--a-amber-dim);
          padding: 4px 10px; display: inline-block; width: fit-content;
          margin-bottom: 24px;
        }
        .pp-tier-name {
          font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--a-muted); margin-bottom: 20px;
        }
        .pp-tier-price {
          font-family: 'DM Serif Display', serif;
          font-size: 2.8rem; font-weight: 400; color: var(--a-ink);
          line-height: 1; letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .pp-tier-cadence { font-size: 12px; color: var(--a-muted); margin-bottom: 16px; }
        .pp-tier-desc { font-size: 14px; color: var(--a-ink-2); line-height: 1.65; margin-bottom: 36px; }
        .pp-tier-features { display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .pp-tier-feature {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; color: var(--a-ink-2); line-height: 1.5;
        }
        .pp-check { color: var(--a-amber); flex-shrink: 0; font-size: 14px; }
        .pp-tier-cta { margin-top: 36px; }

        /* alt models */
        .pp-alt-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
          background: var(--a-border); border: 1px solid var(--a-border);
          margin-bottom: 80px;
        }
        .pp-alt-card {
          background: var(--a-bg); padding: clamp(28px, 4vw, 52px);
        }
        .pp-alt-tag {
          font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--a-amber); margin-bottom: 24px;
        }
        .pp-alt-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.8rem; font-weight: 400; color: var(--a-ink);
          letter-spacing: -0.02em; margin-bottom: 12px;
        }
        .pp-alt-rate {
          font-family: 'DM Serif Display', serif;
          font-size: 3.2rem; font-weight: 400; color: var(--a-amber);
          line-height: 1; letter-spacing: -0.02em; margin-bottom: 8px;
        }
        .pp-alt-rate-label { font-size: 12px; color: var(--a-muted); margin-bottom: 28px; }
        .pp-alt-desc { font-size: 14px; color: var(--a-ink-2); line-height: 1.8; margin-bottom: 24px; max-width: 48ch; }
        .pp-alt-how-label {
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--a-muted); margin-bottom: 12px;
        }
        .pp-alt-steps { display: flex; flex-direction: column; gap: 8px; }
        .pp-alt-step { font-size: 13px; color: var(--a-ink-2); line-height: 1.6; display: flex; gap: 10px; }
        .pp-alt-step-n { color: var(--a-amber); flex-shrink: 0; font-weight: 500; }

        /* addons */
        .pp-addon-head {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.6rem, 2.5vw, 2.2rem);
          font-weight: 400; color: var(--a-ink); letter-spacing: -0.02em;
          margin-bottom: 40px;
        }
        .pp-addon-table { border: 1px solid var(--a-border); margin-bottom: 80px; }
        .pp-addon-row {
          display: grid; grid-template-columns: 1fr 160px 160px;
          border-bottom: 1px solid var(--a-border);
        }
        .pp-addon-row:last-child { border-bottom: none; }
        .pp-addon-row-head { background: var(--a-surface); }
        .pp-addon-cell {
          padding: 16px 24px; font-size: 13px; color: var(--a-ink-2); line-height: 1.5;
        }
        .pp-addon-cell-head {
          font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--a-muted); padding: 12px 24px; font-weight: 500;
        }
        .pp-addon-price { color: var(--a-amber); font-weight: 500; }

        /* faq */
        .pp-faq-head {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.6rem, 2.5vw, 2.2rem);
          font-weight: 400; color: var(--a-ink); letter-spacing: -0.02em;
          margin-bottom: 40px;
        }
        .pp-faq { display: flex; flex-direction: column; }
        .pp-faq-item {
          border-top: 1px solid var(--a-border); padding: 24px 0;
        }
        .pp-faq-item:last-child { border-bottom: 1px solid var(--a-border); }
        .pp-faq-q {
          font-size: 15px; font-weight: 500; color: var(--a-ink); margin-bottom: 10px;
          line-height: 1.4;
        }
        .pp-faq-a { font-size: 14px; color: var(--a-muted); line-height: 1.75; max-width: 70ch; }

        @media (max-width: 860px) {
          .pp-tiers, .pp-alt-grid { grid-template-columns: 1fr; }
          .pp-addon-row { grid-template-columns: 1fr 1fr; }
          .pp-addon-row .pp-addon-cell:nth-child(2) { display: none; }
          .pp-addon-row .pp-addon-cell-head:nth-child(2) { display: none; }
        }
      `}</style>

      {/* HERO */}
      <section className="pp-hero">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div className="pp-tag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Pricing
          </motion.div>
          <motion.h1 className="pp-head"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: E, delay: 0.35 }}
          >
            A worker that pays for itself.<br /><em>Starting at AED 2,500.</em>
          </motion.h1>
          <motion.p className="pp-sub"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: E, delay: 0.55 }}
          >
            Three subscription tiers, a revenue-share model for performance-driven verticals,
            and a results-based option for digital media. No platform setup fee.
          </motion.p>
        </div>
      </section>

      {/* TIERS */}
      <section className="a-section">
        <div className="a-inner">
          <div className="pp-tiers">
            {TIERS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.08} className={`pp-tier${t.featured ? " featured" : ""}`}>
                {t.featured && <div className="pp-tier-badge">Most Popular</div>}
                <div className="pp-tier-name">{t.name}</div>
                <div className="pp-tier-price">{t.price}</div>
                <div className="pp-tier-cadence">{t.cadence}</div>
                <div className="pp-tier-desc">{t.desc}</div>
                <div className="pp-tier-features">
                  {t.features.map((f) => (
                    <div key={f} className="pp-tier-feature">
                      <span className="pp-check">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="pp-tier-cta">
                  <Link href="/aitaas/contact" className="a-btn" style={{ display: "block", textAlign: "center" }}>
                    {t.cta}
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* ALTERNATIVE MODELS */}
          <FadeUp>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 400, color: "var(--a-ink)", letterSpacing: "-0.02em", marginBottom: 40 }}>
              Prefer to pay on performance?
            </h2>
          </FadeUp>
          <div className="pp-alt-grid">
            <FadeUp className="pp-alt-card">
              <div className="pp-alt-tag">Revenue Share</div>
              <h3 className="pp-alt-name">Deploy free. Pay when deals close.</h3>
              <div className="pp-alt-rate">2.5%</div>
              <div className="pp-alt-rate-label">of closed deal value</div>
              <p className="pp-alt-desc">
                Best for real estate brokers and automotive dealers. We deploy the agent at no upfront cost.
                ENG takes 2.5% of the 5% commission on each closed deal. If deals close, you pay.
                If they don't, you haven't spent a dirham.
              </p>
              <div className="pp-alt-how-label">How it works</div>
              <div className="pp-alt-steps">
                <div className="pp-alt-step"><span className="pp-alt-step-n">1.</span><span>Agent deploys at no cost to you.</span></div>
                <div className="pp-alt-step"><span className="pp-alt-step-n">2.</span><span>ENG tracks closed deal value through CRM integration.</span></div>
                <div className="pp-alt-step"><span className="pp-alt-step-n">3.</span><span>Commission is invoiced monthly against closed pipeline.</span></div>
                <div className="pp-alt-step"><span className="pp-alt-step-n">4.</span><span>You retain the full client relationship and all data.</span></div>
              </div>
            </FadeUp>
            <FadeUp delay={0.08} className="pp-alt-card">
              <div className="pp-alt-tag">Performance Fee</div>
              <h3 className="pp-alt-name">We prove the ROI first. Then we charge.</h3>
              <div className="pp-alt-rate">15%</div>
              <div className="pp-alt-rate-label">of documented savings vs current spend</div>
              <p className="pp-alt-desc">
                Built for digital media and programmatic clients. We run a 50/50 budget split:
                your current approach vs ours. If our AI outperforms yours, we charge 15% of the savings.
                You keep the rest — and never pay for underperformance.
              </p>
              <div className="pp-alt-how-label">How it works</div>
              <div className="pp-alt-steps">
                <div className="pp-alt-step"><span className="pp-alt-step-n">1.</span><span>50/50 budget split for 30-day A/B test.</span></div>
                <div className="pp-alt-step"><span className="pp-alt-step-n">2.</span><span>Results audited against baseline spend and performance.</span></div>
                <div className="pp-alt-step"><span className="pp-alt-step-n">3.</span><span>If AI wins, 15% performance fee on ongoing savings.</span></div>
                <div className="pp-alt-step"><span className="pp-alt-step-n">4.</span><span>If AI doesn't win, no charge. Test costs only your time.</span></div>
              </div>
            </FadeUp>
          </div>

          {/* ADD-ONS */}
          <FadeUp>
            <h2 className="pp-addon-head">Configuration add-ons</h2>
          </FadeUp>
          <FadeUp delay={0.05}>
            <div className="pp-addon-table">
              <div className="pp-addon-row pp-addon-row-head">
                <div className="pp-addon-cell-head">Line Item</div>
                <div className="pp-addon-cell-head">Unit</div>
                <div className="pp-addon-cell-head">Price</div>
              </div>
              {ADDONS.map((a) => (
                <div key={a.item} className="pp-addon-row">
                  <div className="pp-addon-cell">{a.item}</div>
                  <div className="pp-addon-cell">{a.unit}</div>
                  <div className={`pp-addon-cell pp-addon-price`}>{a.price}</div>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* FAQ */}
          <FadeUp>
            <h2 className="pp-faq-head">Common questions</h2>
          </FadeUp>
          <div className="pp-faq">
            {FAQ.map((item, i) => (
              <FadeUp key={item.q} delay={i * 0.04} className="pp-faq-item">
                <div className="pp-faq-q">{item.q}</div>
                <div className="pp-faq-a">{item.a}</div>
              </FadeUp>
            ))}
          </div>

          {/* CTA */}
          <FadeUp delay={0.1}>
            <div style={{
              background: "var(--a-surface)", border: "1px solid var(--a-border)",
              padding: "clamp(36px, 5vw, 64px)", marginTop: 72,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              flexWrap: "wrap", gap: 32
            }}>
              <div>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 400, color: "var(--a-ink)", letterSpacing: "-0.025em", marginBottom: 12 }}>
                  Ready to deploy your first AI worker?
                </h2>
                <p style={{ fontSize: 14, color: "var(--a-muted)", lineHeight: 1.7, maxWidth: "50ch" }}>
                  Book a 30-minute discovery call. We will map the right agent to your business and outline a deployment plan.
                </p>
              </div>
              <Link href="/aitaas/contact" className="a-btn">Book a Discovery Call</Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
