"use client";

import { useEffect, useRef } from "react";

const COPPER = { r: 194, g: 106, b: 58 };

function rgba(c: { r: number; g: number; b: number }, a: number) {
  return `rgba(${c.r},${c.g},${c.b},${a.toFixed(3)})`;
}

const RINGS = [
  { rFrac: 0.44, spd: 0.00032, segs: 10, fill: 0.3,  lw: 0.5, a: 0.14 },
  { rFrac: 0.35, spd: -0.00055, segs: 14, fill: 0.18, lw: 0.5, a: 0.09 },
  { rFrac: 0.26, spd: 0.00092, segs: 7,  fill: 0.48, lw: 0.7, a: 0.18 },
  { rFrac: 0.17, spd: -0.0015, segs: 5,  fill: 0.55, lw: 0.8, a: 0.26 },
  { rFrac: 0.09, spd: 0.0026,  segs: 3,  fill: 0.7,  lw: 1.2, a: 0.42 },
];

export default function AitaasHeroCanvas({
  mouseRef,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0;
    let smx = 0.5, smy = 0.5;
    let frame = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    }

    function tick() {
      frame++;
      ctx.clearRect(0, 0, W, H);

      const nx = (mouseRef.current?.x ?? 0.5);
      const ny = (mouseRef.current?.y ?? 0.5);
      smx += (nx - smx) * 0.04;
      smy += (ny - smy) * 0.04;

      const cx = W / 2;
      const cy = H / 2;
      const base = Math.min(W, H) * 0.5;
      const pulse = 0.5 + 0.5 * Math.sin(frame * 0.018);

      // Dot grid
      const gs = 46;
      for (let gx = gs; gx < W; gx += gs) {
        for (let gy = gs; gy < H; gy += gs) {
          const d = Math.hypot(gx - cx, gy - cy);
          const a = Math.max(0, 0.05 - d / (base * 2.4));
          if (a > 0.003) {
            ctx.beginPath();
            ctx.arc(gx, gy, 0.7, 0, Math.PI * 2);
            ctx.fillStyle = rgba(COPPER, a);
            ctx.fill();
          }
        }
      }

      // Rings
      RINGS.forEach((ring, i) => {
        const phase = frame * ring.spd;
        const arc = (Math.PI * 2) / ring.segs;
        const dashArc = arc * ring.fill;
        const r = base * ring.rFrac;
        const ox = (smx - 0.5) * 18 * (i * 0.5 + 0.3);
        const oy = (smy - 0.5) * 12 * (i * 0.5 + 0.3);

        ctx.strokeStyle = rgba(COPPER, ring.a);
        ctx.lineWidth = ring.lw;
        for (let s = 0; s < ring.segs; s++) {
          const sa = phase + s * arc;
          ctx.beginPath();
          ctx.arc(cx + ox, cy + oy, r, sa, sa + dashArc);
          ctx.stroke();
        }

        // Node marker
        const na = phase + 0.9 + i * 0.7;
        const nx2 = cx + ox + Math.cos(na) * r;
        const ny2 = cy + oy + Math.sin(na) * r;
        ctx.beginPath();
        ctx.arc(nx2, ny2, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = rgba(COPPER, ring.a * 2.6);
        ctx.fill();
      });

      // Central orb
      const or = 22 + pulse * 5;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, or * 5);
      g.addColorStop(0, rgba(COPPER, 0.1 + pulse * 0.06));
      g.addColorStop(1, rgba(COPPER, 0));
      ctx.beginPath();
      ctx.arc(cx, cy, or * 5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, or, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(COPPER, 0.5 + pulse * 0.28);
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, or * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = rgba(COPPER, 0.18 + pulse * 0.1);
      ctx.fill();

      raf.current = requestAnimationFrame(tick);
    }

    resize();
    tick();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, [mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden
    />
  );
}
