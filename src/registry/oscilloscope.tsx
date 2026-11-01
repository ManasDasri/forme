"use client";
import { useEffect, useRef, useState } from "react";
import "./oscilloscope.css";

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
/** A phosphor waveform you can tune: pointer or arrow keys set frequency and amplitude. */
export function Oscilloscope({
  color = "#7dd3fc",
  speed = 1,
  label = "Oscilloscope",
}: {
  color?: string;
  speed?: number;
  label?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const tune = useRef({ freq: 3, amp: 0.6 });
  const [readout, setReadout] = useState(tune.current);
  const [paused, setPaused] = useState(false);
  const set = (freq: number, amp: number) => {
    tune.current = { freq: clamp(freq, 1, 9), amp: clamp(amp, 0.1, 1) };
    setReadout(tune.current);
  };
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
      height = 0;
    const paint = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      if (!paused && !media.matches) t += dt * 2.2 * clamp(speed, 0, 3);
      last = now;
      const { freq, amp } = tune.current;
      // Phosphor persistence: fade the previous frame instead of clearing it.
      context.globalCompositeOperation = "source-over";
      context.fillStyle = paused || media.matches ? "#060709" : "rgba(6,7,9,0.32)";
      context.fillRect(0, 0, width, height);
      const pad = 18,
        w = width - pad * 2,
        h = height - pad * 2 - 26,
        mid = pad + h / 2;
      context.fillStyle = "rgba(255,255,255,0.16)";
      for (let i = 0; i <= 10; i++)
        for (let j = 0; j <= 8; j++) {
          context.beginPath();
          context.arc(pad + (w * i) / 10, pad + (h * j) / 8, 0.8, 0, Math.PI * 2);
          context.fill();
        }
      context.strokeStyle = "rgba(255,255,255,0.1)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(pad, mid);
      context.lineTo(pad + w, mid);
      context.moveTo(pad + w / 2, pad);
      context.lineTo(pad + w / 2, pad + h);
      for (let i = 0; i <= 50; i++) {
        const x = pad + (w * i) / 50, len = i % 5 ? 2.5 : 5;
        context.moveTo(x, mid - len);
        context.lineTo(x, mid + len);
      }
      for (let j = 0; j <= 40; j++) {
        const y = pad + (h * j) / 40, len = j % 5 ? 2.5 : 5;
        context.moveTo(pad + w / 2 - len, y);
        context.lineTo(pad + w / 2 + len, y);
      }
      context.stroke();
      context.beginPath();
      for (let x = 0; x <= w; x += 1.5) {
        const u = (x / w) * Math.PI * 2;
        const y =
          Math.sin(u * freq + t) * 0.78 +
          Math.sin(u * freq * 2 - t * 1.5) * 0.16 +
          Math.sin(u * freq * 3 + t * 0.7) * 0.06;
        const taper = Math.sin((x / w) * Math.PI);
        context.lineTo(pad + x, mid - y * amp * taper * h * 0.46);
      }
      context.globalCompositeOperation = "lighter";
      context.strokeStyle = color;
      context.globalAlpha = 0.18;
      context.lineWidth = 7;
      context.shadowColor = color;
      context.shadowBlur = 18;
      context.stroke();
      context.globalAlpha = 1;
      context.shadowBlur = 6;
      context.lineWidth = 1.6;
      context.strokeStyle = color;
      context.stroke();
      context.shadowBlur = 0;
      context.lineWidth = 0.6;
      context.strokeStyle = "rgba(255,255,255,0.75)";
      context.stroke();
      context.globalCompositeOperation = "source-over";
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
  }, [color, speed, paused, readout]);
  return (
    <div className="forme-scope" style={{ color }}>
      <div
        className="forme-scope-screen"
        tabIndex={0}
        role="group"
        aria-label={`${label}. Left and right arrows set frequency, up and down set amplitude.`}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" && e.buttons === 0) return;
          const r = e.currentTarget.getBoundingClientRect();
          set(1 + ((e.clientX - r.left) / r.width) * 8, 1 - (e.clientY - r.top) / r.height);
        }}
        onKeyDown={(e) => {
          const { freq, amp } = tune.current;
          const next = { ArrowLeft: [-0.5, 0], ArrowRight: [0.5, 0], ArrowUp: [0, 0.1], ArrowDown: [0, -0.1] }[e.key];
          if (!next) return;
          e.preventDefault();
          set(freq + next[0], amp + next[1]);
        }}
      >
        <canvas ref={canvas} aria-hidden="true" />
      </div>
      <div className="forme-scope-footer">
        <span className="forme-scope-readout">
          <span>Frequency</span> {readout.freq.toFixed(1)} Hz
        </span>
        <span className="forme-scope-readout">
          <span>Amplitude</span> {readout.amp.toFixed(2)}
        </span>
        <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
