"use client";
import { createElement, useCallback, useEffect, useRef, useState } from "react";
import "./ascii-decode.css";

// Glyphs from the same face as the text, so the noise reads as type, not symbols.
const glyphs = "abcdeghknopqrsuvxyz0123456789";
type Cell = { ch: string; done: boolean };
const settled = (text: string): Cell[] => Array.from(text, (ch) => ({ ch, done: true }));

/** Returns the current cells and a function that decodes the text from noise.
 * Each character resolves on its own staggered schedule, roughly left to right. */
export function useDecode(text: string, duration = 900) {
  const [cells, setCells] = useState<Cell[]>(() => settled(text));
  const frame = useRef(0);
  const run = useCallback(() => {
    cancelAnimationFrame(frame.current);
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return setCells(settled(text));
    const chars = Array.from(text);
    const at = chars.map((_, i) => (i / Math.max(1, chars.length)) * 0.7 + Math.random() * 0.3);
    const start = performance.now();
    let step = -1;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // Fresh noise every 50 ms reads as decoding rather than flicker.
      if (Math.floor((now - start) / 50) !== step || progress === 1) {
        step = Math.floor((now - start) / 50);
        setCells(
          chars.map((ch, i) =>
            progress >= at[i] || ch === " "
              ? { ch, done: true }
              : { ch: glyphs[Math.floor(Math.random() * glyphs.length)], done: false },
          ),
        );
      }
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, duration]);
  useEffect(() => {
    setCells(settled(text));
    return () => cancelAnimationFrame(frame.current);
  }, [text]);
  return [cells, run] as const;
}

export function DecodeCells({ cells }: { cells: Cell[] }) {
  return (
    <span className="forme-decode-live" aria-hidden="true">
      {cells.map((cell, i) => (
        <span key={i} data-scrambling={cell.done ? undefined : ""}>
          {cell.ch}
        </span>
      ))}
    </span>
  );
}

export function AsciiDecode({
  text,
  as = "span",
  className = "",
  duration = 1100,
  replayOnHover = true,
}: {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
  duration?: number;
  replayOnHover?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [cells, run] = useDecode(text, duration);
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
    <DecodeCells cells={cells} />,
  );
}
