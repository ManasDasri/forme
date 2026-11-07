"use client";
import type { ReactNode } from "react";
import { useId, useState } from "react";
import "./accordion.css";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}
/** Disclosure rows that open with a smooth height change. One open at a time, or many. */
export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  className = "",
}: {
  items: AccordionItem[];
  multiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}) {
  const base = useId();
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const toggle = (id: string) =>
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : multiple ? [...o, id] : [id]));
  return (
    <div className={`forme-accordion ${className}`}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id} className="forme-accordion-item" data-open={isOpen || undefined}>
            <h3>
              <button
                type="button"
                id={`${base}-${item.id}-trigger`}
                aria-expanded={isOpen}
                aria-controls={`${base}-${item.id}-panel`}
                onClick={() => toggle(item.id)}
              >
                <span>{item.title}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </h3>
            <div
              id={`${base}-${item.id}-panel`}
              role="region"
              aria-labelledby={`${base}-${item.id}-trigger`}
              className="forme-accordion-panel"
              inert={!isOpen}
            >
              <div className="forme-accordion-inner">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
