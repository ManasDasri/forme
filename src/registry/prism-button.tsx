"use client";
import type { ButtonHTMLAttributes, CSSProperties } from "react";
import "./prism-button.css";
export function PrismButton({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      type={type}
      className={`forme-prism ${className}`}
      onPointerMove={(e) => {
        if (
          e.pointerType !== "mouse" ||
          matchMedia("(prefers-reduced-motion:reduce)").matches
        ) {
          props.onPointerMove?.(e);
          return;
        }
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--px", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--py", `${e.clientY - r.top}px`);
        props.onPointerMove?.(e);
      }}
      style={{ ...props.style } as CSSProperties}
    >
      <span>{children}</span>
      <span aria-hidden="true">↗</span>
    </button>
  );
}
