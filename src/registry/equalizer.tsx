"use client";
import "./equalizer.css";

/** Bars that rise and fall like an audio meter, for playback or processing states. */
export function Equalizer({
  bars = 5,
  height = 28,
  label = "Playing",
  className = "",
}: {
  bars?: number;
  height?: number;
  label?: string;
  className?: string;
}) {
  return (
    <span role="status" aria-label={label} className={`forme-equalizer ${className}`} style={{ height }}>
      {Array.from({ length: bars }, (_, i) => (
        <i key={i} style={{ animationDelay: `${-((i * 0.37) % 1.1)}s`, animationDuration: `${0.9 + ((i * 0.23) % 0.5)}s` }} />
      ))}
    </span>
  );
}
