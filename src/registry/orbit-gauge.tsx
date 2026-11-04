"use client";
import { useEffect, useId, useRef, useState } from "react";
import "./orbit-gauge.css";

export interface OrbitMetric {
  label: string;
  /** 0 to 1 */
  value: number;
  color: string;
}
const SWEEP = 270;
const arc = (radius: number) => {
  const length = (2 * Math.PI * radius * SWEEP) / 360;
  return { length, circumference: 2 * Math.PI * radius };
};
/** Concentric precision arcs that ease to new values, with a rolling center readout. */
export function OrbitGauge({
  metrics,
  title = "Capacity",
}: {
  metrics: OrbitMetric[];
  title?: string;
}) {
  const id = useId().replace(/:/g, "");
  const primary = Math.round((metrics[0]?.value ?? 0) * 100);
  const [shown, setShown] = useState(primary);
  const frame = useRef(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return setShown(primary);
    const from = shown,
      start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 1100);
      const eased = 1 - Math.pow(1 - k, 4);
      setShown(Math.round(from + (primary - from) * eased));
      if (k < 1) frame.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primary]);
  return (
    <figure className="forme-orbit" aria-label={`${title}: ${metrics.map((m) => `${m.label} ${Math.round(m.value * 100)}%`).join(", ")}`}>
      <svg viewBox="0 0 240 240" aria-hidden="true">
        <defs>
          {metrics.map((m, i) => (
            <linearGradient key={i} id={`${id}-${i}`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor={m.color} stopOpacity="0.55" />
              <stop offset="100%" stopColor={m.color} />
            </linearGradient>
          ))}
        </defs>
        <g transform="rotate(135 120 120)">
          {Array.from({ length: 55 }, (_, i) => {
            const a = ((i / 54) * SWEEP * Math.PI) / 180;
            const long = i % 9 === 0;
            return (
              <line
                key={i}
                x1={120 + Math.cos(a) * 112}
                y1={120 + Math.sin(a) * 112}
                x2={120 + Math.cos(a) * (long ? 104 : 108)}
                y2={120 + Math.sin(a) * (long ? 104 : 108)}
                className={long ? "forme-orbit-tick is-long" : "forme-orbit-tick"}
              />
            );
          })}
          {metrics.slice(0, 3).map((m, i) => {
            const radius = 92 - i * 16;
            const { length, circumference } = arc(radius);
            const value = Math.max(0, Math.min(1, m.value));
            return (
              <g key={i}>
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  className="forme-orbit-track"
                  strokeDasharray={`${length} ${circumference}`}
                />
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  className="forme-orbit-value"
                  stroke={`url(#${id}-${i})`}
                  style={{ color: m.color }}
                  strokeDasharray={`${length * value} ${circumference}`}
                />
              </g>
            );
          })}
        </g>
      </svg>
      <figcaption className="forme-orbit-center" aria-hidden="true">
        <strong>
          {shown}
          <span>%</span>
        </strong>
        <span>{title}</span>
      </figcaption>
      <ul className="forme-orbit-legend" aria-hidden="true">
        {metrics.slice(0, 3).map((m) => (
          <li key={m.label}>
            <i style={{ background: m.color }} />
            {m.label}
            <b>{Math.round(m.value * 100)}%</b>
          </li>
        ))}
      </ul>
    </figure>
  );
}
