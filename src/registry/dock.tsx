"use client";
import type { ReactNode } from "react";
import { useRef } from "react";
import "./dock.css";

// Keep in step with dock.css: icon size, gap, bar padding, and the largest swell.
const SIZE = 44,
  GAP = 8,
  PAD = 10,
  MAX_BOOST = 0.62;

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
  // Width available to the dock, measured at rest when the pointer arrives. Measuring on
  // every move would feed back: a wrapper that grows with the dock would keep making room.
  const space = useRef(Infinity);
  const magnify = (x: number | null) => {
    const ul = list.current;
    if (!ul) return;
    const items = [...ul.children] as HTMLElement[];
    if (x === null || matchMedia("(prefers-reduced-motion:reduce)").matches) {
      for (const el of items) el.style.setProperty("--forme-dock-scale", "1");
      return;
    }
    const boosts = items.map((el) => {
      const r = el.getBoundingClientRect();
      const d = (x - (r.left + r.width / 2)) / 90;
      return MAX_BOOST * Math.exp(-d * d);
    });
    // Never grow wider than the container: shrink the swell to the room that's left.
    const rest = items.length * SIZE + (items.length - 1) * GAP + PAD * 2;
    const room = Math.max(0, space.current - rest);
    const growth = SIZE * boosts.reduce((a, b) => a + b, 0);
    const k = growth > room ? room / growth : 1;
    items.forEach((el, i) => el.style.setProperty("--forme-dock-scale", String(1 + boosts[i] * k)));
  };
  return (
    <nav aria-label={label} className={`forme-dock ${className}`}>
      <ul
        ref={list}
        onPointerEnter={(e) => {
          // The nav may shrink to fit the bar, so measure the element it sits in.
          const box = e.currentTarget.parentElement?.parentElement;
          if (!box) return;
          const cs = getComputedStyle(box);
          space.current = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        }}
        onPointerMove={(e) => e.pointerType === "mouse" && magnify(e.clientX)}
        onPointerLeave={() => magnify(null)}
      >
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
