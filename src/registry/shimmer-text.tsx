"use client";
import type { ReactNode } from "react";
import "./shimmer-text.css";

/** Status text with a slow highlight passing through it. Announced politely. */
export function ShimmerText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span role="status" className={`forme-shimmer ${className}`}>
      {children}
    </span>
  );
}
