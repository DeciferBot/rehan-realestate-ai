import AitaasNav from "@/components/AitaasNav";
import AitaasFooter from "@/components/AitaasFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://simmerproperties.com"),
  title: "AITaaS — AI Agents for Your Business",
  description:
    "Voice and digital AI agents that call leads in 60 seconds, book appointments overnight, recover revenue, and follow up in 7 languages, around the clock.",
  openGraph: {
    title: "AITaaS — AI Agents for Your Business",
    description:
      "Voice and digital AI agents that call leads in 60 seconds, book appointments overnight, recover revenue, and follow up in 7 languages, around the clock.",
    url: "/aitaas",
    siteName: "AITaaS",
    type: "website",
    locale: "en_AE",
  },
  twitter: {
    card: "summary",
    title: "AITaaS — AI Agents for Your Business",
    description:
      "AI agents that call leads in 60 seconds, book appointments overnight, and follow up in 7 languages.",
  },
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

        /* ── reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }
      `}</style>

      <div className="c-body">
        <AitaasNav />
        {children}
        <AitaasFooter />
      </div>
    </>
  );
}
