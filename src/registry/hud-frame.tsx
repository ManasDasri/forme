"use client";
import type { ReactNode } from "react";
import "./hud-frame.css";

/** A targeting frame for any content: corner brackets, scan line, and readouts. */
export function HudFrame({
  children,
  label = "Target",
  status = "Live",
  code = "SIG-01",
  className = "",
}: {
  children?: ReactNode;
  label?: string;
  status?: string;
  code?: string;
  className?: string;
}) {
  return (
    <div className={`forme-hud ${className}`}>
      <span className="forme-hud-corner" data-corner="tl" aria-hidden="true" />
      <span className="forme-hud-corner" data-corner="tr" aria-hidden="true" />
      <span className="forme-hud-corner" data-corner="bl" aria-hidden="true" />
      <span className="forme-hud-corner" data-corner="br" aria-hidden="true" />
      <span className="forme-hud-scan" aria-hidden="true" />
      <div className="forme-hud-bar">
        <span>{label}</span>
        <span className="forme-hud-status">
          <i aria-hidden="true" />
          {status}
        </span>
      </div>
      <div className="forme-hud-body">{children}</div>
      <div className="forme-hud-bar" aria-hidden="true">
        <span>{code}</span>
        <span className="forme-hud-ticks" />
      </div>
    </div>
  );
}
