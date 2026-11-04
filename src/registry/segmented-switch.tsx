"use client";
import { useId, useState } from "react";
import "./segmented-switch.css";

/** Native radios behind a spring-eased thumb, so arrow keys and forms just work. */
export function SegmentedSwitch({
  options,
  label,
  value,
  defaultValue,
  onChange,
  name,
  className = "",
}: {
  options: string[];
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
}) {
  const auto = useId();
  const [own, setOwn] = useState(defaultValue ?? options[0]);
  const current = value ?? own;
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`forme-segmented ${className}`}
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        ["--forme-segmented-count" as string]: options.length,
        ["--forme-segmented-index" as string]: Math.max(0, options.indexOf(current)),
      }}
    >
      <span className="forme-segmented-thumb" aria-hidden="true" />
      {options.map((option) => (
        <label key={option} data-active={option === current || undefined}>
          <input
            type="radio"
            name={name || auto}
            value={option}
            checked={option === current}
            onChange={() => {
              setOwn(option);
              onChange?.(option);
            }}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}
