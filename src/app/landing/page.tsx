"use client";

import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";

/* ─── constants ───────────────────────────────────────────────────────── */
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── stagger variants ─────────────────────────────────────────────────── */
const staggerContainer = (stagger = 0.07, delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

/* ─── word-reveal ─────────────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }} className={className}>
      <motion.span
        style={{ display: "inline-block" }}
        initial={{ y: "105%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.72, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function SplitReveal({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <Reveal key={i} delay={delay + i * 0.07}>
          {word}{i < text.split(" ").length - 1 ? " " : ""}
        </Reveal>
      ))}
    </span>
  );
}

/* ─── scroll reveal (directional) ────────────────────────────────────── */
function ScrollReveal({
  children,
  delay = 0,
  className,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const initial =
    direction === "left"
      ? { opacity: 0, x: -32 }
      : direction === "right"
      ? { opacity: 0, x: 32 }
      : { opacity: 0, y: 24 };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.65, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── stagger reveal container ────────────────────────────────────────── */
function StaggerReveal({
  children,
  className,
  stagger = 0.07,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

/* ─── count-up stat ───────────────────────────────────────────────────── */
function CountStat({ value, suffix, delay = 0 }: { value: number; suffix: string; delay?: number }) {
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => `${Math.round(v)}${suffix}`);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, value, { duration: 1.4, ease: EASE_OUT, delay });
    return () => controls.stop();
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={ref} style={{ display: "inline-block" }}>
      <motion.span>{display}</motion.span>
    </span>
  );
}

/* ─── market count-up ─────────────────────────────────────────────────── */
function MarketCount() {
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => `${Math.round(v)}B`);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, 528, { duration: 2.2, ease: EASE_OUT });
    return () => controls.stop();
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} className="market-big-num">
      <motion.span>{display}</motion.span>
    </div>
  );
}

/* ─── parallax hero text ──────────────────────────────────────────────── */
function ParallaxText({ children, speed = 0.3 }: { children: React.ReactNode; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 600 * speed]);
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}

/* ─── signup form ─────────────────────────────────────────────────────── */
type State = "idle" | "loading" | "success" | "error";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
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
      if (res.ok || (await res.json().then((d) => d.error === "already_registered").catch(() => false))) {
        setState("success");
        setCount((c) => (c !== null ? c + 1 : c));
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  return (
    <div className="form-root">
      <AnimatePresence mode="wait">
        {state === "success" ? (
          <motion.div
            key="ok"
            className="form-success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <span className="form-success-mark">✦</span>
            You&apos;re on the list. We&apos;ll reach out directly.
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            className="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your work email"
              required
              className="form-input"
              disabled={state === "loading"}
            />
            <motion.button
              type="submit"
              className={`form-btn${state === "loading" ? " form-btn--loading" : ""}`}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.14, ease: EASE_OUT }}
            >
              {state === "loading" ? <span className="spinner" /> : "Request access"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
      {count !== null && count > 0 && (
        <motion.p
          className="form-count"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          {count.toLocaleString()} agents already on the list
        </motion.p>
      )}
    </div>
  );
}

/* ─── hero section (isolated for mouse-spring glows) ─────────────────── */
function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.05);
    mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.05);
  };

  return (
    <section className="hero" onMouseMove={handleMouseMove}>
      <motion.div className="glow-tl" aria-hidden style={{ x: springX, y: springY }} />
      <motion.div
        className="glow-br"
        aria-hidden
        style={{
          x: useTransform(springX, (v) => -v * 0.6),
          y: useTransform(springY, (v) => -v * 0.6),
        }}
      />

      <ParallaxText speed={0.18}>
        <div className="hero-inner">
          <motion.div
            className="hero-kicker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="hero-kicker-line" />
            PropTech built for the speed of Dubai
          </motion.div>

          <h1 className="hero-h1">
            <SplitReveal text="Your Next Deal" delay={0.35} />
            <br />
            <SplitReveal text="Called. Nobody" delay={0.65} />{" "}
            <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
              <motion.span
                className="hero-h1-em"
                style={{ display: "inline-block", fontFamily: "'Cormorant Garant', serif", fontStyle: "italic", fontWeight: 300 }}
                initial={{ y: "105%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.72, ease: EASE_OUT, delay: 0.94 }}
              >
                Answered.
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="hero-body"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_OUT, delay: 1.2 }}
          >
            A lead clicks your ad and a clock starts. Within 5 minutes, the probability of qualifying them
            drops by 80%. The average agent calls back in 47 hours. Simmer calls in 60 seconds, in the
            lead&apos;s language, with their property matches and mortgage breakdown already prepared.
          </motion.p>

          {/* Staggered stats with count-up */}
          <StaggerReveal className="hero-stat-row" stagger={0.08} delay={1.4}>
            {[
              { value: 60, suffix: "s", label: "Response time from ad click" },
              { value: 78, suffix: "%", label: "Win rate when first to contact" },
              { value: 80, suffix: "%", label: "Drop in qualification after 1 hour" },
              { value: 47, suffix: "hrs", label: "Industry average response time" },
            ].map((s) => (
              <motion.div className="hero-stat" key={s.suffix + s.value} variants={fadeUp}>
                <span className="hero-stat-num">
                  <CountStat value={s.value} suffix={s.suffix} />
                </span>
                <span className="hero-stat-label">{s.label}</span>
              </motion.div>
            ))}
          </StaggerReveal>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT, delay: 1.9 }}
          >
            <SignupForm />
          </motion.div>
        </div>
      </ParallaxText>

      <div className="scroll-hint" aria-hidden>
        <div className="scroll-hint-line" />
      </div>
    </section>
  );
}

