"use client";
import "./spinner.css";

/** The classic spoke spinner, drawn in your text color at any size. */
export function Spinner({
  size = 24,
  label = "Loading",
  className = "",
}: {
  size?: number;
  label?: string;
  className?: string;
}) {
  return (
    <span role="status" aria-label={label} className={`forme-spinner ${className}`} style={{ width: size, height: size }}>
      {Array.from({ length: 8 }, (_, i) => (
        <i key={i} style={{ transform: `rotate(${i * 45}deg)`, animationDelay: `${-0.9 + i * 0.1125}s` }} />
      ))}
    </span>
  );
}
