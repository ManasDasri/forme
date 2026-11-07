"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./word-rotator.css";

const OUT_MS = 380;

/**
 * Cycles through words or phrases in place. Letters blur out, then the next phrase rises in letter by letter.
 * Phrases are ordinary text, so long ones wrap, and the box keeps the size of the longest so nothing shifts.
 */
export function WordRotator({
  words,
  interval = 2600,
  from,
  to,
  className = "",
}: {
  words: string[];
  interval?: number;
  /** Optional gradient across each phrase; defaults to the text color. */
  from?: string;
  to?: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (words.length < 2 || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    let timer = 0,
      swap = 0;
    const tick = () => {
      setLeaving(true);
      swap = window.setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setLeaving(false);
      }, OUT_MS);
    };
    // Only cycle while on screen.
    const observer = new IntersectionObserver(([entry]) => {
      clearInterval(timer);
      if (entry.isIntersecting) timer = window.setInterval(tick, interval);
    });
    observer.observe(root.current!);
    return () => {
      observer.disconnect();
      clearInterval(timer);
      clearTimeout(swap);
    };
  }, [words.length, interval]);

  const phrase = words[index] ?? "";
  const total = phrase.replace(/\s/g, "").length;
  // Long phrases stagger faster, so every phrase finishes entering in about the same time.
  const step = Math.min(32, 420 / Math.max(total, 1));
  let n = 0;
  return (
    <span ref={root} className={`forme-rotator ${leaving ? "is-leaving" : ""} ${className}`}>
      <span className="forme-rotator-sr">{words.join(", ")}</span>
      {/* Invisible copies share one grid cell, so the box always fits the longest phrase and nothing shifts. */}
      {words.map((w) => (
        <span key={`ghost-${w}`} className="forme-rotator-ghost" aria-hidden="true">
          {w}
        </span>
      ))}
      <span key={index} className="forme-rotator-phrase" aria-hidden="true">
        {phrase.split(" ").map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            <span className="forme-rotator-word">
              {[...word].map((ch, c) => {
                const i = n++;
                const style = {
                  "--d": `${i * step}ms`,
                  ...(from && to ? { color: `color-mix(in oklab, ${from}, ${to} ${total > 1 ? (i / (total - 1)) * 100 : 0}%)` } : {}),
                } as CSSProperties;
                return (
                  <span key={c} className="forme-rotator-char" style={style}>
                    {ch}
                  </span>
                );
              })}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
