"use client";
import { useEffect, useRef } from "react";
import "./ascii-text.css";
export function AsciiText({
  text = "HELLO, FUTURE.",
  duration = 0.85,
  characters = "01/<>_-=+*#",
}: {
  text?: string;
  duration?: number;
  characters?: string;
}) {
  const output = useRef<HTMLSpanElement>(null),
    frame = useRef(0);
  useEffect(() => {
    if (output.current) output.current.textContent = text;
    return () => cancelAnimationFrame(frame.current);
  }, [text]);
  function play() {
    cancelAnimationFrame(frame.current);
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) {
      output.current!.textContent = text;
      return;
    }
    const start = performance.now();
    const alphabet = characters || "01";
    const ms = Math.max(100, Math.min(duration * 1000, 3000));
    const draw = (now: number) => {
      const progress = Math.min(1, (now - start) / ms);
      output.current!.textContent = [...text]
        .map((char, i) =>
          char === " " || i < Math.floor(progress * text.length)
            ? char
            : alphabet[Math.floor(Math.random() * alphabet.length)],
        )
        .join("");
      if (progress < 1) frame.current = requestAnimationFrame(draw);
    };
    frame.current = requestAnimationFrame(draw);
  }
  return (
    <button
      className="forme-ascii-text"
      onPointerEnter={play}
      onFocus={play}
      onClick={play}
      aria-label={`Replay ASCII text: ${text}`}
    >
      <span className="forme-ascii-text-label">
        Signal decoded / ASCII typography
      </span>
      <span ref={output} className="forme-ascii-text-output" aria-hidden="true">
        {text}
      </span>
      <span className="forme-ascii-text-footer">
        Select to reassemble<span aria-hidden="true">↻</span>
      </span>
    </button>
  );
}
