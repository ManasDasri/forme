import { useEffect, useState } from "react";
import { catalog } from "./catalog";
import { Demo } from "./Demo";
import { SilkShader } from "./registry/silk-shader";
import { LibraryBrowser } from "./Library";
import { SearchDialog } from "./SearchDialog";
import { DocsPage } from "./Docs";
import { Arrow, Footer, Header } from "./ui";

const groups = [
  {
    name: "Buttons",
    slug: "buttons",
    demo: "prism-button",
    description: "Small surfaces. Big personalities.",
    count: 3,
  },
  {
    name: "Shaders",
    slug: "shaders",
    demo: "orbital-shader",
    description: "Light, noise, and a little distortion.",
    count: 3,
  },
  {
    name: "ASCII",
    slug: "ascii",
    demo: "ascii-orbit",
    description: "A different language for the web.",
    count: 3,
  },
];
function CategoryCards() {
  return (
    <div className="category-collection-grid">
      {groups.map((group) => (
        <article className="category-collection" key={group.slug}>
          <div className="category-collection-preview">
            <Demo slug={group.demo} />
          </div>
          <div>
            <a href={`/collections/${group.slug}/`}>
              <h3>{group.name}</h3>
              <span>{group.count} experiments</span>
              <Arrow diagonal />
            </a>
            <p>{group.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
function HomePage() {
  return (
    <main id="main" className="discovery-home">
      <section className="future-hero">
        <div className="hero-shader" aria-hidden="true">
          <SilkShader speed={0.45} />
        </div>
        <div className="future-hero-content shell">
          <a className="drop-badge" href="/collections/experimental/">
            <span />
            Signal / The first drop
            <Arrow />
          </a>
          <h1>
            The future looks
            <br />
            interactive.
          </h1>
          <p>
            Experimental buttons. Living shaders. ASCII with dimension.
            <br />
            Thoughtfully crafted React components for a less ordinary web.
          </p>
          <div className="future-hero-actions">
            <a className="button" href="/components/">
              Explore components
              <Arrow />
            </a>
            <a className="button button-secondary" href="/docs/">
              Read the docs
            </a>
          </div>
          <div className="hero-technology">
            <span>React</span>
            <span>TypeScript</span>
            <span>Copy the source. Make it yours.</span>
          </div>
        </div>
      </section>
      <section
        className="hero-library shell"
        aria-label="Explore the live component library"
      >
        <div className="app-preview-frame">
          <LibraryBrowser embedded />
        </div>
      </section>
      <section className="experiments-section shell">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              A few different ways to be different
            </span>
            <h2>Find your frequency.</h2>
          </div>
          <a className="text-link" href="/collections/">
            Explore the collection
            <Arrow diagonal />
          </a>
        </div>
        <CategoryCards />
      </section>
      <section className="studio-callout shell">
        <div className="studio-callout-icon" aria-hidden="true">
          ✦
        </div>
        <div>
          <span>For the beautifully unexpected.</span>
          <h2>Meet the Studio side.</h2>
          <p>
            More expressive experiments. Working previews now, paid source
            access later.
          </p>
        </div>
        <a className="button button-secondary" href="/studio/">
          Explore Studio
          <Arrow />
        </a>
      </section>
      <section className="build-strip shell">
        <div>
          <span className="build-strip-symbol" aria-hidden="true">
            〈/〉
          </span>
          <h2>Find it. Try it. Make it yours.</h2>
          <p>Live previews, real source, and docs that get you started.</p>
        </div>
        <a className="text-link" href="/docs/">
          Start building
          <Arrow />
        </a>
      </section>
    </main>
  );
}
function LibraryPage({
  saved = false,
  category,
}: {
  saved?: boolean;
  category?: string;
}) {
  return (
    <main id="main" className="library-page shell">
      <div className="library-page-heading">
        <span className="section-kicker">The Forme library</span>
        <h1>
          {saved
            ? "Saved for your next idea."
            : category
              ? `${category}. A little unexpected.`
              : "Components with character."}
        </h1>
        <p>
          {saved
            ? "Your personal collection, saved in this browser."
            : "Explore the first drop. Every preview is live, every detail is yours to take further."}
        </p>
      </div>
      <LibraryBrowser savedOnly={saved} initialCategory={category} />
    </main>
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
        <a className="drop-badge" href="/components/">
          <span />
          Signal / Drop 01
        </a>
        <h1>
          Three kinds of
          <br />
          beautifully unusual.
        </h1>
        <p>
          Buttons with presence. Shaders with a life of their own. ASCII that
          moves beyond the terminal. This is where Forme begins.
        </p>
      </div>
      <CategoryCards />
      <a className="next-drop-banner" href="/collections/next/">
        <div>
          <span>The next signal</span>
          <h2>More experiments are taking shape.</h2>
          <p>New drops over time. No release date announced yet.</p>
        </div>
        <span className="coming-badge">Coming soon</span>
        <Arrow diagonal />
      </a>
    </main>
  );
}
function StudioPage() {
  return (
    <main id="main" className="studio-page shell">
      <div className="library-page-heading">
        <span className="section-kicker">Forme Studio</span>
        <h1>
          A little further
          <br />
          from the ordinary.
        </h1>
        <p>
          Our most expressive experiments. Explore the live previews while the
          paid edition takes shape.
        </p>
      </div>
      <div className="studio-release-note">
        <span className="live-indicator" />
        <p>
          Studio purchasing is not open yet. Pricing, commercial terms, and
          editable source access will be announced before launch.
        </p>
      </div>
      <LibraryBrowser studioOnly />
    </main>
  );
}
function NextDropPage() {
  return (
    <main id="main" className="next-drop-page shell">
      <div className="breadcrumbs">
        <a href="/collections/">Collections</a>
        <span>/</span>Next drop
      </div>
      <div className="next-drop-art">
        <span className="next-drop-orbit" aria-hidden="true" />
        <span className="coming-badge">In development</span>
        <h1>
          Another signal
          <br />
          is out there.
        </h1>
        <p>
          We’re exploring what comes next for buttons, shaders, and ASCII. New
          experiments will arrive in focused drops.
        </p>
        <a className="button" href="/components/">
          Explore the first drop
          <Arrow />
        </a>
        <span className="next-drop-note">No release date announced yet.</span>
      </div>
    </main>
  );
}
export default function App() {
  const [search, setSearch] = useState(false);
  const path = location.pathname.replace(/\/+$/, "") || "/";
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  let page;
  if (path === "/") page = <HomePage />;
  else if (
    path === "/components" ||
    path === "/collections/experimental" ||
    path === "/collections/editorial"
  )
    page = <LibraryPage />;
  else if (path === "/bookmarks") page = <LibraryPage saved />;
  else if (path === "/collections") page = <CollectionsPage />;
  else if (groups.some((g) => path === `/collections/${g.slug}`))
    page = (
      <LibraryPage
        category={groups.find((g) => path === `/collections/${g.slug}`)!.name}
      />
    );
  else if (path === "/studio") page = <StudioPage />;
  else if (
    [
      "/collections/next",
      "/collections/object",
      "/collections/kinetic",
    ].includes(path)
  )
    page = <NextDropPage />;
  else if (path === "/docs" || path.startsWith("/docs/"))
    page = <DocsPage slug={path.slice(5).replace(/^\//, "")} />;
  else
    page = (
      <main id="main" className="not-found shell">
        <h1>
          A little too far
          <br />
          into the unknown.
        </h1>
        <p>This page isn’t part of the current drop.</p>
        <a className="button" href="/components/">
          Explore the library
          <Arrow />
        </a>
      </main>
    );
  useEffect(() => {
    const component = catalog.find((c) => path === `/docs/${c.slug}`);
    document.title = `${component?.name || (path === "/studio" ? "Studio" : path.startsWith("/docs") ? "Documentation" : path === "/bookmarks" ? "Bookmarks" : path.startsWith("/collections") ? "Collections" : path === "/components" ? "Component library" : "The future looks interactive")} — Forme`;
  }, [path]);
  return (
    <>
      <Header onSearch={() => setSearch(true)} />
      {page}
      <Footer />
      {search && <SearchDialog close={() => setSearch(false)} />}
    </>
  );
}
