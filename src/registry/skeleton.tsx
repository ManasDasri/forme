"use client";
import type { CSSProperties, ReactNode } from "react";
import "./skeleton.css";

/** A placeholder block with a soft sheen. Compose several to sketch the content that is loading. */
export function Skeleton({
  width = "100%",
  height = 14,
  radius = 8,
  className = "",
  style,
}: {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: CSSProperties;
}) {
  return <span aria-hidden="true" className={`forme-skeleton ${className}`} style={{ width, height, borderRadius: radius, ...style }} />;
}
/** Wrap skeletons in this so assistive technology hears one loading message instead of nothing. */
export function SkeletonGroup({ label = "Loading", children }: { label?: string; children: ReactNode }) {
  return (
    <div role="status" aria-label={label} aria-busy="true" className="forme-skeleton-group">
      {children}
    </div>
  );
}
