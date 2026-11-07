"use client";
import type { ButtonHTMLAttributes } from "react";
import "./lens-button.css";

/** Dark glass with a spotlight edge and a soft refraction that follow the pointer.
 * On leave the light fades where it was, instead of jumping back to center. */
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
        e.currentTarget.dataset.lit = "";
        props.onPointerMove?.(e);
      }}
      onPointerLeave={(e) => {
        delete e.currentTarget.dataset.lit;
        props.onPointerLeave?.(e);
      }}
      onFocus={(e) => {
        // Keyboard focus lights the button from its center.
        if (!e.currentTarget.matches(":hover")) {
          e.currentTarget.style.setProperty("--forme-lens-x", "50%");
          e.currentTarget.style.setProperty("--forme-lens-y", "50%");
        }
        props.onFocus?.(e);
      }}
    >
      <span className="forme-lens-light" aria-hidden="true" />
      <span className="forme-lens-label">{children}</span>
    </button>
  );
}
