"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const links = [
  { href: "/aitaas/solutions", label: "Solutions" },
  { href: "/aitaas/pricing", label: "Pricing" },
  { href: "/aitaas/contact", label: "Contact" },
];

export default function AitaasNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <style>{`
        .an {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          height: 64px; display: flex; align-items: center;
          padding: 0 clamp(20px, 5vw, 72px);
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s, background 0.3s;
        }
        .an.scrolled {
          background: oklch(0.07 0.008 255 / 0.90);
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          border-bottom-color: oklch(0.18 0.007 255);
        }
        .an-logo {
          font-family: 'DM Serif Display', serif; font-size: 18px;
          color: oklch(0.93 0.006 95); text-decoration: none;
          letter-spacing: -0.01em; display: flex; align-items: center; gap: 2px;
          flex-shrink: 0;
        }
        .an-logo-dot { color: oklch(0.75 0.145 88); }
        .an-links {
          display: flex; align-items: center; gap: 0; margin-left: auto;
          list-style: none;
        }
        .an-link {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: oklch(0.60 0.008 95); text-decoration: none;
          padding: 8px 18px; letter-spacing: 0.01em;
          transition: color 0.18s;
          position: relative;
        }
        .an-link:hover, .an-link.active { color: oklch(0.93 0.006 95); }
        .an-cta {
          margin-left: 12px;
          background: oklch(0.75 0.145 88); color: oklch(0.07 0.008 255);
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 9px 22px; text-decoration: none;
          transition: opacity 0.18s;
          display: inline-block;
        }
        .an-cta:hover { opacity: 0.88; }
        .an-burger {
          display: none; background: none; border: none; cursor: pointer;
          margin-left: auto; padding: 8px; color: oklch(0.93 0.006 95);
          flex-direction: column; gap: 5px; align-items: center;
        }
        .an-burger span {
          display: block; width: 22px; height: 1.5px;
          background: currentColor; transition: transform 0.22s, opacity 0.22s;
        }
        .an-burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .an-burger.open span:nth-child(2) { opacity: 0; }
        .an-burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
        @media (max-width: 720px) {
          .an-links, .an-cta { display: none; }
          .an-burger { display: flex; }
        }
        .an-overlay {
          position: fixed; inset: 0; z-index: 190;
          background: oklch(0.07 0.008 255 / 0.97);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          display: flex; flex-direction: column; justify-content: center;
          padding: 80px clamp(28px, 8vw, 64px) 48px;
          gap: 0;
        }
        .an-overlay-link {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 9vw, 3.2rem);
          color: oklch(0.93 0.006 95); text-decoration: none;
          padding: 16px 0; border-bottom: 1px solid oklch(0.18 0.007 255);
          display: block; letter-spacing: -0.02em;
          transition: color 0.18s;
        }
        .an-overlay-link:hover { color: oklch(0.75 0.145 88); }
        .an-overlay-cta {
          margin-top: 36px;
          background: oklch(0.75 0.145 88); color: oklch(0.07 0.008 255);
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 16px 32px; text-decoration: none; display: inline-block;
          align-self: flex-start;
        }
      `}</style>

      <motion.nav
        className={`an${scrolled ? " scrolled" : ""}`}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
      >
        <Link href="/aitaas" className="an-logo">
          ENG<span className="an-logo-dot"> · </span>AITaaS
        </Link>

        <ul className="an-links">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={`an-link${pathname === l.href ? " active" : ""}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/aitaas/contact" className="an-cta">Book a Demo</Link>

        <button
          className={`an-burger${open ? " open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="an-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
          >
            {links.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT, delay: i * 0.07 }}
              >
                <Link href={l.href} className="an-overlay-link">{l.label}</Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT, delay: 0.25 }}
            >
              <Link href="/aitaas/contact" className="an-overlay-cta">Book a Demo</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
