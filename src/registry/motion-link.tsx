"use client";

import type { AnchorHTMLAttributes } from "react";
import "./motion-link.css";

export function MotionLink({
  children,
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...props} className={`forme-link ${className}`}>
      <span className="forme-link-window">
        <span className="forme-link-text">{children}</span>
        <span className="forme-link-copy" aria-hidden="true">
          {children}
        </span>
      </span>
      <span className="forme-link-arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}
