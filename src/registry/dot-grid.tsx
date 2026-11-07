"use client";
import { useEffect, useRef } from "react";
import "./dot-grid.css";

/** A dot-matrix background in your text color: a slow swell, and a soft glow that follows the pointer. */
export function DotGrid({
  spacing = 22,
  className = "",
}: {
  spacing?: number;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const host = root.current!,
      node = canvas.current!,
      context = node.getContext("2d");
    if (!context) return;
    const media = matchMedia("(prefers-reduced-motion:reduce)");
    // The glow eases toward the pointer and fades in and out, rather than flying in from off-screen.
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, strength: 0, on: false };
    let frame = 0,
      visible = false,
      width = 0,
      height = 0,
      t = 0,
      last = performance.now(),
      rgb = "255,255,255";
    const paint = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!media.matches) t += dt;
      pointer.x += (pointer.tx - pointer.x) * 0.18;
      pointer.y += (pointer.ty - pointer.y) * 0.18;
      pointer.strength += ((pointer.on ? 1 : 0) - pointer.strength) * 0.12;
      context.clearRect(0, 0, width, height);
      for (let y = spacing / 2; y < height; y += spacing)
        for (let x = spacing / 2; x < width; x += spacing) {
          const swell = media.matches ? 0 : 0.5 + 0.5 * Math.sin(x * 0.012 + y * 0.009 - t * 0.9);
          const d = Math.hypot(x - pointer.x, y - pointer.y);
          const glow = pointer.strength * Math.exp(-(d * d) / 9000);
          const alpha = 0.22 + swell * 0.14 + glow * 0.7;
          const radius = 1.05 + glow * 1.3;
          context.fillStyle = `rgba(${rgb},${alpha.toFixed(3)})`;
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
    };
    const tick = (now: number) => {
      if (now - last >= 32) paint(now);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      // Dots take the host's text color, so the grid suits any page.
      const m = getComputedStyle(host).color.match(/\d+(\.\d+)?/g);
      if (m) rgb = m.slice(0, 3).join(",");
      last = performance.now();
      paint(last);
      if (visible && !document.hidden && !media.matches) frame = requestAnimationFrame(tick);
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
    const move = (e: PointerEvent) => {
      const r = node.getBoundingClientRect();
      pointer.tx = e.clientX - r.left;
      pointer.ty = e.clientY - r.top;
      if (pointer.strength < 0.02) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
      pointer.on = true;
      if (media.matches) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
        pointer.strength = 1;
        paint(performance.now());
      }
    };
    const leave = () => {
      pointer.on = false;
      if (media.matches) {
        pointer.strength = 0;
        paint(performance.now());
      }
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", start);
    media.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", start);
      media.removeEventListener("change", start);
    };
  }, [spacing]);
  return (
    <div ref={root} className={`forme-dot-grid ${className}`}>
      <canvas ref={canvas} aria-hidden="true" />
    </div>
  );
}
