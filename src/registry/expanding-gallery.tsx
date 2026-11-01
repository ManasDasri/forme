'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import './expanding-gallery.css'

export interface GalleryImage { src: string; alt: string; title: string }

export function ExpandingGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  return (
    <div className="forme-gallery" aria-label="Image gallery">
      {images.map((image, i) => (
        <motion.button key={image.src} animate={{ flex: active === i ? 3.4 : 1 }} transition={{ duration: reduce ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }} onClick={() => setActive(i)} aria-pressed={active === i} aria-label={image.title}>
          <img src={image.src} alt={image.alt} loading="lazy" />
          <span>{image.title}</span>
        </motion.button>
      ))}
    </div>
  )
}
