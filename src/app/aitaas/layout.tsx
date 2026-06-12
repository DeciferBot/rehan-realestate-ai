import AitaasNav from "@/components/AitaasNav";

export const metadata = {
  title: "AITaaS — AI Agents for Your Business",
  description: "Voice and digital AI agents that call leads, book appointments, recover revenue, and close pipeline — in 7 languages, 24 hours a day.",
};

export default function AitaasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Hanken+Grotesk:wght@300;400;500;600&display=swap');

        :root {
          --c-bg:          oklch(0.05 0.008 260);
          --c-surface:     oklch(0.08 0.008 260);
          --c-surface2:    oklch(0.13 0.007 260);
          --c-copper:      oklch(0.72 0.17 34);
          --c-copper-dim:  oklch(0.30 0.09 34);
          --c-copper-glow: oklch(0.72 0.17 34 / 0.13);
          --c-ink:         oklch(0.96 0.003 80);
          --c-ink-2:       oklch(0.72 0.006 80);
          --c-muted:       oklch(0.46 0.005 80);
          --c-border:      oklch(0.16 0.007 260);
          --c-ease:        cubic-bezier(0.16, 1, 0.3, 1);
        }

        .c-body {
          background: var(--c-bg);
          color: var(--c-ink);
          font-family: 'Hanken Grotesk', sans-serif;
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
          min-height: 100dvh;
          overflow-x: hidden;
        }

        /* ── shared layout primitives ── */
        .c-wrap  { max-width: 1140px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 72px); }
        .c-sect  { padding: clamp(72px, 10vw, 128px) 0; position: relative; }

        /* ── shared typography ── */
        .c-display {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; text-transform: uppercase;
          letter-spacing: -0.01em; line-height: 0.95;
        }
        .c-head {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600; letter-spacing: -0.005em; line-height: 1.05;
        }

        /* ── shared button ── */
        .c-btn {
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none; font-family: 'Hanken Grotesk', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 13px 28px; border: none;
          cursor: pointer; transition: opacity 0.15s, transform 0.12s;
          background: var(--c-copper); color: var(--c-bg);
        }
        .c-btn:hover  { opacity: 0.88; }
        .c-btn:active { transform: scale(0.97); }
        .c-btn--ghost {
          background: transparent; color: var(--c-ink);
          border: 1px solid var(--c-border);
        }
        .c-btn--ghost:hover { border-color: var(--c-ink-2); opacity: 1; }

        /* ── shared footer ── */
        .c-footer {
          border-top: 1px solid var(--c-border);
          padding: 40px clamp(20px, 5vw, 72px);
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 20px;
        }
        .c-footer-logo {
          font-family: 'Barlow Condensed', sans-serif; font-size: 16px;
          font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--c-muted); text-decoration: none;
        }
        .c-footer-logo span { color: var(--c-copper-dim); }
        .c-footer-links { display: flex; gap: 28px; flex-wrap: wrap; }
        .c-footer-link {
          font-size: 12px; color: var(--c-muted); text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.15s;
        }
        .c-footer-link:hover { color: var(--c-ink); }
        .c-footer-copy { font-size: 11px; color: var(--c-muted); }

        /* ── reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }
      `}</style>

      <div className="c-body">
        <AitaasNav />
        {children}
        <footer className="c-footer">
          <a href="/aitaas" className="c-footer-logo">
            AITaaS<span> / </span>by ENG
          </a>
          <div className="c-footer-links">
            <a href="/aitaas/solutions" className="c-footer-link">Agents</a>
            <a href="/aitaas/pricing" className="c-footer-link">Pricing</a>
            <a href="/aitaas/contact" className="c-footer-link">Contact</a>
            <a href="/landing" className="c-footer-link">Simmer Properties</a>
          </div>
          <span className="c-footer-copy">© 2026 ENG Worldwide. All rights reserved.</span>
        </footer>
      </div>
    </>
  );
}
