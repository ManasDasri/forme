"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "./project-reel.css";

export interface ReelFrame {
  src: string;
  alt: string;
  title: string;
  caption?: string;
}
export function ProjectReel({ frames }: { frames: ReelFrame[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const index = Math.min(active, Math.max(0, frames.length - 1));
  const frame = frames[index];
  if (!frame) return null;
  return (
    <div className="forme-reel">
      <div className="forme-reel-image">
        <AnimatePresence initial={false}>
          <motion.img
            key={frame.src}
            src={frame.src}
            alt={frame.alt}
            loading="lazy"
            initial={{ opacity: 0, scale: reduce ? 1 : 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.45 }}
          />
        </AnimatePresence>
        <span>{frame.title}</span>
      </div>
      <div className="forme-reel-footer">
        <div>
          <p aria-live="polite">{frame.caption || frame.title}</p>
          <span>
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(frames.length).padStart(2, "0")}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={frames.length - 1}
          step="1"
          value={index}
          onChange={(e) => setActive(Number(e.target.value))}
          aria-label="Project reel frame"
          aria-valuetext={`${index + 1} of ${frames.length}: ${frame.title}`}
        />
        <div className="forme-reel-navigation">
          <button
            aria-label="Previous frame"
            disabled={index === 0}
            onClick={() => setActive(index - 1)}
          >
            ←
          </button>
          <span>Scrub to explore</span>
          <button
            aria-label="Next frame"
            disabled={index === frames.length - 1}
            onClick={() => setActive(index + 1)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
