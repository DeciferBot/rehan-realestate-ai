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
    id: "lead-response",
    name: "Lead-Response Agent",
    tag: "Voice + WhatsApp",
    headline: "Calls and WhatsApps every new lead in 60 seconds. Brochures delivered before they hang up.",
    body: "Your portals and ad spend run 24/7. Your team doesn't. This Acre agent calls and WhatsApps every inbound lead within 60 seconds — in their own language — opens with your business's persona, and starts the conversation while interest is still hot. Replies are grounded in your live inventory, so it talks real units, real prices, and real payment plans from the first message.",
    capabilities: [
      "60-second voice and WhatsApp first touch",
      "Replies grounded in your live unit inventory",
      "Speaks the lead's own language automatically",
      "Real prices, payment plans, and handover dates",
      "Brochure delivery via WhatsApp mid-conversation",
      "Full transcript logged to your command center",
    ],
    languages: ["Arabic", "English", "Russian", "Hindi", "Mandarin"],
    pricing: "Revenue share or per-business subscription",
    stat: "60s",
    statLabel: "from enquiry to first outbound contact",
    industry: "UAE Real Estate",
  },
  {
    id: "qualifier",
    name: "Qualifier Agent",
    tag: "Voice + WhatsApp",
    headline: "Qualifies every lead on budget, intent, and timeline before your team lifts a finger.",
    body: "Not every enquiry is a buyer. The Qualifier works each lead across voice and WhatsApp in their own language, drawing out budget, intent, timeline, financing, preferred area, and family needs. It scores readiness against your business's criteria so your closers only ever spend time on deals that are real — every answer captured to the dossier.",
    capabilities: [
      "Budget, intent, and timeline discovery",
      "Financing and cash-vs-mortgage check",
      "Preferred area and family-size profiling",
      "Scoring against your qualification criteria",
      "Conversation in the lead's own language",
      "Structured dossier built as it talks",
    ],
    languages: ["Arabic", "English", "Hindi", "Russian"],
    pricing: "Per-business subscription or revenue share",
    stat: "24/7",
    statLabel: "qualification across every timezone",
    industry: "UAE Real Estate",
  },
  {
    id: "inventory-concierge",
    name: "Inventory Concierge",
    tag: "Voice + WhatsApp",
    headline: "Answers any project or unit question from your live availability — instantly, accurately.",
    body: "Buyers ask about floors, views, sizes, payment plans, and handover dates at all hours. The Inventory Concierge answers from your business's live inventory — ingested straight from developer availability PDFs across Arada projects like Akala, W Residences, Inaura, and Masaar — so every reply quotes real units and real numbers. No outdated PDFs forwarded by hand, no broker on hold.",
    capabilities: [
      "Live inventory ingested from developer PDFs",
      "Real units, prices, sizes, and floor plans",
      "Payment-plan and handover-date answers",
      "Arada projects: Akala, W Residences, Inaura, Masaar",
      "Mortgage math in the buyer's own currency",
      "Always current — never a stale brochure",
    ],
    languages: ["Arabic", "English", "Russian", "Mandarin"],
    pricing: "Per-business subscription or revenue share",
    stat: "100%",
    statLabel: "of unit questions answered, day or night",
    industry: "UAE Real Estate",
  },
  {
    id: "appointment-booker",
    name: "Appointment Booker",
    tag: "Voice + WhatsApp",
    headline: "Turns interested buyers into confirmed viewings without a coordinator in the loop.",
    body: "A qualified buyer cools fast without a date in the diary. The Appointment Booker proposes times, checks your brokers' live availability, locks the viewing for the matched units, and confirms over WhatsApp — with a branded reminder sequence and a no-show re-book flow. Every booking lands in your command center against the lead's dossier.",
    capabilities: [
      "Live broker calendar availability check",
      "Viewings booked for the matched units",
      "Confirmation in the buyer's own language",
      "Branded WhatsApp reminder sequence",
      "Automated 24h and 1h reminders",
      "No-show re-booking workflow",
    ],
    languages: ["Arabic", "English", "Hindi", "Russian"],
    pricing: "Per-business subscription or revenue share",
    stat: "5 min",
    statLabel: "from qualified lead to confirmed viewing",
    industry: "UAE Real Estate",
  },
  {
    id: "whatsapp-brochure",
    name: "WhatsApp & Brochure Agent",
    tag: "WhatsApp + Email",
    headline: "Keeps every buyer warm on WhatsApp and email with the right brochure, not bulk blasts.",
    body: "Buyers go quiet, but they do not disappear. This Acre agent works your pipeline across WhatsApp and email in each buyer's language, sends the exact brochure for the units they care about, answers objections in real time from live inventory, and nudges them back toward a viewing — with a personalised follow-up sequence instead of a generic blast.",
    capabilities: [
      "Personalised WhatsApp and email follow-up",
      "Right-unit brochures from live inventory",
      "Objection handling grounded in real pricing",
      "Outreach in the buyer's own language",
      "Re-engagement of quiet leads at the right moment",
      "Every touch logged to the command center",
    ],
    languages: ["Arabic", "English", "Hindi", "Russian"],
    pricing: "Per-business subscription or revenue share",
    stat: "5+",
    statLabel: "languages across WhatsApp and email",
    industry: "UAE Real Estate",
  },
  {
    id: "closer-handoff",
    name: "Closer Hand-off / Dossier",
    tag: "Command Center",
    headline: "Escalates hot buyers to your human closers with a full dossier and one-click take-over.",
    body: "When a buyer is ready, speed and context win the deal. This Acre agent detects intent, escalates the hot buyer to the right human closer, and hands over a complete dossier — budget, intent, timeline, financing, preferred area, recommended units, and mortgage math. Your closer opens the command center, sees the whole conversation across voice, WhatsApp, and email, and takes over in one click.",
    capabilities: [
      "Hot-buyer detection and instant escalation",
      "Full dossier: budget, intent, timeline, financing",
      "Recommended units plus live mortgage math",
      "One unified inbox across voice, WhatsApp, email",
      "One-click human take-over mid-conversation",
      "Escalation rules programmable per business",
    ],
    languages: ["Arabic", "English", "Hindi", "Russian", "Mandarin"],
    pricing: "Per-business subscription or revenue share",
    stat: "1-click",
    statLabel: "human take-over with full context",
    industry: "UAE Real Estate",
  },
];

