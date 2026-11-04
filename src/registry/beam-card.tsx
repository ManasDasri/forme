"use client";
import type { HTMLAttributes } from "react";
import "./beam-card.css";

/** A surface with a slow comet of light travelling around its border. */
export function BeamCard({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`forme-beam ${className}`}>
      <span className="forme-beam-light" aria-hidden="true" />
      {children}
    </div>
  );
}
