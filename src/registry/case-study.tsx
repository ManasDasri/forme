"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import "./case-study.css";

export interface CaseStudyItem {
  title: string;
  category: string;
  image: string;
  alt: string;
  description: string;
  year?: string;
  credits?: string;
}

export function CaseStudy({ project }: { project: CaseStudyItem }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  return (
    <div className="forme-case">
      <button
        className="forme-case-trigger"
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
      >
        <img src={project.image} alt={project.alt} loading="lazy" />
        <span className="forme-case-eyebrow">
          Selected project / {project.category}
        </span>
        <span className="forme-case-title">{project.title}</span>
        <span className="forme-case-open">
          Explore the case study <span aria-hidden="true">↗</span>
        </span>
      </button>
      <dialog
        ref={dialog}
        className="forme-case-dialog"
        aria-label={`${project.title} case study`}
      >
        <div className="forme-case-top">
          <span>Selected work / {project.title}</span>
          <button onClick={() => dialog.current?.close()} autoFocus>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <motion.div
          className="forme-case-detail"
          initial={false}
          whileInView={{ opacity: 1 }}
        >
          <motion.img
            src={project.image}
            alt={project.alt}
            initial={reduce ? false : { clipPath: "inset(8% 8% 8% 8%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{
              duration: reduce ? 0 : 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          <div>
            <span>
              {project.category}
              {project.year ? ` / ${project.year}` : ""}
            </span>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            {project.credits && (
              <p className="forme-case-credit">{project.credits}</p>
            )}
            <button
              className="forme-case-return"
              onClick={() => dialog.current?.close()}
            >
              Return to selected work <span aria-hidden="true">↗</span>
            </button>
          </div>
        </motion.div>
      </dialog>
    </div>
  );
}
