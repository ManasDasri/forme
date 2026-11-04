"use client";
import "./progress-beam.css";

/** A hairline progress bar with a glowing head. Omit value for unknown progress. */
export function ProgressBeam({
  value,
  label = "Progress",
  color = "#8ab4ff",
  className = "",
}: {
  /** 0 to 100. Leave undefined for an indeterminate sweep. */
  value?: number;
  label?: string;
  color?: string;
  className?: string;
}) {
  const known = typeof value === "number";
  const clamped = known ? Math.max(0, Math.min(100, value)) : undefined;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      data-indeterminate={known ? undefined : ""}
      className={`forme-progress ${className}`}
      style={{ ["--forme-progress-color" as string]: color, ["--forme-progress" as string]: `${clamped ?? 40}%` }}
    >
      <span />
    </div>
  );
}
