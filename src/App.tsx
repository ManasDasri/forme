import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { catalog, categories, type Category } from "./catalog";
import { Demo } from "./Demo";
import { DocsPage } from "./Docs";
import { Arrow, Footer, Header } from "./ui";

const collectionInfo = [
  {
    slug: "editorial",
    name: "Editorial",
    description:
      "Expressive type. Considered imagery. A quieter kind of confidence.",
    detail: "Twelve components, one shared rhythm.",
    status: "Available to explore",
  },
  {
    slug: "object",
    name: "Object",
    description:
      "Tactile details. Material depth. Digital experiences with a physical presence.",
    detail: "Product stories, material selectors, and dimensional galleries.",
    status: "Coming soon",
  },
  {
    slug: "kinetic",
    name: "Kinetic",
    description:
      "Bold identities. Graphic energy. Motion that makes its own rules.",
    detail: "Kinetic type, playful cursors, and expressive transitions.",
    status: "Coming soon",
  },
];

function CollectionArt({ name }: { name: string }) {
  if (name === "editorial")
    return (
      <div className="collection-art art-editorial">
        <img
          src="/images/landscape.jpg"
          alt="Mountains and a calm lake in an editorial cover composition"
          loading="lazy"
        />
        <span className="cover-brand">
          Fieldnotes<span>Issue one</span>
        </span>
        <span className="cover-title">
          Somewhere
          <br />a little slower.
        </span>
        <span className="cover-bottom">A different way of seeing.</span>
      </div>
    );
  if (name === "object")
    return (
      <div
        className="collection-art art-object"
        aria-label="Object concept: a tactile sculptural sphere"
      >
        <span className="object-word">
          A sense
          <br />
          of substance.
        </span>
        <span className="object-sculpture" aria-hidden="true" />
        <span className="concept-note">Material. Shape. Feeling.</span>
      </div>
    );
  return (
    <div
      className="collection-art art-kinetic"
      aria-label="Kinetic concept: bold expressive typography"
    >
      <div aria-hidden="true">
        <span>Make</span>
        <span>your</span>
        <span>move.</span>
      </div>
      <span className="kinetic-symbol" aria-hidden="true">
        ✳
      </span>
      <span className="concept-note">A little beautifully unpredictable.</span>
    </div>
  );
}

function CollectionCards({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`collections-grid${compact ? " compact" : ""}`}>
      {collectionInfo.map((item) => (
        <a
          className={`collection-card card-${item.slug}`}
          href={`/collections/${item.slug}/`}
          key={item.slug}
        >
          <CollectionArt name={item.slug} />
          <div className="collection-card-meta">
            <div>
              <h3>{item.name}</h3>
              <span
                className={
                  item.slug === "editorial"
                    ? "availability available"
                    : "availability"
                }
              >
                {item.slug === "editorial" && <span className="status-dot" />}
                {item.status}
              </span>
            </div>
            <Arrow diagonal />
          </div>
          <p>{item.description}</p>
          <span className="collection-card-detail">{item.detail}</span>
        </a>
      ))}
    </div>
  );
}

