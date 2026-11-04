import { useEffect, useState } from "react";
import { catalog, freeCount, studioCount, traitInfo, type Trait } from "./catalog";
import { StudioPreview } from "./Demo";
import { HorizonShader } from "./registry/horizon-shader";
import { LibraryBrowser } from "./Library";
import { SearchDialog } from "./SearchDialog";
import { DocsPage } from "./Docs";
import { Code, Footer, Header, Icon, Lazy, installCommand, sizeOf, useCopy } from "./ui";

const groups = [
  { name: "Buttons", slug: "buttons" },
  { name: "Shaders", slug: "shaders" },
  { name: "ASCII", slug: "ascii" },
  { name: "HUD", slug: "hud" },
  { name: "Surfaces", slug: "surfaces" },
  { name: "Inputs", slug: "inputs" },
  { name: "Loaders", slug: "loaders" },
];
const proofRows = ["hold-button", "ascii-globe", "chrome-shader", "radar-sweep", "lens-button", "telemetry-card"];
const proofTraits: Trait[] = ["reduced-motion", "keyboard", "offscreen-pause", "zero-deps"];

function Stage() {
  return (
    <div className="stage">
      <div className="stage-frame">
        <HorizonShader speed={0.8} />
      </div>
    </div>
  );
}

function HomePage() {
  const [copied, copy] = useCopy();
  const command = installCommand("hold-button");
  return (
    <main id="main">
      <section className="hero shell">
        <div className="hero-top">
          <h1>Components for interfaces that feel alive.</h1>
          <div className="hero-side">
            <p className="lede">
              Shaders, ASCII, instruments, inputs, and loaders for React. Install the source with one command, then make
              it yours.
            </p>
            <div className="actions">
              <a className="btn" href="/components/">
                Browse components
              </a>
              <a className="btn btn-secondary" href="/docs/">
                Read the docs
              </a>
            </div>
          </div>
        </div>
        <Stage />
      </section>

      <section className="section shell" aria-labelledby="library-title">
        <header className="section-head">
          <h2 id="library-title">The library</h2>
          <p>
            {catalog.length} components, from shaders and ASCII to inputs and loaders. {freeCount} are free to install.
          </p>
        </header>
        <LibraryBrowser embedded />
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

      <section className="section shell split" aria-labelledby="studio-title">
        <Lazy className="split-media">
          <StudioPreview slug="singularity-shader" />
        </Lazy>
        <div className="split-text">
          <h2 id="studio-title">Studio</h2>
          <p>
            {studioCount} heavier pieces, including a black hole drawn in dense ASCII, a cinematic singularity, and an orbital gauge. You can
            watch recordings of them today. Pricing and source access will be announced before the paid launch.
          </p>
          <a className="btn btn-secondary" href="/studio/">
            See Studio
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
    <main id="main" className="page shell">
      <PageIntro
        title={saved ? "Bookmarks" : category || "Components"}
        text={
          saved
            ? "Components you saved, kept in this browser."
            : `${catalog.length} components for React. ${freeCount} install with one command; Studio pieces are shown as recordings.`
        }
      />
      <LibraryBrowser savedOnly={saved} initialCategory={category} />
    </main>
  );
}
function StudioPage() {
  return (
    <main id="main" className="page shell">
      <PageIntro
        title="Studio"
        text="Our most involved pieces. These previews are recordings of the real components, made by a deterministic capture script. Source access comes with the paid edition."
      />
      <p className="notice">Studio isn't on sale yet. Pricing, terms, and source access will be announced before launch.</p>
      <LibraryBrowser studioOnly />
    </main>
  );
}
function MessagePage({ title, text }: { title: string; text: string }) {
  return (
    <main id="main" className="page shell message-page">
      <h1>{title}</h1>
      <p className="lede">{text}</p>
      <a className="btn" href="/components/">
        Browse components
      </a>
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
  const group = groups.find((g) => path === `/collections/${g.slug}`);
  let page;
  if (path === "/") page = <HomePage />;
  else if (["/components", "/collections", "/collections/experimental", "/collections/editorial"].includes(path))
    page = <LibraryPage />;
  else if (path === "/bookmarks") page = <LibraryPage saved />;
  else if (group) page = <LibraryPage category={group.name} />;
  else if (path === "/studio") page = <StudioPage />;
  else if (["/collections/next", "/collections/object", "/collections/kinetic"].includes(path))
    page = <MessagePage title="More is on the way" text="New components arrive in focused drops. No release date is set yet." />;
  else if (path === "/docs" || path.startsWith("/docs/")) page = <DocsPage slug={path.slice(5).replace(/^\//, "")} />;
  else page = <MessagePage title="Page not found" text="This address doesn't match anything on Forme." />;
  useEffect(() => {
    const component = catalog.find((c) => path === `/docs/${c.slug}`);
    const titles: [boolean, string][] = [
      [!!component, component?.name || ""],
      [path === "/studio", "Studio"],
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
    </>
  );
}
