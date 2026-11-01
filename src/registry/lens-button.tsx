"use client";
import type { ButtonHTMLAttributes } from "react";
import "./lens-button.css";

/** Dark glass with a spotlight edge and a soft refraction that follow the pointer. */
export function LensButton({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type={type}
      className={`forme-lens ${className}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--forme-lens-x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--forme-lens-y", `${e.clientY - r.top}px`);
        props.onPointerMove?.(e);
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.removeProperty("--forme-lens-x");
        e.currentTarget.style.removeProperty("--forme-lens-y");
        props.onPointerLeave?.(e);
      }}
    >
      <span className="forme-lens-label">{children}</span>
    </button>
  );
}