function HeroPlayground() {
  const [scene, setScene] = useState(0);
  const bounds = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const scenes = [
    {
      brand: "serein",
      title: (
        <>
          Room
          <br />
          to feel.
        </>
      ),
      image: "/images/interior.jpg",
      alt: "A warm interior with natural materials",
      color: "sage",
    },
    {
      brand: "Fieldnotes",
      title: (
        <>
          Take the
          <br />
          long way.
        </>
      ),
      image: "/images/landscape.jpg",
      alt: "A still lake below forested mountains",
      color: "lake",
    },
    {
      brand: "Forma",
      title: (
        <>
          Another
          <br />
          perspective.
        </>
      ),
      image: "/images/architecture.jpg",
      alt: "Stepped glass towers seen from below",
      color: "slate",
    },
  ];
  const current = scenes[scene];
  return (
    <div className="hero-playground" ref={bounds}>
      <span className="playground-note">
        <span className="status-dot" /> A small playground for big ideas.
      </span>
      <div className="poster-ghost ghost-one" aria-hidden="true" />
      <div className="poster-ghost ghost-two" aria-hidden="true" />
      <motion.div
        className={`playground-poster poster-${current.color}`}
        drag={!reduce && matchMedia("(pointer:fine)").matches}
        dragConstraints={bounds}
        dragElastic={0.12}
        dragSnapToOrigin
        whileDrag={{ scale: 1.025, cursor: "grabbing" }}
        animate={{ rotate: scene === 1 ? -4 : scene === 2 ? 2 : -2 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        <span className="poster-brand">
          {current.brand}
          <span aria-hidden="true">✳</span>
        </span>
        <img
          key={current.image}
          src={current.image}
          alt={current.alt}
          fetchPriority="high"
        />
        <span className="poster-title">{current.title}</span>
        <span className="poster-caption">
          An independent point of view.<span aria-hidden="true">↗</span>
        </span>
      </motion.div>
      <div className="playground-controls">
        <div role="group" aria-label="Hero specimen">
          {scenes.map((item, i) => (
            <button
              key={item.brand}
              onClick={() => setScene(i)}
              aria-label={`Show ${item.brand} specimen`}
              aria-pressed={scene === i}
            >
              <span />
            </button>
          ))}
        </div>
        <span>Change the scene. Drag the cover.</span>
        <button
          className="scene-next"
          aria-label="Next hero specimen"
          onClick={() => setScene((scene + 1) % scenes.length)}
        >
          <Arrow />
        </button>
      </div>
      <span className="playground-coordinate" aria-live="polite">
        {current.brand} / Editorial collection
      </span>
    </div>
  );
}

function MotionLab() {
  const [active, setActive] = useState("focus-cursor");
  const items = [
    {
      slug: "focus-cursor",
      name: "Follow your curiosity",
      caption:
        "Move your cursor across the photograph. Tap or press Enter to pin the lens.",
    },
    {
      slug: "magnetic-button",
      name: "Feel the attraction",
      caption: "A little pull towards your cursor. Click it for a response.",
    },
    {
      slug: "layout-switch",
      name: "Change your perspective",
      caption:
        "Switch between Grid and List. The same content finds a new arrangement.",
    },
  ];
  const current = items.find((item) => item.slug === active)!;
  return (
    <section className="motion-lab shell">
      <div className="lab-copy">
        <span className="section-kicker">Take a moment. Play a little.</span>
        <h2>
          It’s a feeling.
          <br />
          Try it for yourself.
        </h2>
        <p>The best details answer your curiosity. Here are a few of ours.</p>
        <div
          className="lab-options"
          role="group"
          aria-label="Motion playground"
        >
          {items.map((item, i) => (
            <button
              key={item.slug}
              aria-pressed={active === item.slug}
              onClick={() => setActive(item.slug)}
            >
              <span className="lab-option-icon" aria-hidden="true">
                {["⌖", "↗", "▦"][i]}
              </span>
              {item.name}
              <Arrow />
            </button>
          ))}
        </div>
        <a className="text-link" href={`/docs/${active}/`}>
          Explore this component <Arrow diagonal />
        </a>
      </div>
      <div className="lab-demo">
        <div className="lab-stage" key={active}>
          <Demo slug={active} expanded />
        </div>
        <p aria-live="polite">{current.caption}</p>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <main id="main">
      <section className="hero shell">
        <div className="hero-copy">
          <div className="hero-intro">
            <span aria-hidden="true">✳</span>A little motion. A lot of
            character.
          </div>
          <h1>
            Give the web
            <br />a little feeling.
          </h1>
          <p>
            Thoughtfully animated React components for independent designers and
            ambitious studios.
          </p>
          <div className="hero-buttons">
            <a className="button" href="/collections/editorial/">
              Explore Editorial <Arrow />
            </a>
            <a className="quiet-button" href="/collections/">
              Meet the collections <Arrow diagonal />
            </a>
          </div>
          <div className="hero-footnote">
            <span>React & TypeScript</span>
            <span>Editable source</span>
            <span>Your point of view</span>
          </div>
        </div>
        <HeroPlayground />
      </section>
      <div className="manifesto-strip shell">
        <p>
          For websites that deserve
          <br />a second look.
        </p>
        <span>
          <b aria-hidden="true">⚛</b> Built with React
        </span>
        <span>
          <b aria-hidden="true">▰</b> Powered by Motion
        </span>
        <span>
          <b aria-hidden="true">↗</b> Shaped by you
        </span>
      </div>
      <MotionLab />
      <section className="collections-section shell">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              A collection is a point of view.
            </span>
            <h2>Find yours.</h2>
          </div>
          <p>
            Different sensibilities.
            <br />
            The same attention to detail.
          </p>
        </div>
        <CollectionCards compact />
      </section>
      <section id="approach" className="approach shell">
        <div>
          <span className="section-kicker">The Forme approach</span>
          <h2>
            Good motion
            <br />
            has good manners.
          </h2>
          <p>
            Expressive where it matters. Considered everywhere. Built to make
            your work feel like yours.
          </p>
          <a className="text-link" href="/docs/accessibility/">
            Read about the details <Arrow diagonal />
          </a>
        </div>
        <div className="principles">
          <div>
            <span aria-hidden="true">↔</span>
            <h3>A shared rhythm.</h3>
            <p>
              Coordinated easing and timing. A collection that belongs together,
              from opening impression to final interaction.
            </p>
          </div>
          <div>
            <span aria-hidden="true">⌘</span>
            <h3>Every way of using it.</h3>
            <p>
              Keyboard, touch, and reduced motion. The little details deserve
              care on every screen.
            </p>
          </div>
          <div>
            <span aria-hidden="true">⌁</span>
            <h3>Yours to take further.</h3>
            <p>
              Readable TypeScript. Scoped CSS. Your type, your colors, your
              content. Make something we haven’t imagined.
            </p>
          </div>
        </div>
      </section>
      <Closing />
    </main>
  );
}
function Closing() {
  return (
    <section className="closing shell">
      <span className="closing-symbol" aria-hidden="true">
        ✳
      </span>
      <h2>
        Your next project
        <br />
        has a good feeling.
      </h2>
      <a className="button" href="/collections/editorial/">
        Find your starting point <Arrow />
      </a>
      <span>Twelve components. One considered collection.</span>
    </section>
  );
}

function CollectionsPage() {
  return (
    <main id="main" className="collections-page shell">
      <div className="breadcrumbs">
        <a href="/">Forme</a>
        <span>/</span>Collections
      </div>
      <div className="page-intro">
        <span className="section-kicker">A family of different feelings.</span>
        <h1>
          Three points of view.
          <br />
          Which one feels like you?
        </h1>
        <p>
          Coordinated components, with their own character. Start with
          Editorial. See what’s taking shape next.
        </p>
      </div>
      <CollectionCards />
      <div className="collections-note">
        <span aria-hidden="true">✳</span>
        <div>
          <h2>A collection, not a constraint.</h2>
          <p>
            Every component arrives as editable source. Borrow the rhythm, bring
            your own identity, and make it entirely your own.
          </p>
        </div>
        <a className="text-link" href="/docs/">
          How Forme works <Arrow diagonal />
        </a>
      </div>
    </main>
  );
}

function EditorialPage() {
  const params = new URLSearchParams(location.search);
  const [category, setCategory] = useState<Category>(
    categories.includes(params.get("category") as Category)
      ? (params.get("category") as Category)
      : "All components",
  );
  const [query, setQuery] = useState("");
  const [access, setAccess] = useState(params.get("access") || "all");
  const [roomy, setRoomy] = useState(false);
  const search = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();
  const visible = catalog.filter(
    (c) =>
      (access === "all" ||
        (access === "studio"
          ? c.access === "studio"
          : c.access !== "studio")) &&
      (category === "All components" || c.category === category) &&
      `${c.name} ${c.description} ${c.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        search.current?.focus();
        search.current?.scrollIntoView({
          block: "center",
          behavior: reduce ? "instant" : "smooth",
        });
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [reduce]);
  function filter(value: Category) {
    setCategory(value);
    history.replaceState(
      null,
      "",
      `${location.pathname}${value === "All components" ? "" : "?category=" + encodeURIComponent(value)}`,
    );
  }
  return (
    <main id="main">
      <section className="editorial-intro shell">
        <div>
          <div className="breadcrumbs">
            <a href="/collections/">Collections</a>
            <span>/</span>Editorial
          </div>
          <span className="release-label">
            <span className="status-dot" />
            The first collection, expanded.
          </span>
          <h1>
            A point of view.
            <br />
            In every detail.
          </h1>
          <p>
            Expressive typography. Considered imagery. Quietly unexpected
            interactions. Twelve pieces for websites with something to say.
          </p>
          <div className="intro-links">
            <a className="button" href="#components">
              Explore all twelve <Arrow />
            </a>
            <a className="quiet-button" href="/docs/">
              Read the documentation <Arrow diagonal />
            </a>
          </div>
        </div>
        <div className="editorial-intro-art">
          <Demo slug="type-switcher" />
          <span className="art-instruction">
            An introduction you can interact with.
          </span>
        </div>
      </section>
      <section id="components" className="library shell">
        <div className="library-heading">
          <div>
            <h2>
              The Editorial library<span>{catalog.length}</span>
            </h2>
            <p>Explore, interact, make it your own.</p>
          </div>
          <div
            className="library-view"
            role="group"
            aria-label="Gallery density"
          >
            <button
              aria-pressed={!roomy}
              onClick={() => setRoomy(false)}
              aria-label="Compact gallery"
            >
              ▦
            </button>
            <button
              aria-pressed={roomy}
              onClick={() => setRoomy(true)}
              aria-label="Roomy gallery"
            >
              ▤
            </button>
          </div>
        </div>
        <div className="access-bar">
          <div
            className="access-tabs"
            role="group"
            aria-label="Component access"
          >
            {[
              { key: "all", name: "All pieces", count: 12 },
              { key: "free", name: "Free preview", count: 9 },
              { key: "studio", name: "Studio preview", count: 3 },
            ].map((item) => (
              <button
                key={item.key}
                aria-pressed={access === item.key}
                onClick={() => setAccess(item.key)}
              >
                {item.name}
                <span>{item.count}</span>
              </button>
            ))}
          </div>
          <a href="/studio/">
            Meet Forme Studio <Arrow diagonal />
          </a>
        </div>
        <div className="collection-toolbar">
          <div
            className="filter-tabs"
            role="group"
            aria-label="Filter components"
          >
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => filter(c)}
                aria-pressed={category === c}
              >
                {c === "All components" ? "All" : c}
                <span>
                  {c === "All components"
                    ? catalog.length
                    : catalog.filter((item) => item.category === c).length}
                </span>
              </button>
            ))}
          </div>
          <label className="search">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 5 5" />
            </svg>
            <input
              ref={search}
              aria-label="Search components"
              placeholder="Find a component…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd>⌘ K</kbd>
          </label>
        </div>
        <p className="sr-only" role="status">
          {visible.length} components
        </p>
        <div className={`component-grid${roomy ? " roomy" : ""}`}>
          {visible.map((c) => (
            <article className="component-card" key={c.slug}>
              <div className={`component-preview preview-${c.slug}`}>
                <Demo slug={c.slug} />
                {c.access === "studio" && (
                  <a href="/studio/" className="studio-badge">
                    Studio
                  </a>
                )}
                <a
                  className="expand-preview"
                  href={`/docs/${c.slug}/`}
                  aria-label={`Open ${c.name} preview`}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
                  </svg>
                </a>
              </div>
              <div className="component-meta">
                <div>
                  <a className="component-title" href={`/docs/${c.slug}/`}>
                    {c.name}
                  </a>
                  <span>{c.category}</span>
                </div>
                <a
                  className="component-code"
                  href={`/docs/${c.slug}/?view=source`}
                  aria-label={`View ${c.name} source`}
                >
                  〈/〉
                </a>
              </div>
              <p className="component-description">{c.description}</p>
            </article>
          ))}
        </div>
        {!visible.length && (
          <div className="empty-state">
            <h3>No components found.</h3>
            <p>Try another search or explore the whole collection.</p>
            <button
              className="button"
              onClick={() => {
                filter("All components");
                setAccess("all");
                setQuery("");
              }}
            >
              Show all components
            </button>
          </div>
        )}
        <div className="collection-end">
          <span>Built to become part of your work.</span>
          <a href="/docs/">
            Start building <Arrow diagonal />
          </a>
        </div>
      </section>
      <section className="next-collections shell">
        <div>
          <span className="section-kicker">
            Another feeling is taking shape.
          </span>
          <h2>There’s more to Forme.</h2>
        </div>
        {collectionInfo.slice(1).map((c) => (
          <a key={c.slug} href={`/collections/${c.slug}/`}>
            <span>{c.name}</span>
            <span className="availability">Coming soon</span>
            <Arrow diagonal />
          </a>
        ))}
      </section>
    </main>
  );
}

function StudioPage() {
  const pieces = catalog.filter((c) => c.access === "studio");
  return (
    <main id="main" className="studio-page shell">
      <div className="breadcrumbs">
        <a href="/collections/">Collections</a>
        <span>/</span>Studio
      </div>
      <div className="studio-intro">
        <div>
          <span className="availability">Paid edition / Coming soon</span>
          <h1>
            A little more.
            <br />
            For your studio.
          </h1>
          <p>
            Complete compositions for your most considered client work. Preview
            the direction now. Editable source and paid access will follow.
          </p>
          <a className="button" href="/collections/editorial/?access=free">
            Explore the free preview <Arrow />
          </a>
        </div>
        <div className="studio-identity" aria-hidden="true">
          <span>Forme</span>
          <span>✳</span>
          <span>Studio edition</span>
        </div>
      </div>
      <div className="studio-release-note">
        <span className="status-dot" />
        <p>
          Three working previews. Purchasing is not open yet; pricing and
          commercial terms will be announced before launch.
        </p>
      </div>
      <div className="component-grid studio-grid">
        {pieces.map((c) => (
          <article className="component-card" key={c.slug}>
            <div className="component-preview">
              <Demo slug={c.slug} />
              <span className="studio-badge">Studio preview</span>
            </div>
            <div className="component-meta">
              <a className="component-title" href={`/docs/${c.slug}/`}>
                {c.name}
              </a>
              <a className="text-link" href={`/docs/${c.slug}/`}>
                Try it <Arrow diagonal />
              </a>
            </div>
            <p className="component-description">{c.description}</p>
          </article>
        ))}
      </div>
      <div className="studio-roadmap">
        <div>
          <h2>A focused first release.</h2>
          <p>
            Editorial opens with nine free-preview components and three Studio
            compositions. Object and Kinetic will arrive as separate
            collections, with more pieces added over time.
          </p>
        </div>
        <a className="text-link" href="/collections/">
          See the collections <Arrow diagonal />
        </a>
      </div>
    </main>
  );
}

function ComingSoonPage({ slug }: { slug: string }) {
  const item = collectionInfo.find((c) => c.slug === slug)!;
  return (
    <main id="main" className="coming-page shell">
      <div className="breadcrumbs">
        <a href="/collections/">Collections</a>
        <span>/</span>
        {item.name}
      </div>
      <div className="coming-layout">
        <div>
          <span className="availability">Coming soon</span>
          <h1>{item.name}</h1>
          <h2>
            {slug === "object"
              ? "A little more substance."
              : "A little less predictable."}
          </h2>
          <p>{item.description}</p>
          <p className="coming-plan">
            Planned: {item.detail[0].toLowerCase() + item.detail.slice(1)}
          </p>
          <div className="hero-buttons">
            <a className="button" href="/collections/editorial/">
              Explore Editorial now <Arrow />
            </a>
            <a className="quiet-button" href="/collections/">
              All collections
            </a>
          </div>
          <span className="coming-note">
            A direction in development. No release date announced yet.
          </span>
        </div>
        <CollectionArt name={slug} />
      </div>
      <div className="coming-footer">
        <span>Good things take a little consideration.</span>
        <a href="/docs/">
          Get to know Forme <Arrow diagonal />
        </a>
      </div>
    </main>
  );
}

export default function App() {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  const docsSlug = path.slice("/docs".length).replace(/^\//, "");
  const page =
    path === "/studio" ? (
      <StudioPage />
    ) : path === "/collections" ? (
      <CollectionsPage />
    ) : path === "/collections/editorial" ? (
      <EditorialPage />
    ) : path === "/collections/object" || path === "/collections/kinetic" ? (
      <ComingSoonPage slug={path.split("/")[2]} />
    ) : path === "/docs" || path.startsWith("/docs/") ? (
      <DocsPage slug={docsSlug} />
    ) : path === "/" ? (
      <HomePage />
    ) : (
      <main id="main" className="not-found shell">
        <h1>A different direction?</h1>
        <p>This page isn’t part of the collection.</p>
        <a className="button" href="/collections/">
          Explore the collections <Arrow />
        </a>
      </main>
    );
  useEffect(() => {
    const component = catalog.find((c) => path === `/docs/${c.slug}`);
    const title =
      component?.name ||
      (path.startsWith("/docs")
        ? "Documentation"
        : path === "/studio"
          ? "Studio"
          : path === "/collections"
            ? "Collections"
            : path.startsWith("/collections/")
              ? path.split("/")[2].replace(/^./, (c) => c.toUpperCase())
              : "Motion with a point of view");
    document.title = `${title} — Forme`;
  }, [path]);
  return (
    <>
      <Header />
      {page}
      <Footer />
    </>
  );
}
