"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { IconCheck, IconArrowRight } from "@/components/AitaasIcons";

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

const TIERS = [
  {
    name: "Boutique",
    price: "AED 2,500",
    cadence: "/ month",
    desc: "One AI agent answering every lead instantly. The right starting point for smaller UAE real estate teams building their first always-on sales force.",
    features: [
      "1 AI sales agent",
      "Every lead called in 60 seconds",
      "English + 1 additional language",
      "WhatsApp + email engagement",
      "Live inventory grounding",
      "Qualify, book viewings + escalate to closers",
      "Email support",
    ],
    cta: "Get started",
    featured: false,
  },
  {
    name: "Business",
    price: "AED 5,000",
    cadence: "/ month",
    desc: "Multiple agents working voice, WhatsApp, and email across your full pipeline, watched from one command center.",
    features: [
      "Up to 3 AI sales agents",
      "Multilingual voice + WhatsApp + email",
      "3 languages supported",
      "Live inventory grounding across listings",
      "Single command-center inbox",
      "Hot buyers escalated to human closers",
      "Programmable agents per team",
      "Priority support",
    ],
    cta: "Get started",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    desc: "Built for UAE real estate teams that need programmable agents per branch, dedicated infrastructure, and UAE compliance guarantees.",
    features: [
      "Unlimited AI sales agents",
      "Programmable agents per business + branch",
      "All 7 languages",
      "Full integration suite — CRM, portals, inventory, payment",
      "Dedicated infrastructure",
      "SLA uptime guarantee",
      "On-site onboarding",
      "24/7 dedicated support",
    ],
    cta: "Talk to us",
    featured: false,
  },
];

const REVENUE_SHARE = [
  { model: "Closed Property Sale", share: "2.5% of closed deal value" },
  { model: "Off-Plan Booking", share: "1.5–2% of unit price" },
  { model: "Qualified Viewing Booked", share: "Fixed fee per booked viewing" },
  { model: "Revived Cold Lead", share: "4–6% of resulting commission" },
];

const FAQS = [
  {
    q: "How long does it take to go live?",
    a: "Most teams have Acre engaging leads within 14 days. Connecting your live inventory feed and proprietary CRM adds 5&ndash;7 days. We deliver a working demo on your real listings in the first 72 hours.",
  },
  {
    q: "Do we need to replace our existing CRM or portals?",
    a: "No. Acre pushes to and pulls from your existing CRM and portals via API. We support Salesforce, HubSpot, Zoho, Property Finder, Bayut, and custom systems &mdash; grounded in your live inventory.",
  },
  {
    q: "What happens when a buyer is ready to close?",
    a: "Acre qualifies the lead, books the viewing, and escalates hot buyers to a human closer in real time &mdash; transferring the full conversation context so your agents never start from scratch.",
  },
  {
    q: "Which languages and channels does Acre cover?",
    a: "Acre engages every lead instantly across voice, WhatsApp, and email in the buyer&apos;s own language. All calls are recorded with consent, stored on UAE-based servers, and fully PDPA-compliant.",
  },
  {
    q: "Can we trial Acre before committing?",
    a: "Yes. We run a 14-day live pilot at no charge for qualifying UAE real estate teams. You&apos;ll see real leads called, qualified, and booked &mdash; before signing anything.",
  },
];

