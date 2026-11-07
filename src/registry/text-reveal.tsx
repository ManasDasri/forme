"use client";
import { createElement, useEffect, useRef } from "react";
import "./text-reveal.css";

/** A paragraph whose words light up one by one as it scrolls through the viewport. */
export function TextReveal({
  text,
  as = "p",
  className = "",
}: {
  text: string;
  as?: "p" | "h2" | "h3" | "blockquote";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current!;
    const words = [...node.querySelectorAll<HTMLElement>(".forme-reveal-word")];
    const media = matchMedia("(prefers-reduced-motion:reduce)");
    let queued = 0;
    const update = () => {
      queued = 0;
      if (media.matches) return words.forEach((w) => w.style.setProperty("--forme-reveal", "1"));
      const r = node.getBoundingClientRect();
      // 0 when the top enters the lower fifth of the viewport, 1 when the bottom passes the middle.
      const start = innerHeight * 0.85,
        end = innerHeight * 0.45;
      const progress = Math.max(0, Math.min(1, (start - r.top) / (start - end + r.height * 0.6)));
      const lit = progress * words.length;
      words.forEach((w, i) => w.style.setProperty("--forme-reveal", String(Math.max(0, Math.min(1, lit - i)))));
    };
    const schedule = () => {
      if (!queued) queued = requestAnimationFrame(update);
    };
    update();
    // Listen only while on screen, so long pages pay nothing for it.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) addEventListener("scroll", schedule, { passive: true });
      else removeEventListener("scroll", schedule);
      schedule();
    });
    observer.observe(node);
    addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(queued);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, [text]);
  return createElement(
    as,
    { ref, className: `forme-reveal ${className}` },
    text.split(/(\s+)/).map((part, i) =>
      /\s/.test(part) ? part : (
        <span key={i} className="forme-reveal-word">
          {part}
        </span>
      ),
    ),
  );
}
