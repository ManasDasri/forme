"use client";

import type { ButtonHTMLAttributes } from "react";
import { useEffect, useState } from "react";
import { motion, useSpring } from "motion/react";
import "./magnetic-button.css";

export function MagneticButton({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const [reduce, setReduce] = useState(false);
  const x = useSpring(0, { stiffness: 260, damping: 13, mass: 0.7 });
  const y = useSpring(0, { stiffness: 260, damping: 13, mass: 0.7 });
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion:reduce)");
    const update = () => setReduce(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (reduce || props.disabled) {
      x.jump(0);
      y.jump(0);
    }
  }, [reduce, props.disabled, x, y]);
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
      onPointerCancel={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.span
        style={{ x, y }}
        whileTap={reduce || props.disabled ? undefined : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 420, damping: 14, mass: 0.55 }}
      >
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
