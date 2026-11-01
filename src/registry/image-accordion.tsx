"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "./image-accordion.css";

export interface ImageAccordionItem {
  title: string;
  description: string;
  image: string;
  alt: string;
}

export function ImageAccordion({ items }: { items: ImageAccordionItem[] }) {
  const [active, setActive] = useState<number | null>(0);
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <div className="forme-accordion">
      {items.map((item, i) => (
        <section key={item.title}>
          <h3>
            <button
              id={`${id}-trigger-${i}`}
              aria-expanded={active === i}
              aria-controls={`${id}-panel-${i}`}
              onClick={() => setActive(active === i ? null : i)}
            >
              <span>{item.title}</span>
              <span aria-hidden="true">{active === i ? "−" : "+"}</span>
            </button>
          </h3>
          <div
            id={`${id}-panel-${i}`}
            role="region"
            aria-labelledby={`${id}-trigger-${i}`}
          >
            <AnimatePresence initial={false}>
              {active === i && (
                <motion.div
                  className="forme-accordion-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div>
                    <p>{item.description}</p>
                    <img src={item.image} alt={item.alt} loading="lazy" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      ))}
    </div>
  );
}
