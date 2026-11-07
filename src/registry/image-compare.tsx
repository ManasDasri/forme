"use client";
import { useState } from "react";
import "./image-compare.css";

/** Before and after, split by a handle. Drag anywhere, or use the arrow keys: it is a real range input. */
export function ImageCompare({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeLabel = "Before",
  afterLabel = "After",
  initial = 50,
  className = "",
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  initial?: number;
  className?: string;
}) {
  const [split, setSplit] = useState(initial);
  return (
    <div className={`forme-compare ${className}`} style={{ ["--forme-compare" as string]: `${split}%` }}>
      <img src={after} alt={afterAlt} draggable={false} />
      <img src={before} alt={beforeAlt} draggable={false} className="forme-compare-before" />
      <span className="forme-compare-tag" data-side="before" aria-hidden="true">
        {beforeLabel}
      </span>
      <span className="forme-compare-tag" data-side="after" aria-hidden="true">
        {afterLabel}
      </span>
      <span className="forme-compare-handle" aria-hidden="true">
        <span />
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={split}
        aria-label={`Show more of ${beforeLabel.toLowerCase()} or ${afterLabel.toLowerCase()}`}
        aria-valuetext={`${Math.round(split)}% ${beforeLabel.toLowerCase()}`}
        onChange={(e) => setSplit(Number(e.target.value))}
      />
    </div>
  );
}
