"use client";
import "./orbit-loader.css";

/** Three fine arcs turning at different speeds, for waits of unknown length. */
export function OrbitLoader({
  size = 56,
  color = "#8ab4ff",
  label = "Loading",
  className = "",
}: {
  size?: number;
  color?: string;
  label?: string;
  className?: string;
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`forme-orbit-loader ${className}`}
      style={{ width: size, height: size, color }}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="21" pathLength="100" strokeDasharray="28 72" />
        <circle cx="24" cy="24" r="15" pathLength="100" strokeDasharray="20 80" />
        <circle cx="24" cy="24" r="9" pathLength="100" strokeDasharray="34 66" />
      </svg>
    </span>
  );
}
