"use client";
import type { ReactNode } from "react";
import { useRef } from "react";
import "./dock.css";

export interface DockItem {
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}
/** A row of icons that swell toward the pointer, like a desktop dock. */
export function Dock({ items, label = "Dock", className = "" }: { items: DockItem[]; label?: string; className?: string }) {
  const list = useRef<HTMLUListElement>(null);
  const magnify = (x: number | null) => {
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    for (const li of list.current?.children ?? []) {
      const el = li as HTMLElement;
      if (x === null || reduce) {
        el.style.setProperty("--forme-dock-scale", "1");
        continue;
      }
      const r = el.getBoundingClientRect();
      const d = (x - (r.left + r.width / 2)) / 90;
      el.style.setProperty("--forme-dock-scale", String(1 + 0.62 * Math.exp(-d * d)));
    }
  };
  return (
    <nav aria-label={label} className={`forme-dock ${className}`}>
      <ul ref={list} onPointerMove={(e) => e.pointerType === "mouse" && magnify(e.clientX)} onPointerLeave={() => magnify(null)}>
        {items.map((item) => {
          const inner = (
            <>
              <span className="forme-dock-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="forme-dock-label">{item.label}</span>
            </>
          );
          return (
            <li key={item.label} data-active={item.active || undefined}>
              {item.href ? (
                <a href={item.href} aria-label={item.label} aria-current={item.active ? "page" : undefined}>
                  {inner}
                </a>
              ) : (
                <button type="button" aria-label={item.label} aria-pressed={item.active} onClick={item.onClick}>
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