/* ─── page ────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garant:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:              oklch(0.08 0.010 20);
          --surface:         oklch(0.11 0.009 20);
          --surface2:        oklch(0.15 0.007 20);
          --crimson:         oklch(0.52 0.210 20);
          --crimson-dim:     oklch(0.32 0.110 20);
          --crimson-glow:    oklch(0.52 0.210 20 / 0.14);
          --crimson-bright:  oklch(0.63 0.185 20);
          --ink:             oklch(0.94 0.008 55);
          --ink-2:           oklch(0.72 0.010 55);
          --muted:           oklch(0.48 0.010 55);
          --border:          oklch(0.19 0.008 55);
          --border-strong:   oklch(0.26 0.009 55);
          --ease:            cubic-bezier(0.16,1,0.3,1);
        }

        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--ink); font-family: 'Outfit', sans-serif;
               font-weight: 300; -webkit-font-smoothing: antialiased; }
        .lp { min-height: 100dvh; overflow-x: hidden; }

        /* ── grain ── */
        .grain {
          position: fixed; inset: 0; z-index: 5; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.028;
        }

        /* ── ambient glow ── */
        .glow-tl {
          position: absolute; width: 700px; height: 700px;
          left: -220px; top: -180px; border-radius: 50%;
          background: radial-gradient(circle, oklch(0.52 0.210 20 / 0.18) 0%, transparent 65%);
          filter: blur(40px); pointer-events: none; z-index: 0;
          animation: glowPulse 12s ease-in-out infinite;
        }
        .glow-br {
          position: absolute; width: 500px; height: 500px;
          right: -100px; bottom: -100px; border-radius: 50%;
          background: radial-gradient(circle, oklch(0.40 0.120 20 / 0.12) 0%, transparent 65%);
          filter: blur(60px); pointer-events: none; z-index: 0;
          animation: glowPulse 16s ease-in-out infinite reverse;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.08); }
        }

        /* ── nav ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(20px, 5vw, 80px); height: 60px;
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s, background 0.3s;
        }
        .nav.scrolled {
          background: oklch(0.08 0.010 20 / 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom-color: var(--border);
        }
        .nav-logo {
          font-family: 'Cormorant Garant', serif; font-weight: 500;
          font-size: 19px; letter-spacing: 0.06em; color: var(--ink);
          text-decoration: none; display: flex; align-items: center; gap: 4px;
        }
        .nav-logo-dot { color: var(--crimson); }
        .nav-pill {
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--crimson); border: 1px solid var(--crimson-dim);
          padding: 5px 13px; font-family: 'Outfit', sans-serif; font-weight: 500;
        }

        /* ── hero ── */
        .hero {
          position: relative; min-height: 100svh;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 0 clamp(20px, 6vw, 96px) clamp(60px, 8vh, 96px);
          overflow: hidden;
        }
        .hero-inner { position: relative; z-index: 2; }

        .hero-kicker {
          display: flex; align-items: center; gap: 12px;
          font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 32px;
        }
        .hero-kicker-line { width: 24px; height: 1px; background: var(--crimson-dim); }

        .hero-h1 {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(2.8rem, 7.5vw, 5.8rem);
          font-weight: 300; line-height: 1.0; letter-spacing: -0.025em;
          color: var(--ink); max-width: 820px; margin-bottom: 32px;
          text-wrap: balance;
        }
        .hero-h1-em { color: var(--crimson); font-style: italic; }

        .hero-body {
          max-width: 540px; font-size: clamp(15px, 1.8vw, 17px);
          line-height: 1.72; color: var(--ink-2); margin-bottom: 44px;
          font-weight: 300;
        }

        .hero-stat-row {
          display: flex; align-items: center; gap: 0;
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          margin-bottom: 44px; flex-wrap: wrap;
        }
        .hero-stat {
          display: flex; flex-direction: column; padding: 20px 32px 20px 0;
          gap: 4px; flex-shrink: 0;
        }
        .hero-stat:not(:last-child) { margin-right: 32px; border-right: 1px solid var(--border); padding-right: 32px; }
        .hero-stat-num {
          font-family: 'Cormorant Garant', serif; font-size: 2.2rem;
          font-weight: 300; color: var(--crimson); line-height: 1;
        }
        .hero-stat-label {
          font-size: 11px; color: var(--muted); letter-spacing: 0.05em; line-height: 1.4;
          max-width: 120px;
        }

        /* ── scroll hint ── */
        .scroll-hint {
          position: absolute; bottom: 32px; right: clamp(20px, 5vw, 80px);
          z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .scroll-hint-line {
          width: 1px; height: 48px;
          background: linear-gradient(to bottom, var(--crimson-dim), transparent);
          animation: scrollLine 2.2s ease-in-out infinite;
        }
        @keyframes scrollLine {
          0%, 100% { opacity: 0.4; transform: scaleY(0.7) translateY(0); }
          50%       { opacity: 1;   transform: scaleY(1)   translateY(4px); }
        }

        /* ── section wrapper ── */
        .section { padding: clamp(64px, 9vw, 120px) clamp(20px, 6vw, 96px); position: relative; z-index: 2; }
        .section-inner { max-width: 1080px; margin: 0 auto; }

        /* ── narrative section ── */
        .narrative { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .narrative-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start;
        }
        .narrative-pull {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 300; line-height: 1.15; letter-spacing: -0.02em;
          color: var(--ink); text-wrap: balance;
        }
        .narrative-pull em { font-style: italic; color: var(--crimson); }
        .narrative-body {
          font-size: 15px; line-height: 1.8; color: var(--ink-2);
          display: flex; flex-direction: column; gap: 20px; padding-top: 8px;
        }
        .narrative-body p { max-width: 52ch; }

        /* ── story timeline ── */
        .timeline-section { border-top: 1px solid var(--border); }
        .timeline-heading {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(1.6rem, 2.8vw, 2.6rem);
          font-weight: 300; letter-spacing: -0.02em; margin-bottom: 56px;
          color: var(--ink); max-width: 600px; text-wrap: balance;
        }
        .timeline-heading em { font-style: italic; color: var(--crimson); }
        .timeline { display: flex; flex-direction: column; gap: 0; border: 1px solid var(--border); overflow: hidden; }
        .timeline-item {
          display: grid; grid-template-columns: 200px 1fr;
          border-bottom: 1px solid var(--border);
          transition: background 0.22s var(--ease);
        }
        .timeline-item:last-child { border-bottom: none; }
        @media (hover: hover) and (pointer: fine) {
          .timeline-item:hover { background: oklch(0.12 0.009 20); }
        }
        .timeline-time {
          padding: 28px 24px; border-right: 1px solid var(--border);
          font-family: 'Cormorant Garant', serif;
          font-size: 13px; color: var(--crimson);
          letter-spacing: 0.08em; font-style: italic;
          display: flex; align-items: center;
        }
        .timeline-content { padding: 28px 32px; }
        .timeline-title {
          font-size: 15px; font-weight: 500; color: var(--ink);
          margin-bottom: 6px;
        }
        .timeline-desc { font-size: 14px; line-height: 1.7; color: var(--muted); max-width: 58ch; }

        /* ── parallel engine ── */
        .engine-section { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .engine-header { margin-bottom: 56px; }
        .engine-tag {
          display: inline-block; font-size: 10px; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--crimson);
          border: 1px solid var(--crimson-dim); padding: 4px 12px;
          margin-bottom: 20px;
        }
        .engine-heading {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(1.6rem, 2.8vw, 2.6rem);
          font-weight: 300; letter-spacing: -0.02em; color: var(--ink);
          max-width: 560px; text-wrap: balance; line-height: 1.15;
        }
        .engine-heading em { font-style: italic; color: var(--crimson); }
        .engine-sub {
          font-size: 15px; color: var(--muted); line-height: 1.7; max-width: 52ch;
          margin-top: 16px;
        }
        .engine-grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 1px; background: var(--border); border: 1px solid var(--border);
        }
        .engine-card {
          background: var(--bg); padding: clamp(28px, 3.5vw, 44px);
          transition: background 0.22s var(--ease);
        }
        @media (hover: hover) and (pointer: fine) {
          .engine-card:hover { background: oklch(0.10 0.009 20); }
        }
        .engine-card-label {
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--crimson-bright); margin-bottom: 16px;
        }
        .engine-card-title {
          font-family: 'Cormorant Garant', serif;
          font-size: 1.5rem; font-weight: 400; color: var(--ink);
          margin-bottom: 12px; letter-spacing: -0.01em;
        }
        .engine-card-body { font-size: 14px; line-height: 1.75; color: var(--muted); max-width: 40ch; }

        /* ── market section ── */
        .market-section { border-top: 1px solid var(--border); }
        .market-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .market-stat-block { position: relative; }
        .market-big-num {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(4rem, 10vw, 9rem);
          font-weight: 300; color: var(--crimson);
          line-height: 0.9; letter-spacing: -0.03em;
        }
        .market-big-label { font-size: 13px; color: var(--muted); margin-top: 16px; max-width: 30ch; line-height: 1.6; }
        .market-body { display: flex; flex-direction: column; gap: 24px; }
        .market-body p { font-size: 15px; line-height: 1.8; color: var(--ink-2); max-width: 50ch; }
        .market-body strong { color: var(--ink); font-weight: 500; }

        /* ── manifesto ── */
        .manifesto-section { border-top: 1px solid var(--border); position: relative; overflow: hidden; }
        .manifesto-section::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 100%, oklch(0.52 0.210 20 / 0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .manifesto-inner { max-width: 1080px; margin: 0 auto; position: relative; z-index: 1; }
        .manifesto-text {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(1.7rem, 3.2vw, 3rem);
          font-weight: 300; line-height: 1.3; letter-spacing: -0.025em;
          color: var(--ink); max-width: 16em; text-wrap: balance;
        }
        .manifesto-text em { color: var(--crimson); font-style: italic; }
        .manifesto-caption { font-size: 14px; color: var(--muted); margin-top: 32px; max-width: 50ch; line-height: 1.7; }

        /* ── languages ── */
        .lang-section { border-top: 1px solid var(--border); }
        .lang-header { margin-bottom: 48px; }
        .lang-heading {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(1.5rem, 2.5vw, 2.4rem);
          font-weight: 300; letter-spacing: -0.02em; color: var(--ink);
          text-wrap: balance;
        }
        .lang-heading em { font-style: italic; color: var(--crimson); }
        .lang-row {
          display: flex; border: 1px solid var(--border); overflow: hidden;
        }
        .lang-item {
          flex: 1; padding: clamp(20px, 3vw, 32px) 20px;
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          transition: background 0.22s var(--ease);
        }
        .lang-item:last-child { border-right: none; }
        @media (hover: hover) and (pointer: fine) {
          .lang-item:hover { background: oklch(0.12 0.009 20); }
        }
        .lang-flag { font-size: 24px; }
        .lang-name { font-size: 11px; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }

        /* ── CTA section ── */
        .cta-section { border-top: 1px solid var(--border); }
        .cta-inner { max-width: 1080px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .cta-heading {
          font-family: 'Cormorant Garant', serif;
          font-size: clamp(2rem, 3.5vw, 3.2rem);
          font-weight: 300; letter-spacing: -0.025em; line-height: 1.1;
          color: var(--ink); text-wrap: balance;
        }
        .cta-heading em { font-style: italic; color: var(--crimson); }
        .cta-body { font-size: 14px; color: var(--muted); line-height: 1.75; margin-top: 20px; max-width: 44ch; }
        .cta-right { display: flex; flex-direction: column; gap: 0; }

        /* ── form ── */
        .form-root { width: 100%; }
        .form { display: flex; flex-direction: column; gap: 0; }
        .form-input {
          background: var(--surface); border: 1px solid var(--border-strong);
          color: var(--ink); font-family: 'Outfit', sans-serif; font-size: 14px;
          padding: 15px 18px; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .form-input::placeholder { color: var(--muted); }
        .form-input:focus { border-color: var(--crimson-dim); box-shadow: 0 0 0 3px var(--crimson-glow); }
        .form-btn {
          background: var(--crimson); color: oklch(0.97 0.005 20);
          border: none; padding: 15px 24px; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: 13px;
          font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
          transition: background 0.18s;
          position: relative; overflow: hidden;
        }
        .form-btn::after {
          content: ''; position: absolute; inset: 0;
          background: oklch(1 0 0 / 0.1);
          clip-path: inset(0 100% 0 0);
          transition: clip-path 0.3s var(--ease);
        }
        .form-btn:hover::after { clip-path: inset(0 0 0 0); }
        .form-btn--loading { pointer-events: none; opacity: 0.7; }
        .form-success {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 18px; border: 1px solid var(--crimson-dim);
          background: oklch(0.52 0.210 20 / 0.06);
          font-size: 14px; color: var(--ink-2); line-height: 1.5;
        }
        .form-success-mark { color: var(--crimson); font-size: 16px; flex-shrink: 0; }
        .form-count { font-size: 12px; color: var(--muted); margin-top: 16px; letter-spacing: 0.04em; }
        .spinner {
          display: inline-block; width: 13px; height: 13px;
          border: 2px solid oklch(0.97 0.005 20 / 0.3);
          border-top-color: oklch(0.97 0.005 20);
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── footer ── */
        footer {
          border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
          padding: 28px clamp(20px, 6vw, 96px); flex-wrap: wrap; gap: 16px;
          position: relative; z-index: 2;
        }
        .footer-logo {
          font-family: 'Cormorant Garant', serif; font-size: 17px;
          color: var(--muted); text-decoration: none; letter-spacing: 0.04em;
        }
        .footer-logo span { color: var(--crimson-dim); }
        .footer-copy { font-size: 12px; color: var(--muted); }

        /* ── responsive ── */
        @media (max-width: 860px) {
          .narrative-grid { grid-template-columns: 1fr; gap: 32px; }
          .timeline-item { grid-template-columns: 120px 1fr; }
          .engine-grid { grid-template-columns: 1fr; }
          .market-grid { grid-template-columns: 1fr; gap: 40px; }
          .cta-inner { grid-template-columns: 1fr; gap: 40px; }
          .lang-row { flex-wrap: wrap; }
          .lang-item { flex: 1 1 calc(33.33% - 1px); }
        }
        @media (max-width: 560px) {
          .hero-stat-row { flex-direction: column; gap: 0; }
          .hero-stat { border-right: none !important; border-bottom: 1px solid var(--border); padding: 16px 0 !important; margin-right: 0 !important; }
          .hero-stat:last-child { border-bottom: none; }
          .timeline-item { grid-template-columns: 1fr; }
          .timeline-time { border-right: none; border-bottom: 1px solid var(--border); padding: 16px 24px; }
          .lang-item { flex: 1 1 50%; }
        }

        /* ── reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .glow-tl, .glow-br, .scroll-hint-line, .spinner { animation: none !important; }
          * { transition-duration: 0.01ms !important; }
        }
      `}</style>

      <div className="grain" aria-hidden />

      <div className="lp">
        {/* NAV */}
        <NavBar />

        {/* HERO */}
        <HeroSection />

        {/* NARRATIVE — horizontal slide */}
        <section className="section narrative">
          <div className="section-inner">
            <div className="narrative-grid">
              <ScrollReveal direction="left">
                <p className="narrative-pull">
                  The gap between interest and contact is where <em>real estate deals die.</em>
                </p>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={0.08}>
                <div className="narrative-body">
                  <p>
                    A buyer in Moscow clicks your Palm Jumeirah listing at 11pm local time. You are asleep.
                    By the time you see the notification in the morning, they have spoken to three other agents
                    and visited two showrooms.
                  </p>
                  <p>
                    This is not a story about effort. Your agents work hard. This is the mathematics of
                    first-contact advantage: the agent who responds first wins the deal 78% of the time,
                    regardless of the quality of the property.
                  </p>
                  <p>
                    Simmer does not close deals. Your agents do. Simmer ensures that when your agent picks
                    up the phone, they are talking to a qualified buyer who already has the property brochure,
                    the school report, and the mortgage breakdown in their WhatsApp.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* TIMELINE — stagger variants */}
        <section className="section timeline-section">
          <div className="section-inner">
            <ScrollReveal>
              <h2 className="timeline-heading">
                What happens in the <em>60 seconds</em> after a lead clicks your ad.
              </h2>
            </ScrollReveal>
            <StaggerReveal className="timeline" stagger={0.06}>
              {[
                {
                  time: "T + 0:00",
                  title: "Lead captured",
                  desc: "A prospect clicks your Meta or Instagram ad. The webhook fires. Simmer creates a lead record and queues the AI caller. Total latency: under 200ms.",
                },
                {
                  time: "T + 0:58",
                  title: "AI calls the lead",
                  desc: "Vapi.ai initiates the call. The AI identifies the lead's preferred language from their profile and opens in Arabic, Hindi, Russian, Mandarin, or English, with adaptive tone matching from the first sentence.",
                },
                {
                  time: "T + 1:30",
                  title: "Qualification begins. Four agents fire in parallel.",
                  desc: "While the AI asks about budget, lifestyle, and investment horizon, four specialized research agents activate simultaneously. The lead is answering questions. The system is already finding their perfect property.",
                },
                {
                  time: "T + 2:45",
                  title: "Brochures arrive on their phone",
                  desc: "WhatsApp delivers property brochures matched to stated preferences, a school catchment report for families, and an EMI breakdown in their local currency. Mid-call. Before they have hung up.",
                },
                {
                  time: "T + 4:10",
                  title: "Appointment confirmed",
                  desc: "The AI proposes three calendar slots, the lead chooses one, and Google Calendar sends confirmations to both parties. Your agent has a meeting in their diary before they have seen the lead come in.",
                },
                {
                  time: "Day 2–14",
                  title: "Automated nurture runs in the background",
                  desc: "If no appointment is booked, multi-channel follow-up sequences run across WhatsApp, email, and AI callbacks for 14 days. No lead goes cold without a fight.",
                },
                {
                  time: "Meeting day",
                  title: "Your agent receives a complete dossier",
                  desc: "Full call transcript, qualification summary, property interests, mortgage data, and school preferences. The agent arrives knowing more about the buyer than most closers learn in three meetings.",
                },
              ].map((item) => (
                <motion.div className="timeline-item" key={item.time} variants={fadeUp}>
                  <div className="timeline-time">{item.time}</div>
                  <div className="timeline-content">
                    <div className="timeline-title">{item.title}</div>
                    <div className="timeline-desc">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </StaggerReveal>
          </div>
        </section>

        {/* PARALLEL ENGINE — stagger variants */}
        <section className="section engine-section">
          <div className="section-inner">
            <ScrollReveal>
              <div className="engine-header">
                <span className="engine-tag">The Parallel Engine</span>
                <h2 className="engine-heading">
                  While your AI is talking, four agents are <em>already researching.</em>
                </h2>
                <p className="engine-sub">
                  A human agent can ask questions or do research. Not both, not simultaneously.
                  Simmer does both at once, across four specialized systems, in real time.
                </p>
              </div>
            </ScrollReveal>
            <StaggerReveal className="engine-grid" stagger={0.09}>
              {[
                {
                  label: "Agent 01",
                  title: "School Mapper",
                  body: "Pulls school ratings, catchment boundaries, tuition fees, and commute times from Google Maps. Families make school access a primary purchase criterion. Simmer delivers the answer before they ask.",
                },
                {
                  label: "Agent 02",
                  title: "Mortgage Calculator",
                  body: "Generates EMI breakdowns tailored to the lead's budget, preferred currency, and local lending rates. Delivered to WhatsApp mid-call so the monthly cost is concrete before the conversation ends.",
                },
                {
                  label: "Agent 03",
                  title: "Property Recommender",
                  body: "Filters the full inventory against stated preferences in real time. Surfaces the three best matches before the call ends. The lead receives a shortlist, not a catalogue.",
                },
                {
                  label: "Agent 04",
                  title: "Profile Builder",
                  body: "Captures intent signals, investment horizon, family composition, and conversation sentiment. Writes it directly into the CRM. When your agent meets the buyer, the dossier is already there.",
                },
              ].map((card) => (
                <motion.div className="engine-card" key={card.label} variants={fadeUp}>
                  <div className="engine-card-label">{card.label}</div>
                  <h3 className="engine-card-title">{card.title}</h3>
                  <p className="engine-card-body">{card.body}</p>
                </motion.div>
              ))}
            </StaggerReveal>
          </div>
        </section>

        {/* MARKET — count-up on 528B */}
        <section className="section market-section">
          <div className="section-inner">
            <div className="market-grid">
              <ScrollReveal direction="left">
                <div className="market-stat-block">
                  <MarketCount />
                  <p className="market-big-label">
                    AED in Dubai property transactions in 2023 alone, growing at 20% year on year.
                    The fastest-growing luxury market on earth.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={0.1}>
                <div className="market-body">
                  <p>
                    <strong>90% of Dubai buyers are international.</strong> They browse in Russian,
                    Mandarin, Arabic, and Hindi. They are in different time zones. They close in hours
                    when the experience is right, and disappear in minutes when it is not.
                  </p>
                  <p>
                    Today, the agencies winning in this market are the ones that respond fastest and
                    speak the right language. They do it by hiring more people. That approach does not
                    scale. Simmer does.
                  </p>
                  <p>
                    We are starting in Dubai. The same problem exists in Singapore, London, Miami,
                    and every international gateway city where buyers and agents do not share a native
                    language or a timezone.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* LANGUAGES — staggered items */}
        <section className="section lang-section">
          <div className="section-inner">
            <ScrollReveal>
              <div className="lang-header">
                <h2 className="lang-heading">
                  Your AI agent speaks <em>their language.</em> From the first word.
                </h2>
              </div>
            </ScrollReveal>
            <StaggerReveal className="lang-row" stagger={0.07} delay={0.1}>
              {[
                { flag: "🇦🇪", name: "Arabic" },
                { flag: "🇬🇧", name: "English" },
                { flag: "🇮🇳", name: "Hindi" },
                { flag: "🇷🇺", name: "Russian" },
                { flag: "🇨🇳", name: "Mandarin" },
              ].map((l) => (
                <motion.div className="lang-item" key={l.name} variants={fadeUp}>
                  <span className="lang-flag">{l.flag}</span>
                  <span className="lang-name">{l.name}</span>
                </motion.div>
              ))}
            </StaggerReveal>
          </div>
        </section>

        {/* MANIFESTO — word-by-word SplitReveal */}
        <section className="section manifesto-section">
          <div className="manifesto-inner">
            <p className="manifesto-text">
              <SplitReveal text="We are not building a better chatbot. We are building the" delay={0} />{" "}
              <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
                <motion.em
                  className="manifesto-em-word"
                  style={{ display: "inline-block", fontStyle: "italic", color: "var(--crimson)" }}
                  initial={{ y: "105%", opacity: 0 }}
                  whileInView={{ y: "0%", opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.72, ease: EASE_OUT, delay: 1.1 }}
                >
                  response&nbsp;layer
                </motion.em>
              </span>{" "}
              <SplitReveal text="for how real estate is sold in every international market on earth." delay={1.3} />
            </p>
            <ScrollReveal delay={0.5}>
              <p className="manifesto-caption">
                The agents who deploy Simmer first will qualify more leads in a week than
                their competition does in a month. First-mover advantage in a market this
                size is measured in careers, not quarters.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="section cta-section">
          <div className="cta-inner">
            <ScrollReveal direction="left">
              <h2 className="cta-heading">
                Get early access before we open <em>to the market.</em>
              </h2>
              <p className="cta-body">
                We are onboarding a small number of Dubai agencies in the first cohort.
                Early partners will shape the product and lock in founding-tier pricing.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.12}>
              <div className="cta-right">
                <SignupForm />
              </div>
            </ScrollReveal>
          </div>
        </section>

        <footer>
          <a href="#" className="footer-logo">Simmer Properties<span>.</span></a>
          <span className="footer-copy">© 2026 Simmer Properties. All rights reserved.</span>
        </footer>
      </div>
    </>
  );
}

/* ─── nav with scroll state ───────────────────────────────────────────── */
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <motion.nav
      className={`nav${scrolled ? " scrolled" : ""}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
    >
      <a href="#" className="nav-logo">
        Simmer<span className="nav-logo-dot">.</span>
      </a>
      <span className="nav-pill">Early Access</span>
    </motion.nav>
  );
}
