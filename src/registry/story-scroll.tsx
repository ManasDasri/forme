"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "./story-scroll.css";

export interface StoryChapter {
  title: string;
  body: string;
  image: string;
  alt: string;
}

export function StoryScroll({ chapters }: { chapters: StoryChapter[] }) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const chapter = chapters[active] ?? chapters[0];
  if (!chapter) return null;
  return (
    <div className="forme-story">
      <div className="forme-story-visual">
        <AnimatePresence initial={false}>
          <motion.img
            key={chapter.image}
            src={chapter.image}
            alt={chapter.alt}
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.45 }}
          />
        </AnimatePresence>
        <span>A story in {chapters.length} chapters</span>
      </div>
      <div className="forme-story-reading">
        <div
          className="forme-story-scroller"
          ref={scroller}
          tabIndex={0}
          role="region"
          aria-label="Story chapters, scroll to read"
          onScroll={(event) => {
            const node = event.currentTarget;
            setActive(
              Math.min(
                chapters.length - 1,
                Math.round(node.scrollTop / node.clientHeight),
              ),
            );
          }}
        >
          {chapters.map((item, i) => (
            <section key={item.title}>
              <span>Chapter {i + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </section>
          ))}
        </div>
        <nav aria-label="Story chapter">
          <span>
            {active + 1} / {chapters.length}
          </span>
          {chapters.map((item, i) => (
            <button
              key={item.title}
              aria-label={`Read chapter ${i + 1}: ${item.title}`}
              aria-current={active === i ? "step" : undefined}
              onClick={() =>
                scroller.current?.scrollTo({
                  top: i * scroller.current.clientHeight,
                  behavior: reduce ? "instant" : "smooth",
                })
              }
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
