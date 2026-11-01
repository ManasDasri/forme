"use client";
import { useEffect, useRef, useState } from "react";
import "./ascii-rain.css";

const glyphs = "01<>/\\|=+*#%ABCDEFXZ$&?";
const pick = () => glyphs[Math.floor(Math.random() * glyphs.length)];
export function AsciiRain({
  color = "#7dffb2",
  speed = 1,
  label = "Columns of falling characters",
}: {
  color?: string;
  speed?: number;
  label?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const surge = useRef(0);
  const pointer = useRef(-1);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = canvas.current!,
      context = node.getContext("2d");
    if (!context) return;
    const media = matchMedia("(prefers-reduced-motion:reduce)");
    const size = 14;
    let frame = 0,
      visible = false,
      last = 0,
      width = 0,
      height = 0,
      drops: number[] = [],
      rates: number[] = [],
      handled = surge.current;
    const background = () => {
      context.globalAlpha = 1;
      context.fillStyle = "#05070a";
      context.fillRect(0, 0, width, height);
    };
    const still = () => {
      // Reduced motion and pause: a calm, legible field instead of motion.
      background();
      for (let x = 0; x < drops.length; x++)
        for (let y = 0; y < height / size; y++) {
          context.globalAlpha = Math.max(0, Math.sin(x * 1.7 + y * 0.35)) * 0.55;
          context.fillStyle = color;
          context.fillText(glyphs[(x * 7 + y * 3) % glyphs.length], x * size, y * size);
        }
      context.globalAlpha = 1;
    };
    const paint = () => {
      if (surge.current !== handled) {
        handled = surge.current;
        drops = drops.map(() => Math.random() * -4);
      }
      context.globalAlpha = 0.18;
      context.fillStyle = "#05070a";
      context.fillRect(0, 0, width, height);
      context.globalAlpha = 1;
      const rows = height / size;
      for (let i = 0; i < drops.length; i++) {
        const near = pointer.current >= 0 && Math.abs(i * size - pointer.current) < 60;
        const y = drops[i] * size;
        context.fillStyle = color;
        context.fillText(pick(), i * size, y - size);
        context.fillStyle = near ? "#ffffff" : "#e8fff2";
        context.fillText(pick(), i * size, y);
        drops[i] += rates[i] * Math.max(0, Math.min(speed, 3)) * (near ? 2.4 : 1);
        if (drops[i] > rows && Math.random() > 0.97) drops[i] = Math.random() * -6;
      }
    };
    const tick = (now: number) => {
      if (now - last >= 50) {
        last = now;
        paint();
      }
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (paused || media.matches) return still();
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
      context.font = `${size}px ui-monospace,SFMono-Regular,Menlo,monospace`;
      context.textBaseline = "top";
      const cols = Math.ceil(width / size);
      drops = Array.from({ length: cols }, () => Math.random() * -(height / size));
      rates = Array.from({ length: cols }, () => 0.35 + Math.random() * 0.65);
      background();
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
      className="forme-ascii-rain"
      onPointerMove={(e) => {
        pointer.current = e.clientX - e.currentTarget.getBoundingClientRect().left;
      }}
      onPointerLeave={() => {
        pointer.current = -1;
      }}
    >
      <button
        className="forme-ascii-rain-canvas"
        aria-label={`Send a surge: ${label}`}
        disabled={paused}
        onClick={() => {
          surge.current++;
        }}
      >
        <canvas ref={canvas} aria-hidden="true" />
      </button>
      <div className="forme-ascii-rain-footer">
        <span>ASCII / Rain</span>
        <span>Click to surge</span>
        <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
