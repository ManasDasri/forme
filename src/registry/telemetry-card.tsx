"use client";
import { useEffect, useId, useRef, useState } from "react";
import "./telemetry-card.css";

const digits = Array.from({ length: 10 }, (_, i) => i);
/** A glass readout: rolling digits, a delta, and a sparkline of recent values. */
export function TelemetryCard({
  label = "Signal",
  value,
  unit = "",
  decimals = 1,
  status = "Live",
  color = "#8ab4ff",
  history,
  className = "",
}: {
  label?: string;
  value: number;
  unit?: string;
  decimals?: number;
  status?: string;
  color?: string;
  /** Optional recent values, oldest first. Without it the card records values as they arrive. */
  history?: number[];
  className?: string;
}) {
  const gradient = `forme-telemetry-${useId().replace(/:/g, "")}`;
  const recorded = useRef<number[]>([]);
  const [own, setOwn] = useState<number[]>([]);
  useEffect(() => {
    recorded.current = [...recorded.current, value].slice(-40);
    setOwn(recorded.current);
  }, [value]);
  const series = history?.length ? history.slice(-40) : own;
  const text = value.toFixed(decimals);
  const previous = series.length > 1 ? series[series.length - 2] : value;
  const delta = previous ? ((value - previous) / Math.abs(previous)) * 100 : 0;
  const min = Math.min(...series, value),
    max = Math.max(...series, value);
  const points = series.map((v, i) => [
    series.length > 1 ? (i / (series.length - 1)) * 100 : 100,
    max === min ? 16 : 28 - ((v - min) / (max - min)) * 24,
  ]);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const last = points[points.length - 1] || [100, 16];
  return (
    <div className={`forme-telemetry ${className}`} style={{ ["--forme-telemetry-color" as string]: color }}>
      <div className="forme-telemetry-head">
        <span>{label}</span>
        <span className="forme-telemetry-status">
          <i aria-hidden="true" />
          {status}
        </span>
      </div>
      <div className="forme-telemetry-value">
        <span className="forme-telemetry-sr">
          {text} {unit}
        </span>
        <span className="forme-telemetry-number" aria-hidden="true">
          {Array.from(text).map((ch, i) =>
            /\d/.test(ch) ? (
              <span className="forme-telemetry-digit" key={`${text.length}-${i}`}>
                <span style={{ transform: `translateY(${-Number(ch) * 1.2}em)` }}>
                  {digits.map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </span>
              </span>
            ) : (
              <span key={`${text.length}-${i}`}>{ch}</span>
            ),
          )}
        </span>
        <span className="forme-telemetry-unit">{unit}</span>
        <span className="forme-telemetry-delta" data-down={delta < 0 || undefined}>
          {delta < 0 ? "↓" : "↑"} {Math.abs(delta).toFixed(1)}%
        </span>
      </div>
      <div className="forme-telemetry-chart" aria-hidden="true">
        <svg viewBox="0 0 100 32" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {points.length > 1 && (
            <>
              <path d={`${line} L100,32 L0,32 Z`} fill={`url(#${gradient})`} />
              <path d={line} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </>
          )}
        </svg>
        <span className="forme-telemetry-head-dot" style={{ left: `${last[0]}%`, top: `${(last[1] / 32) * 100}%` }} />
      </div>
    </div>
  );
}
