"use client";

import type { ButtonHTMLAttributes } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import "./magnetic-button.css";

export function MagneticButton({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 180, damping: 16 });
  const y = useSpring(0, { stiffness: 180, damping: 16 });
  return (
    <span
      className="forme-magnet"
      onPointerMove={(event) => {
        if (reduce || props.disabled || event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - bounds.left - bounds.width / 2) * 0.22);
        y.set((event.clientY - bounds.top - bounds.height / 2) * 0.22);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.span style={{ x, y }}>
        <button
          {...props}
          type={type}
          className={`forme-magnet-button ${className}`}
        >
          <span>{children}</span>
          <span className="forme-magnet-arrow" aria-hidden="true">
            ↗
          </span>
        </button>
      </motion.span>
    </span>
  );
}
