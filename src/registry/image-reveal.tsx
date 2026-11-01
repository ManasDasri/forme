"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./image-reveal.css";

export interface ImageRevealProps {
  src: string;
  alt: string;
  title: string;
  caption?: string;
}

/** Pointer, keyboard, and touch share the same reveal. */
export function ImageReveal({ src, alt, title, caption }: ImageRevealProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <button
      className="forme-reveal"
      onClick={() => setOpen(!open)}
      aria-pressed={open}
      aria-label={`${open ? "Close" : "Reveal"} ${title}`}
    >
      <span className="forme-reveal-type" aria-hidden="true">
        {title}
      </span>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        animate={{
          clipPath: open
            ? "inset(0% 0% 0% 0% round 0px)"
            : "inset(9% 17% 9% 17% round 90px)",
          scale: open ? 1.04 : 1,
        }}
        transition={{ duration: reduce ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
      />
      <span className="forme-reveal-caption">
        {caption || "A different perspective"}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </span>
    </button>
  );
}
