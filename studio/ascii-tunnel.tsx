"use client";
import { useEffect, useRef, useState } from "react";
import "./ascii-tunnel.css";

const glyphs = "@%#*+=-:.";
const RINGS = 64,
  PER_RING = 96,
  FAR = 5;
const rgb = (hex: string) => {
  const h = /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#ffb86b";
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
};
/** Rings of characters rush toward the viewer. Glyph size, brightness, and color follow depth. */
export function AsciiTunnel({
  color = "#ffb86b",
  speed = 1,
  label = "An endless tunnel of characters",
}: {
  color?: string;
  speed?: number;
  label?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const aim = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = canvas.current!,
      context = node.getContext("2d");
    if (!context) return;
    const media = matchMedia("(prefers-reduced-motion:reduce)");
    const tint = rgb(color);
    const rings = Array.from({ length: RINGS }, (_, i) => ({ z: 0.2 + (i / RINGS) * FAR, seed: i }));
    let frame = 0,
      visible = false,
      last = performance.now(),
      t = 0,
      width = 0,
      height = 0;
    const paint = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const moving = !paused && !media.matches;
      if (moving) {
        t += dt * Math.max(0, Math.min(speed, 3));
        for (const ring of rings) {
          ring.z -= dt * 0.9 * Math.max(0, Math.min(speed, 3));
          if (ring.z < 0.2) ring.z += FAR;
        }
      }
      const a = aim.current;
      a.x += (a.tx - a.x) * 0.06;
      a.y += (a.ty - a.y) * 0.06;
      const f = Math.min(width, height) * 0.62;
      const cx = width / 2,
        cy = height / 2;
      context.fillStyle = "#050406";
      context.fillRect(0, 0, width, height);
      // Light at the end of the tunnel.
      const vx = cx + a.x * width * 0.18,
        vy = cy + a.y * height * 0.18;
      const glow = context.createRadialGradient(vx, vy, 0, vx, vy, f * 0.55);
      glow.addColorStop(0, `rgba(255,244,230,0.55)`);
      glow.addColorStop(0.25, `rgba(${tint},0.18)`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
      context.textAlign = "center";
      context.textBaseline = "middle";
      const sorted = [...rings].sort((p, q) => q.z - p.z);
      for (const ring of sorted) {
        const z = ring.z;
        const radius = (0.55 * f) / z;
        // Parallax: near rings stay centered, far rings drift toward the aim point.
        const ox = cx + a.x * width * 0.18 * (1 - 1 / (1 + z)),
          oy = cy + a.y * height * 0.18 * (1 - 1 / (1 + z));
        const size = Math.max(3.5, Math.min(26, (9 / z) * (f / 420)));
        const fog = Math.pow(Math.max(0, 1 - z / FAR), 1.4) * Math.min(1, (z - 0.2) * 3);
        if (fog < 0.02) continue;
        const near = Math.min(1, 1.2 / z);
        const r = Math.round(255 + (tint[0] - 255) * near),
          g = Math.round(244 + (tint[1] - 244) * near),
          b = Math.round(230 + (tint[2] - 230) * near);
        context.font = `500 ${size.toFixed(1)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        const twist = z * 0.35 + t * 0.25;
        for (let i = 0; i < PER_RING; i++) {
          // Four spiral rails carry the brightest glyphs.
          const rail = (i + ring.seed) % 12;
          const angle = (i / PER_RING) * Math.PI * 2 + twist;
          const shade = rail < 2 ? 1 : 0.28 + 0.3 * (0.5 + 0.5 * Math.sin(i * 0.45 + ring.seed * 0.7));
          context.globalAlpha = fog * shade;
          context.fillStyle = `rgb(${r},${g},${b})`;
          context.fillText(
            glyphs[Math.min(glyphs.length - 1, Math.floor((1 - shade) * glyphs.length))],
            ox + Math.cos(angle) * radius,
            oy + Math.sin(angle) * radius,
          );
        }
      }
      context.globalAlpha = 1;
    };
    const tick = (now: number) => {
      if (now - last >= 30) paint(now);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      paint(last);
      if (visible && !document.hidden && !paused && !media.matches) frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(() => {
      const rect = node.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      node.width = Math.round(width * ratio);
      node.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      start();
    });
    resize.observe(node);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    observer.observe(node);
    document.addEventListener("visibilitychange", start);
    media.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", start);
      media.removeEventListener("change", start);
    };
  }, [color, speed, paused]);
  return (
    <div
      className="forme-ascii-tunnel"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        aim.current.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        aim.current.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      }}
      onPointerLeave={() => {
        aim.current.tx = aim.current.ty = 0;
      }}
    >
      <canvas ref={canvas} role="img" aria-label={label} />
      <div className="forme-ascii-tunnel-footer">
        <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
