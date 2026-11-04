"use client";
import type { HTMLAttributes } from "react";
import "./spotlight-card.css";

/** A dark surface whose edge and interior catch a soft light under the pointer. */
export function SpotlightCard({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`forme-spotlight ${className}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--forme-spot-x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--forme-spot-y", `${e.clientY - r.top}px`);
        props.onPointerMove?.(e);
      }}
    >
      {children}
    </div>
  );
}
