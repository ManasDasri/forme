'use client'

import { useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import './fullscreen-menu.css'

export interface FullscreenMenuProps {
  links: { label: string; href: string }[]
  brand?: string
}

/** Native dialog supplies focus trapping, Escape, and focus restoration. */
export function FullscreenMenu({ links, brand = 'Studio' }: FullscreenMenuProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const reduce = useReducedMotion()
  return (
    <div className="forme-menu-demo">
      <span className="forme-menu-brand">{brand}<span>Independent by design.</span></span>
      <button className="forme-menu-trigger" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">Open menu<span aria-hidden="true">☰</span></button>
      <span className="forme-menu-note">An entrance worth making.</span>
      <dialog ref={dialog} className="forme-menu-dialog" aria-label={`${brand} navigation`}>
        <div className="forme-menu-top"><span>{brand}</span><button onClick={() => dialog.current?.close()} autoFocus>Close <span aria-hidden="true">×</span></button></div>
        <nav aria-label={`${brand} pages`}>
          {links.map((link, i) => <motion.a key={link.href} href={link.href} onClick={() => dialog.current?.close()} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: reduce ? 0 : i * 0.08 }}><span>{link.label}</span><span aria-hidden="true">↗</span></motion.a>)}
        </nav>
        <p>Built with intention. Made to move.</p>
      </dialog>
    </div>
  )
}
