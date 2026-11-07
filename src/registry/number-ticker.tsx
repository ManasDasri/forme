"use client";
import { useEffect, useRef, useState } from "react";
import "./number-ticker.css";

/** Counts to its value when it scrolls into view, and eases between later values. */
export function NumberTicker({
  value,
  duration = 1600,
  locale,
  format,
  className = "",
}: {
  value: number;
  duration?: number;
  locale?: string;
  format?: Intl.NumberFormatOptions;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);
  const [display, setDisplay] = useState(0);
  const [seen, setSeen] = useState(false);
  const formatter = new Intl.NumberFormat(locale, format);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setSeen(true);
      observer.disconnect();
    });
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!seen) return;
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) {
      shown.current = value;
      return setDisplay(value);
    }
    // Round in-between values to the target's precision, so 51 never shows as 49.0009.
    const places = Math.min(20, (String(value).split(".")[1] ?? "").length);
    const from = shown.current,
      began = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - began) / duration);
      shown.current = from + (value - from) * (1 - Math.pow(1 - k, 4));
      setDisplay(k < 1 ? Number(shown.current.toFixed(places)) : value);
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, value, duration]);
  return (
    <span ref={ref} className={`forme-ticker ${className}`}>
      <span aria-hidden="true">{formatter.format(display)}</span>
      <span className="forme-ticker-sr">{formatter.format(value)}</span>
    </span>
  );
}
