"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "./preview-navigation.css";

export interface PreviewNavLink {
  label: string;
  href: string;
  image: string;
  alt: string;
  description?: string;
}
export function PreviewNavigation({
  links,
  brand = "Independent studio",
}: {
  links: PreviewNavLink[];
  brand?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = links[active] ?? links[0];
  return (
    <div className="forme-preview-nav">
      <span>{brand}</span>
      <p>
        Every entrance
        <br />
        sets a tone.
      </p>
      <button
        className="forme-preview-nav-trigger"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        Explore the studio <span aria-hidden="true">☰</span>
      </button>
      <dialog
        ref={dialog}
        className="forme-preview-nav-dialog"
        aria-label={`${brand} navigation`}
      >
        <header>
          <span>{brand}</span>
          <button onClick={() => dialog.current?.close()} autoFocus>
            Close ×
          </button>
        </header>
        <div className="forme-preview-nav-body">
          <nav aria-label="Studio pages">
            {links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setActive(i);
                }}
                onFocus={() => setActive(i)}
                onClick={() => dialog.current?.close()}
              >
                <span>
                  {link.label}
                  <small>{link.description}</small>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
          {current && (
            <div className="forme-preview-nav-image">
              <AnimatePresence initial={false}>
                <motion.img
                  key={current.image}
                  src={current.image}
                  alt={current.alt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.35 }}
                />
              </AnimatePresence>
            </div>
          )}
        </div>
        <footer>Designed to be explored.</footer>
      </dialog>
    </div>
  );
}
