'use client'

import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import './project-index.css'

export interface Project {
  title: string
  category: string
  image: string
  alt: string
  description?: string
}

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState(0)
  const reduce = useReducedMotion()
  const panelId = useId()
  const active = projects[selected] ?? projects[0]
  if (!active) return null
  return (
    <div className="forme-index">
      <div className="forme-index-list" aria-label="Select a project">
        <span className="forme-index-label">Selected work</span>
        {projects.map((project, i) => (
          <button key={project.title} onPointerEnter={event => { if (event.pointerType === 'mouse') setSelected(i) }} onFocus={() => setSelected(i)} onClick={() => setSelected(i)} aria-pressed={active === project} aria-controls={panelId}>
            <span>{project.title}<small>{project.category}</small></span><span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div id={panelId} className="forme-index-image">
        <AnimatePresence mode="wait">
          <motion.img key={active.image} src={active.image} alt={active.alt} loading="lazy" initial={{ opacity: 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.2 }} />
        </AnimatePresence>
        <p aria-live="polite">{active.description ?? active.title}</p>
      </div>
    </div>
  )
}
