import { useEffect, useRef, useState } from "react";
import {
  catalog,
  categories,
  freeCount,
  studioCount,
  type Category,
} from "./catalog";
import { Demo } from "./Demo";
import { DocsPage } from "./Docs";
import { Arrow, Footer, Header } from "./ui";

const launches = [
  {
    slug: "editorial",
    name: "Editorial",
    caption: "Project presentation, considered.",
    description:
      "Image-led interactions for selected work, case studies, and studio websites.",
    image: "/images/architecture.jpg",
    alt: "A stepped glass building seen from below",
    status: "Explore the release",
  },
  {
    slug: "object",
    name: "Object",
    caption: "Material, made interactive.",
    description:
      "A forthcoming study of products, finishes, and the details that make them tangible.",
    image: "/images/object.jpg",
    alt: "A sculptural dark metal desk lamp against a pale background",
    status: "In development",
  },
  {
    slug: "kinetic",
    name: "Kinetic",
    caption: "An exploration of time.",
    description:
      "A forthcoming study of responsive type, transitions, and visual rhythm.",
    image: "/images/light-study.jpg",
    alt: "Light illuminating the architecture and tram lines of a city at night",
    status: "In development",
  },
];
function ReleaseArt({ slug }: { slug: string }) {
  const item = launches.find((x) => x.slug === slug)!;
  return (
    <div className={`release-art release-${slug}`}>
      <img src={item.image} alt={item.alt} loading="lazy" />
      <span>
        {slug === "editorial"
          ? "Selected perspectives"
          : slug === "object"
            ? "Studies in material"
            : "Studies in time"}
      </span>
    </div>
  );
}
function Releases({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`release-list${compact ? " release-list-compact" : ""}`}>
      {launches.map((item, i) => (
        <a
          key={item.slug}
          href={`/collections/${item.slug}/`}
          className="release-item"
        >
          <ReleaseArt slug={item.slug} />
          <div className="release-caption">
            <span>Collection {String(i + 1).padStart(2, "0")}</span>
            <h3>{item.name}</h3>
            <p>{item.caption}</p>
            <span className="release-status">
              {item.status}
              <Arrow diagonal />
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
function PieceCard({ slug }: { slug: string }) {
  const item = catalog.find((x) => x.slug === slug)!;
  return (
    <article className="component-card">
      <div className={`component-preview preview-${slug}`}>
        <Demo slug={slug} />
        {item.access === "studio" && (
          <a href="/studio/" className="studio-badge">
            Studio
          </a>
        )}
        <a
          className="expand-preview"
          href={`/docs/${slug}/`}
          aria-label={`Open ${item.name} preview`}
        >
          <Arrow diagonal />
        </a>
      </div>
      <div className="component-meta">
        <div>
          <a className="component-title" href={`/docs/${slug}/`}>
            {item.name}
          </a>
          <span>{item.category}</span>
        </div>
        <a
          className="component-code"
          href={`/docs/${slug}/?view=source`}
          aria-label={`View ${item.name} source`}
        >
          〈/〉
        </a>
      </div>
      <p className="component-description">{item.description}</p>
    </article>
  );
}
function HomePage() {
  return (
    <main id="main">
      <section className="home-intro shell">
        <div className="intro-topline">
          <span>Independent interaction studio</span>
          <span>React components / Release 01</span>
        </div>
        <div className="home-headline">
          <h1>
            Make the details
            <br />
            unforgettable.
          </h1>
          <div>
            <p>
              Distinctive interactions for the websites you put your name on.
              Designed as a system. Built to become your own.
            </p>
            <a className="button" href="/collections/editorial/">
              Explore the collection
              <Arrow />
            </a>
          </div>
        </div>
        <div className="signature-stage">
          <div className="signature-bar">
            <a href="/docs/project-index/">
              Project index<span>Live specimen</span>
            </a>
            <span>
              Select a project to explore
              <Arrow diagonal />
            </span>
          </div>
          <Demo slug="project-index" />
          <div className="signature-footer">
            <span>Every interaction on this site is the component itself.</span>
            <a href="/docs/project-index/">
              Make it yours
              <Arrow />
            </a>
          </div>
        </div>
      </section>
      <section className="selected-pieces shell">
        <div className="section-heading">
          <div>
            <span className="section-kicker">The Editorial release</span>
            <h2>
              Small details.
              <br />A lasting impression.
            </h2>
          </div>
          <div>
            <p>
              Image, intent, and interaction.
              <br />
              Made for the work between the sections.
            </p>
            <a className="text-link" href="/collections/editorial/">
              View all {catalog.length} pieces
              <Arrow diagonal />
            </a>
          </div>
        </div>
        <div className="home-piece-grid">
          {[
            "expanding-gallery",
            "focus-cursor",
            "magnetic-button",
            "image-compare",
          ].map((slug) => (
            <PieceCard key={slug} slug={slug} />
          ))}
        </div>
      </section>
      <section className="studio-feature shell">
        <div className="studio-feature-stage">
          <Demo slug="case-study" />
        </div>
        <div className="studio-feature-copy">
          <span className="section-kicker">For the whole story</span>
          <h2>
            Your work deserves
            <br />a better entrance.
          </h2>
          <p>
            A project should feel connected from its first impression to its
            final detail. Studio brings those moments together: case-study
            entrances, photographic reels, and navigation with context.
          </p>
          <a className="text-link" href="/studio/">
            Discover Forme Studio
            <Arrow diagonal />
          </a>
          <span className="release-note">
            Working previews. Paid source access coming later.
          </span>
        </div>
      </section>
      <section className="releases-section shell">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              Different directions. A shared standard.
            </span>
            <h2>The next chapters.</h2>
          </div>
          <a className="text-link" href="/collections/">
            All collections
            <Arrow diagonal />
          </a>
        </div>
        <Releases compact />
      </section>
      <section id="approach" className="approach shell">
        <div>
          <span className="section-kicker">What comes with the craft</span>
          <h2>
            Considered beyond
            <br />
            the first impression.
          </h2>
        </div>
        <div className="principles">
          <div>
            <h3>Made to be adapted.</h3>
            <p>
              Readable TypeScript, scoped CSS, and content structures you can
              actually put to work.
            </p>
          </div>
          <div>
            <h3>Every way of using it.</h3>
            <p>
              Touch, keyboard, and reduced motion. An interaction should respect
              the person using it.
            </p>
          </div>
          <div>
            <h3>A coherent starting point.</h3>
            <p>
              Components that share a visual and motion language, with room for
              your own art direction.
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
      <span>Good work lives in the details.</span>
      <a href="/collections/editorial/">
        Find your next interaction
        <Arrow diagonal />
      </a>
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
        <span className="section-kicker">An ongoing series</span>
        <h1>
          A distinct perspective.
          <br />
          With every release.
        </h1>
        <p>
          Editorial is our first collection. Object and Kinetic are taking shape
          as separate explorations, each with its own purpose and point of view.
        </p>
      </div>
      <Releases />
      <div className="collections-note">
        <h2>Built one release at a time.</h2>
        <p>
          A focused collection now, with new interactions added as the studio
          develops. Future releases have no announced dates.
        </p>
        <a className="text-link" href="/docs/">
          Start with Editorial
          <Arrow diagonal />
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
  const [access, setAccess] = useState(params.get("access") || "all");
  const [query, setQuery] = useState("");
  const [roomy, setRoomy] = useState(false);
  const search = useRef<HTMLInputElement>(null);
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
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        search.current?.focus();
        search.current?.scrollIntoView({ block: "center" });
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
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
        <div className="breadcrumbs">
          <a href="/collections/">Collections</a>
          <span>/</span>Editorial
        </div>
        <div className="collection-page-heading">
          <div>
            <span className="section-kicker">Collection 01</span>
            <h1>Editorial.</h1>
          </div>
          <p>
            Present your work with intention.
            <br />
            Nine interactions for images, projects,
            <br />
            and the way people move between them.
          </p>
        </div>
        <div className="editorial-banner">
          <Demo slug="expanding-gallery" />
        </div>
      </section>
      <section id="components" className="library shell">
        <div className="library-heading">
          <div>
            <h2>
              The collection<span>{catalog.length}</span>
            </h2>
            <p>Every preview is live. Take your time with it.</p>
          </div>
          <div
            className="library-view"
            role="group"
            aria-label="Gallery density"
          >
            <button aria-pressed={!roomy} onClick={() => setRoomy(false)}>
              Grid
            </button>
            <button aria-pressed={roomy} onClick={() => setRoomy(true)}>
              Large
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
              { key: "all", name: "All pieces", count: catalog.length },
              { key: "free", name: "Free preview", count: freeCount },
              { key: "studio", name: "Studio preview", count: studioCount },
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
            About Studio
            <Arrow diagonal />
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
                aria-pressed={category === c}
                onClick={() => filter(c)}
              >
                {c === "All components" ? "All" : c}
                <span>
                  {c === "All components"
                    ? catalog.length
                    : catalog.filter((x) => x.category === c).length}
                </span>
              </button>
            ))}
          </div>
          <label className="search">
            <span aria-hidden="true">⌕</span>
            <input
              ref={search}
              aria-label="Search components"
              placeholder="Find an interaction"
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
            <PieceCard key={c.slug} slug={c.slug} />
          ))}
        </div>
        {!visible.length && (
          <div className="empty-state">
            <h3>No interactions found.</h3>
            <p>Try another search or explore the full collection.</p>
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
          <span>Made to become part of your work.</span>
          <a href="/docs/">
            Start building
            <Arrow diagonal />
          </a>
        </div>
      </section>
      <section className="next-collections shell">
        <span>Next in the series</span>
        {launches.slice(1).map((item) => (
          <a href={`/collections/${item.slug}/`} key={item.slug}>
            <h2>{item.name}</h2>
            <span>Coming soon</span>
            <Arrow diagonal />
          </a>
        ))}
      </section>
    </main>
  );
}
function StudioPage() {
  return (
    <main id="main" className="studio-page shell">
      <div className="breadcrumbs">
        <a href="/collections/">Collections</a>
        <span>/</span>Studio
      </div>
      <div className="studio-intro">
        <div>
          <span className="section-kicker">The complete interaction</span>
          <h1>
            Give your work
            <br />
            the whole stage.
          </h1>
          <p>
            Deeper compositions for client projects: from choosing a piece of
            work to exploring the story behind it. Three working previews for
            our forthcoming paid edition.
          </p>
          <a className="text-link" href="/collections/editorial/?access=free">
            Explore the free pieces
            <Arrow diagonal />
          </a>
        </div>
        <div className="studio-intro-demo">
          <Demo slug="case-study" />
        </div>
      </div>
      <div className="studio-release-note">
        <span className="status-dot" />
        <p>
          Studio is in development. Preview the compositions now; pricing,
          commercial terms, and purchasing will follow.
        </p>
      </div>
      <div className="component-grid studio-grid">
        {catalog
          .filter((c) => c.access === "studio")
          .map((c) => (
            <PieceCard key={c.slug} slug={c.slug} />
          ))}
      </div>
      <div className="studio-roadmap">
        <h2>
          A better starting point
          <br />
          for the projects that matter.
        </h2>
        <p>
          Editable compositions, content patterns, and a consistent motion
          language. Paid downloads and customer access will be connected before
          the commercial launch.
        </p>
      </div>
    </main>
  );
}
function ComingSoonPage({ slug }: { slug: string }) {
  const item = launches.find((x) => x.slug === slug)!;
  return (
    <main id="main" className="coming-page shell">
      <div className="breadcrumbs">
        <a href="/collections/">Collections</a>
        <span>/</span>
        {item.name}
      </div>
      <div className="coming-layout">
        <div>
          <span className="section-kicker">
            Next in the series / In development
          </span>
          <h1>{item.name}.</h1>
          <h2>{item.caption}</h2>
          <p>{item.description}</p>
          <span className="coming-note">
            Coming soon. No release date announced yet.
          </span>
          <a className="button" href="/collections/editorial/">
            Explore Editorial now
            <Arrow />
          </a>
        </div>
        <ReleaseArt slug={slug} />
      </div>
      <div className="coming-footer">
        <span>A new direction, held to the same standard.</span>
        <a href="/collections/">
          All collections
          <Arrow diagonal />
        </a>
      </div>
    </main>
  );
}
export default function App() {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  const page =
    path === "/" ? (
      <HomePage />
    ) : path === "/collections" ? (
      <CollectionsPage />
    ) : path === "/collections/editorial" ? (
      <EditorialPage />
    ) : path === "/studio" ? (
      <StudioPage />
    ) : path === "/collections/object" || path === "/collections/kinetic" ? (
      <ComingSoonPage slug={path.split("/")[2]} />
    ) : path === "/docs" || path.startsWith("/docs/") ? (
      <DocsPage slug={path.slice(5).replace(/^\//, "")} />
    ) : (
      <main id="main" className="not-found shell">
        <h1>A different direction?</h1>
        <a className="button" href="/collections/">
          Explore the collections
          <Arrow />
        </a>
      </main>
    );
  useEffect(() => {
    const part = catalog.find((c) => path === `/docs/${c.slug}`);
    document.title = `${part?.name || (path === "/studio" ? "Studio" : path.startsWith("/docs") ? "Documentation" : path.includes("editorial") ? "Editorial" : path.includes("collections") ? "Collections" : "Independent interaction studio")} — Forme`;
  }, [path]);
  return (
    <>
      <Header />
      {page}
      <Footer />
    </>
  );
}
