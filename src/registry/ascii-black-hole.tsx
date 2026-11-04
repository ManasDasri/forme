"use client";
import { useEffect, useRef, useState } from "react";
import "./ascii-black-hole.css";

// Dense ramp, darkest to brightest.
const ramp = " .'`^,:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@";
const LEVELS = 18;
const hash = (x: number, y: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};
const noise = (x: number, y: number) => {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
};
// Warm palette: umber, amber, then white-hot.
const palette = Array.from({ length: LEVELS }, (_, i) => {
  const k = i / (LEVELS - 1);
  const stops = [
    [70, 42, 24],
    [176, 112, 60],
    [242, 190, 130],
    [255, 246, 232],
  ];
  const s = Math.min(stops.length - 2, Math.floor(k * (stops.length - 1)));
  const f = k * (stops.length - 1) - s;
  const c = stops[s].map((v, j) => Math.round(v + (stops[s + 1][j] - v) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
});

/** A black hole drawn in dense characters: a lensed ring and an accretion disk whose rings orbit. */
export function AsciiBlackHole({
  speed = 1,
  label = "A black hole drawn in characters, its accretion disk orbiting",
}: {
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
    let frame = 0,
      visible = false,
      last = performance.now(),
      t = 0,
      width = 0,
      height = 0,
      cellW = 4.2,
      cellH = 7;
    const fontSize = 7;
    const tilt = 0.3,
      cosT = Math.cos(tilt),
      sinT = Math.sin(tilt);
    const brightness = (px: number, py: number, stars: number) => {
      const r = Math.hypot(px, py);
      if (r < 1) return 0;
      // Disk plane, tilted and seen nearly edge-on.
      const qx = px * cosT - py * sinT,
        qy = (px * sinT + py * cosT) / 0.11;
      const rd = Math.hypot(qx, qy);
      const angle = Math.atan2(qy, qx);
      const beam = 1 - 0.55 * Math.max(-1, Math.min(1, qx / (rd + 1e-4)));
      let disk = 0;
      if (rd > 1.4 && rd < 8) {
        // Keplerian shear: inner rings orbit faster, so streaks visibly flow.
        const orbit = angle + (t * 1.6) / Math.pow(rd, 1.5);
        const rings = 0.3 + 0.7 * noise(rd * 7, orbit * 2.2);
        const fine = 0.7 + 0.3 * Math.sin(rd * 26 + noise(orbit * 3, rd) * 4);
        disk = Math.pow(1.5 / (rd - 0.85), 1.7) * rings * fine * beam * Math.min(1, (rd - 1.4) * 3) * 1.3;
      }
      const front = qy > 0 || r > 1.9; // far side hides behind the shadow
      // Lensed image of the far disk: a wide ring hugging the shadow.
      const ring = r - 1.05;
      const lensAngle = Math.atan2(py, px);
      const lens =
        (2.3 * Math.exp(-ring * 2.6) + 0.22 * Math.exp(-ring * 0.8)) *
        (0.55 + 0.45 * noise(ring * 9, lensAngle * 3 + t * 0.9)) *
        (0.7 + 0.4 * Math.sin(-lensAngle + 0.6)) *
        (1 - 0.6 * Math.max(-1, Math.min(1, px / r)));
      const photon = Math.exp(-Math.abs(r - 1.03) * 40) * 0.6;
      const glow = 1.5 * Math.exp(-Math.hypot(px + 1.05, (py - 0.1) * 1.4) * 1.8) + 0.12 * Math.exp(-Math.abs(r - 1.2) * 1.2);
      return Math.min(1.4, (front ? disk : 0) + lens * 0.95 + photon + glow + stars);
    };
    const paint = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!paused && !media.matches) t += dt * Math.max(0, Math.min(speed, 3));
      context.fillStyle = "#050302";
      context.fillRect(0, 0, width, height);
      const cols = Math.ceil(width / cellW),
        rows = Math.ceil(height / cellH);
      const R = height * 0.22,
        cx = width * 0.66,
        cy = height * 0.42;
      const buckets: string[][] = Array.from({ length: LEVELS }, () => []);
      for (let row = 0; row < rows; row++) {
        const lines = Array.from({ length: LEVELS }, () => [] as string[]);
        for (let col = 0; col < cols; col++) {
          const px = (col * cellW + cellW / 2 - cx) / R,
            py = (row * cellH + cellH / 2 - cy) / R;
          const star = hash(col, row) > 0.9975 ? 0.35 : 0;
          const b = brightness(px, py, star);
          const k = Math.pow(1 - Math.exp(-b * 2.1), 1.9);
          if (k < 0.05) {
            for (const line of lines) line.push(" ");
            continue;
          }
          const level = Math.min(LEVELS - 1, Math.floor(k * LEVELS));
          const ch = ramp[Math.min(ramp.length - 1, 1 + Math.floor(k * (ramp.length - 1)))];
          for (let l = 0; l < LEVELS; l++) lines[l].push(l === level ? ch : " ");
        }
        for (let l = 0; l < LEVELS; l++) buckets[l].push(lines[l].join(""));
      }
      context.textBaseline = "top";
      for (let l = 0; l < LEVELS; l++) {
        context.fillStyle = palette[l];
        const rowsText = buckets[l];
        for (let row = 0; row < rowsText.length; row++)
          if (rowsText[row].trim()) context.fillText(rowsText[row], 0, row * cellH);
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
      cellW = context.measureText("M").width;
      cellH = fontSize;
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
  }, [speed, paused]);
  return (
    <div className="forme-ascii-black-hole">
      <canvas ref={canvas} role="img" aria-label={label} />
      <div className="forme-ascii-black-hole-footer">
        <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
