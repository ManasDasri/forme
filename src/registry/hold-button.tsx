"use client";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import "./hold-button.css";

/** Press and hold (pointer, Space, or Enter) to confirm a consequential action. */
export function HoldButton({
  children,
  onConfirm,
  duration = 1200,
  confirmedLabel = "Confirmed",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  onConfirm?: () => void;
  duration?: number;
  confirmedLabel?: ReactNode;
}) {
  const hint = useId();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const run = useRef({ holding: false, value: 0, last: 0, frame: 0, reset: 0 });
  const confirm = useRef(onConfirm);
  confirm.current = onConfirm;
  useEffect(() => {
    const state = run.current;
    return () => {
      cancelAnimationFrame(state.frame);
      clearTimeout(state.reset);
    };
  }, []);
  const loop = (now: number) => {
    const state = run.current;
    const elapsed = now - state.last;
    state.last = now;
    // Filling takes `duration`; releasing drains three times faster.
    state.value = Math.max(
      0,
      Math.min(1, state.value + (state.holding ? 1 : -3) * (elapsed / duration)),
    );
    setProgress(state.value);
    if (state.value >= 1) {
      state.holding = false;
      setDone(true);
      confirm.current?.();
      state.reset = window.setTimeout(() => {
        state.value = 0;
        setProgress(0);
        setDone(false);
      }, 1600);
      return;
    }
    if (state.holding || state.value > 0)
      state.frame = requestAnimationFrame(loop);
  };
  const begin = () => {
    const state = run.current;
    if (props.disabled || done || state.holding) return;
    state.holding = true;
    cancelAnimationFrame(state.frame);
    state.last = performance.now();
    state.frame = requestAnimationFrame(loop);
  };
  const end = () => {
    run.current.holding = false;
  };
  return (
    <button
      {...props}
      type={type}
      aria-describedby={hint}
      data-done={done || undefined}
      className={`forme-hold ${className}`}
      style={{ ...props.style, ["--forme-hold" as string]: progress }}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        begin();
        props.onPointerDown?.(e);
      }}
      onPointerUp={(e) => {
        end();
        props.onPointerUp?.(e);
      }}
      onPointerCancel={end}
      onLostPointerCapture={end}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          if (!e.repeat) begin();
        }
        props.onKeyDown?.(e);
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") end();
        props.onKeyUp?.(e);
      }}
      onBlur={(e) => {
        end();
        props.onBlur?.(e);
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="forme-hold-fill" aria-hidden="true" />
      <span className="forme-hold-label">{done ? confirmedLabel : children}</span>
      <span className="forme-hold-meter" aria-hidden="true">
        {String(Math.round(progress * 100)).padStart(3, "0")}%
      </span>
      <span id={hint} className="forme-hold-sr">
        Press and hold to confirm
      </span>
      <span className="forme-hold-sr" role="status">
        {done ? confirmedLabel : ""}
      </span>
    </button>
  );
}
