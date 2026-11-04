"use client";
import { useState } from "react";
import "./signal-slider.css";

/** A native range input with a lit track, fine tick marks, and a live readout. */
export function SignalSlider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  format = String,
  color = "#8ab4ff",
  className = "",
}: {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  format?: (value: number) => string;
  color?: string;
  className?: string;
}) {
  const [own, setOwn] = useState(defaultValue ?? min);
  const current = value ?? own;
  const percent = max === min ? 0 : ((current - min) / (max - min)) * 100;
  return (
    <label
      className={`forme-slider ${className}`}
      style={{ ["--forme-slider-fill" as string]: `${percent}%`, ["--forme-slider-color" as string]: color }}
    >
      <span className="forme-slider-head">
        <span>{label}</span>
        <output>{format(current)}</output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        aria-valuetext={format(current)}
        onChange={(e) => {
          const next = Number(e.target.value);
          setOwn(next);
          onChange?.(next);
        }}
      />
    </label>
  );
}