const INDUSTRIES = [
  { label: "Off-Plan Sales", Icon: IconBuilding },
  { label: "Secondary Market", Icon: IconHospital },
  { label: "Developer Sales", Icon: IconShoppingBag },
  { label: "Investor Relations", Icon: IconGraduationCap },
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
            <p className="sol-hero-eyebrow">Acre AI Agents</p>
            <h1 className="sol-hero-h">Six agents.<br />Every lead covered.</h1>
            <p className="sol-hero-sub">An AI sales force for UAE developers, brokers, and institutional landlords. Voice, WhatsApp, and email agents for every stage of the deal — from first enquiry to closer hand-off. Each one is grounded in your live inventory and built for a specific outcome, not a general capability.</p>
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
                        href="/contact"
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
              <h2 className="sol-ind-h">Built for every desk</h2>
              <div className="sol-ind-tiles">
                {INDUSTRIES.map(({ label, Icon }) => (
                  <div key={label} className="sol-ind-tile">
                    <Icon size={15} /> {label}
                  </div>
                ))}
                <div className="sol-ind-tile">
                  <IconClock size={15} /> Leasing
                </div>
                <div className="sol-ind-tile">
                  <IconGlobe size={15} /> Holiday Homes
                </div>
                <div className="sol-ind-tile">
                  <IconGlobe size={15} /> Mortgage Brokerage
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
            <h2 className="sol-cta-h">Not sure which<br />agent fits your desk?</h2>
            <p className="sol-cta-sub">Book a 30-minute call. We&apos;ll map your lead flow to the right Acre agents and show you a working prototype on your own inventory before any commitment.</p>
            <Link href="/contact" className="c-btn">
              Book a discovery call <IconArrowRight size={13} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
