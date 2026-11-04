"use client";
import type { ReactNode } from "react";
import { HorizonShader } from "./horizon-shader";
import "./eclipse-hero.css";

/** A full-bleed hero: a planet's dawn below, your headline resolving out of blur above. */
export function EclipseHero({
  title,
  subtitle,
  actions,
  color = "#6f8bff",
  speed = 0.7,
  className = "",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  color?: string;
  speed?: number;
  className?: string;
}) {
  return (
    <section className={`forme-eclipse ${className}`}>
      <div className="forme-eclipse-sky" aria-hidden="true">
        <HorizonShader color={color} speed={speed} />
      </div>
      <div className="forme-eclipse-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {actions && <div className="forme-eclipse-actions">{actions}</div>}
      </div>
    </section>
  );
}
