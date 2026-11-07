import { useEffect, useState } from "react";
import { catalog, traitInfo, type Trait } from "./catalog";
import { Demo } from "./Demo";
import { Toaster } from "./registry/toast";
import { EclipseHero } from "./registry/eclipse-hero";
import { WordRotator } from "./registry/word-rotator";
import { NumberTicker } from "./registry/number-ticker";
import { LibraryBrowser } from "./Library";
import { SearchDialog } from "./SearchDialog";
import { DocsPage } from "./Docs";
import { Code, Footer, Header, Icon, Lazy, cardHandlers, installCommand, medianSize, sizeOf, useCopy } from "./ui";

const groups = [
  { name: "Buttons", slug: "buttons" },
  { name: "Shaders", slug: "shaders" },
  { name: "ASCII", slug: "ascii" },
  { name: "HUD", slug: "hud" },
  { name: "Surfaces", slug: "surfaces" },
  { name: "Inputs", slug: "inputs" },
  { name: "Loaders", slug: "loaders" },
  { name: "Navigation", slug: "navigation" },
  { name: "Feedback", slug: "feedback" },
  { name: "Text", slug: "text" },
];
const proofRows = ["hold-button", "animated-tabs", "mesh-gradient-shader", "radar-sweep", "otp-input", "toast"];
const proofTraits: Trait[] = ["reduced-motion", "keyboard", "offscreen-pause", "zero-deps"];

