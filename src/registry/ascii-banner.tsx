"use client";
import { createElement, useEffect, useRef } from "react";
import "./ascii-banner.css";

const ramp = " .:-=+*#%@";
const LEVELS = 12;
const rgb = (hex: string) => {
  const h = /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#e4e4e7";
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
};
/** Any text drawn as dense ASCII art with a slow light sweeping across it; the light follows a hovering pointer. A real heading underneath. */
export function AsciiBanner({
  text,
  as = "h2",
  color = "#e4e4e7",
  font = "800 100px system-ui, sans-serif",
  speed = 1,
  className = "",
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  color?: string;
  font?: string;
  speed?: number;
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const node = canvas.current!,
      context = node.getContext("2d");
    if (!context) return;
    const media = matchMedia("(prefers-reduced-motion:reduce)");
    const tint = rgb(color);
    const palette = Array.from({ length: LEVELS }, (_, i) => {
      const k = (i + 1) / LEVELS;
      const mix = (c: number) => Math.round(c * (0.35 + 0.65 * Math.min(1, k * 1.4)) + (255 - c) * Math.max(0, k - 0.75) * 2.2);
      return `rgb(${Math.min(255, mix(tint[0]))},${Math.min(255, mix(tint[1]))},${Math.min(255, mix(tint[2]))})`;
    });
    const sample = document.createElement("canvas");
    const sctx = sample.getContext("2d", { willReadFrequently: true })!;
    const fontSize = 9;
    let frame = 0,
      visible = false,
      last = performance.now(),
      t = 0,
      width = 0,
      height = 0,
      cellW = 5.4,
      cols = 0,
      rows = 0,
      coverage = new Float32Array(0),
      // Pointer spotlight in 0..1 page-relative coordinates; strength eases in and out.
      px = 0.5,
      py = 0.5,
      tx = 0.5,
      ty = 0.5,
      hover = 0,
      hovering = false;
    // Rasterize the text once per size, then read how much of each cell it covers.
    const rasterize = () => {
      cols = Math.max(1, Math.floor(width / cellW));
      rows = Math.max(1, Math.floor(height / fontSize));
      sample.width = cols;
      sample.height = rows;
      sctx.clearRect(0, 0, cols, rows);
      sctx.font = font;
      const m = sctx.measureText(text);
      const textH = (m.actualBoundingBoxAscent || 72) + (m.actualBoundingBoxDescent || 0);
      // Cells are taller than wide, so squash horizontally to keep letter proportions.
      // Each sample pixel paints as one cell, which is taller than wide, so squash the
      // text vertically by the cell aspect to keep letters in proportion on screen.
      const aspect = cellW / fontSize;
      const scale = Math.min((cols * 0.94) / m.width, (rows * 0.86) / (textH * aspect));
      sctx.save();
      sctx.translate(cols / 2, rows / 2);
      sctx.scale(scale, scale * aspect);
      sctx.textAlign = "center";
      sctx.textBaseline = "middle";
      sctx.fillStyle = "#fff";
      sctx.fillText(text, 0, 0);
      sctx.restore();
      const data = sctx.getImageData(0, 0, cols, rows).data;
      coverage = new Float32Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) coverage[i] = data[i * 4 + 3] / 255;
    };
    const paint = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!media.matches) t += dt * Math.max(0, Math.min(speed, 3));
      context.clearRect(0, 0, width, height);
      const sweep = ((t * 0.18) % 1.6) - 0.3;
      const ease = 1 - Math.exp(-dt * 10);
      px += (tx - px) * ease;
      py += (ty - py) * ease;
      hover += ((hovering ? 1 : 0) - hover) * ease;
      const ratio = height / Math.max(width, 1);
      const lines: string[][] = Array.from({ length: LEVELS }, () => []);
      for (let r = 0; r < rows; r++) {
        const parts: string[][] = Array.from({ length: LEVELS }, () => []);
        for (let c = 0; c < cols; c++) {
          const cov = coverage[r * cols + c];
          let k = 0;
          if (cov > 0.02) {
            const x = c / cols + (r / rows) * 0.25;
            const sweepLight = media.matches ? 0 : Math.exp(-Math.pow((x - sweep) / 0.07, 2)) * (1 - hover);
            const dx = c / cols - px,
              dy = (r / rows - py) * ratio;
            const spot = hover * Math.exp(-(dx * dx + dy * dy) / 0.012);
            const light = Math.max(sweepLight, spot);
            const grain = 0.88 + 0.12 * Math.sin(c * 12.9898 + r * 78.233 + Math.floor(t * 6));
            k = Math.min(1, cov * (0.55 + 0.45 * light) * grain + light * 0.35 * cov);
          }
          const level = Math.min(LEVELS - 1, Math.floor(k * LEVELS));
          const ch = k < 0.04 ? " " : ramp[Math.min(ramp.length - 1, 1 + Math.floor(k * (ramp.length - 1)))];
          for (let l = 0; l < LEVELS; l++) parts[l].push(l === level ? ch : " ");
        }
        for (let l = 0; l < LEVELS; l++) lines[l].push(parts[l].join(""));
      }
      for (let l = 0; l < LEVELS; l++) {
        context.fillStyle = palette[l];
        for (let r = 0; r < rows; r++) if (lines[l][r].trim()) context.fillText(lines[l][r], 0, r * fontSize);
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
      context.font = `600 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      context.textBaseline = "top";
      cellW = context.measureText("M").width;
      rasterize();
      start();
    });
    resize.observe(node);
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = node.getBoundingClientRect();
      tx = (e.clientX - rect.left) / rect.width;
      ty = (e.clientY - rect.top) / rect.height;
      if (!hovering) {
        px = tx;
        py = ty;
      }
      hovering = true;
    };
    const leave = () => (hovering = false);
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", leave);
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
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", start);
      media.removeEventListener("change", start);
    };
  }, [text, color, font, speed]);
  return createElement(
    as,
    { className: `forme-ascii-banner ${className}` },
    <span className="forme-ascii-banner-text">{text}</span>,
    <canvas ref={canvas} aria-hidden="true" />,
  );
}
