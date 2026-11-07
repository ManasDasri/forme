"use client";
import type { ReactNode } from "react";
import "./marquee.css";

/** An endless strip for logos or quotes. Pauses on hover; edges fade; reduced motion makes it scrollable. */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  pauseOnHover = true,
  label,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`forme-marquee ${className}`}
      role={label ? "region" : undefined}
      aria-label={label}
      data-reverse={reverse || undefined}
      data-pause={pauseOnHover || undefined}
      style={{ ["--forme-marquee-duration" as string]: `${duration}s` }}
    >
      <div className="forme-marquee-track">
        <div className="forme-marquee-group">{children}</div>
        <div className="forme-marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
