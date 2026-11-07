"use client";
import type { ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";
import "./tooltip.css";

/** A small label that appears on hover or keyboard focus, wired with aria-describedby. Escape closes it. */
export function Tooltip({
  content,
  children,
  side = "top",
  delay = 250,
}: {
  content: ReactNode;
  children: ReactElement<{ "aria-describedby"?: string }>;
  side?: "top" | "bottom";
  delay?: number;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = (wait: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), wait);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };
  return (
    <span
      className="forme-tooltip"
      data-side={side}
      onPointerEnter={() => show(delay)}
      onPointerLeave={hide}
      onFocus={() => show(0)}
      onBlur={hide}
      onKeyDown={(e) => e.key === "Escape" && hide()}
    >
      {isValidElement(children) ? cloneElement(children, { "aria-describedby": id }) : children}
      <span role="tooltip" id={id} className="forme-tooltip-bubble" data-open={open || undefined}>
        {content}
      </span>
    </span>
  );
}
