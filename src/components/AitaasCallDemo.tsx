"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Live call simulation — the hero's product demo.
 * A scripted outbound sales call streams in: dialing, transcript,
 * booking events, wrap-up, then loops with the next lead.
 */

type Msg = { kind: "agent" | "lead"; text: string; ar?: string };
type Step =
  | { t: "msg"; msg: Msg; pre: number }
  | { t: "event"; text: string; pre: number }
  | { t: "wrap"; pre: number };

const LEADS = ["Omar Al Rashid", "Fatima Hassan", "Daniel Park"];

function script(lead: string): Step[] {
  const first = lead.split(" ")[0];
  return [
    { t: "msg", pre: 1100, msg: { kind: "agent", text: `Good evening ${first}, this is Aya from Marina Heights. You enquired about the three-bedroom on Marina Walk a few minutes ago.` } },
    { t: "msg", pre: 2100, msg: { kind: "lead", text: "Yes, that was fast. Is the marina-view unit still available?" } },
    { t: "msg", pre: 1900, msg: { kind: "agent", text: "It is. AED 2.4M, 1,840 sq ft, vacant on transfer. I can hold a private viewing for you, Thursday 4:30 or Saturday 11?" } },
    { t: "msg", pre: 2300, msg: { kind: "lead", text: "Thursday 4:30 works." } },
    { t: "msg", pre: 1700, msg: { kind: "agent", text: "Perfect, your viewing is confirmed.", ar: "ممتاز، تم تأكيد الموعد." } },
    { t: "event", pre: 1000, text: "Viewing booked · Thu 4:30 PM" },
    { t: "event", pre: 1300, text: "Brochure sent on WhatsApp · CRM updated" },
    { t: "wrap", pre: 2200 },
  ];
}

const DIAL_MS = 1900;
const RESET_MS = 2800;

