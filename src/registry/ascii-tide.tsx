"use client";
import { useEffect, useRef, useState } from "react";
import "./ascii-tide.css";

const ramp = " .,-~:;=+*#%@";
const LEVELS = 14;
const rgb = (hex: string) => {
  const h = /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#8ab4ff";
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
};
/** A moonlit ocean in dense characters: rolling swells, a glittering moon path, foam on the crests. */
export function AsciiTide({
  color = "#8ab4ff",
  speed = 1,
  label = "Slow waves drawn in dense characters",
}: {
  color?: string;
  speed?: number;
  label?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = canvas.current!,
      context = node.getContext("2d");
    if (!context) return;
    const media = matchMedia("(prefers-reduced-motion:reduce)");
    const tint = rgb(color);
    const palette = Array.from({ length: LEVELS }, (_, i) => {
      const k = i / (LEVELS - 1);
      // Deep tint in the troughs, the color itself mid-swell, near white on crests.
      const mix = (c: number) =>
        k < 0.6 ? Math.round(c * (0.22 + (k / 0.6) * 0.78)) : Math.round(c + (255 - c) * ((k - 0.6) / 0.4) * 0.9);
      return `rgb(${mix(tint[0])},${mix(tint[1])},${mix(tint[2])})`;
    });
    const fontSize = 8;
    let frame = 0,
      visible = false,
      last = performance.now(),
      t = 0,
      width = 0,
      height = 0,
      cellW = 4.8;
    // Several swells crossing at different angles; returns height for a point on the water.
    const swells = [
      [0.9, 0.35, 0.55, 0.42],
      [-0.6, 0.8, 0.8, 0.3],
      [0.3, 1.0, 1.3, 0.18],
      [-0.9, 0.45, 2.1, 0.1],
      [0.7, -0.7, 3.4, 0.05],
    ];
    const sea = (x: number, z: number) => {
      let h = 0;
      for (const [dx, dz, f, a] of swells) h += a * Math.sin((x * dx + z * dz) * f + t * (0.6 + f * 0.35));
      return h;
    };
    const hash = (x: number, y: number) => {
      const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return n - Math.floor(n);
    };
    const paint = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!paused && !media.matches) t += dt * Math.max(0, Math.min(speed, 3));
      context.fillStyle = "#030406";
      context.fillRect(0, 0, width, height);
      const cols = Math.ceil(width / cellW),
        rows = Math.ceil(height / fontSize),
        aspect = width / height;
      const lines: string[][] = Array.from({ length: LEVELS }, () => []);
      for (let row = 0; row < rows; row++) {
        const y = row / rows;
        const parts: string[][] = Array.from({ length: LEVELS }, () => []);
        for (let col = 0; col < cols; col++) {
          const x = (col / cols - 0.5) * aspect * 2;
          // Moonlit ocean: a sky with a moon, and below the horizon, water shaded by its slope.
          const horizon = 0.4,
            moonX = aspect * 0.32,
            moonY = 0.17;
          let k = 0;
          if (y < horizon) {
            const dx = (x - moonX) * 0.9,
              dy = (y - moonY) * 1.7,
              dm = Math.hypot(dx, dy),
              R = 0.095;
            // A lit sphere: brightest toward the upper left, softly darker at the limb.
            const disc = dm < R ? 0.72 + 0.28 * Math.max(0, (-dx - dy) / R * 0.5 + Math.sqrt(1 - (dm / R) ** 2) * 0.6) : 0;
            // Only a thin, faint rim of glow, so the sky around the moon stays dark.
            const halo = dm >= R ? 0.1 * Math.exp(-(dm - R) * 40) : 0;
            const glow = 0.1 * Math.exp(-(horizon - y) * 16);
            const star = hash(col, row) > 0.994 ? 0.25 + 0.2 * Math.sin(t * 2 + col) : 0;
            k = Math.max(disc, halo + glow + star);
          } else {
            const v = (y - horizon) / (1 - horizon);
            const z = 1 / (v + 0.035);
            const wx = x * z * 0.55,
              wz = z * 1.4;
            const h = sea(wx, wz);
            const sx = (sea(wx + 0.06, wz) - h) / 0.06,
              sz = (sea(wx, wz + 0.06) - h) / 0.06;
            // Faces tilted toward the horizon reflect the bright sky; the rest stays dark.
            const sky = Math.max(0, 0.38 + sz * 0.7 - Math.abs(sx) * 0.06) * (0.45 + 0.55 * (1 - v));
            const path = Math.exp(-Math.pow((x - moonX) / (0.08 + 0.6 * v), 2));
            const glitter = path * Math.pow(Math.max(0, 0.6 + sx * 0.5 + sz * 0.35), 5) * 2.4;
            const foam = Math.max(0, h - 0.62) * 2.2 * (0.5 + 0.5 * v);
            const fog = Math.exp(-v * 9) * 0.22;
            k = Math.min(1, sky * 1.05 + glitter + foam + fog);
          }
          const level = Math.min(LEVELS - 1, Math.floor(k * LEVELS));
          const ch = k < 0.045 ? " " : ramp[Math.min(ramp.length - 1, 1 + Math.floor(k * (ramp.length - 1)))];
          for (let l = 0; l < LEVELS; l++) parts[l].push(l === level ? ch : " ");
        }
        for (let l = 0; l < LEVELS; l++) lines[l].push(parts[l].join(""));
      }
      for (let l = 0; l < LEVELS; l++) {
        context.fillStyle = palette[l];
        for (let row = 0; row < lines[l].length; row++)
          if (lines[l][row].trim()) context.fillText(lines[l][row], 0, row * fontSize);
      }
    };
    const tick = (now: number) => {
      if (now - last >= 40) paint(now);
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
      context.font = `500 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      context.textBaseline = "top";
      cellW = context.measureText("M").width;
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
    <div className="forme-ascii-tide">
      <canvas ref={canvas} role="img" aria-label={label} />
      <div className="forme-ascii-tide-footer">
        <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
