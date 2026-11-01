"use client";
import type { ButtonHTMLAttributes } from "react";
import "./plasma-button.css";

export function PlasmaButton({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} type={type} className={`forme-plasma ${className}`}>
      <span className="forme-plasma-glow" aria-hidden="true" />
      <span className="forme-plasma-core">
        {children}
        <span className="forme-plasma-dot" aria-hidden="true" />
      </span>
    </button>
  );
}
