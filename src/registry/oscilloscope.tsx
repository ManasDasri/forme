"use client";
import { useEffect, useRef, useState } from "react";
import "./oscilloscope.css";

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
/** A phosphor waveform you can tune: pointer or arrow keys set frequency and amplitude. */
export function Oscilloscope({
  color = "#ffd23f",
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
      if (!paused && !media.matches) t += ((now - last) / 1000) * 2.2 * clamp(speed, 0, 3);
      last = now;
      const { freq, amp } = tune.current;
      context.fillStyle = "#0a0904";
      context.fillRect(0, 0, width, height);
      context.strokeStyle = "#ffffff12";
      context.lineWidth = 1;
      for (let i = 1; i < 10; i++) {
        context.beginPath();
        context.moveTo((width * i) / 10, 0);
        context.lineTo((width * i) / 10, height);
        context.stroke();
      }
      for (let i = 1; i < 8; i++) {
        context.beginPath();
        context.moveTo(0, (height * i) / 8);
        context.lineTo(width, (height * i) / 8);
        context.stroke();
      }
      const mid = height / 2;
      context.beginPath();
      for (let x = 0; x <= width; x += 2) {
        const u = (x / width) * Math.PI * 2;
        const y =
          Math.sin(u * freq + t) * 0.72 +
          Math.sin(u * freq * 2.7 - t * 1.3) * 0.2 +
          Math.sin(u * 31 + t * 7) * 0.04;
        context.lineTo(x, mid - y * amp * height * 0.4);
      }
      context.strokeStyle = color;
      context.shadowColor = color;
      context.shadowBlur = 14;
      context.lineWidth = 2;
      context.stroke();
      context.shadowBlur = 0;
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
        <span>
          Freq {readout.freq.toFixed(1)} · Amp {readout.amp.toFixed(2)}
        </span>
        <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}
