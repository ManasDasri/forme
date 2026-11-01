"use client";
import { useEffect, useRef, useState } from "react";
import "./radar-sweep.css";

type Contact = { a: number; r: number; lit: number };
const rgba = (hex: string, alpha: number) => {
  const h = /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#4dffa6";
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${alpha})`;
};
export function RadarSweep({
  color = "#4dffa6",
  speed = 1,
  label = "Radar sweep",
}: {
  color?: string;
  speed?: number;
  label?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const contacts = useRef<Contact[]>(
    Array.from({ length: 5 }, (_, i) => ({ a: i * 1.3 + 0.4, r: 0.25 + ((i * 0.37) % 0.65), lit: -1e9 })),
  );
  const [count, setCount] = useState(contacts.current.length);
  const [paused, setPaused] = useState(false);
  const add = (a: number, r: number) => {
    contacts.current = [...contacts.current, { a, r, lit: -1e9 }].slice(-12);
    setCount(contacts.current.length);
  };
  useEffect(() => {
    const node = canvas.current!,
      context = node.getContext("2d");
    if (!context) return;
    const media = matchMedia("(prefers-reduced-motion:reduce)");
    let frame = 0,
      visible = false,
      last = performance.now(),
      sweep = 0,
      width = 0,
      height = 0;
    const paint = (now: number) => {
      const moving = !paused && !media.matches;
      if (moving) sweep = (sweep + ((now - last) / 1000) * 1.3 * Math.max(0, Math.min(speed, 3))) % (Math.PI * 2);
      last = now;
      const cx = width / 2, cy = height / 2, R = Math.min(width, height) * 0.42;
      context.clearRect(0, 0, width, height);
      context.strokeStyle = rgba(color, 0.22);
      context.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        context.beginPath();
        context.arc(cx, cy, (R * i) / 4, 0, Math.PI * 2);
        context.stroke();
      }
      context.beginPath();
      context.moveTo(cx - R, cy);
      context.lineTo(cx + R, cy);
      context.moveTo(cx, cy - R);
      context.lineTo(cx, cy + R);
      context.stroke();
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2, inner = R * (i % 6 ? 1.02 : 0.98);
        context.beginPath();
        context.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
        context.lineTo(cx + Math.cos(a) * R * 1.05, cy + Math.sin(a) * R * 1.05);
        context.stroke();
      }
      if (moving) {
        const trail = 1.1;
        const gradient = context.createConicGradient(sweep - trail, cx, cy);
        gradient.addColorStop(0, rgba(color, 0));
        gradient.addColorStop(trail / (Math.PI * 2), rgba(color, 0.42));
        gradient.addColorStop(trail / (Math.PI * 2) + 0.001, rgba(color, 0));
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(cx, cy, R, 0, Math.PI * 2);
        context.fill();
      }
      context.strokeStyle = color;
      context.lineWidth = 1.5;
      context.beginPath();
      context.moveTo(cx, cy);
      context.lineTo(cx + Math.cos(sweep) * R, cy + Math.sin(sweep) * R);
      context.stroke();
      for (const c of contacts.current) {
        const behind = (sweep - c.a + Math.PI * 4) % (Math.PI * 2);
        if (moving && behind < 0.08) c.lit = now;
        const glow = moving ? Math.exp(-(now - c.lit) / 1800) : 0.8;
        const x = cx + Math.cos(c.a) * c.r * R, y = cy + Math.sin(c.a) * c.r * R;
        context.fillStyle = rgba(color, 0.15 + glow * 0.85);
        context.beginPath();
        context.arc(x, y, 3.2, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = rgba(color, glow * 0.6);
        context.beginPath();
        context.arc(x, y, 6 + (1 - glow) * 10, 0, Math.PI * 2);
        context.stroke();
      }
    };
    const tick = (now: number) => {
      paint(now);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      paint(last);
      if (visible && !document.hidden && !paused && !media.matches)
        frame = requestAnimationFrame(tick);
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
  }, [color, speed, paused, count]);
  return (
    <div className="forme-radar" style={{ color }}>
      <button
        className="forme-radar-scope"
        aria-label={`${label}. Activate to place a contact.`}
        onClick={(e) => {
          if (e.detail === 0) return add(Math.random() * Math.PI * 2, 0.2 + Math.random() * 0.7);
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2,
            y = e.clientY - rect.top - rect.height / 2;
          const r = Math.hypot(x, y) / (Math.min(rect.width, rect.height) * 0.42);
          if (r <= 1) add(Math.atan2(y, x), r);
        }}
      >
        <canvas ref={canvas} aria-hidden="true" />
      </button>
      <div className="forme-radar-footer">
        <span>Contacts {String(count).padStart(2, "0")}</span>
        <span>Click to mark</span>
        <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
