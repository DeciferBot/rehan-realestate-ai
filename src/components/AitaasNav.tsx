"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const E: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LINKS = [
  { href: "/aitaas/solutions", label: "Agents" },
  { href: "/aitaas/pricing",   label: "Pricing" },
  { href: "/aitaas/contact",   label: "Contact" },
];

export default function AitaasNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <style>{`
        .cn {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          height: 64px; display: flex; align-items: center;
          padding: 0 clamp(20px, 5vw, 72px);
          background: oklch(0.07 0.012 260 / 0.97);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid oklch(0.18 0.009 260);
          transition: border-color 0.3s, background 0.3s;
          box-shadow: 0 1px 0 0 oklch(0.72 0.17 34 / 0.25);
        }
        .cn::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0;
          height: 2px; background: oklch(0.72 0.17 34);
        }
        .cn.at-top {
          border-bottom-color: transparent;
          background: oklch(0.05 0.008 260 / 0.85);
        }

        .cn-logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 17px;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: oklch(0.96 0.003 80); text-decoration: none;
          display: flex; align-items: center; gap: 8px; flex-shrink: 0;
        }
        .cn-links {
          display: flex; align-items: center; gap: 4px;
          margin-left: auto; list-style: none;
        }
        .cn-link {
          font-family: 'Hanken Grotesk', sans-serif; font-size: 13px;
          font-weight: 500; color: oklch(0.68 0.006 80);
          text-decoration: none; padding: 6px 14px; letter-spacing: 0.01em;
          transition: color 0.15s; position: relative;
        }
        .cn-link:hover  { color: oklch(0.96 0.003 80); }
        .cn-link.active { color: oklch(0.96 0.003 80); }
        .cn-link.active::after {
          content: ''; position: absolute; bottom: -1px; left: 14px;
          right: 14px; height: 1px; background: oklch(0.72 0.17 34);
        }

        .cn-cta {
          margin-left: 16px;
          background: oklch(0.72 0.17 34);
          color: oklch(0.05 0.008 260);
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 8px 20px;
          text-decoration: none; transition: opacity 0.15s; white-space: nowrap;
        }
        .cn-cta:hover { opacity: 0.88; }

        /* ── burger ── */
        .cn-burger {
          display: none; background: none; border: none; cursor: pointer;
          margin-left: auto; padding: 8px; color: oklch(0.96 0.003 80);
          flex-direction: column; gap: 5px; align-items: center;
        }
        .cn-burger span {
          display: block; width: 20px; height: 1.5px;
          background: currentColor; transition: transform 0.22s, opacity 0.18s;
        }
        .cn-burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .cn-burger.open span:nth-child(2) { opacity: 0; }
        .cn-burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        @media (max-width: 700px) {
          .cn-links, .cn-cta { display: none; }
          .cn-burger { display: flex; }
        }

        /* ── mobile overlay ── */
        .cn-overlay {
          position: fixed; inset: 0; z-index: 190;
          background: oklch(0.05 0.008 260 / 0.98);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          display: flex; flex-direction: column;
          padding: 80px clamp(24px, 7vw, 56px) 40px;
        }
        .cn-overlay-link {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2.8rem, 12vw, 5rem);
          font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em;
          color: oklch(0.96 0.003 80); text-decoration: none;
          padding: 12px 0; border-bottom: 1px solid oklch(0.14 0.007 260);
          display: block; line-height: 1; transition: color 0.15s;
        }
        .cn-overlay-link:hover { color: oklch(0.72 0.17 34); }
        .cn-overlay-cta {
          margin-top: 40px; align-self: flex-start;
          background: oklch(0.72 0.17 34); color: oklch(0.05 0.008 260);
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 14px 32px; text-decoration: none;
        }
      `}</style>

      <motion.nav
        className={`cn${!scrolled ? " at-top" : ""}`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: E, delay: 0.05 }}
      >
        <Link href="/aitaas" className="cn-logo">
          AITaaS
        </Link>

        <ul className="cn-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={`cn-link${pathname === l.href ? " active" : ""}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/aitaas/contact" className="cn-cta">Book a Demo</Link>

        <button
          className={`cn-burger${open ? " open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span /><span /><span />
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="cn-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: E }}
          >
            {LINKS.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.32, ease: E, delay: i * 0.06 }}
              >
                <Link href={l.href} className="cn-overlay-link">{l.label}</Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: E, delay: 0.22 }}
            >
              <Link href="/aitaas/contact" className="cn-overlay-cta">Book a Demo</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
