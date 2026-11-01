import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { catalog, categories, type Category } from './catalog'
import { EditorialHero } from './registry/editorial-hero'
import { ProjectIndex } from './registry/project-index'
import { ImageReveal } from './registry/image-reveal'
import { FullscreenMenu } from './registry/fullscreen-menu'
import { ExpandingGallery } from './registry/expanding-gallery'
import { MotionLink } from './registry/motion-link'

const sources = import.meta.glob('./registry/*.{tsx,css}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const repo = 'https://github.com/ManasDasri/forme'
const pictures = {
  interior: '/images/interior.jpg', architecture: '/images/architecture.jpg', landscape: '/images/landscape.jpg',
}
const galleryImages = [
  { src: pictures.architecture, alt: 'Stepped glass skyscrapers beneath a cloudy sky', title: 'Form & structure' },
  { src: pictures.interior, alt: 'A softly lit interior with warm natural materials', title: 'Room to feel' },
  { src: pictures.landscape, alt: 'A quiet lake beneath a mountain range', title: 'A slower pace' },
]

function Arrow({ diagonal = false, ...props }: React.SVGProps<SVGSVGElement> & { diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}>{diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}</svg>
}
function Mark() { return <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span> }

function Demo({ slug, title, expanded = false }: { slug: string; title?: string; expanded?: boolean }) {
  if (slug === 'editorial-hero') return <EditorialHero brand="Serein studio" title={title || 'Room to feel.'} subtitle="Spaces for a slower kind of living." image={pictures.interior} alt="A calm interior with natural materials and soft light" />
  if (slug === 'project-index') return <ProjectIndex projects={[
    { title: title || 'Serein', category: 'Architecture', image: pictures.interior, alt: 'A quiet contemporary interior', description: 'A considered place to call home.' },
    { title: 'Forma', category: 'Art direction', image: pictures.architecture, alt: 'Stepped glass skyscrapers beneath a cloudy sky', description: 'A study in light and structure.' },
    { title: 'Elsewhere', category: 'Travel & culture', image: pictures.landscape, alt: 'Mountains reflected in a lake', description: 'A little closer to the outdoors.' },
  ]} />
  if (slug === 'image-reveal') return <ImageReveal src={pictures.architecture} alt="A stepped glass skyscraper seen from below" title={title || 'Forma'} caption="Tap to change your perspective" />
  if (slug === 'fullscreen-menu') return <FullscreenMenu brand={title || 'Studio North'} links={[{ label: 'The collection', href: '#collection' }, { label: 'Our approach', href: '#approach' }, { label: 'Source on GitHub', href: repo }]} />
  if (slug === 'expanding-gallery') return <ExpandingGallery images={galleryImages.map((image, i) => i === 0 && title ? { ...image, title } : image)} />
  return <div className={`link-specimen ${expanded ? 'is-expanded' : ''}`}><span className="link-specimen-kicker">Small details. Lasting impressions.</span><MotionLink href="#collection">{title || 'Make an impression'}</MotionLink><span className="link-specimen-caption">Hover or focus to feel the difference.</span><span className="link-orbit" aria-hidden="true">✳</span></div>
}

function Docs({ slug, initialTab, close }: { slug: string; initialTab: 'preview' | 'source'; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [tab, setTab] = useState<'preview' | 'source' | 'usage'>(initialTab)
  const [title, setTitle] = useState('')
  const [replay, setReplay] = useState(0)
  const [copied, setCopied] = useState('')
  const [file, setFile] = useState<'tsx' | 'css'>('tsx')
  const component = catalog.find(c => c.slug === slug)
  const source = sources[`./registry/${slug}.${file}`] ?? ''
  const command = `npx shadcn@latest add ${window.location.origin}/r/${slug}.json`
  useEffect(() => {
    const node = dialog.current!
    node.showModal()
    return () => node.close()
  }, [])
  useEffect(() => { if (!copied) return; const timer = setTimeout(() => setCopied(''), 2200); return () => clearTimeout(timer) }, [copied])
  async function copy(value: string, name: string) {
    try { await navigator.clipboard.writeText(value); setCopied(name) } catch { setCopied('Select the code and copy manually') }
  }
  const intro = slug === 'installation'
  return <dialog ref={dialog} className="docs-dialog" aria-labelledby="docs-title" onCancel={close} onClick={event => { if (event.target === event.currentTarget) close() }}>
    <div className="docs-inner">
      <div className="docs-heading"><div><span className="collection-label">Forme / Editorial</span><h2 id="docs-title">{intro ? 'Make it your own.' : component?.name}</h2></div><button className="icon-button" onClick={close} aria-label="Close documentation">×</button></div>
      {intro ? <div className="install-guide"><p>Six considered components. Editable source. A shared point of view.</p><h3>Start locally</h3><p>Clone the private repository with your GitHub account, then start the development server.</p><Code text={`git clone ${repo}.git\ncd forme\nnpm ci\nnpm run dev`} /><h3>Add a component to your project</h3><p>With the local preview running, use the shadcn CLI in a separate React project:</p><Code text={`npx shadcn@latest add http://localhost:5173/r/editorial-hero.json`} /><p>The registry adds the component, its stylesheet, and the Motion dependency. You can also copy the TypeScript and CSS from any component’s Source tab.</p><div className="guide-note">Development preview. Hosted CLI installs require a public deployment. Commercial licensing and paid access will be added before launch.</div><h3>Built for the details</h3><p>Components support keyboard input, touch, and reduced motion. Import them into your React project and bring your own fonts, imagery, and content.</p><a className="text-link" href={repo} target="_blank" rel="noreferrer">Open the repository <Arrow diagonal /></a></div> : <>
        <p className="docs-description">{component?.description}</p>
        <div className="docs-toolbar"><div className="segmented" role="group" aria-label="Documentation view">{(['preview', 'usage', 'source'] as const).map(t => <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}</div>{tab === 'preview' && <button className="replay-button" onClick={() => setReplay(n => n + 1)}>↻ Replay</button>}</div>
        {tab === 'preview' && <><div className="docs-preview" key={replay}><Demo slug={slug} title={title} expanded /></div><label className="customize-label">Try your own words<input value={title} onChange={e => setTitle(e.target.value)} placeholder="Type a title or brand name…" maxLength={80} /></label><p className="docs-hint">Fictional brand content for demonstration. Images are included in this preview.</p></>}
        {tab === 'usage' && <div className="usage-panel"><h3>Install</h3><div className="code-toolbar"><span>Terminal</span><button onClick={() => copy(command, 'Command copied')}>Copy command</button></div><Code text={command} /><p className="docs-hint">Local installs work with the dev server running. The hosted preview is private until launch.</p><h3>Use it</h3><Code text={`import { ${slug === 'motion-link' ? 'MotionLink' : slug === 'fullscreen-menu' ? 'FullscreenMenu' : slug === 'editorial-hero' ? 'EditorialHero' : slug === 'project-index' ? 'ProjectIndex' : slug === 'image-reveal' ? 'ImageReveal' : 'ExpandingGallery'} } from "@/components/forme/${slug}"\n\n${component?.usage}`} /><h3>Props & behavior</h3><p>{component?.props}</p></div>}
        {tab === 'source' && <><div className="code-toolbar"><div className="file-tabs">{(['tsx', 'css'] as const).map(ext => <button key={ext} aria-pressed={file === ext} onClick={() => setFile(ext)}>{slug}.{ext}</button>)}</div><button onClick={() => copy(source, 'Source copied')}>Copy source</button></div><Code text={source} /></>}
        <div role="status" className="copy-status">{copied}</div>
      </>}
    </div>
  </dialog>
}

function Code({ text }: { text: string }) { return <pre className="code-block" tabIndex={0}><code>{text}</code></pre> }

export default function App() {
  const [category, setCategory] = useState<Category>('All components')
  const [query, setQuery] = useState('')
  const [docs, setDocs] = useState<string | null>(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [heroActive, setHeroActive] = useState(false)
  const reduce = useReducedMotion()
  const search = useRef<HTMLInputElement>(null)
  const visible = catalog.filter(c => (category === 'All components' || c.category === category) && `${c.name} ${c.description}`.toLowerCase().includes(query.toLowerCase()))
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && !document.querySelector('dialog[open]')) { e.preventDefault(); search.current?.focus(); search.current?.scrollIntoView({ block: 'center', behavior: reduce ? 'instant' : 'smooth' }) }
      if (e.key === 'Escape') setMobileMenu(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [reduce])
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="announcement"><span className="status-dot" />The Editorial collection is here.<a href="#collection">Meet your next project <Arrow diagonal /></a></div>
    <header className="header shell">
      <a className="wordmark" href="#" aria-label="Forme home"><Mark />forme</a>
      <nav className={mobileMenu ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation"><a href="#collection" onClick={() => setMobileMenu(false)}>Components <span className="nav-count">6</span></a><a href="#approach" onClick={() => setMobileMenu(false)}>Our approach</a><button onClick={() => { setDocs('installation'); setMobileMenu(false) }}>Documentation</button></nav>
      <div className="header-actions"><a className="github-link" href={repo} target="_blank" rel="noreferrer" aria-label="Forme on GitHub"><svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.64-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 6.8c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.79c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg></a><a className="button button-small" href="#collection">Start exploring <Arrow /></a><button className="mobile-toggle icon-button" onClick={() => setMobileMenu(!mobileMenu)} aria-expanded={mobileMenu} aria-label="Toggle navigation">{mobileMenu ? '×' : '☰'}</button></div>
    </header>
    <main id="main">
      <section className="hero shell">
        <div className="hero-copy"><div className="hero-intro"><span className="tiny-symbol" aria-hidden="true">✳</span> A little motion. A lot of character.</div><h1>Give the web<br />a little feeling.</h1><p>Thoughtfully animated React components for<br className="desktop-break" /> independent designers and ambitious studios.</p><div className="hero-buttons"><a className="button" href="#collection">Explore the collection <Arrow /></a><button className="quiet-button" onClick={() => setDocs('installation')}>How it works <span aria-hidden="true">↗</span></button></div><div className="hero-footnote"><span className="mini-stack" aria-hidden="true">〈/〉</span> React & TypeScript <span className="footnote-dot">•</span> Editable source <span className="footnote-dot">•</span> Made to be yours</div></div>
        <div className="hero-art"><span className="art-top-label"><span className="status-dot" /> A living collection</span><motion.button className="hero-specimen" aria-label="Animate the Serein editorial specimen" aria-pressed={heroActive} onClick={() => setHeroActive(!heroActive)} whileHover={reduce ? {} : { rotate: -2, y: -5 }} animate={{ rotate: heroActive ? -4 : 3 }} transition={{ type: 'spring', stiffness: 110, damping: 17 }}><span className="specimen-top">serein<span aria-hidden="true">✳</span></span><span className="specimen-image"><img src={pictures.interior} alt="Warm contemporary interior with an arched wall and natural furnishings" fetchPriority="high" /></span><span className="specimen-title">Room<br />to feel.</span><span className="specimen-bottom">Spaces for a slower<br />kind of living.<span aria-hidden="true">↗</span></span></motion.button><span className="art-caption"><span className="caption-cross" aria-hidden="true">+</span> Thoughtful by design.<br /><span>Expressive by nature.</span></span><span className="floating-tag"><span className="tag-swatch" />Editorial hero <span className="tag-divider" /> Click to interact</span><svg className="art-orbit" viewBox="0 0 130 130" fill="none" aria-hidden="true"><circle cx="65" cy="65" r="53" stroke="currentColor" strokeDasharray="2 5" /><path d="M65 35v60M35 65h60M44 44l42 42M44 86l42-42" stroke="currentColor" strokeWidth="1.2" /></svg></div>
      </section>
      <div className="manifesto-strip shell"><p>For websites that deserve<br />a second look.</p><div className="stack-item"><span className="react-symbol" aria-hidden="true">⚛</span> Built with React</div><div className="stack-item"><span className="motion-symbol" aria-hidden="true">▰▰</span> Powered by Motion</div><div className="stack-item"><span className="source-symbol" aria-hidden="true">↗</span> Shaped by you</div></div>
      <section id="collection" className="collection shell">
        <div className="section-heading"><div><span className="collection-label">The first collection</span><h2>Considered. Then animated.</h2></div><p>Expressive details, quiet confidence.<br />Meet Editorial.</p></div>
        <div className="collection-toolbar"><div className="filter-tabs" role="group" aria-label="Filter components">{categories.map(c => <button key={c} onClick={() => setCategory(c)} aria-pressed={category === c}>{c}{c === 'All components' && <span>{catalog.length}</span>}</button>)}</div><label className="search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><input ref={search} aria-label="Search components" placeholder="Find a component…" value={query} onChange={e => setQuery(e.target.value)} /><kbd>⌘ K</kbd></label></div>
        <p className="sr-only" role="status">{visible.length} components</p>
        <div className="component-grid">{visible.map(c => <article className="component-card" key={c.slug}><div className={`component-preview preview-${c.slug}`}><Demo slug={c.slug} /><button className="expand-preview" aria-label={`Open ${c.name} preview`} onClick={() => setDocs(c.slug)}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /></svg></button></div><div className="component-meta"><div><button className="component-title" onClick={() => setDocs(c.slug)}>{c.name}</button><span>{c.category}</span></div><button className="component-code" aria-label={`View ${c.name} source`} onClick={() => setDocs(`${c.slug}:source`)}><span aria-hidden="true">〈/〉</span></button></div><p className="component-description">{c.description}</p></article>)}</div>
        {visible.length === 0 && <div className="empty-state"><h3>No components found.</h3><p>Try a different search or explore the full collection.</p><button className="button" onClick={() => { setCategory('All components'); setQuery('') }}>Show all components</button></div>}
        <div className="collection-end"><span>Six pieces. Endless possibilities.</span><button onClick={() => setDocs('installation')}>A guide to getting started <Arrow diagonal /></button></div>
      </section>
      <section id="approach" className="approach shell"><div className="approach-heading"><span className="collection-label">The Forme approach</span><h2>Good motion<br />has good manners.</h2><p>Beautiful in a demo. Considered in the real world. Every piece is built to become part of your work.</p><button className="text-link" onClick={() => setDocs('installation')}>Get to know the collection <Arrow diagonal /></button></div><div className="principles"><div><span className="principle-icon" aria-hidden="true">↔</span><h3>A shared rhythm.</h3><p>Consistent timing and easing. Details that belong together, from the first impression to the last interaction.</p></div><div><span className="principle-icon" aria-hidden="true">⌘</span><h3>Every way of using it.</h3><p>Keyboard, touch, and reduced motion. The experience deserves the same care on every screen.</p></div><div><span className="principle-icon" aria-hidden="true">⌁</span><h3>Your name on the work.</h3><p>Readable TypeScript and scoped CSS. Change the type, the colors, the content. Take it somewhere we haven’t.</p></div></div></section>
      <section className="closing shell"><div className="closing-symbol" aria-hidden="true">✳</div><h2>Your next project<br />has a good feeling.</h2><button className="button button-white" onClick={() => setDocs('installation')}>Build something with Forme <Arrow /></button><span>Editorial collection / Development preview</span></section>
    </main>
    <footer className="footer shell"><a className="wordmark" href="#"><Mark />forme</a><p>Made with care. Made to move.</p><div><a href={repo} target="_blank" rel="noreferrer">GitHub <Arrow diagonal /></a><button onClick={() => setDocs('installation')}>Documentation</button><span>© {new Date().getFullYear()} Forme</span></div></footer>
    {docs && <Docs key={docs} slug={docs.split(':')[0]} initialTab={docs.endsWith(':source') ? 'source' : 'preview'} close={() => setDocs(null)} />}
  </>
}