export default function PricingPage() {
  return (
    <>
      <style>{`
        .pr-hero {
          padding: clamp(120px, 18vw, 180px) 0 clamp(64px, 8vw, 96px);
          border-bottom: 1px solid var(--c-border);
        }
        .pr-hero-eyebrow {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--c-copper); margin-bottom: 20px;
        }
        .pr-hero-h {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; text-transform: uppercase;
          font-size: clamp(3rem, 8vw, 5.5rem);
          letter-spacing: -0.02em; line-height: 0.95;
          color: var(--c-ink); margin-bottom: 24px; text-wrap: balance;
        }
        .pr-hero-sub {
          font-size: clamp(15px, 2vw, 17px);
          color: var(--c-ink-2); line-height: 1.65; max-width: 560px;
        }

        /* Tier grid */
        .pr-tiers {
          padding: clamp(72px, 10vw, 120px) 0;
          border-bottom: 1px solid var(--c-border);
        }
        .pr-tier-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--c-border);
          border: 1px solid var(--c-border);
        }
        @media (max-width: 860px) {
          .pr-tier-grid { grid-template-columns: 1fr; }
        }
        .pr-tier-card {
          background: var(--c-surface);
          padding: 40px 32px;
          display: flex; flex-direction: column;
          position: relative;
        }
        .pr-tier-card.featured { background: var(--c-surface2); }

        .pr-featured-badge {
          position: absolute; top: 0; left: 32px;
          background: var(--c-copper); color: var(--c-bg);
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 4px 10px;
        }
        .pr-tier-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 1.2rem;
          text-transform: uppercase; letter-spacing: 0.04em;
          color: var(--c-muted); margin-bottom: 20px;
          padding-top: 8px;
        }
        .pr-tier-card.featured .pr-tier-name { padding-top: 24px; }
        .pr-tier-price {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: clamp(2.4rem, 4vw, 3.2rem);
          letter-spacing: -0.02em; color: var(--c-ink);
          line-height: 1; margin-bottom: 4px;
        }
        .pr-tier-cadence {
          font-size: 12px; color: var(--c-muted);
          margin-bottom: 20px;
        }
        .pr-tier-desc {
          font-size: 13px; color: var(--c-ink-2); line-height: 1.6;
          margin-bottom: 28px;
          border-bottom: 1px solid var(--c-border);
          padding-bottom: 24px;
        }
        .pr-feat-list {
          list-style: none; display: flex; flex-direction: column;
          gap: 10px; flex: 1; margin-bottom: 32px;
        }
        .pr-feat-item {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; color: var(--c-ink-2); line-height: 1.5;
        }
        .pr-feat-icon { flex-shrink: 0; margin-top: 2px; color: var(--c-copper); }

        .pr-tier-cta {
          display: inline-flex; align-items: center; gap: 8px;
          justify-content: center;
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 13px 24px;
          text-decoration: none; transition: opacity 0.15s;
          background: transparent; color: var(--c-ink);
          border: 1px solid var(--c-border);
        }
        .pr-tier-cta:hover { border-color: var(--c-ink-2); }
        .pr-tier-card.featured .pr-tier-cta {
          background: var(--c-copper); color: var(--c-bg);
          border-color: var(--c-copper);
        }
        .pr-tier-card.featured .pr-tier-cta:hover { opacity: 0.86; }

        /* Revenue share */
        .pr-rev {
          padding: clamp(72px, 10vw, 120px) 0;
          border-bottom: 1px solid var(--c-border);
        }
        .pr-rev-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(40px, 6vw, 80px);
          align-items: start;
        }
        @media (max-width: 700px) { .pr-rev-inner { grid-template-columns: 1fr; } }
        .pr-rev-h {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; text-transform: uppercase;
          font-size: clamp(2rem, 5vw, 3.5rem);
          letter-spacing: -0.02em; line-height: 0.95;
          color: var(--c-ink); margin-bottom: 16px; text-wrap: balance;
        }
        .pr-rev-body {
          font-size: 14px; color: var(--c-ink-2); line-height: 1.7;
          margin-bottom: 28px;
        }
        .pr-rev-table { width: 100%; border-collapse: collapse; }
        .pr-rev-table tr { border-bottom: 1px solid var(--c-border); }
        .pr-rev-table tr:last-child { border-bottom: none; }
        .pr-rev-table td {
          padding: 14px 0; font-size: 13px; color: var(--c-ink-2);
        }
        .pr-rev-table td:first-child { color: var(--c-ink); font-weight: 500; }
        .pr-rev-table td:last-child { text-align: right; color: var(--c-copper); }

        /* FAQ */
        .pr-faq {
          padding: clamp(72px, 10vw, 120px) 0;
          border-bottom: 1px solid var(--c-border);
        }
        .pr-faq-h {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; text-transform: uppercase;
          font-size: clamp(1.8rem, 4vw, 3rem);
          letter-spacing: -0.02em; color: var(--c-ink);
          margin-bottom: 48px; text-wrap: balance;
        }
        .pr-faq-list { display: flex; flex-direction: column; gap: 0; }
        .pr-faq-item {
          border-top: 1px solid var(--c-border);
          padding: 24px 0;
        }
        .pr-faq-q {
          font-family: 'Hanken Grotesk', sans-serif;
          font-weight: 600; font-size: 15px; color: var(--c-ink);
          margin-bottom: 10px;
        }
        .pr-faq-a { font-size: 14px; color: var(--c-ink-2); line-height: 1.7; max-width: 680px; }

        /* CTA */
        .pr-cta {
          padding: clamp(80px, 12vw, 140px) 0;
          text-align: center;
        }
        .pr-cta-h {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; text-transform: uppercase;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          letter-spacing: -0.02em; line-height: 0.95;
          color: var(--c-ink); margin-bottom: 24px; text-wrap: balance;
        }
        .pr-cta-sub {
          font-size: 15px; color: var(--c-ink-2); margin-bottom: 36px;
          max-width: 480px; margin-left: auto; margin-right: auto;
          line-height: 1.65;
        }
      `}</style>

      {/* Hero */}
      <section className="pr-hero">
        <div className="c-wrap">
          <Reveal>
            <p className="pr-hero-eyebrow">Pricing</p>
            <h1 className="pr-hero-h">Transparent pricing.<br />No surprises.</h1>
            <p className="pr-hero-sub">Flat monthly subscriptions for predictable budgets, or revenue share when you want zero upfront risk. Every plan includes Acre&apos;s full AI sales force and command center.</p>
          </Reveal>
        </div>
      </section>

      {/* Tiers */}
      <section className="pr-tiers">
        <div className="c-wrap">
          <Reveal>
            <div className="pr-tier-grid">
              {TIERS.map((tier) => (
                <div key={tier.name} className={`pr-tier-card${tier.featured ? " featured" : ""}`}>
                  {tier.featured && <span className="pr-featured-badge">Most popular</span>}
                  <p className="pr-tier-name">{tier.name}</p>
                  <p className="pr-tier-price">{tier.price}</p>
                  {tier.cadence && <p className="pr-tier-cadence">{tier.cadence}</p>}
                  <p className="pr-tier-desc">{tier.desc}</p>
                  <ul className="pr-feat-list">
                    {tier.features.map((f) => (
                      <li key={f} className="pr-feat-item">
                        <span className="pr-feat-icon"><IconCheck size={13} /></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="pr-tier-cta">
                    {tier.cta} <IconArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Revenue share */}
      <section className="pr-rev">
        <div className="c-wrap">
          <div className="pr-rev-inner">
            <Reveal>
              <h2 className="pr-rev-h">Prefer zero upfront risk?</h2>
              <p className="pr-rev-body">For qualifying UAE real estate teams, we offer a performance-aligned model: we deploy and run Acre&apos;s AI sales force, and take a percentage of the commission directly attributable to it. No subscription. No risk until deals close.</p>
              <Link href="/contact" className="c-btn">
                Discuss revenue share <IconArrowRight size={13} />
              </Link>
            </Reveal>
            <Reveal delay={0.12}>
              <table className="pr-rev-table">
                <tbody>
                  {REVENUE_SHARE.map((row) => (
                    <tr key={row.model}>
                      <td>{row.model}</td>
                      <td>{row.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pr-faq">
        <div className="c-wrap">
          <Reveal>
            <h2 className="pr-faq-h">Common questions</h2>
          </Reveal>
          <div className="pr-faq-list">
            {FAQS.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 0.05}>
                <div className="pr-faq-item">
                  <p className="pr-faq-q">{faq.q}</p>
                  <p className="pr-faq-a">{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pr-cta">
        <div className="c-wrap">
          <Reveal>
            <h2 className="pr-cta-h">Start with a<br />14-day free pilot</h2>
            <p className="pr-cta-sub">We deploy Acre on your real enquiries, grounded in your live inventory, no commitment required. You keep every lead, booked viewing, and call recording regardless of what you decide.</p>
            <Link href="/contact" className="c-btn">
              Apply for the pilot <IconArrowRight size={13} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
