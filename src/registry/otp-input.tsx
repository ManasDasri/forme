"use client";
import { useId, useRef, useState } from "react";
import "./otp-input.css";

/** One real input drawn as separate cells, so paste, SMS autofill, and screen readers just work. */
export function OtpInput({
  length = 6,
  label = "Verification code",
  onComplete,
  numeric = true,
  className = "",
}: {
  length?: number;
  label?: string;
  onComplete?: (code: string) => void;
  numeric?: boolean;
  className?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [caret, setCaret] = useState(0);
  const sync = () => setCaret(Math.min(input.current?.selectionStart ?? value.length, length - 1));
  return (
    <div className={`forme-otp ${className}`} style={{ ["--forme-otp-length" as string]: length }}>
      <label htmlFor={id} className="forme-otp-label">
        {label}
      </label>
      <div className="forme-otp-cells">
        <input
          ref={input}
          id={id}
          value={value}
          inputMode={numeric ? "numeric" : "text"}
          autoComplete="one-time-code"
          pattern={numeric ? `\\d{${length}}` : undefined}
          spellCheck={false}
          onFocus={() => (setFocused(true), sync())}
          onBlur={() => setFocused(false)}
          onSelect={sync}
          onChange={(e) => {
            const next = (numeric ? e.target.value.replace(/\D/g, "") : e.target.value.replace(/\s/g, "")).slice(0, length);
            setValue(next);
            setCaret(Math.min(next.length, length - 1));
            if (next.length === length) onComplete?.(next);
          }}
        />
        {Array.from({ length }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="forme-otp-cell"
            data-filled={i < value.length || undefined}
            data-active={(focused && i === Math.min(caret, value.length)) || undefined}
          >
            {value[i] ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}
