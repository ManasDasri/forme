"use client";
import { createElement, useCallback, useEffect, useRef, useState } from "react";
import "./ascii-decode.css";

const glyphs = "!<>-_/[]{}=+*^?#%@01ABCDEFXZ";
/** Returns the visible text and a function that decodes it from noise. */
export function useDecode(text: string, duration = 900) {
  const [shown, setShown] = useState(text);
  const frame = useRef(0);
  const run = useCallback(() => {
    cancelAnimationFrame(frame.current);
    if (matchMedia("(prefers-reduced-motion:reduce)").matches)
      return setShown(text);
    const start = performance.now();
    let step = -1;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // New noise every 45 ms reads as decoding instead of flicker.
      if (Math.floor((now - start) / 45) !== step || progress === 1) {
        step = Math.floor((now - start) / 45);
        const solved = progress * text.length;
        setShown(
          Array.from(text, (ch, i) =>
            i < solved || ch === " "
              ? ch
              : glyphs[Math.floor(Math.random() * glyphs.length)],
          ).join(""),
        );
      }
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, duration]);
  useEffect(() => {
    setShown(text);
    return () => cancelAnimationFrame(frame.current);
  }, [text]);
  return [shown, run] as const;
}

export function AsciiDecode({
  text,
  as = "span",
  className = "",
  duration = 900,
  replayOnHover = true,
}: {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
  duration?: number;
  replayOnHover?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, run] = useDecode(text, duration);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      run();
      observer.disconnect();
    });
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, [run]);
  return createElement(
    as,
    {
      ref,
      className: `forme-decode ${className}`,
      onPointerEnter: replayOnHover ? run : undefined,
    },
    <span className="forme-decode-final">{text}</span>,
    <span className="forme-decode-live" aria-hidden="true">
      {shown}
    </span>,
  );
}
