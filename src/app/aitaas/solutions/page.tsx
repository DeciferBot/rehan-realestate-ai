"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
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

const FILTERS = ["All", "Voice Agents", "Digital Agents"];

const SOLUTIONS = [
  {
    num: "01",
    name: "Property Sales Agent",
    type: "Voice Agents",
    industry: "Real Estate",
    headline: "Calls every lead in 60 seconds. Brochures delivered before they hang up.",
    description: "Your ads run 24/7 but your team doesn't. The Property Sales Agent calls every inbound lead within 60 seconds of their enquiry — in their language — qualifies their budget, timeline, and preferences, and delivers matched property brochures directly to their WhatsApp mid-call. By the time your human agent gets involved, the viewing is already booked.",
    capabilities: [
      "Lead qualification: budget, timeline, lifestyle preferences",
      "Property matching from live inventory",
      "Brochure and floor plan delivery via WhatsApp mid-call",
      "In-office viewing and callback booking",
      "Mortgage and EMI breakdown in the lead's currency",
      "School catchment reports for family buyers",
      "Full call transcript and lead dossier to CRM",
    ],
    languages: ["Arabic", "English", "Russian", "Hindi", "Mandarin"],
    model: "Revenue Share (2.5% of closed deal) or Subscription",
    stat: "78% of deals go to the first responder",
  },
  {
    num: "02",
    name: "Revenue Recovery Agent",
    type: "Voice Agents",
    industry: "Finance & Collections",
    headline: "Recovers overdue payments without a collections team.",
    description: "Late payments are expensive and awkward. The Revenue Recovery Agent parses your aging receivables, generates personalised statements of account, and runs a structured 15-day collection cadence across voice and WhatsApp. It handles objections, generates payment links in-call, offers payment plans, and escalates only the genuinely difficult cases to your team.",
    capabilities: [
      "Aging file parsing and prioritisation",
      "Personalised statement of account generation",
      "15-day voice + WhatsApp collection cadence",
      "Payment link generation mid-call",
      "Structured payment plan offers",
      "Objection handling and negotiation flows",
      "Full escalation to human with context payload",
    ],
    languages: ["Arabic", "English", "Hindi", "Urdu"],
    model: "Subscription from AED 2,500/month",
    stat: "Up to 3× faster collection cycles",
  },
  {
    num: "03",
    name: "Healthcare Booking Agent",
    type: "Voice Agents",
    industry: "Clinics & Healthcare",
    headline: "Handles every patient call. Books every appointment. Works nights and weekends.",
    description: "Your clinic cannot afford to miss a patient call, but staffing a phone line around the clock isn't practical. The Healthcare Booking Agent handles inbound calls for dental practices, medical clinics, and specialist centres — matching patients to the right doctor and room, sending appointment confirmations and preparation guides to WhatsApp, and managing rescheduling without human intervention.",
    capabilities: [
      "Doctor and specialist matching by symptom and preference",
      "Room and resource conflict checking",
      "Appointment confirmation and prep guide delivery",
      "Insurance pre-authorisation capture",
      "Reminder and no-show reduction calls",
      "Post-visit follow-up and review requests",
      "Multilingual patient communication",
    ],
    languages: ["Arabic", "English", "Hindi", "Urdu"],
    model: "Subscription from AED 2,500/month",
    stat: "Zero missed calls after hours",
  },
  {
    num: "04",
    name: "Cart Recovery Agent",
    type: "Voice Agents",
    industry: "Retail & E-commerce",
    headline: "Calls abandoned cart customers before your competitors do.",
    description: "83% of online shopping carts are abandoned. Email re-targeting barely reaches 20% open rates. The Cart Recovery Agent calls your abandoned cart customers within minutes, addresses their objections in their language, generates BNPL payment links for hesitant buyers, and bridges the conversation to WhatsApp for follow-up. It operates across multiple brands simultaneously — one agent, unlimited SKUs.",
    capabilities: [
      "Abandoned cart and browse detection via webhook",
      "Outbound voice call within minutes of abandonment",
      "Objection handling for price, delivery, and trust",
      "BNPL and instalment link generation",
      "WhatsApp bridge for product imagery and reviews",
      "Multi-brand product handling",
      "Recovery attribution and reporting",
    ],
    languages: ["Arabic", "English", "Hindi"],
    model: "Subscription + per-call usage",
    stat: "Reaches buyers before competitors do",
  },
  {
    num: "05",
    name: "Admissions Agent",
    type: "Voice Agents",
    industry: "Education",
    headline: "Converts enquiries into enrolments. In every language your students speak.",
    description: "Universities and schools in the UAE receive enquiries from dozens of nationalities speaking as many languages. The Admissions Agent matches each prospect to the right programme, scores their scholarship eligibility, answers FAQs with verified institutional knowledge, and books campus tours — all in the caller's native language. No wrong department transfers, no missed language.",
    capabilities: [
      "Programme matching by interest, qualification, and budget",
      "Scholarship and financial aid eligibility scoring",
      "Campus tour and open day booking",
      "Parent and student dual-language handling",
      "Verified FAQ handling from institutional knowledge base",
      "Application document checklist delivery via WhatsApp",
      "Follow-up sequence for unconverted enquiries",
    ],
    languages: ["Arabic", "English", "Hindi", "Urdu", "Mandarin"],
    model: "Subscription from AED 2,500/month",
    stat: "35%+ appointment conversion target",
  },
  {
    num: "06",
    name: "Inbound Qualifier & Proposal Engine",
    type: "Digital Agents",
    industry: "Enterprise & Professional Services",
    headline: "Qualifies every inbound enquiry. Generates a branded proposal before you reply.",
    description: "Every inbound lead deserves a fast, professional response — but building proposals takes hours. The Inbound Qualifier captures and scores your inbound leads, extracts pricing intelligence, renders a branded Excel or PDF proposal, queues it for executive approval, and auto-sends it on sign-off. Your prospects receive a polished commercial response in hours, not days.",
    capabilities: [
      "Inbound call or form qualification",
      "Lead scoring and prioritisation",
      "Pricing intelligence and benchmarking",
      "Branded proposal generation (Excel + PDF)",
      "Executive approval queue and notification",
      "Auto-send on approval",
      "CRM push and follow-up scheduling",
    ],
    languages: ["Arabic", "English"],
    model: "Subscription from AED 5,000/month",
    stat: "Proposals delivered in hours, not days",
  },
  {
    num: "07",
    name: "Multilingual Sales Fleet",
    type: "Digital Agents",
    industry: "Enterprise & B2B Sales",
    headline: "An outbound sales team in 7 languages. Operating simultaneously.",
    description: "Building a multilingual outbound sales team is expensive and slow. The Multilingual Sales Fleet handles LinkedIn prospecting, gatekeeper navigation, outbound calling, and meeting booking across 7 languages simultaneously. Each persona is culturally adapted — not just translated. The fleet handles its own objections, drops voicemails, and advances every qualified prospect toward a booked meeting.",
    capabilities: [
      "LinkedIn prospect extraction and enrichment",
      "Gatekeeper identification and navigation",
      "Outbound calling in 7 languages with cultural tone matching",
      "Objection handling and persistence logic",
      "Voicemail dropping and LinkedIn message sequencing",
      "Meeting booking direct to calendar",
      "DNC compliance and contact management",
    ],
    languages: ["Arabic", "English", "Hindi", "Urdu", "Russian", "Mandarin", "Egyptian Arabic"],
    model: "Subscription from AED 7,500/month",
    stat: "7 languages, 1 deployment",
  },
  {
    num: "08",
    name: "Social Media Executive",
    type: "Digital Agents",
    industry: "Marketing & Media",
    headline: "Creates, publishes, and optimises your social presence. Autonomously.",
    description: "Great social media requires daily content, creative consistency, and platform-specific optimisation. The Social Media Executive handles the full content cycle — writing copy, generating images and video, building carousels, scheduling posts, and analysing performance. It operates on your monthly calendar autonomously, surfacing only strategic decisions for human approval.",
    capabilities: [
      "Monthly, weekly, and daily content planning",
      "AI copy generation with brand voice matching",
      "Image, video, and carousel creation",
      "Multi-platform publishing and scheduling",
      "Performance analysis and optimisation",
      "Brand guideline enforcement",
      "Monthly content calendar and reporting",
    ],
    languages: ["Arabic", "English"],
    model: "Subscription from AED 5,000/month",
    stat: "24/7 autonomous content operations",
  },
  {
    num: "09",
    name: "Business Discovery Agent",
    type: "Voice Agents",
    industry: "Professional Services",
    headline: "Handles every discovery call. Qualifies, pitches, and books the next step.",
    description: "Your best clients come from your fastest responses. The Business Discovery Agent handles inbound discovery calls — qualifying the prospect's need, sharing relevant capability overviews, and booking follow-up calls with your sales director. It sends a proposal pack to WhatsApp before the call ends. Your team meets only the qualified pipeline.",
    capabilities: [
      "Inbound call handling and immediate response",
      "Needs qualification and scoring",
      "Capability overview delivery",
      "Proposal pack generation and WhatsApp delivery",
      "Sales director calendar booking",
      "CRM push with full call summary",
      "Follow-up sequence for cold prospects",
    ],
    languages: ["Arabic", "English"],
    model: "Subscription from AED 2,500/month",
    stat: "Your team meets only qualified pipeline",
  },
];

