"use client";
import type { ButtonHTMLAttributes } from "react";
import "./glitch-button.css";

export function GlitchButton({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} type={type} className={`forme-glitch ${className}`}>
      <span className="forme-glitch-text">{children}</span>
      <span className="forme-glitch-layer" aria-hidden="true">
        {children}
      </span>
      <span className="forme-glitch-layer" aria-hidden="true">
        {children}
      </span>
    </button>
  );
}
