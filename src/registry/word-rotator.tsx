"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./word-rotator.css";

/** Cycles through words in place. The line eases to each word's width, so the sentence never jumps. */
export function WordRotator({
  words,
  interval = 2400,
  className = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const measure = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (words.length < 2 || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    let timer = 0;
    // Only cycle while on screen.
    const observer = new IntersectionObserver(([entry]) => {
      clearInterval(timer);
      if (entry.isIntersecting) timer = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    });
    observer.observe(root.current!);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [words.length, interval]);
  useLayoutEffect(() => {
    const el = measure.current?.children[index] as HTMLElement | undefined;
    if (el) setWidth(el.getBoundingClientRect().width);
  }, [index, words]);
  return (
    <span ref={root} className={`forme-rotator ${className}`}>
      <span className="forme-rotator-sr">{words.join(", ")}</span>
      <span className="forme-rotator-window" aria-hidden="true" style={{ width }}>
        <span key={index} className="forme-rotator-word">
          {words[index]}
        </span>
      </span>
      {/* Hidden copies measure each word in the surrounding font. */}
      <span ref={measure} className="forme-rotator-measure" aria-hidden="true">
        {words.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </span>
    </span>
  );
}
