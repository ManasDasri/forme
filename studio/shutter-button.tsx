"use client";
import type { ButtonHTMLAttributes } from "react";
import "./shutter-button.css";
export function ShutterButton({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} type={type} className={`forme-shutter ${className}`}>
      <span className="forme-shutter-panels" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <i key={i} style={{ transitionDelay: `${i * 25}ms` }} />
        ))}
      </span>
      <span className="forme-shutter-label">{children}</span>
      <span className="forme-shutter-symbol" aria-hidden="true">
        ↗
      </span>
    </button>
  );
}
