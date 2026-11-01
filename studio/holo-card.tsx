"use client";
import type { ReactNode } from "react";
import "./holo-card.css";

/** A tilting card with holographic foil and a glare that follows the pointer. */
export function HoloCard({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`forme-holo ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        e.currentTarget.style.setProperty("--forme-holo-x", String(x));
        e.currentTarget.style.setProperty("--forme-holo-y", String(y));
        e.currentTarget.dataset.active = "";
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--forme-holo-x", "0.5");
        e.currentTarget.style.setProperty("--forme-holo-y", "0.5");
        delete e.currentTarget.dataset.active;
      }}
    >
      <div className="forme-holo-card">
        <div className="forme-holo-content">{children}</div>
        <span className="forme-holo-foil" aria-hidden="true" />
        <span className="forme-holo-glare" aria-hidden="true" />
      </div>
    </div>
  );
}
