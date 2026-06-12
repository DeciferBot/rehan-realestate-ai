"use client";

import Link from "next/link";

const PAGES = [
  { href: "/aitaas/solutions", label: "Agents" },
  { href: "/aitaas/pricing", label: "Pricing" },
  { href: "/aitaas/contact", label: "Contact" },
  { href: "/aitaas/contact", label: "Book a demo" },
];

export default function AitaasFooter() {
  return (
    <>
      <style>{`
        .cf {
          border-top: 1px solid var(--c-border);
          background: var(--c-surface);
          padding: clamp(56px, 8vw, 88px) 0 0;
        }
        .cf-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: clamp(40px, 6vw, 96px);
          padding-bottom: clamp(48px, 6vw, 72px);
        }
        .cf-brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 22px;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--c-ink); margin-bottom: 16px;
        }
        .cf-blurb {
          font-size: 14px; line-height: 1.7; color: var(--c-muted);
          max-width: 36ch;
        }
        .cf-col-h {
          font-size: 10px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--c-muted);
          margin-bottom: 20px;
        }
        .cf-link {
          display: block; font-size: 14px; color: var(--c-ink-2);
          text-decoration: none; padding: 5px 0;
          transition: color 0.15s;
        }
        .cf-link:hover { color: var(--c-copper); }
        .cf-note {
          font-size: 12px; color: var(--c-muted); line-height: 1.6;
          margin-top: 14px; max-width: 26ch;
        }
        .cf-bottom {
          border-top: 1px solid var(--c-border);
          padding: 22px 0;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
        }
        .cf-bottom-line { font-size: 12px; color: var(--c-muted); }
        @media (max-width: 760px) {
          .cf-grid { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>

      <footer className="cf">
        <div className="c-wrap">
          <div className="cf-grid">
            <div>
              <div className="cf-brand">AITaaS</div>
              <p className="cf-blurb">
                Voice and digital AI agents for revenue teams in the UAE and GCC.
                They call, qualify, book, and follow up so your pipeline never sleeps.
              </p>
            </div>
            <div>
              <p className="cf-col-h">Pages</p>
              {PAGES.map((p) => (
                <Link key={p.label} href={p.href} className="cf-link">{p.label}</Link>
              ))}
            </div>
            <div>
              <p className="cf-col-h">Direct</p>
              <a href="mailto:chopraa@gmail.com" className="cf-link">chopraa@gmail.com</a>
              <p className="cf-note">
                We reply within 4 hours on business days. Every enquiry is read by a person.
              </p>
            </div>
          </div>
          <div className="cf-bottom">
            <span className="cf-bottom-line">© 2026 AITaaS. All rights reserved.</span>
            <span className="cf-bottom-line">Serving the UAE and GCC</span>
          </div>
        </div>
      </footer>
    </>
  );
}
