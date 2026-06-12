import AitaasNav from "@/components/AitaasNav";

export const metadata = {
  title: "ENG AITaaS — AI Workers for Your Business",
  description: "Deploy intelligent AI agents that call leads, recover revenue, book appointments, and close deals — in 7 languages, 24 hours a day.",
};

export default function AitaasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --a-bg:         oklch(0.07 0.008 255);
          --a-surface:    oklch(0.10 0.007 255);
          --a-surface2:   oklch(0.14 0.006 255);
          --a-amber:      oklch(0.75 0.145 88);
          --a-amber-dim:  oklch(0.40 0.090 88);
          --a-amber-glow: oklch(0.75 0.145 88 / 0.12);
          --a-ink:        oklch(0.93 0.006 95);
          --a-ink-2:      oklch(0.70 0.008 95);
          --a-muted:      oklch(0.46 0.008 95);
          --a-border:     oklch(0.18 0.007 255);
          --a-ease:       cubic-bezier(0.16,1,0.3,1);
        }

        .a-body {
          background: var(--a-bg);
          color: var(--a-ink);
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
          min-height: 100dvh;
          overflow-x: hidden;
        }

        /* ── shared section layout ── */
        .a-section { padding: clamp(72px, 10vw, 128px) clamp(20px, 6vw, 88px); position: relative; }
        .a-inner { max-width: 1100px; margin: 0 auto; }

        /* ── shared footer ── */
        .a-footer {
          border-top: 1px solid var(--a-border);
          padding: 40px clamp(20px, 6vw, 88px);
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 20px;
        }
        .a-footer-logo {
          font-family: 'DM Serif Display', serif; font-size: 16px;
          color: var(--a-muted); text-decoration: none; letter-spacing: -0.01em;
        }
        .a-footer-logo span { color: var(--a-amber-dim); }
        .a-footer-links { display: flex; gap: 32px; flex-wrap: wrap; }
        .a-footer-link {
          font-size: 12px; color: var(--a-muted); text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.18s;
        }
        .a-footer-link:hover { color: var(--a-ink); }
        .a-footer-copy { font-size: 12px; color: var(--a-muted); }

        /* ── shared button ── */
        .a-btn {
          display: inline-block; text-decoration: none;
          background: var(--a-amber); color: var(--a-bg);
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          padding: 14px 32px; border: none; cursor: pointer;
          transition: opacity 0.18s, transform 0.14s;
        }
        .a-btn:hover { opacity: 0.88; }
        .a-btn:active { transform: scale(0.97); }
        .a-btn--ghost {
          background: transparent; color: var(--a-ink);
          border: 1px solid var(--a-border);
        }
        .a-btn--ghost:hover { border-color: var(--a-ink-2); opacity: 1; }

        /* ── reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }
      `}</style>

      <div className="a-body">
        <AitaasNav />
        {children}
        <footer className="a-footer">
          <a href="/aitaas" className="a-footer-logo">
            ENG<span> · </span>AITaaS
          </a>
          <div className="a-footer-links">
            <a href="/aitaas/solutions" className="a-footer-link">Solutions</a>
            <a href="/aitaas/pricing" className="a-footer-link">Pricing</a>
            <a href="/aitaas/contact" className="a-footer-link">Contact</a>
            <a href="/landing" className="a-footer-link">Simmer Properties</a>
          </div>
          <span className="a-footer-copy">© 2026 ENG Worldwide. All rights reserved.</span>
        </footer>
      </div>
    </>
  );
}
