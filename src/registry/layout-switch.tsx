"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./layout-switch.css";

export interface LayoutItem {
  title: string;
  category: string;
  image: string;
  alt: string;
}

export function LayoutSwitch({ items }: { items: LayoutItem[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const reduce = useReducedMotion();
  return (
    <div className="forme-layout" data-view={view}>
      <div className="forme-layout-toolbar">
        <span>Selected perspectives</span>
        <div role="group" aria-label="Project layout">
          <button
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            Grid
          </button>
          <button
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            List
          </button>
        </div>
      </div>
      <div className="forme-layout-items">
        {items.map((item) => (
          <motion.figure
            layout={!reduce}
            key={item.title}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
          >
            <motion.img
              layout={!reduce}
              src={item.image}
              alt={item.alt}
              loading="lazy"
            />
            <figcaption>
              <span>{item.title}</span>
              <small>{item.category}</small>
            </figcaption>
          </motion.figure>
        ))}
      </div>
      <span className="forme-layout-status" role="status">
        {items.length} projects · {view} view
      </span>
    </div>
  );
}