export default function AitaasCallDemo() {
  const [leadIdx, setLeadIdx] = useState(0);
  const [phase, setPhase] = useState<"dialing" | "live" | "wrap">("dialing");
  const [items, setItems] = useState<Step[]>([]);
  const [typing, setTyping] = useState<"agent" | "lead" | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [reduced, setReduced] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const speakingRef = useRef<"agent" | "lead" | "idle" | "dial">("dial");
  const barsRef = useRef<HTMLDivElement>(null);

  const lead = LEADS[leadIdx % LEADS.length];

  // Reduced motion: render the finished conversation, no engine
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduced(true);
      setPhase("live");
      setItems(script(LEADS[0]).filter((s) => s.t !== "wrap"));
      setSeconds(107);
    }
  }, []);

  // Call engine — chained timeouts through the script
  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => { timers.push(setTimeout(res, ms)); });

    (async () => {
      setPhase("dialing");
      setItems([]);
      setSeconds(0);
      speakingRef.current = "dial";
      await wait(DIAL_MS);
      if (cancelled) return;
      setPhase("live");

      for (const step of script(lead)) {
        if (step.t === "msg") {
          await wait(Math.max(0, step.pre - 700));
          if (cancelled) return;
          setTyping(step.msg.kind);
          speakingRef.current = step.msg.kind;
          await wait(700);
          if (cancelled) return;
          setTyping(null);
          setItems((prev) => [...prev, step]);
        } else {
          speakingRef.current = "idle";
          await wait(step.pre);
          if (cancelled) return;
          if (step.t === "wrap") {
            setPhase("wrap");
            speakingRef.current = "dial";
          } else {
            setItems((prev) => [...prev, step]);
          }
        }
      }

      await wait(RESET_MS);
      if (cancelled) return;
      setLeadIdx((i) => i + 1);
    })();

    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [leadIdx, reduced, lead]);

  // Call timer
  useEffect(() => {
    if (reduced || phase !== "live") return;
    const iv = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, [phase, reduced]);

  // Auto-scroll transcript
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [items, typing, reduced]);

  // Waveform — 36 bars, amplitude follows who is speaking
  useEffect(() => {
    if (reduced) return;
    const wrap = barsRef.current;
    if (!wrap) return;
    const bars = Array.from(wrap.children) as HTMLElement[];
    let raf = 0;
    let amp = 0.06;
    const tick = (now: number) => {
      const target =
        speakingRef.current === "agent" ? 1 :
        speakingRef.current === "lead" ? 0.6 :
        speakingRef.current === "idle" ? 0.2 : 0.08;
      amp += (target - amp) * 0.07;
      const t = now * 0.004;
      bars.forEach((b, i) => {
        const wave =
          Math.sin(t * 1.9 + i * 0.55) * 0.35 +
          Math.sin(t * 3.1 + i * 1.3) * 0.25 +
          Math.sin(t * 0.7 + i * 0.2) * 0.4;
        const floor = 0.08 + Math.abs(Math.sin(i * 7.31)) * 0.22;
        const h = Math.max(floor, Math.abs(wave) * amp);
        b.style.transform = `scaleY(${h.toFixed(3)})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const mm = String(Math.floor(seconds / 60)).padStart(1, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <>
      <style>{`
        .cd {
          width: 100%; max-width: 480px;
          background: oklch(0.065 0.01 260 / 0.92);
          border: 1px solid var(--c-border);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          display: flex; flex-direction: column;
          box-shadow: 0 32px 80px oklch(0 0 0 / 0.5);
        }
        .cd-head {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 18px;
          border-bottom: 1px solid var(--c-border);
        }
        .cd-avatar {
          width: 38px; height: 38px; flex-shrink: 0;
          background: var(--c-copper-dim);
          color: var(--c-copper);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 15px; letter-spacing: 0.04em;
        }
        .cd-id { min-width: 0; flex: 1; }
        .cd-name {
          font-size: 13px; font-weight: 600; color: var(--c-ink);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cd-role {
          font-size: 11px; color: var(--c-muted); margin-top: 1px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cd-live {
          display: flex; align-items: center; gap: 7px; flex-shrink: 0;
        }
        .cd-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--c-copper);
          animation: cd-pulse 1.8s ease-in-out infinite;
        }
        @keyframes cd-pulse {
          0%, 100% { box-shadow: 0 0 0 0 oklch(0.64 0.115 163 / 0.5); }
          50%      { box-shadow: 0 0 0 6px oklch(0.64 0.115 163 / 0); }
        }
        .cd-live-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--c-copper);
        }
        .cd-timer {
          font-size: 12px; color: var(--c-ink-2);
          font-variant-numeric: tabular-nums;
          min-width: 38px; text-align: right;
        }

        .cd-wave {
          display: flex; align-items: center; gap: 3px;
          height: 40px; padding: 0 18px;
          border-bottom: 1px solid var(--c-border);
        }
        .cd-bar {
          flex: 1; height: 30px;
          background: var(--c-copper);
          opacity: 0.85;
          transform: scaleY(0.1);
          transform-origin: center;
          will-change: transform;
        }

        .cd-body {
          height: 320px; overflow-y: hidden;
          padding: 18px;
          display: flex; flex-direction: column; gap: 10px;
          position: relative;
        }
        .cd-dialing {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 14px;
          text-align: center; padding: 0 32px;
        }
        .cd-dialing-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--c-muted);
        }
        .cd-dialing-name { font-size: 15px; font-weight: 600; color: var(--c-ink); }
        .cd-dialing-dots { display: flex; gap: 6px; }
        .cd-dialing-dots span {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--c-copper);
          animation: cd-bounce 1.2s ease-in-out infinite;
        }
        .cd-dialing-dots span:nth-child(2) { animation-delay: 0.15s; }
        .cd-dialing-dots span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes cd-bounce {
          0%, 60%, 100% { opacity: 0.25; transform: translateY(0); }
          30%           { opacity: 1; transform: translateY(-4px); }
        }

        .cd-msg {
          max-width: 84%;
          padding: 10px 14px;
          font-size: 13.5px; line-height: 1.55;
          animation: cd-in 0.45s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        @keyframes cd-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cd-msg--agent {
          align-self: flex-start;
          background: oklch(0.33 0.075 163 / 0.2);
          border: 1px solid oklch(0.64 0.115 163 / 0.25);
          color: var(--c-ink);
        }
        .cd-msg--lead {
          align-self: flex-end;
          background: oklch(0.13 0.008 260);
          border: 1px solid var(--c-border);
          color: var(--c-ink-2);
        }
        .cd-msg-who {
          display: block;
          font-size: 9px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; margin-bottom: 5px;
        }
        .cd-msg--agent .cd-msg-who { color: var(--c-copper); }
        .cd-msg--lead .cd-msg-who { color: var(--c-muted); }
        .cd-msg-ar {
          display: block; direction: rtl;
          font-size: 14px; margin-bottom: 4px; color: var(--c-ink);
        }

        .cd-typing {
          align-self: flex-start;
          display: flex; gap: 5px; padding: 12px 16px;
          background: oklch(0.13 0.008 260);
          border: 1px solid var(--c-border);
          animation: cd-in 0.3s ease both;
        }
        .cd-typing--lead { align-self: flex-end; }
        .cd-typing span {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--c-muted);
          animation: cd-bounce 1.1s ease-in-out infinite;
        }
        .cd-typing span:nth-child(2) { animation-delay: 0.12s; }
        .cd-typing span:nth-child(3) { animation-delay: 0.24s; }

        .cd-event {
          align-self: center;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 14px;
          border: 1px solid oklch(0.64 0.115 163 / 0.35);
          background: oklch(0.64 0.115 163 / 0.07);
          font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--c-copper);
          animation: cd-in 0.5s cubic-bezier(0.23, 1, 0.32, 1) both;
        }

        .cd-wrapnote {
          position: absolute; inset: 0; z-index: 2;
          background: oklch(0.065 0.01 260 / 0.88);
          backdrop-filter: blur(6px);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 10px;
          animation: cd-fade 0.4s ease both;
          text-align: center; padding: 0 32px;
        }
        @keyframes cd-fade { from { opacity: 0; } to { opacity: 1; } }
        .cd-wrapnote-check {
          width: 36px; height: 36px;
          border: 1px solid var(--c-copper);
          display: flex; align-items: center; justify-content: center;
          color: var(--c-copper);
        }
        .cd-wrapnote-h {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; text-transform: uppercase;
          font-size: 1.4rem; letter-spacing: 0; color: var(--c-ink);
        }
        .cd-wrapnote-sub { font-size: 12px; color: var(--c-muted); }

        .cd-foot {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 4px 16px;
          padding: 12px 18px;
          border-top: 1px solid var(--c-border);
          font-size: 10.5px; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--c-muted);
        }
        .cd-foot span { white-space: nowrap; }
        .cd-foot-lang { color: var(--c-copper); }

        @media (max-width: 860px) {
          .cd { max-width: 100%; }
          .cd-body { height: clamp(300px, 48svh, 380px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cd-live-dot, .cd-dialing-dots span, .cd-typing span { animation: none; }
          .cd-msg, .cd-event { animation: none; opacity: 1; }
        }
      `}</style>

      <div className="cd" role="img" aria-label="Live demonstration of an AI voice agent booking a property viewing">
        <div className="cd-head">
          <div className="cd-avatar" aria-hidden>AY</div>
          <div className="cd-id">
            <div className="cd-name">Aya — Property Sales Agent</div>
            <div className="cd-role">Outbound · {lead} · Marina Walk enquiry</div>
          </div>
          {phase === "live" ? (
            <div className="cd-live">
              <span className="cd-live-dot" />
              <span className="cd-live-label">Live</span>
              <span className="cd-timer">{mm}:{ss}</span>
            </div>
          ) : (
            <div className="cd-live">
              <span className="cd-live-label" style={{ color: "var(--c-muted)" }}>
                {phase === "dialing" ? "Dialing" : "Ended"}
              </span>
            </div>
          )}
        </div>

        <div className="cd-wave" aria-hidden>
          <div ref={barsRef} style={{ display: "flex", alignItems: "center", gap: 2, width: "100%", height: "100%" }}>
            {Array.from({ length: 48 }).map((_, i) => (
              <span key={i} className="cd-bar" style={reduced ? { transform: `scaleY(${0.1 + ((i * 7) % 10) / 14})` } : undefined} />
            ))}
          </div>
        </div>

        <div className="cd-body" ref={scrollRef}>
          {phase === "dialing" && (
            <div className="cd-dialing">
              <span className="cd-dialing-label">Outbound call · enquiry 4 min old</span>
              <span className="cd-dialing-name">{lead}</span>
              <div className="cd-dialing-dots" aria-hidden><span /><span /><span /></div>
            </div>
          )}

          {items.map((step, i) => {
            if (step.t === "msg") {
              return (
                <div key={i} className={`cd-msg cd-msg--${step.msg.kind}`}>
                  <span className="cd-msg-who">{step.msg.kind === "agent" ? "Aya · AI Agent" : lead.split(" ")[0]}</span>
                  {step.msg.ar && <span className="cd-msg-ar" lang="ar">{step.msg.ar}</span>}
                  {step.msg.text}
                </div>
              );
            }
            if (step.t === "event") {
              return (
                <div key={i} className="cd-event">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2 6.5L4.8 9.2L10 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {step.text}
                </div>
              );
            }
            return null;
          })}

          {typing && (
            <div className={`cd-typing${typing === "lead" ? " cd-typing--lead" : ""}`} aria-hidden>
              <span /><span /><span />
            </div>
          )}

          {phase === "wrap" && (
            <div className="cd-wrapnote">
              <div className="cd-wrapnote-check">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M2.5 8.5L6.2 12.2L13.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="cd-wrapnote-h">Viewing booked</div>
              <div className="cd-wrapnote-sub">Call complete · {mm}:{ss} · next lead in queue</div>
            </div>
          )}
        </div>

        <div className="cd-foot">
          <span><span className="cd-foot-lang">EN · AR</span> live voice</span>
          <span>Simulated call</span>
          <span>Transcript on</span>
        </div>
      </div>
    </>
  );
}
