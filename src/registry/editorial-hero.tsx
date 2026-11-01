'use client'

import { motion, useReducedMotion } from 'motion/react'
import './editorial-hero.css'

export interface EditorialHeroProps {
  title: string
  subtitle: string
  image: string
  alt: string
  brand?: string
}

export function EditorialHero({ title, subtitle, image, alt, brand = 'Independent studio' }: EditorialHeroProps) {
  const reduce = useReducedMotion()
  return (
    <section className={`forme-editorial${title.length > 24 ? ' forme-editorial-long' : ''}`} aria-label={brand}>
      <span className="forme-editorial-brand">{brand}<span aria-hidden="true">✳</span></span>
      <motion.img src={image} alt={alt} loading="lazy" initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }} whileInView={{ clipPath: 'inset(0 0 0% 0)' }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : 1, ease: [0.22, 1, 0.36, 1] }} />
      <motion.h3 style={title.length > 24 ? { fontSize: 'clamp(23px, 8cqi, 48px)', maxWidth: '18ch', overflowWrap: 'anywhere' } : undefined} initial={reduce ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.15 }}>{title}</motion.h3>
      <p>{subtitle}</p>
    </section>
  )
}
