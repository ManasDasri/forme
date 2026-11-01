"use client";
import { useEffect, useRef, useState } from "react";
import "./ascii-surface.css";

export function AsciiSurface({
  color = "#a6d5df",
  speed = 1,
  label = "An undulating surface drawn from ASCII characters",
}: {
  color?: string;
  speed?: number;
  label?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0.5, y: 0.5, active: false, pulse: -10000 });
  const phase = useRef(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = canvas.current!,
      context = node.getContext("2d");
    if (!context) return;
    const media = matchMedia("(prefers-reduced-motion:reduce)");
    let frame = 0,
      visible = false,
      last = 0,
      width = 0,
      height = 0;
    const paint = (now: number) => {
      const elapsed = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!paused && !media.matches)
        phase.current += elapsed * Math.max(0, Math.min(speed, 3));
      const t = phase.current,
        unit = Math.min(width / 5.9, height / 2.6);
      const cols = Math.max(32, Math.min(100, Math.floor(width / 6.5))),
        rows = 34;
      const font = Math.max(7, Math.min(13, unit * 0.115));
      context.clearRect(0, 0, width, height);
      context.fillStyle = color;
      context.font = `${font}px ui-monospace,monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      const chars = " .:-=+*#%@",
        age = (now - pointer.current.pulse) / 1000;
      for (let row = 0; row <= rows; row++)
        for (let col = 0; col <= cols; col++) {
          const u = (col / cols - 0.5) * 5,
            v = (row / rows - 0.5) * 3.6;
          const distance = Math.hypot(
            u - (pointer.current.x - 0.5) * 5,
            v - (pointer.current.y - 0.5) * 3.6,
          );
          let z =
            0.3 * Math.sin(u * 1.7 + t) * Math.cos(v * 1.5 - t * 0.6) +
            0.12 * Math.sin(v * 3 + u - t);
          if (!media.matches && !paused) {
            if (pointer.current.active)
              z -= 0.3 * Math.exp(-distance * distance * 0.8);
            if (age >= 0 && age < 3)
              z +=
                0.4 *
                Math.sin(distance * 6 - age * 7) *
                Math.exp(-age * 1.6 - distance * 0.35);
          }
          const light =
            0.5 + 0.5 * Math.cos(u * 1.7 + t) * Math.cos(v * 1.5 - t * 0.6);
          const edge = Math.pow(
            Math.max(
              0,
              Math.sin((Math.PI * col) / cols) *
                Math.sin((Math.PI * row) / rows),
            ),
            0.35,
          );
          context.globalAlpha = (0.22 + 0.78 * light) * edge;
          context.fillText(
            chars[1 + Math.floor(light * (chars.length - 2))],
            width * 0.5 + (u + v * 0.15) * unit,
            height * 0.48 + (v * 0.43 - z * 0.7) * unit,
          );
        }
      context.globalAlpha = 1;
      if (visible && !document.hidden && !paused && !media.matches)
        frame = requestAnimationFrame(tick);
    };
    const tick = (now: number) => {
      if (now - last < 32) {
        frame = requestAnimationFrame(tick);
        return;
      }
      paint(now);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      last = performance.now() - 33;
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(() => {
      const rect = node.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      node.width = Math.round(width * ratio);
      node.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      cancelAnimationFrame(frame);
      paint(performance.now());
    });
    resize.observe(node);
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
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
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        const r = event.currentTarget.getBoundingClientRect();
        pointer.current.x = (event.clientX - r.left) / r.width;
        pointer.current.y = (event.clientY - r.top) / r.height;
        pointer.current.active = true;
      }}
      onPointerLeave={() => {
        pointer.current.active = false;
      }}
    >
      <button
        className="forme-ascii-surface-canvas"
        aria-label={`Send a ripple: ${label}`}
        disabled={paused}
        onClick={(event) => {
          if (event.detail === 0) {
            pointer.current.x = 0.5;
            pointer.current.y = 0.5;
          } else {
            const rect = event.currentTarget.getBoundingClientRect();
            pointer.current.x = (event.clientX - rect.left) / rect.width;
            pointer.current.y = (event.clientY - rect.top) / rect.height;
          }
          pointer.current.pulse = performance.now();
        }}
      >
        <canvas ref={canvas} aria-hidden="true" />
      </button>
      <div className="forme-ascii-surface-footer">
        <span>ASCII / Surface study</span>
        <span>Tap to ripple</span>
        <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
