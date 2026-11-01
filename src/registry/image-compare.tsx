"use client";

import { useId, useState } from "react";
import "./image-compare.css";

export interface ImageCompareProps {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  initial?: number;
}

/** Native range input supports pointer, touch, and keyboard without custom dragging. */
export function ImageCompare({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeLabel = "Before",
  afterLabel = "After",
  initial = 50,
}: ImageCompareProps) {
  const [position, setPosition] = useState(Math.max(0, Math.min(100, initial)));
  const id = useId();
  return (
    <div className="forme-compare">
      <img src={after} alt={afterAlt} loading="lazy" />
      <div
        className="forme-compare-before"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={before} alt={beforeAlt} loading="lazy" />
      </div>
      <span className="forme-compare-label before">{beforeLabel}</span>
      <span className="forme-compare-label after">{afterLabel}</span>
      <span
        className="forme-compare-divider"
        style={{ left: `${position}%` }}
        aria-hidden="true"
      >
        <span>↔</span>
      </span>
      <label htmlFor={id} className="forme-compare-sr">
        Comparison position
      </label>
      <input
        id={id}
        type="range"
        min="0"
        max="100"
        step="1"
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-valuetext={`${position}% ${beforeLabel}, ${100 - position}% ${afterLabel}`}
      />
    </div>
  );
}
