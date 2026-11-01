"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "./type-switcher.css";

export function TypeSwitcher({
  phrases,
  caption = "A change of perspective.",
}: {
  phrases: string[];
  caption?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  if (!phrases.length) return null;
  return (
    <button
      className="forme-type-switcher"
      onClick={() => setIndex((index + 1) % phrases.length)}
      aria-label="Change the headline"
    >
      <span className="forme-type-top">
        Words with character.<span aria-hidden="true">↻</span>
      </span>
      <span className="forme-type-mask" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={index}
            initial={{ y: reduce ? 0 : "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduce ? 0 : "-110%", opacity: 0 }}
            transition={{
              duration: reduce ? 0 : 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {phrases[index]}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="forme-type-bottom">
        {caption}
        <span>
          {index + 1} / {phrases.length}
        </span>
      </span>
    </button>
  );
}
