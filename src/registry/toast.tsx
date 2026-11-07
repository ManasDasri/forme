"use client";
import type { ReactNode } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import "./toast.css";

type Tone = "neutral" | "success" | "error";
interface ToastItem {
  id: number;
  title: ReactNode;
  description?: ReactNode;
  tone: Tone;
  action?: { label: string; onClick: () => void };
  duration: number;
}
let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
/** Show a toast from anywhere. Returns its id. Render <Toaster /> once in your app. */
export function toast(
  title: ReactNode,
  options: { description?: ReactNode; tone?: Tone; action?: ToastItem["action"]; duration?: number } = {},
) {
  const id = nextId++;
  items = [...items, { id, title, tone: "neutral" as Tone, duration: 4000, ...options }].slice(-5);
  emit();
  return id;
}
toast.dismiss = (id: number) => {
  items = items.filter((t) => t.id !== id);
  emit();
};
const subscribe = (l: () => void) => (listeners.add(l), () => listeners.delete(l));

function ToastCard({ t, index, count, expanded, paused }: { t: ToastItem; index: number; count: number; expanded: boolean; paused: boolean }) {
  const [drag, setDrag] = useState(0);
  const start = useRef<number | null>(null);
  const left = useRef(t.duration);
  useEffect(() => {
    if (paused) return;
    const began = Date.now();
    const timer = setTimeout(() => toast.dismiss(t.id), left.current);
    return () => {
      clearTimeout(timer);
      left.current -= Date.now() - began;
    };
  }, [paused, t.id]);
  const depth = count - 1 - index;
  return (
    <li
      className="forme-toast"
      data-tone={t.tone}
      style={{
        ["--forme-toast-depth" as string]: depth,
        ["--forme-toast-drag" as string]: `${drag}px`,
        zIndex: index,
      }}
      data-hidden={!expanded && depth > 2 ? "" : undefined}
      onPointerDown={(e) => {
        if ((e.target as Element).closest("button")) return;
        start.current = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => start.current !== null && setDrag(Math.max(0, e.clientX - start.current))}
      onPointerUp={() => {
        if (drag > 90) toast.dismiss(t.id);
        start.current = null;
        setDrag(0);
      }}
    >
      <span className="forme-toast-dot" aria-hidden="true" />
      <div className="forme-toast-body">
        <strong>{t.title}</strong>
        {t.description && <p>{t.description}</p>}
      </div>
      {t.action && (
        <button
          type="button"
          className="forme-toast-action"
          onClick={() => {
            t.action!.onClick();
            toast.dismiss(t.id);
          }}
        >
          {t.action.label}
        </button>
      )}
      <button type="button" className="forme-toast-close" aria-label="Dismiss notification" onClick={() => toast.dismiss(t.id)}>
        ×
      </button>
    </li>
  );
}
/** The stack. Hover or focus expands it and pauses the timers; swipe right to dismiss. */
export function Toaster({ className = "" }: { className?: string }) {
  const list = useSyncExternalStore(subscribe, () => items, () => items);
  const [expanded, setExpanded] = useState(false);
  return (
    <section aria-label="Notifications" className={`forme-toaster ${className}`}>
      <ol
        role="status"
        aria-live="polite"
        data-expanded={expanded || undefined}
        style={{ ["--forme-toast-count" as string]: list.length }}
        onPointerEnter={() => setExpanded(true)}
        onPointerLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setExpanded(false)}
      >
        {list.map((t, i) => (
          <ToastCard key={t.id} t={t} index={i} count={list.length} expanded={expanded} paused={expanded} />
        ))}
      </ol>
    </section>
  );
}
