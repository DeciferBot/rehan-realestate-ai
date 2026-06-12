"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import {
  IconArrowRight, IconCheck, IconGlobe, IconClock,
  IconBuilding, IconHospital, IconShoppingBag, IconGraduationCap,
} from "@/components/AitaasIcons";

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

const AGENTS = [
  {
    id: "property-sales",
    name: "Property Sales Agent",
    tag: "Voice",
    headline: "Calls every lead in 60 seconds. Brochures delivered before they hang up.",
    body: "Your ads run 24/7. Your team doesn't. This agent calls every inbound lead within 60 seconds of enquiry — in their language — qualifies budget and timeline, delivers matched brochures to WhatsApp mid-call, and books the viewing. By the time your human agent picks up the file, the appointment is already confirmed.",
    capabilities: [
      "Lead qualification: budget, timeline, preferences",
      "Property matching from live inventory",
      "Brochure delivery via WhatsApp mid-call",
      "Viewing and callback booking",
      "Mortgage breakdown in the lead's currency",
      "Full transcript and dossier to CRM",
    ],
    languages: ["Arabic", "English", "Russian", "Hindi", "Mandarin"],
    pricing: "Revenue share (2.5% closed) or subscription",
    stat: "60s",
    statLabel: "from enquiry to first outbound call",
    industry: "Real Estate",
  },
  {
    id: "revenue-recovery",
    name: "Revenue Recovery Agent",
    tag: "Voice",
    headline: "Recovers overdue payments without a collections team.",
    body: "Automated payment calls that sound nothing like a robot. The Revenue Recovery Agent contacts overdue accounts at the right time, in the right language, with empathy and a clear path to resolution. It accepts card payments, sets up installment plans, and updates your billing system in real time.",
    capabilities: [
      "Overdue account detection via CRM or billing API",
      "Outbound call in customer's preferred language",
      "Flexible repayment plan negotiation",
      "Secure payment link delivery via SMS/WhatsApp",
      "Escalation routing for high-value accounts",
      "Real-time billing system updates",
    ],
    languages: ["Arabic", "English", "Hindi", "Urdu"],
    pricing: "Performance share (8–12% of recovered amount) or flat subscription",
    stat: "24/7",
    statLabel: "outreach across every timezone",
    industry: "Finance & Collections",
  },
  {
    id: "appointment-booking",
    name: "Appointment Booking Agent",
    tag: "Voice + Digital",
    headline: "Converts web enquiries into confirmed bookings without staff intervention.",
    body: "Every missed call, late-night form, or weekend enquiry becomes a confirmed appointment. The Booking Agent reaches out immediately, qualifies the request, checks live calendar availability, and sends a confirmation — complete with preparation instructions and a branded reminder sequence.",
    capabilities: [
      "24/7 inbound enquiry response",
      "Live calendar integration (Google, Outlook, Calendly)",
      "Multi-resource scheduling with conflict resolution",
      "Branded SMS and WhatsApp confirmation",
      "Automated 24h and 1h reminder sequence",
      "No-show re-booking workflow",
    ],
    languages: ["Arabic", "English", "French", "Hindi"],
    pricing: "Per booking or monthly subscription",
    stat: "100%",
    statLabel: "of enquiries answered, day or night",
    industry: "Healthcare, Beauty, Legal, Education",
  },
  {
    id: "leasing",
    name: "Leasing Agent",
    tag: "Voice",
    headline: "Handles unit enquiries, qualifying, and move-in scheduling end to end.",
    body: "Rental inventory does not sell itself. The Leasing Agent responds to every portal enquiry, qualifies tenants on income and move-in date, schedules viewings for the right units, and sends the application link — all before a property manager sees the lead.",
    capabilities: [
      "Portal and website lead intake",
      "Tenant qualification: income, move-in date, preferences",
      "Unit matching from live availability",
      "Viewing coordination and confirmation",
      "Application link delivery and follow-up",
      "Rejection handling with alternative suggestions",
    ],
    languages: ["Arabic", "English", "Hindi", "Tagalog"],
    pricing: "Per signed lease or monthly subscription",
    stat: "5 min",
    statLabel: "from portal lead to first call",
    industry: "Real Estate, Property Management",
  },
  {
    id: "cart-recovery",
    name: "Cart Recovery Agent",
    tag: "Digital",
    headline: "Recovers abandoned carts with personalised outreach, not bulk SMS blasts.",
    body: "One-size SMS blasts go unread. This agent reaches customers who abandoned high-value carts with a personalised WhatsApp sequence, offers a time-bound incentive, answers objections in real time, and guides them back to checkout — then closes via a direct payment link.",
    capabilities: [
      "Abandoned cart detection via Shopify/WooCommerce webhook",
      "Personalised WhatsApp outreach within 15 minutes",
      "Objection handling in natural language",
      "Time-bound discount or offer delivery",
      "Direct-to-checkout payment link",
      "Post-purchase upsell and review request",
    ],
    languages: ["Arabic", "English", "Hindi"],
    pricing: "Revenue share (4–6%) or monthly subscription",
    stat: "15 min",
    statLabel: "from abandonment to outreach",
    industry: "E-commerce, Retail",
  },
  {
    id: "admissions",
    name: "Admissions Agent",
    tag: "Voice + Digital",
    headline: "Turns programme enquiries into enrolled students without admissions staff overhead.",
    body: "Prospective students enquire at all hours. The Admissions Agent responds immediately, walks through programme fit, confirms intake dates, answers fee and scholarship questions, and hands the applicant a pre-filled application form — all in the language they asked in.",
    capabilities: [
      "24/7 enquiry response across web, WhatsApp, SMS",
      "Programme fit and eligibility assessment",
      "Scholarship and payment plan information",
      "Application form pre-fill and submission guidance",
      "Follow-up sequence for incomplete applications",
      "Open day and tour booking",
    ],
    languages: ["Arabic", "English", "Hindi", "French", "Mandarin"],
    pricing: "Per enrolled student or monthly subscription",
    stat: "5",
    statLabel: "languages, including Mandarin",
    industry: "Education, Training",
  },
];

