"use client";
import { useEffect, useRef, useState } from "react";
import "./ascii-surface.css";

const ramp = " .:-=+*#%@";
const COLS = 92,
  ROWS = 60,
  NEAR = 0.45,
  FAR = 7,
  CAMERA = 0.62;
const rgb = (hex: string) => {
  const h = /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#9ecbff";
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
};
/** A terrain of characters in perspective. Glyph size, light, and color follow depth and slope. */
export function AsciiSurface({
  color = "#9ecbff",
  speed = 1,
  label = "A rolling surface drawn from characters",
}: {
  color?: string;
  speed?: number;
  label?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, z: 2, active: false, rx: 0, rz: 2, pulse: -1e9 });
  const [paused, setPaused] = useState(false);
  const geometry = useRef({ f: 1, cx: 0, horizon: 0 });
  // Screen point to the ground plane, so the lens lands where the pointer is.
  const toWorld = (sx: number, sy: number) => {
    const { f, cx, horizon } = geometry.current;
    const z = Math.max(NEAR, Math.min(FAR, (CAMERA * f) / Math.max(1, sy - horizon)));
    return { x: ((sx - cx) * z) / f, z };
  };
  useEffect(() => {
    const node = canvas.current!,
      context = node.getContext("2d");
    if (!context) return;
    const media = matchMedia("(prefers-reduced-motion:reduce)");
    const tint = rgb(color);
    let frame = 0,
      visible = false,
      last = performance.now(),
      t = 0,
      width = 0,
      height = 0;
    const heightAt = (x: number, z: number, now: number) => {
      const p = pointer.current;
      let y =
        0.24 * Math.sin(x * 1.3 + t * 0.8) * Math.cos(z * 0.9 - t * 0.5) +
        0.11 * Math.sin(x * 2.7 - z * 1.7 + t * 1.2) +
        0.05 * Math.cos(z * 3.4 + x * 1.5 + t);
      if (!paused && !media.matches) {
        const d = Math.hypot(x - p.rx, (z - p.rz) * 0.8);
        if (p.active) y -= 0.22 * Math.exp(-d * d * 3);
        const age = (now - p.pulse) / 1000;
        if (age >= 0 && age < 3.5) y += 0.18 * Math.sin(d * 7 - age * 6) * Math.exp(-age * 1.1 - d * 0.6);
      }
      return y;
    };
    const paint = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!paused && !media.matches) t += dt * Math.max(0, Math.min(speed, 3));
      const p = pointer.current;
      p.rx += (p.x - p.rx) * 0.12;
      p.rz += (p.z - p.rz) * 0.12;
      const f = height * 0.9,
        cx = width / 2,
        horizon = height * 0.34;
      geometry.current = { f, cx, horizon };
      context.fillStyle = "#04060a";
      context.fillRect(0, 0, width, height);
      // Glow peaks at the horizon and fades both ways, so there is no seam.
      const sky = context.createLinearGradient(0, 0, 0, height);
      const h = Math.min(0.95, horizon / height);
      sky.addColorStop(0, "rgba(0,0,0,0)");
      sky.addColorStop(h, `rgba(${tint},0.09)`);
      sky.addColorStop(Math.min(1, h + 0.3), "rgba(0,0,0,0)");
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);
      context.textAlign = "center";
      context.textBaseline = "middle";
      // Back to front so nearer, larger glyphs sit on top.
      for (let row = ROWS - 1; row >= 0; row--) {
        const z = NEAR + Math.pow(row / (ROWS - 1), 1.35) * (FAR - NEAR);
        const span = 0.95 * z + 0.6;
        const size = Math.max(3.5, Math.min(22, (0.042 * f) / z));
        const fog = Math.pow(1 - (z - NEAR) / (FAR - NEAR), 1.2);
        context.font = `500 ${size.toFixed(1)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        for (let col = 0; col < COLS; col++) {
          const x = (col / (COLS - 1) - 0.5) * 2 * span;
          const y = heightAt(x, z, now);
          const e = 0.04;
          const nx = heightAt(x + e, z, now) - y,
            nz = heightAt(x, z + e, now) - y;
          const light = Math.max(0, Math.min(1, 0.45 - nx * 14 + nz * 10 + y * 1.8));
          const sx = cx + (x * f) / z,
            sy = horizon + ((CAMERA - y) * f) / z;
          if (sx < -20 || sx > width + 20 || sy > height + 20) continue;
          const edge = Math.min(1, (1 - Math.abs(col / (COLS - 1) - 0.5) * 2) * 4);
          context.globalAlpha = fog * edge * (0.25 + 0.75 * light);
          const w = light * light;
          context.fillStyle = `rgb(${Math.round(tint[0] + (255 - tint[0]) * w)},${Math.round(tint[1] + (255 - tint[1]) * w)},${Math.round(tint[2] + (255 - tint[2]) * w)})`;
          context.fillText(ramp[1 + Math.floor(light * (ramp.length - 2))], sx, sy);
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
      className="forme-ascii-surface"
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        Object.assign(pointer.current, toWorld(e.clientX - r.left, e.clientY - r.top), { active: true });
      }}
      onPointerLeave={() => {
        pointer.current.active = false;
      }}
    >
      <button
        className="forme-ascii-surface-canvas"
        aria-label={`Send a ripple: ${label}`}
        disabled={paused}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const point =
            e.detail === 0 ? { x: 0, z: 1.6 } : toWorld(e.clientX - r.left, e.clientY - r.top);
          Object.assign(pointer.current, point, { rx: point.x, rz: point.z, pulse: performance.now() });
        }}
      >
        <canvas ref={canvas} aria-hidden="true" />
      </button>
      <div className="forme-ascii-surface-footer">
        <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
