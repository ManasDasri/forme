"use client";
import type { ReactNode } from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import "./animated-tabs.css";

export interface Tab {
  id: string;
  label: string;
  content?: ReactNode;
}
/** Tabs with a pill that glides to the active tab. Full arrow, Home, and End keyboard support. */
export function AnimatedTabs({
  tabs,
  defaultId,
  onChange,
  label = "Tabs",
  className = "",
}: {
  tabs: Tab[];
  defaultId?: string;
  onChange?: (id: string) => void;
  label?: string;
  className?: string;
}) {
  const base = useId();
  const [active, setActive] = useState(defaultId ?? tabs[0]?.id);
  const list = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  const measure = () => {
    const el = list.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(active)}"]`);
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  };
  useLayoutEffect(measure, [active, tabs]);
  useEffect(() => {
    const observer = new ResizeObserver(measure);
    if (list.current) observer.observe(list.current);
    return () => observer.disconnect();
  });
  const select = (id: string, focus = false) => {
    setActive(id);
    onChange?.(id);
    if (focus) list.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)?.focus();
  };
  const current = tabs.find((t) => t.id === active);
  return (
    <div className={`forme-tabs ${className}`}>
      <div
        ref={list}
        role="tablist"
        aria-label={label}
        className="forme-tabs-list"
        onKeyDown={(e) => {
          const i = tabs.findIndex((t) => t.id === active);
          const next =
            e.key === "ArrowRight" ? (i + 1) % tabs.length
            : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length
            : e.key === "Home" ? 0
            : e.key === "End" ? tabs.length - 1
            : -1;
          if (next < 0) return;
          e.preventDefault();
          select(tabs[next].id, true);
        }}
      >
        <span
          className="forme-tabs-pill"
          aria-hidden="true"
          data-ready={pill.ready || undefined}
          style={{ transform: `translateX(${pill.left}px)`, width: pill.width }}
        />
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            data-id={t.id}
            id={`${base}-tab-${t.id}`}
            aria-selected={t.id === active}
            aria-controls={current?.content !== undefined ? `${base}-panel` : undefined}
            tabIndex={t.id === active ? 0 : -1}
            onClick={() => select(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {current?.content !== undefined && (
        <div
          key={current.id}
          id={`${base}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${current.id}`}
          tabIndex={0}
          className="forme-tabs-panel"
        >
          {current.content}
        </div>
      )}
    </div>
  );
}