const INDUSTRIES = [
  { label: "Real Estate", Icon: IconBuilding },
  { label: "Healthcare", Icon: IconHospital },
  { label: "E-commerce", Icon: IconShoppingBag },
  { label: "Education", Icon: IconGraduationCap },
];

export default function SolutionsPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <style>{`
        .sol-hero {
          padding: clamp(120px, 18vw, 180px) 0 clamp(64px, 8vw, 96px);
          border-bottom: 1px solid var(--c-border);
        }
        .sol-hero-eyebrow {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--c-copper);
          margin-bottom: 20px;
        }
        .sol-hero-h {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; text-transform: uppercase;
          font-size: clamp(3rem, 8vw, 5.5rem);
          letter-spacing: -0.02em; line-height: 0.95;
          color: var(--c-ink); margin-bottom: 24px;
          text-wrap: balance;
        }
        .sol-hero-sub {
          font-size: clamp(15px, 2vw, 17px);
          color: var(--c-ink-2); line-height: 1.65;
          max-width: 580px;
        }

        .sol-grid {
          padding: clamp(72px, 10vw, 120px) 0;
          display: flex; flex-direction: column; gap: 2px;
          border-bottom: 1px solid var(--c-border);
        }

        .sol-card {
          border: 1px solid var(--c-border);
          background: var(--c-surface);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          overflow: hidden;
        }
        .sol-card:hover { border-color: var(--c-copper); }
        .sol-card.is-open { border-color: var(--c-copper); background: var(--c-surface2); }

        .sol-card-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          padding: 28px 32px;
          gap: 20px;
        }
        @media (max-width: 600px) { .sol-card-header { padding: 20px; } }

        .sol-card-left { display: flex; align-items: center; gap: 20px; }
        .sol-card-stat {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: clamp(2.2rem, 4vw, 3rem);
          letter-spacing: -0.02em; color: var(--c-copper);
          line-height: 1; white-space: nowrap;
          min-width: 80px;
        }
        .sol-card-meta { display: flex; flex-direction: column; gap: 4px; }
        .sol-card-tag {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--c-muted);
        }
        .sol-card-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: clamp(1.3rem, 3vw, 1.75rem);
          letter-spacing: -0.01em; color: var(--c-ink);
          text-transform: uppercase; line-height: 1;
        }
        .sol-card-hl {
          font-size: 13px; color: var(--c-ink-2); line-height: 1.5;
          max-width: 420px;
        }
        .sol-card-toggle {
          width: 36px; height: 36px;
          border: 1px solid var(--c-border); background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          color: var(--c-muted); transition: color 0.15s, border-color 0.15s;
        }
        .sol-card:hover .sol-card-toggle,
        .sol-card.is-open .sol-card-toggle {
          color: var(--c-copper); border-color: var(--c-copper);
        }
        .sol-card-toggle svg { transition: transform 0.25s var(--c-ease); }
        .sol-card.is-open .sol-card-toggle svg { transform: rotate(45deg); }

        .sol-card-body {
          overflow: hidden;
          border-top: 1px solid var(--c-border);
        }
        .sol-card-inner {
          padding: 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 700px) {
          .sol-card-inner { grid-template-columns: 1fr; gap: 24px; padding: 20px; }
        }
        .sol-card-desc {
          font-size: 14px; color: var(--c-ink-2); line-height: 1.7;
          margin-bottom: 20px;
        }
        .sol-cap-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .sol-cap-item {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; color: var(--c-ink-2); line-height: 1.5;
        }
        .sol-cap-icon { flex-shrink: 0; margin-top: 2px; color: var(--c-copper); }

        .sol-meta-col { display: flex; flex-direction: column; gap: 24px; }
        .sol-meta-block {}
        .sol-meta-label {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--c-muted); margin-bottom: 8px;
        }
        .sol-meta-pills { display: flex; flex-wrap: wrap; gap: 6px; }
        .sol-meta-pill {
          font-size: 11px; font-weight: 500;
          padding: 4px 10px;
          border: 1px solid var(--c-border);
          color: var(--c-ink-2);
          display: flex; align-items: center; gap: 5px;
        }
        .sol-meta-pill svg { color: var(--c-copper); }
        .sol-meta-pricing {
          font-size: 13px; color: var(--c-ink-2);
          border-left: 2px solid var(--c-copper);
          padding-left: 12px; line-height: 1.5;
        }
        .sol-card-cta {
          margin-top: 28px;
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--c-copper); color: var(--c-bg);
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 11px 22px;
          text-decoration: none; transition: opacity 0.15s;
        }
        .sol-card-cta:hover { opacity: 0.86; }

        /* Industries strip */
        .sol-ind {
          padding: clamp(64px, 8vw, 96px) 0;
          border-bottom: 1px solid var(--c-border);
        }
        .sol-ind-row {
          display: flex; align-items: center;
          gap: clamp(32px, 5vw, 64px);
          flex-wrap: wrap;
        }
        .sol-ind-h {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; text-transform: uppercase;
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          letter-spacing: -0.01em; color: var(--c-ink);
          flex-shrink: 0; min-width: 200px;
        }
        .sol-ind-tiles {
          display: flex; gap: 12px; flex-wrap: wrap; flex: 1;
        }
        .sol-ind-tile {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 18px;
          border: 1px solid var(--c-border);
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 13px; font-weight: 500;
          color: var(--c-ink-2);
          transition: border-color 0.2s, color 0.2s;
        }
        .sol-ind-tile:hover { border-color: var(--c-copper); color: var(--c-ink); }
        .sol-ind-tile svg { color: var(--c-copper); }

        /* CTA section */
        .sol-cta {
          padding: clamp(80px, 12vw, 140px) 0;
          text-align: center;
        }
        .sol-cta-h {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; text-transform: uppercase;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          letter-spacing: -0.02em; line-height: 0.95;
          color: var(--c-ink); margin-bottom: 24px;
          text-wrap: balance;
        }
        .sol-cta-sub {
          font-size: 15px; color: var(--c-ink-2); margin-bottom: 36px;
          max-width: 480px; margin-left: auto; margin-right: auto;
          line-height: 1.65;
        }
      `}</style>

      {/* Hero */}
      <section className="sol-hero c-sect">
        <div className="c-wrap">
          <Reveal>
            <p className="sol-hero-eyebrow">AI Agents</p>
            <h1 className="sol-hero-h">Six agents.<br />Every revenue gap covered.</h1>
            <p className="sol-hero-sub">Voice and digital agents for every stage of the customer journey — from first enquiry to collected payment. Each one is built for a specific outcome, not a general capability.</p>
          </Reveal>
        </div>
      </section>

      {/* Agents accordion */}
      <section className="c-wrap">
        <div className="sol-grid">
          {AGENTS.map((agent, i) => {
            const open = active === agent.id;
            return (
              <div
                key={agent.id}
                className={`sol-card${open ? " is-open" : ""}`}
                onClick={() => setActive(open ? null : agent.id)}
              >
                <div className="sol-card-header">
                  <div className="sol-card-left">
                    <div className="sol-card-stat">{agent.stat}</div>
                    <div className="sol-card-meta">
                      <span className="sol-card-tag">{agent.tag} · {agent.industry}</span>
                      <span className="sol-card-name">{agent.name}</span>
                      <span className="sol-card-hl">{agent.headline}</span>
                    </div>
                  </div>
                  <button className="sol-card-toggle" aria-label={open ? "Collapse" : "Expand"} onClick={(e) => { e.stopPropagation(); setActive(open ? null : agent.id); }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1.5"/>
                      <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </button>
                </div>

                <motion.div
                  className="sol-card-body"
                  initial={false}
                  animate={{ height: open ? "auto" : 0 }}
                  transition={{ duration: 0.38, ease: E }}
                >
                  <div className="sol-card-inner">
                    <div>
                      <p className="sol-card-desc">{agent.body}</p>
                      <ul className="sol-cap-list">
                        {agent.capabilities.map((c) => (
                          <li key={c} className="sol-cap-item">
                            <span className="sol-cap-icon"><IconCheck size={13} /></span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="sol-meta-col">
                      <div className="sol-meta-block">
                        <p className="sol-meta-label">Languages</p>
                        <div className="sol-meta-pills">
                          {agent.languages.map((l) => (
                            <span key={l} className="sol-meta-pill">
                              <IconGlobe size={10} /> {l}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="sol-meta-block">
                        <p className="sol-meta-label">Pricing model</p>
                        <p className="sol-meta-pricing">{agent.pricing}</p>
                      </div>
                      <div className="sol-meta-block">
                        <p className="sol-meta-label">Key result</p>
                        <p className="sol-meta-pricing" style={{ borderColor: "var(--c-border)" }}>
                          <strong style={{ color: "var(--c-copper)" }}>{agent.stat}</strong> {agent.statLabel}
                        </p>
                      </div>
                      <Link
                        href="/aitaas/contact"
                        className="sol-card-cta"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Deploy this agent <IconArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Industries */}
      <section className="sol-ind">
        <div className="c-wrap">
          <Reveal>
            <div className="sol-ind-row">
              <h2 className="sol-ind-h">Industries served</h2>
              <div className="sol-ind-tiles">
                {INDUSTRIES.map(({ label, Icon }) => (
                  <div key={label} className="sol-ind-tile">
                    <Icon size={15} /> {label}
                  </div>
                ))}
                <div className="sol-ind-tile">
                  <IconClock size={15} /> Hospitality
                </div>
                <div className="sol-ind-tile">
                  <IconGlobe size={15} /> Automotive
                </div>
                <div className="sol-ind-tile">
                  <IconGlobe size={15} /> Financial Services
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="sol-cta">
        <div className="c-wrap">
          <Reveal>
            <h2 className="sol-cta-h">Not sure which<br />agent fits your problem?</h2>
            <p className="sol-cta-sub">Book a 30-minute call. We will map your revenue gaps to the right agents and show you a working prototype before any commitment.</p>
            <Link href="/aitaas/contact" className="c-btn">
              Book a discovery call <IconArrowRight size={13} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
