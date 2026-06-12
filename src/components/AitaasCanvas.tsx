"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label: string;
  type: "core" | "agent" | "output";
  r: number;
  alpha: number;
  targetAlpha: number;
}

interface Pulse {
  from: number;
  to: number;
  t: number; // 0..1
  speed: number;
}

const LABELS = [
  "Property Sales", "Revenue Recovery", "Appointment Booking",
  "Cart Recovery", "Admissions", "Arabic", "English", "Hindi",
  "WhatsApp", "Calendar", "CRM", "Payment Link", "Voice Call",
  "Qualification", "Brochure Delivery", "Follow-up",
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function AitaasCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let W = 0, H = 0;

    // ── copper palette ──────────────────────────────────
    // oklch(0.72 0.17 34) → approximately #C26A3A / rgb(194,106,58)
    const COPPER = { r: 194, g: 106, b: 58 };
    const DIM    = { r: 80,  g: 40,  b: 20 };
    const BG_R = 8, BG_G = 10, BG_B = 18; // dark ink bg tint

    function rgba(c: { r: number; g: number; b: number }, a: number) {
      return `rgba(${c.r},${c.g},${c.b},${a})`;
    }

    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let edges: [number, number][] = [];

    function buildGraph() {
      nodes = [];
      edges = [];
      pulses = [];

      const cx = W * 0.5;
      const cy = H * 0.5;

      // Core orchestrator node
      nodes.push({ x: cx, y: cy, vx: 0, vy: 0, label: "Orchestrator", type: "core", r: 14, alpha: 0.9, targetAlpha: 0.9 });

      // Agent nodes — arranged loosely around center
      const count = Math.min(LABELS.length, W < 600 ? 8 : 14);
      const radius = Math.min(W, H) * 0.36;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const r = radius * (0.7 + Math.random() * 0.3);
        nodes.push({
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          label: LABELS[i],
          type: i < 6 ? "agent" : "output",
          r: 6 + Math.random() * 3,
          alpha: 0.35 + Math.random() * 0.45,
          targetAlpha: 0.35 + Math.random() * 0.45,
        });
      }

      buildEdges();
    }

    function buildEdges() {
      edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 260 && (i === 0 || j === 0 || dist < 180)) {
            edges.push([i, j]);
          }
        }
      }
    }

    function spawnPulse() {
      if (edges.length === 0) return;
      const e = edges[Math.floor(Math.random() * edges.length)];
      pulses.push({ from: e[0], to: e[1], t: 0, speed: 0.004 + Math.random() * 0.006 });
    }

    let frame = 0;
    function tick() {
      ctx.clearRect(0, 0, W, H);

      frame++;
      if (frame % 40 === 0 && pulses.length < 12) spawnPulse();

      // ── update nodes ──
      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (const n of nodes) {
        if (n.type === "core") continue;
        n.x += n.vx;
        n.y += n.vy;

        // gentle wrap
        if (n.x < 30) n.vx += 0.01;
        if (n.x > W - 30) n.vx -= 0.01;
        if (n.y < 30) n.vy += 0.01;
        if (n.y > H - 30) n.vy -= 0.01;

        // damping
        n.vx *= 0.998;
        n.vy *= 0.998;

        // mouse repulsion
        const ddx = n.x - mx;
        const ddy = n.y - my;
        const dd = Math.hypot(ddx, ddy);
        if (dd < 120) {
          const force = (120 - dd) / 120;
          n.vx += (ddx / dd) * force * 0.4;
          n.vy += (ddy / dd) * force * 0.4;
        }

        // mouse proximity highlights
        if (dd < 160) {
          n.targetAlpha = Math.min(0.95, n.targetAlpha + 0.3);
        } else {
          n.targetAlpha = 0.35 + (n.type === "agent" ? 0.25 : 0.1);
        }
        n.alpha = lerp(n.alpha, n.targetAlpha, 0.05);
      }

      // ── rebuild edges when nodes move significantly ──
      if (frame % 120 === 0) buildEdges();

      // ── draw edges ──
      for (const [i, j] of edges) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        const alpha = (1 - dist / 260) * 0.15 * Math.min(a.alpha, b.alpha) * 2.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = rgba(DIM, alpha);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ── draw & advance pulses ──
      const alive: Pulse[] = [];
      for (const p of pulses) {
        p.t = Math.min(1, p.t + p.speed);
        const a = nodes[p.from];
        const b = nodes[p.to];
        const px = lerp(a.x, b.x, p.t);
        const py = lerp(a.y, b.y, p.t);

        // trail
        const g = ctx.createRadialGradient(px, py, 0, px, py, 12);
        g.addColorStop(0, rgba(COPPER, 0.7));
        g.addColorStop(1, rgba(COPPER, 0));
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // dot
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = rgba(COPPER, 0.9);
        ctx.fill();

        if (p.t < 1) alive.push(p);
      }
      pulses = alive;

      // ── draw nodes ──
      for (const n of nodes) {
        // glow
        const gRadius = n.type === "core" ? 48 : 28;
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, gRadius);
        g.addColorStop(0, rgba(COPPER, n.alpha * (n.type === "core" ? 0.22 : 0.12)));
        g.addColorStop(1, rgba(COPPER, 0));
        ctx.beginPath();
        ctx.arc(n.x, n.y, gRadius, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(COPPER, n.alpha * 0.8);
        ctx.lineWidth = n.type === "core" ? 1.5 : 1;
        ctx.stroke();

        // fill
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r - 1.5, 0, Math.PI * 2);
        ctx.fillStyle = rgba(COPPER, n.alpha * 0.18);
        ctx.fill();

        // label
        if (n.alpha > 0.3) {
          ctx.font = `${n.type === "core" ? "500 11px" : "400 9.5px"} 'Hanken Grotesk', sans-serif`;
          ctx.fillStyle = rgba(COPPER, n.alpha * 0.9);
          ctx.textAlign = "center";
          ctx.fillText(n.label, n.x, n.y + n.r + 14);
        }
      }

      raf.current = requestAnimationFrame(tick);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      buildGraph();
    }

    resize();
    tick();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onLeave() { mouse.current = { x: -9999, y: -9999 }; }

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden
    />
  );
}
