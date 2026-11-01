"use client";
import { useEffect, useRef, useState } from "react";
import "./radar-sweep.css";

type Contact = { a: number; r: number; lit: number };
const rgba = (hex: string, alpha: number) => {
  const h = /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#6ee7b7";
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${alpha})`;
};
export function RadarSweep({
  color = "#6ee7b7",
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
      if (moving) sweep = (sweep + ((now - last) / 1000) * 1.1 * Math.max(0, Math.min(speed, 3))) % (Math.PI * 2);
      last = now;
      const cx = width / 2,
        cy = height / 2,
        R = Math.min(width, height) * 0.4;
      context.clearRect(0, 0, width, height);
      // Scope glass: a faint lit disc that falls off toward the rim.
      const glass = context.createRadialGradient(cx, cy, 0, cx, cy, R);
      glass.addColorStop(0, rgba(color, 0.07));
      glass.addColorStop(1, rgba(color, 0.015));
      context.fillStyle = glass;
      context.beginPath();
      context.arc(cx, cy, R, 0, Math.PI * 2);
      context.fill();
      context.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        context.strokeStyle = rgba(color, i === 4 ? 0.32 : 0.1);
        context.beginPath();
        context.arc(cx, cy, (R * i) / 4, 0, Math.PI * 2);
        context.stroke();
      }
      context.strokeStyle = rgba(color, 0.07);
      context.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI;
        context.moveTo(cx - Math.cos(a) * R, cy - Math.sin(a) * R);
        context.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      }
      context.stroke();
      context.font = "500 9px system-ui, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      for (let deg = 0; deg < 360; deg += 5) {
        const a = (deg / 180) * Math.PI - Math.PI / 2,
          major = deg % 30 === 0;
        context.strokeStyle = rgba(color, major ? 0.45 : 0.18);
        context.beginPath();
        context.moveTo(cx + Math.cos(a) * (R + 4), cy + Math.sin(a) * (R + 4));
        context.lineTo(cx + Math.cos(a) * (R + (major ? 11 : 7)), cy + Math.sin(a) * (R + (major ? 11 : 7)));
        context.stroke();
        if (major) {
          context.fillStyle = rgba(color, 0.4);
          context.fillText(String(deg).padStart(3, "0"), cx + Math.cos(a) * (R + 22), cy + Math.sin(a) * (R + 22));
        }
      }
      context.save();
      context.beginPath();
      context.arc(cx, cy, R, 0, Math.PI * 2);
      context.clip();
      context.globalCompositeOperation = "lighter";
      const tail = 1.7;
      const gradient = context.createConicGradient(sweep - tail, cx, cy);
      gradient.addColorStop(0, rgba(color, 0));
      gradient.addColorStop((tail / (Math.PI * 2)) * 0.75, rgba(color, 0.06));
      gradient.addColorStop(tail / (Math.PI * 2), rgba(color, 0.32));
      gradient.addColorStop(tail / (Math.PI * 2) + 0.0005, rgba(color, 0));
      context.fillStyle = gradient;
      context.fillRect(cx - R, cy - R, R * 2, R * 2);
      context.shadowColor = color;
      context.shadowBlur = 12;
      context.strokeStyle = rgba(color, 0.9);
      context.lineWidth = 1.25;
      context.beginPath();
      context.moveTo(cx, cy);
      context.lineTo(cx + Math.cos(sweep) * R, cy + Math.sin(sweep) * R);
      context.stroke();
      for (const c of contacts.current) {
        const behind = (sweep - c.a + Math.PI * 4) % (Math.PI * 2);
        if (moving && behind < 0.06) c.lit = now;
        const age = (now - c.lit) / 1000;
        const glow = moving ? Math.exp(-age / 2.2) : 0.7;
        const x = cx + Math.cos(c.a) * c.r * R,
          y = cy + Math.sin(c.a) * c.r * R;
        context.shadowBlur = 10 * glow;
        context.fillStyle = rgba(color, 0.12 + glow * 0.88);
        context.beginPath();
        context.arc(x, y, 2.4, 0, Math.PI * 2);
        context.fill();
        if (moving && age < 1.4) {
          context.shadowBlur = 0;
          context.strokeStyle = rgba(color, (1 - age / 1.4) * 0.55);
          context.beginPath();
          context.arc(x, y, 3 + age * 16, 0, Math.PI * 2);
          context.stroke();
        }
      }
      context.restore();
      context.fillStyle = rgba(color, 0.9);
      context.beginPath();
      context.arc(cx, cy, 2, 0, Math.PI * 2);
      context.fill();
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
        <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
