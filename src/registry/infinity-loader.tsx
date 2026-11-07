"use client";
import "./infinity-loader.css";

/** A comet of light tracing a figure eight over a faint track. */
export function InfinityLoader({
  size = 72,
  color = "#8ab4ff",
  label = "Loading",
  className = "",
}: {
  size?: number;
  color?: string;
  label?: string;
  className?: string;
}) {
  const path = "M12 12c-3-4.5-9-4.5-9 0s6 4.5 9 0 9-4.5 9 0-6 4.5-9 0Z";
  return (
    <span role="status" aria-label={label} className={`forme-infinity ${className}`} style={{ width: size, color }}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={path} pathLength="100" className="forme-infinity-track" />
        <path d={path} pathLength="100" className="forme-infinity-comet" />
      </svg>
    </span>
  );
}
