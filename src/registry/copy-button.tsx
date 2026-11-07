"use client";
import { useEffect, useRef, useState } from "react";
import "./copy-button.css";

/** Copies text with one click; the icon morphs to a check and the result is announced. */
export function CopyButton({
  value,
  label = "Copy",
  className = "",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <button
      type="button"
      className={`forme-copy ${className}`}
      data-state={state}
      aria-label={state === "copied" ? "Copied" : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setState("copied");
        } catch {
          setState("failed");
        }
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setState("idle"), 1600);
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="forme-copy-icon is-copy">
        <rect x="8" y="8" width="12" height="12" rx="2.5" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </svg>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="forme-copy-icon is-check">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
      <span className="forme-copy-status" role="status">
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : ""}
      </span>
    </button>
  );
}
