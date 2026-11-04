"use client";
import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import "./glow-input.css";

/** A native input with a floating label and a band of light that wakes on focus. */
export function GlowInput({
  label,
  hint,
  id,
  className = "",
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> & {
  label: string;
  hint?: ReactNode;
}) {
  const auto = useId();
  const inputId = id || auto;
  return (
    <div className={`forme-glow-field ${className}`}>
      <div className="forme-glow-box">
        <input
          {...props}
          id={inputId}
          placeholder=" "
          aria-describedby={hint ? `${inputId}-hint` : props["aria-describedby"]}
        />
        <label htmlFor={inputId}>{label}</label>
      </div>
      {hint && (
        <p id={`${inputId}-hint`} className="forme-glow-hint">
          {hint}
        </p>
      )}
    </div>
  );
}