// Curated, not exhaustive: size follows how much each piece has to show.
const showcase = [
  { slug: "mesh-gradient-shader", area: "chrome" },
  { slug: "command-palette", area: "command" },
  { slug: "telemetry-card", area: "telemetry" },
  { slug: "ascii-black-hole", area: "hole" },
  { slug: "hold-button", area: "hold" },
  { slug: "segmented-switch", area: "segment" },
  { slug: "infinity-loader", area: "orbit" },
  { slug: "lens-button", area: "lens" },
];
function Showcase() {
  return (
    <div className="bento">
      {showcase.map(({ slug, area }) => (
        <figure className="bento-tile" key={slug} style={{ gridArea: area }} {...cardHandlers(`/docs/${slug}/`)}>
          <Lazy className="bento-live">
            <Demo slug={slug} />
          </Lazy>
          <figcaption>
            <a href={`/docs/${slug}/`}>{catalog.find((c) => c.slug === slug)!.name}</a>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function HomePage() {
  const [copied, copy] = useCopy();
  const command = installCommand("hold-button");
  return (
    <main id="main" tabIndex={-1}>
      <div className="hero">
        <EclipseHero
          title={
            <>
              Components for interfaces that <WordRotator words={["feel alive.", "glow.", "move.", "stick in your head."]} interval={2800} from="#c7d2fe" to="#fde68a" />
            </>
          }
          subtitle="Shaders, ASCII, navigation, inputs, and feedback for React. Install the source with one command, then make it yours."
          actions={
            <>
              <a className="btn" href="/components/">
                Browse components
              </a>
              <a className="btn btn-secondary" href="/docs/">
                Read the docs
              </a>
            </>
          }
        />
      </div>

      <section className="stats-strip shell" aria-label="Forme in numbers">
        <div>
          <strong>
            <NumberTicker value={catalog.length} />
          </strong>
          <span>components, all free</span>
        </div>
        <div>
          <strong>
            <NumberTicker value={catalog.filter((c) => c.traits.includes("zero-deps")).length} />
          </strong>
          <span>with zero dependencies</span>
        </div>
        <div>
          <strong>2</strong>
          <span>frameworks every component is installed into on each change</span>
        </div>
        <div>
          <strong>{medianSize()}</strong>
          <span>median install, gzipped</span>
        </div>
      </section>

      <section className="section shell" aria-labelledby="library-title">
        <header className="section-head">
          <h2 id="library-title">Touch them. They're running.</h2>
          <p>
            A few of the {catalog.length}, all running live in your browser. Every one installs with a single command.
          </p>
        </header>
        <Showcase />
        <nav className="category-links" aria-label="Browse by category">
          {groups.map((g) => (
            <a key={g.slug} href={`/collections/${g.slug}/`}>
              {g.name}
              <span>{catalog.filter((c) => c.category === g.name).length}</span>
            </a>
          ))}
          <a className="category-all" href="/components/">
            View all {catalog.length}
          </a>
        </nav>
      </section>

      <section className="section shell proof" aria-labelledby="proof-title">
        <header className="section-head">
          <h2 id="proof-title">Every badge is a test</h2>
          <p>
            When a component says it respects reduced motion or works from the keyboard, a test reads its source on
            every push and fails the build if that handling is missing. Sizes are measured from the files you install.
          </p>
        </header>
        <div className="proof-table" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">Component</th>
                {proofTraits.map((t) => (
                  <th scope="col" key={t}>
                    {traitInfo[t].label}
                  </th>
                ))}
                <th scope="col">Size</th>
              </tr>
            </thead>
            <tbody>
              {proofRows.map((slug) => {
                const c = catalog.find((item) => item.slug === slug)!;
                return (
                  <tr key={slug}>
                    <th scope="row">
                      <a href={`/docs/${slug}/`}>{c.name}</a>
                    </th>
                    {proofTraits.map((t) => (
                      <td key={t}>
                        {c.traits.includes(t) ? (
                          <span className="yes" aria-label="Yes">
                            <Icon name="check" />
                          </span>
                        ) : (
                          <span className="no" aria-label="Not applicable">
                            –
                          </span>
                        )}
                      </td>
                    ))}
                    <td>{sizeOf(slug)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <a className="link" href="/docs/quality/">
          See the checks for all {catalog.length} components
        </a>
      </section>

      <section className="section shell split" aria-labelledby="free-title">
        <Lazy className="split-media">
          <Demo slug="light-rays-shader" />
        </Lazy>
        <div className="split-text">
          <h2 id="free-title">All of it is free</h2>
          <p>
            Every component, from the buttons to the black hole, with full source under the MIT license. No account and no package to depend on.
          </p>
          <a className="btn btn-secondary" href="/components/">
            Browse components
          </a>
        </div>
      </section>

      <section className="section shell split" aria-labelledby="install-title">
        <div className="split-text">
          <h2 id="install-title">Install the source, not a package</h2>
          <p>
            The shadcn CLI copies TypeScript and scoped CSS into your project. Nothing to keep up to date, nothing to
            fight when you customize.
          </p>
        </div>
        <div className="install-command">
          <Code text={command} />
          <button className="icon-button" onClick={() => copy(command, "Copied install command")} aria-label="Copy install command">
            <Icon name={copied ? "check" : "copy"} />
          </button>
          <span className="sr-only" role="status">
            {copied}
          </span>
        </div>
      </section>
    </main>
  );
}

function PageIntro({ title, text }: { title: string; text: string }) {
  return (
    <header className="page-intro">
      <h1>{title}</h1>
      <p className="lede">{text}</p>
    </header>
  );
}
function LibraryPage({ saved = false, category }: { saved?: boolean; category?: string }) {
  return (
    <main id="main" tabIndex={-1} className="page shell">
      <PageIntro
        title={saved ? "Bookmarks" : category || "Components"}
        text={
          saved
            ? "Components you saved, kept in this browser."
            : `${catalog.length} components for React, all free. Each one installs with a single command.`
        }
      />
      <LibraryBrowser savedOnly={saved} initialCategory={category} />
    </main>
  );
}
function MessagePage({ title, text }: { title: string; text: string }) {
  return (
    <main id="main" tabIndex={-1} className="page shell message-page">
      <h1>{title}</h1>
      <p className="lede">{text}</p>
      <a className="btn" href="/components/">
        Browse components
      </a>
    </main>
  );
}

const normalize = (pathname: string) => pathname.replace(/\/+$/, "") || "/";
const isComponentDoc = (path: string) => catalog.some((c) => path === `/docs/${c.slug}`);

export default function App() {
  const [search, setSearch] = useState(false);
  const [path, setPath] = useState(() => normalize(location.pathname));
  // Internal links change the view without a page load, so the docs sidebar and
  // scroll position survive. Moving between components keeps your place.
  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest?.<HTMLAnchorElement>("a[href]");
      if (!link || link.target || link.hasAttribute("download") || link.origin !== location.origin) return;
      if (/\.\w+$/.test(link.pathname)) return; // Real files such as /registry.json.
      if (link.hash && link.pathname === location.pathname) return; // Same-page anchors.
      event.preventDefault();
      const next = normalize(link.pathname);
      const current = normalize(location.pathname);
      setSearch(false);
      if (next === current && link.search === location.search) return;
      history.pushState(null, "", link.pathname + link.search);
      setPath(next);
      if (isComponentDoc(next) && isComponentDoc(current)) return;
      scrollTo(0, 0);
      requestAnimationFrame(() => document.getElementById("main")?.focus({ preventScroll: true }));
    };
    const pop = () => setPath(normalize(location.pathname));
    document.addEventListener("click", click);
    window.addEventListener("popstate", pop);
    return () => {
      document.removeEventListener("click", click);
      window.removeEventListener("popstate", pop);
    };
  }, []);
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
  const group = groups.find((g) => path === `/collections/${g.slug}`);
  let page;
  if (path === "/") page = <HomePage />;
  else if (["/components", "/studio", "/collections", "/collections/experimental", "/collections/editorial"].includes(path))
    page = <LibraryPage key={path} />;
  else if (path === "/bookmarks") page = <LibraryPage key={path} saved />;
  else if (group) page = <LibraryPage key={path} category={group.name} />;
  else if (["/collections/next", "/collections/object", "/collections/kinetic"].includes(path))
    page = <MessagePage title="More is on the way" text="New components arrive in focused drops. No release date is set yet." />;
  else if (path === "/docs" || path.startsWith("/docs/")) page = <DocsPage slug={path.slice(5).replace(/^\//, "")} />;
  else page = <MessagePage title="Page not found" text="This address doesn't match anything on Forme." />;
  useEffect(() => {
    const component = catalog.find((c) => path === `/docs/${c.slug}`);
    const titles: [boolean, string][] = [
      [!!component, component?.name || ""],
      [path.startsWith("/docs"), "Docs"],
      [path === "/bookmarks", "Bookmarks"],
      [!!group, group?.name || ""],
      [path === "/components", "Components"],
    ];
    document.title = `${titles.find(([match]) => match)?.[1] || "Components for interfaces that feel alive"} – Forme`;
  }, [path, group]);
  return (
    <>
      <Header onSearch={() => setSearch(true)} />
      {page}
      <Footer />
      {search && <SearchDialog close={() => setSearch(false)} />}
      <Toaster />
    </>
  );
}
