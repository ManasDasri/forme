"use client";

import { useState } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
} from "motion/react";
import "./focus-cursor.css";

export interface FocusCursorProps {
  src: string;
  alt: string;
  label?: string;
}

/** A local color-reveal lens. The native cursor remains available. */
export function FocusCursor({
  src,
  alt,
  label = "A closer look",
}: FocusCursorProps) {
  const [pinned, setPinned] = useState(false);
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();
  const x = useSpring(150, { stiffness: 220, damping: 28 });
  const y = useSpring(130, { stiffness: 220, damping: 28 });
  const clipPath = useMotionTemplate`circle(80px at ${x}px ${y}px)`;
  function center(node: HTMLElement) {
    x.jump(node.clientWidth / 2);
    y.jump(node.clientHeight / 2);
  }
  return (
    <button
      className="forme-focus"
      aria-label={`${label}: ${pinned ? "unpin" : "pin"} the color lens`}
      aria-pressed={pinned}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || reduce) return;
        const box = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - box.left);
        y.set(event.clientY - box.top);
        setHover(true);
      }}
      onPointerLeave={() => setHover(false)}
      onClick={(event) => {
        center(event.currentTarget);
        setPinned(!pinned);
      }}
    >
      <img src={src} alt={alt} loading="lazy" />
      <motion.img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        style={{ clipPath, opacity: hover || pinned ? 1 : 0 }}
      />
      <span className="forme-focus-label">
        {label}
        <span aria-hidden="true">{pinned ? "−" : "+"}</span>
      </span>
      <span className="forme-focus-hint">
        {pinned
          ? "Lens pinned · select to release"
          : "Move to explore · tap to pin"}
      </span>
    </button>
  );
}