export default function SolutionsPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? SOLUTIONS : SOLUTIONS.filter((s) => s.type === filter);

  return (
    <>
      <style>{`
        .sp-hero {
          padding: 140px clamp(20px, 6vw, 88px) 80px;
          border-bottom: 1px solid var(--a-border);
        }
        .sp-hero-tag {
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--a-amber); margin-bottom: 24px;
        }
        .sp-hero-head {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 400; line-height: 1.0; letter-spacing: -0.03em;
          color: var(--a-ink); max-width: 800px; text-wrap: balance;
          margin-bottom: 28px;
        }
        .sp-hero-head em { font-style: italic; color: var(--a-amber); }
        .sp-hero-body {
          font-size: 16px; color: var(--a-ink-2); line-height: 1.75;
          max-width: 56ch;
        }
        .sp-filters {
          display: flex; gap: 0; border: 1px solid var(--a-border);
          width: fit-content; margin-bottom: 64px;
        }
        .sp-filter {
          padding: 10px 24px; font-size: 12px; letter-spacing: 0.08em;
          text-transform: uppercase; cursor: pointer; border: none;
          background: transparent; color: var(--a-muted);
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          border-right: 1px solid var(--a-border); transition: all 0.18s;
        }
        .sp-filter:last-child { border-right: none; }
        .sp-filter.active, .sp-filter:hover { background: var(--a-amber); color: var(--a-bg); }
        .sp-grid { display: flex; flex-direction: column; gap: 1px; }
        .sp-card {
          display: grid; grid-template-columns: 280px 1fr; gap: 0;
          background: var(--a-surface); border: 1px solid var(--a-border);
          border-bottom: none; overflow: hidden;
          transition: background 0.22s;
        }
        .sp-card:last-child { border-bottom: 1px solid var(--a-border); }
        .sp-card-left {
          padding: clamp(28px, 4vw, 48px); border-right: 1px solid var(--a-border);
          display: flex; flex-direction: column; gap: 0;
        }
        .sp-card-num {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--a-amber); margin-bottom: 8px;
        }
        .sp-card-industry {
          font-size: 10px; letter-spacing: 0.10em; text-transform: uppercase;
          color: var(--a-muted); margin-bottom: 20px;
        }
        .sp-card-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.6rem; font-weight: 400; color: var(--a-ink);
          letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 24px;
        }
        .sp-card-langs {
          display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px;
        }
        .sp-card-lang {
          font-size: 10px; color: var(--a-muted); letter-spacing: 0.08em;
          text-transform: uppercase; border: 1px solid var(--a-border);
          padding: 3px 8px;
        }
        .sp-card-model {
          font-size: 12px; color: var(--a-amber); margin-top: auto;
          padding-top: 20px; border-top: 1px solid var(--a-border);
        }
        .sp-card-right {
          padding: clamp(28px, 4vw, 48px); display: flex; flex-direction: column; gap: 24px;
        }
        .sp-card-headline {
          font-family: 'DM Serif Display', serif;
          font-size: 1.25rem; font-weight: 400; color: var(--a-ink);
          letter-spacing: -0.01em; line-height: 1.3;
        }
        .sp-card-desc { font-size: 14px; color: var(--a-ink-2); line-height: 1.8; max-width: 60ch; }
        .sp-cap-label {
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--a-muted); margin-bottom: 14px;
        }
        .sp-caps { display: flex; flex-direction: column; gap: 8px; }
        .sp-cap {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13px; color: var(--a-ink-2); line-height: 1.5;
        }
        .sp-cap-dot { color: var(--a-amber); flex-shrink: 0; margin-top: 2px; }
        .sp-card-stat {
          font-size: 12px; color: var(--a-amber); letter-spacing: 0.04em;
          border-top: 1px solid var(--a-border); padding-top: 20px;
        }
        .sp-cta {
          background: var(--a-surface); border: 1px solid var(--a-border);
          padding: clamp(40px, 5vw, 72px); margin-top: 72px;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 32px;
        }
        .sp-cta-head {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.6rem, 2.5vw, 2.4rem);
          font-weight: 400; color: var(--a-ink); letter-spacing: -0.025em;
          text-wrap: balance; max-width: 480px;
        }
        .sp-cta-head em { font-style: italic; color: var(--a-amber); }
        @media (max-width: 860px) {
          .sp-card { grid-template-columns: 1fr; }
          .sp-card-left { border-right: none; border-bottom: 1px solid var(--a-border); }
        }
      `}</style>

      {/* HERO */}
      <section className="sp-hero">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div className="sp-hero-tag"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >AI Agent Products</motion.div>
          <motion.h1 className="sp-hero-head"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: E, delay: 0.3 }}
          >
            Nine AI workers.<br /><em>One platform.</em>
          </motion.h1>
          <motion.p className="sp-hero-body"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: E, delay: 0.5 }}
          >
            Every agent is configured from the same battle-tested platform — voice, intelligence, and integrations included.
            Pick the vertical, set up in ~2 weeks, and deploy a worker that never sleeps.
          </motion.p>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="a-section">
        <div className="a-inner">
          <FadeUp>
            <div className="sp-filters">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={`sp-filter${filter === f ? " active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </FadeUp>

          <div className="sp-grid">
            {filtered.map((sol, i) => (
              <FadeUp key={sol.num} delay={i * 0.04}>
                <div className="sp-card">
                  <div className="sp-card-left">
                    <div className="sp-card-num">{sol.num}</div>
                    <div className="sp-card-industry">{sol.industry}</div>
                    <h2 className="sp-card-name">{sol.name}</h2>
                    <div className="sp-card-langs">
                      {sol.languages.map((l) => (
                        <span key={l} className="sp-card-lang">{l}</span>
                      ))}
                    </div>
                    <div className="sp-card-model">{sol.model}</div>
                  </div>
                  <div className="sp-card-right">
                    <h3 className="sp-card-headline">{sol.headline}</h3>
                    <p className="sp-card-desc">{sol.description}</p>
                    <div>
                      <div className="sp-cap-label">Capabilities</div>
                      <div className="sp-caps">
                        {sol.capabilities.map((c) => (
                          <div key={c} className="sp-cap">
                            <span className="sp-cap-dot">·</span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="sp-card-stat">{sol.stat}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.1}>
            <div className="sp-cta">
              <h2 className="sp-cta-head">
                Not sure which agent your business needs? <em>Talk to us.</em>
              </h2>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link href="/aitaas/contact" className="a-btn">Book a Discovery Call</Link>
                <Link href="/aitaas/pricing" className="a-btn a-btn--ghost">View Pricing →</Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
