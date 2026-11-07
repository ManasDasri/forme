"use client";
import { createElement } from "react";
import "./gradient-text.css";

/** Text filled with a slowly moving gradient. Still real, selectable text. */
export function GradientText({
  text,
  as = "span",
  colors = ["#7c9cff", "#e879f9", "#fb923c", "#7c9cff"],
  duration = 8,
  className = "",
}: {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  colors?: string[];
  duration?: number;
  className?: string;
}) {
  return createElement(
    as,
    {
      className: `forme-gradient-text ${className}`,
      style: {
        ["--forme-gradient" as string]: `linear-gradient(90deg, ${colors.join(", ")})`,
        ["--forme-gradient-duration" as string]: `${duration}s`,
      },
    },
    text,
  );
}
