"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useInView,
  AnimatePresence,
  useTransform,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

/* ─── easing ─────────────────────────────────────────────────────────── */
const EASE = [0.23, 1, 0.32, 1] as const;
const SPRING = { type: "spring", stiffness: 280, damping: 28 } as const;

/* ─── word-reveal helpers ─────────────────────────────────────────────── */
function SplitReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
        >
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.7,
              ease: EASE,
              delay: delay + i * 0.065,
            }}
            style={{ display: "inline-block" }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─── magnetic button ─────────────────────────────────────────────────── */
function MagneticBtn({
  children,
  className,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * 0.35);
      y.set((e.clientY - cy) * 0.35);
    },
    [x, y]
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.button
      ref={ref}
      type={type}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

/* ─── feature card ────────────────────────────────────────────────────── */
function FeatureCard({
  icon,
  label,
  value,
  desc,
  delay,
}: {
  icon: string;
  label: string;
  value: string;
  desc: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className="feature-card"
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      <span className="feature-icon">{icon}</span>
      <div className="feature-value">{value}</div>
      <div className="feature-label">{label}</div>
      <div className="feature-desc">{desc}</div>
    </motion.div>
  );
}

/* ─── custom cursor ───────────────────────────────────────────────────── */
function Cursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const cx = useSpring(mx, { stiffness: 500, damping: 32 });
  const cy = useSpring(my, { stiffness: 500, damping: 32 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    const over = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button,input")) setHovered(true);
    };
    const out = () => setHovered(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
    };
  }, [mx, my]);

  return (
    <motion.div
      className="cursor-dot"
      style={{ x: cx, y: cy }}
      animate={{ scale: hovered ? 2.8 : 1, opacity: hovered ? 0.5 : 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    />
  );
}

/* ─── aurora background ───────────────────────────────────────────────── */
function Aurora() {
  return (
    <div className="aurora-wrap" aria-hidden>
      <motion.div
        className="aurora-blob a1"
        animate={{ x: [0, 60, -30, 0], y: [0, -50, 30, 0], scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="aurora-blob a2"
        animate={{ x: [0, -80, 40, 0], y: [0, 60, -40, 0], scale: [1, 0.88, 1.12, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="aurora-blob a3"
        animate={{ x: [0, 40, -60, 0], y: [0, -30, 50, 0], scale: [1, 1.08, 0.94, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />
    </div>
  );
}

/* ─── signup form ─────────────────────────────────────────────────────── */
type FormState = "idle" | "loading" | "success" | "error";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist/count")
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? null))
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setState("success");
        setCount((c) => (c ?? 0) + 1);
      } else {
        const d = await res.json();
        if (d.error === "already_registered") setState("success");
        else setState("error");
      }
    } catch {
      setState("error");
    }
  };

  return (
    <div className="form-wrap">
      <AnimatePresence mode="wait">
        {state === "success" ? (
          <motion.div
            key="success"
            className="success-msg"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <motion.span
              className="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...SPRING, delay: 0.15 }}
            >
              ✦
            </motion.span>
            <span>You&apos;re on the list. We&apos;ll be in touch.</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="signup-form"
            onSubmit={submit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="input-wrap">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="email-input"
                disabled={state === "loading"}
              />
              <MagneticBtn
                type="submit"
                className={`submit-btn${state === "loading" ? " loading" : ""}`}
              >
                {state === "loading" ? (
                  <span className="spinner" />
                ) : (
                  <>
                    <span className="btn-text">Join Waitlist</span>
                    <span className="btn-fill" />
                  </>
                )}
              </MagneticBtn>
            </div>
            {state === "error" && (
              <motion.p
                className="error-msg"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Something went wrong. Please try again.
              </motion.p>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      {count !== null && (
        <motion.p
          className="count-line"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <span className="count-num">{count.toLocaleString()}</span> agents already on the list
        </motion.p>
      )}
    </div>
  );
}

/* ─── main page ───────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #06070D;
          --bg2:       #0D0E18;
          --gold:      #C8922A;
          --gold-dim:  #7A5618;
          --gold-glow: rgba(200,146,42,0.18);
          --text:      #EDE8DF;
          --muted:     #5C5850;
          --border:    rgba(255,255,255,0.07);
          --ease:      cubic-bezier(0.23,1,0.32,1);
        }

        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text); font-family:'Outfit',sans-serif; -webkit-font-smoothing:antialiased; }
        .landing-root { min-height: 100vh; overflow-x: hidden; cursor: none; }

        @media (hover: none) {
          .landing-root { cursor: auto; }
          .cursor-dot { display: none; }
        }

        /* ── cursor ── */
        .cursor-dot {
          position: fixed; top: -6px; left: -6px;
          width: 12px; height: 12px; border-radius: 50%;
          background: var(--gold); pointer-events: none;
          z-index: 9999; mix-blend-mode: normal;
          transform-origin: center;
        }

        /* ── grain overlay ── */
        .grain {
          position: fixed; inset: 0; z-index: 5; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.032;
        }

        /* ── aurora ── */
        .aurora-wrap { position: absolute; inset: 0; overflow: hidden; z-index: 0; }
        .aurora-blob {
          position: absolute; border-radius: 50%;
          filter: blur(100px); opacity: 0.28;
        }
        .a1 { width: 600px; height: 600px; left: -120px; top: -120px; background: radial-gradient(circle, #C8922A 0%, transparent 70%); }
        .a2 { width: 700px; height: 700px; right: -180px; top: 60px; background: radial-gradient(circle, #2A3D8A 0%, transparent 70%); }
        .a3 { width: 500px; height: 500px; left: 30%; bottom: -80px; background: radial-gradient(circle, #8A2A6A 0%, transparent 70%); }

        /* ── nav ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(24px, 5vw, 80px); height: 64px;
        }
        .nav-logo {
          font-family: 'Cormorant Garant', serif; font-weight: 500;
          font-size: 20px; letter-spacing: 0.08em; color: var(--text);
          text-decoration: none;
        }
        .nav-logo em { font-style: normal; color: var(--gold); }
        .nav-badge {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); border: 1px solid var(--gold-dim);
          padding: 5px 14px; font-family: 'Outfit', sans-serif;
        }

        /* ── hero ── */
        .hero {
          position: relative; min-height: 100svh;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          text-align: center; padding: 100px clamp(24px, 6vw, 100px) 80px;
          overflow: hidden;
        }
        .hero-inner { position: relative; z-index: 2; max-width: 900px; width: 100%; }

        .eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 36px;
        }
        .eyebrow-line { width: 28px; height: 1px; background: var(--gold); flex-shrink: 0; }

        .hero-title {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(52px, 10vw, 130px);
          font-weight: 300; line-height: 0.95;
          letter-spacing: -0.02em; color: var(--text);
          margin-bottom: 8px;
        }
        .hero-title-gold {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(52px, 10vw, 130px);
          font-weight: 300; line-height: 0.95;
          letter-spacing: -0.02em;
          color: var(--gold);
          margin-bottom: 44px;
          font-style: italic;
        }
        .hero-sub {
          font-size: clamp(15px, 2vw, 18px); line-height: 1.7;
          color: var(--muted); max-width: 520px; margin: 0 auto 52px;
          font-weight: 300;
        }

        /* ── form ── */
        .form-wrap { width: 100%; max-width: 480px; margin: 0 auto; }
        .signup-form { width: 100%; }
        .input-wrap {
          display: flex; width: 100%;
          border: 1px solid var(--border);
          transition: border-color 0.2s ease;
        }
        .input-wrap:focus-within {
          border-color: rgba(200,146,42,0.5);
          box-shadow: 0 0 0 3px var(--gold-glow);
        }
        .email-input {
          flex: 1; background: rgba(255,255,255,0.03);
          border: none; outline: none; padding: 15px 20px;
          font-family: 'Outfit', sans-serif; font-size: 14px;
          color: var(--text); min-width: 0;
        }
        .email-input::placeholder { color: var(--muted); }
        .submit-btn {
          position: relative; background: var(--gold); border: none;
          padding: 15px 28px; cursor: none;
          font-family: 'Outfit', sans-serif; font-size: 13px;
          font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          color: #06070D; overflow: hidden; flex-shrink: 0;
          transition: transform 160ms var(--ease);
        }
        .btn-fill {
          position: absolute; inset: 0; background: rgba(255,255,255,0.18);
          clip-path: inset(0 100% 0 0);
          transition: clip-path 0.35s var(--ease);
          pointer-events: none;
        }
        .submit-btn:hover .btn-fill { clip-path: inset(0 0% 0 0); }

        .spinner {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid rgba(6,7,13,0.3); border-top-color: #06070D;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .success-msg {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; padding: 18px 24px;
          background: rgba(200,146,42,0.08); border: 1px solid var(--gold-dim);
          font-size: 14px; color: var(--text);
        }
        .check { color: var(--gold); font-size: 18px; }
        .error-msg { font-size: 13px; color: #E05050; margin-top: 8px; }

        .count-line {
          font-size: 12px; color: var(--muted); margin-top: 20px;
          letter-spacing: 0.04em; text-align: center;
        }
        .count-num { color: var(--gold); font-weight: 500; }

        /* ── language strip ── */
        .lang-strip {
          display: flex; align-items: center; justify-content: center;
          gap: 24px; margin-top: 56px; flex-wrap: wrap;
        }
        .lang-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 14px; border: 1px solid var(--border);
          font-size: 12px; color: var(--muted); letter-spacing: 0.06em;
          transition: border-color 0.2s, color 0.2s;
        }
        @media (hover: hover) and (pointer: fine) {
          .lang-chip:hover { border-color: var(--gold-dim); color: var(--gold); }
        }

        /* ── scroll indicator ── */
        .scroll-hint {
          position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
          z-index: 2; display: flex; flex-direction: column; align-items: center;
          gap: 8px; color: var(--muted); font-size: 11px; letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .scroll-line {
          width: 1px; height: 40px; background: linear-gradient(to bottom, var(--gold-dim), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(1.1); }
        }

        /* ── divider ── */
        .divider {
          width: 1px; height: 80px; background: linear-gradient(to bottom, transparent, var(--gold-dim), transparent);
          margin: 0 auto;
        }

        /* ── features ── */
        .features {
          padding: clamp(60px, 8vw, 120px) clamp(24px, 6vw, 80px);
          position: relative; z-index: 2;
        }
        .features-inner { max-width: 1100px; margin: 0 auto; }
        .features-label {
          font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--gold); text-align: center; margin-bottom: 16px;
          display: flex; align-items: center; justify-content: center; gap: 16px;
        }
        .features-label::before, .features-label::after {
          content:''; flex: 1; max-width: 60px; height: 1px; background: var(--gold-dim);
        }
        .features-heading {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(32px, 4.5vw, 56px); font-weight: 300;
          text-align: center; margin-bottom: 64px; line-height: 1.1;
        }
        .features-heading em { font-style: italic; color: var(--gold); }
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--border);
          border: 1px solid var(--border); overflow: hidden;
        }
        .feature-card {
          background: var(--bg2); padding: clamp(28px, 4vw, 48px) clamp(24px, 3vw, 40px);
          transition: background 0.25s;
        }
        @media (hover: hover) and (pointer: fine) {
          .feature-card:hover { background: rgba(200,146,42,0.04); }
        }
        .feature-icon { font-size: 28px; margin-bottom: 20px; display: block; }
        .feature-value {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(40px, 5vw, 64px); font-weight: 300;
          color: var(--gold); line-height: 1; margin-bottom: 8px;
        }
        .feature-label {
          font-size: 13px; font-weight: 500; color: var(--text);
          letter-spacing: 0.04em; margin-bottom: 14px; text-transform: uppercase;
        }
        .feature-desc { font-size: 14px; color: var(--muted); line-height: 1.7; }

        /* ── pipeline section ── */
        .pipeline-section {
          padding: clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px);
          position: relative; z-index: 2; overflow: hidden;
          border-top: 1px solid var(--border);
        }
        .pipeline-section::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,146,42,0.04) 0%, transparent 70%);
          pointer-events: none;
        }
        .pipeline-inner { max-width: 1100px; margin: 0 auto; }
        .pipeline-heading {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(32px, 4.5vw, 56px); font-weight: 300;
          text-align: center; margin-bottom: 56px; line-height: 1.1;
        }
        .pipeline-heading em { font-style: italic; color: var(--gold); }
        .pipeline-steps {
          display: grid; grid-template-columns: repeat(7, 1fr);
          gap: 1px; background: var(--border);
          border: 1px solid var(--border); overflow: hidden;
        }
        .p-step {
          background: var(--bg2); padding: 28px 16px;
          text-align: center; position: relative;
          transition: background 0.2s;
        }
        @media (hover: hover) and (pointer: fine) {
          .p-step:hover { background: rgba(200,146,42,0.04); }
        }
        .p-step-num {
          font-family: 'Cormorant Garant', serif; font-size: 11px;
          color: var(--gold-dim); margin-bottom: 10px; display: block;
          letter-spacing: 0.1em;
        }
        .p-step-icon { font-size: 22px; margin-bottom: 10px; display: block; }
        .p-step-label {
          font-size: 11px; color: var(--muted); line-height: 1.5;
          letter-spacing: 0.04em;
        }

        /* ── footer ── */
        footer {
          padding: 36px clamp(24px, 5vw, 80px);
          border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px; position: relative; z-index: 2;
        }
        .footer-logo {
          font-family: 'Cormorant Garant', serif; font-size: 18px;
          font-weight: 400; color: var(--muted); text-decoration: none;
        }
        .footer-logo em { font-style: normal; color: var(--gold-dim); }
        .footer-copy { font-size: 12px; color: var(--muted); }

        /* ── responsive ── */
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: 1fr; }
          .pipeline-steps { grid-template-columns: repeat(4, 1fr); }
          .p-step:nth-child(n+5) { display: none; }
        }
        @media (max-width: 600px) {
          .pipeline-steps { grid-template-columns: repeat(2, 1fr); }
          .p-step:nth-child(n+3) { display: none; }
          .lang-strip { gap: 12px; }
          .input-wrap { flex-direction: column; }
          .submit-btn { width: 100%; text-align: center; }
        }

        /* ── reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .aurora-blob, .scroll-line, .spinner { animation: none !important; }
          * { transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* Grain + Cursor */}
      <div className="grain" aria-hidden />
      <Cursor />

      <div className="landing-root">
        {/* NAV */}
        <motion.nav
          className="nav"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        >
          <a href="#" className="nav-logo">Simmer <em>.</em></a>
          <span className="nav-badge">Early Access</span>
        </motion.nav>

        {/* HERO */}
        <section className="hero">
          <Aurora />

          <div className="hero-inner">
            <motion.div
              className="eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            >
              <span className="eyebrow-line" />
              PropTech for Real Estate Agents
              <span className="eyebrow-line" />
            </motion.div>

            <h1>
              <SplitReveal text="The AI That Sells" className="hero-title" delay={0.5} />
              <br />
              <SplitReveal text="Property While You Sleep." className="hero-title-gold" delay={0.8} />
            </h1>

            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 1.25 }}
            >
              Simmer qualifies every lead in 60 seconds, sends brochures via WhatsApp mid-call, and books appointments — fully automated. <strong style={{ color: "var(--text)", fontWeight: 400 }}>Be the first to know when we launch.</strong>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 1.5 }}
            >
              <SignupForm />
            </motion.div>

            <motion.div
              className="lang-strip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 1.9 }}
            >
              {[
                { flag: "🇦🇪", lang: "Arabic" },
                { flag: "🇬🇧", lang: "English" },
                { flag: "🇮🇳", lang: "Hindi" },
                { flag: "🇷🇺", lang: "Russian" },
                { flag: "🇨🇳", lang: "Mandarin" },
              ].map(({ flag, lang }) => (
                <span key={lang} className="lang-chip">
                  {flag} {lang}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="scroll-hint" aria-hidden>
            <div className="scroll-line" />
            <span>Scroll</span>
          </div>
        </section>

        <div className="divider" aria-hidden />

        {/* FEATURES */}
        <section className="features">
          <div className="features-inner">
            <div className="features-label">What We Do</div>
            <h2 className="features-heading">
              Seven steps.<br /><em>Zero manual effort.</em>
            </h2>
            <div className="features-grid">
              <FeatureCard
                icon="⚡"
                value="60s"
                label="First AI Call"
                desc="Your AI agent calls every new lead within 60 seconds of clicking your ad — every time, without exception."
                delay={0}
              />
              <FeatureCard
                icon="🌍"
                value="5"
                label="Languages Spoken"
                desc="Arabic, English, Hindi, Russian, and Mandarin — with adaptive tone matching and native fluency."
                delay={0.1}
              />
              <FeatureCard
                icon="📲"
                value="14"
                label="Day Nurture"
                desc="Multi-channel follow-ups across WhatsApp, email, and AI callbacks run automatically for two weeks."
                delay={0.2}
              />
            </div>
          </div>
        </section>

        {/* PIPELINE */}
        <section className="pipeline-section">
          <div className="pipeline-inner">
            <h2 className="pipeline-heading">
              Lead to close,<br /><em>end to end.</em>
            </h2>
            <div className="pipeline-steps">
              {[
                { n: "01", icon: "📱", label: "Ad Click" },
                { n: "02", icon: "⚡", label: "AI Calls in 60s" },
                { n: "03", icon: "🧠", label: "Qualifies Lead" },
                { n: "04", icon: "📲", label: "Sends Brochure" },
                { n: "05", icon: "📅", label: "Books Appt" },
                { n: "06", icon: "🔁", label: "14-Day Nurture" },
                { n: "07", icon: "🤝", label: "Agent Closes" },
              ].map((s, i) => (
                <motion.div
                  key={s.n}
                  className="p-step"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
                >
                  <span className="p-step-num">{s.n}</span>
                  <span className="p-step-icon">{s.icon}</span>
                  <div className="p-step-label">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <a href="#" className="footer-logo">Simmer Properties <em>.</em></a>
          <span className="footer-copy">© 2026 Simmer Properties. All rights reserved.</span>
        </footer>
      </div>
    </>
  );
}
