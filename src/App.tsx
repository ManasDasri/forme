import { useEffect, useState } from "react";
import { catalog, code, freeCount, studioCount, type Trait } from "./catalog";
import { Demo, StudioPreview } from "./Demo";
import { HorizonShader } from "./registry/horizon-shader";
import { AsciiDecode } from "./registry/ascii-decode";
import { LibraryBrowser } from "./Library";
import { SearchDialog } from "./SearchDialog";
import { DocsPage } from "./Docs";
import { Arrow, Code, Footer, Header, Icon, Lazy, installCommand, medianSize, useCopy } from "./ui";

const groups = [
  { name: "Buttons", slug: "buttons", demo: "glitch-button", line: "Actions with a pulse. Hold, tear, charge, decode." },
  { name: "Shaders", slug: "shaders", demo: "hologram-shader", line: "Light you can steer. One tiny WebGL runtime." },
  { name: "ASCII", slug: "ascii", demo: "ascii-globe", line: "Worlds built out of characters." },
  { name: "HUD", slug: "hud", demo: "radar-sweep", line: "Instruments for interfaces that feel alive." },
];
const count = (trait: Trait) => catalog.filter((c) => c.traits.includes(trait)).length;

function Channels() {
  return (
    <div className="channel-grid">
      {groups.map((group, i) => (
        <a className="channel" key={group.slug} href={`/collections/${group.slug}/`}>
          <Lazy className="channel-preview">
            <Demo slug={group.demo} />
          </Lazy>
          <div className="channel-meta">
            <span className="label">CH-0{i + 1}</span>
            <h3>{group.name}</h3>
            <span className="channel-count">
              {catalog.filter((c) => c.category === group.name).length} pieces <Arrow diagonal />
            </span>
            <p>{group.line}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
function HomePage() {
  const [copied, copy] = useCopy();
  const command = installCommand("hold-button");
  return (
    <main id="main" className="home">
      <section className="hero">
        <div className="hero-shader" aria-hidden="true">
          <HorizonShader speed={0.6} />
        </div>
        <div className="hero-hud shell" aria-hidden="true">
          <span>LAT 37.77 / LON -122.41</span>
          <span>FREQ 01 · DROP SIGNAL</span>
        </div>
        <div className="hero-content shell">
          <a className="pill" href="/components/">
            <i /> Signal · Drop 01 · {catalog.length} components
            <Arrow />
          </a>
          <AsciiDecode as="h1" text="Interfaces from the near future." duration={1400} />
          <p>
            Shaders, HUD instruments, ASCII worlds, and buttons that react. React components with source you install and
            own. Every accessibility badge is checked against the code on every push.
          </p>
          <div className="hero-actions">
            <a className="btn" href="/components/">
              Enter the library <Arrow />
            </a>
            <a className="btn btn-ghost" href="/docs/quality/">
              How we verify
            </a>
          </div>
          <dl className="hero-stats">
            <div>
              <dt>Components</dt>
              <dd>{catalog.length}</dd>
            </div>
            <div>
              <dt>Free source</dt>
              <dd>{freeCount}</dd>
            </div>
            <div>
              <dt>Studio</dt>
              <dd>{studioCount}</dd>
            </div>
            <div>
              <dt>Median size</dt>
              <dd>{medianSize()}</dd>
            </div>
          </dl>
        </div>
      </section>
      <div className="ticker" aria-hidden="true">
        <div>
          {[0, 1].map((copyIndex) => (
            <span key={copyIndex}>
              {catalog.map((c) => (
                <span key={c.slug}>
                  <b>{code(c.slug)}</b> {c.name}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <section className="section shell" aria-labelledby="live-title">
        <div className="section-head">
          <div>
            <p className="label">// Live index</p>
            <h2 id="live-title">Touch everything.</h2>
          </div>
          <p>Free previews run live in your browser. Studio previews are recordings, so their source never ships here.</p>
        </div>
        <LibraryBrowser embedded />
      </section>
      <section className="section shell" aria-labelledby="channels-title">
        <div className="section-head">
          <div>
            <p className="label">// Channels</p>
            <h2 id="channels-title">Four frequencies.</h2>
          </div>
          <a className="text-link" href="/collections/">
            All channels <Arrow diagonal />
          </a>
        </div>
        <Channels />
      </section>
      <section className="section shell" aria-labelledby="proof-title">
        <div className="section-head">
          <div>
            <p className="label">// The edge</p>
            <h2 id="proof-title">Proof, not promises.</h2>
          </div>
          <p>
            Effects are easy to find. Effects you can ship to a client are not. Each number below comes from the code and
            is enforced by tests that run in CI.
          </p>
        </div>
        <div className="proof-grid">
          <div>
            <strong>
              {count("reduced-motion")}/{catalog.length}
            </strong>
            <span>handle prefers-reduced-motion</span>
          </div>
          <div>
            <strong>{count("offscreen-pause")}</strong>
            <span>render loops, and every one stops offscreen and in hidden tabs</span>
          </div>
          <div>
            <strong>
              {count("zero-deps")}/{catalog.length}
            </strong>
            <span>import nothing beyond React and their own files</span>
          </div>
          <div>
            <strong>{medianSize()}</strong>
            <span>median install size, gzipped, measured at build</span>
          </div>
        </div>
        <a className="text-link" href="/docs/quality/">
          See every check, per component <Arrow diagonal />
        </a>
      </section>
      <section className="studio-band shell" aria-labelledby="studio-title">
        <Lazy className="studio-band-preview">
          <StudioPreview slug="singularity-shader" />
        </Lazy>
        <div>
          <p className="label">// Studio</p>
          <h2 id="studio-title">The deep end.</h2>
          <p>
            {studioCount} heavier pieces, including a black hole, a holographic card, and an endless ASCII tunnel. Watch the
            recordings now. Source access and pricing will be announced before the paid launch.
          </p>
          <a className="btn btn-ghost" href="/studio/">
            Explore Studio <Arrow />
          </a>
        </div>
      </section>
      <section className="install-band shell" aria-labelledby="install-title">
        <div>
          <p className="label">// Install</p>
          <h2 id="install-title">One command. Your source.</h2>
          <p>The shadcn CLI copies TypeScript and scoped CSS into your project. There is no Forme package to depend on.</p>
        </div>
        <div className="install-command">
          <Code text={command} />
          <button className="icon-button" onClick={() => copy(command, "Install command copied")} aria-label="Copy install command">
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
function PageIntro({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="page-intro">
      <p className="label">{label}</p>
      <AsciiDecode as="h1" text={title} />
      <p>{text}</p>
    </div>
  );
}
function LibraryPage({ saved = false, category }: { saved?: boolean; category?: string }) {
  return (
    <main id="main" className="page shell">
      <PageIntro
        label={saved ? "// Bookmarks" : category ? `// Channel / ${category}` : "// Library"}
        title={saved ? "Saved signals." : category ? `${category}.` : "The full signal."}
        text={
          saved
            ? "Your collection, kept in this browser."
            : `${catalog.length} components across four channels. Free pieces install with one command; Studio pieces are recorded previews.`
        }
      />
      <LibraryBrowser savedOnly={saved} initialCategory={category} />
    </main>
  );
}
function ChannelsPage() {
  return (
    <main id="main" className="page shell">
      <PageIntro
        label="// Channels"
        title="Four frequencies."
        text="Buttons with presence. Shaders with a life of their own. ASCII beyond the terminal. Instruments for the HUD."
      />
      <Channels />
      <a className="next-banner" href="/collections/next/">
        <div>
          <p className="label">// Next transmission</p>
          <h2>More experiments are taking shape.</h2>
          <p>New drops over time. No release date announced.</p>
        </div>
        <Arrow diagonal />
      </a>
    </main>
  );
}
function StudioPage() {
  return (
    <main id="main" className="page shell">
      <PageIntro
        label="// Studio"
        title="The deep end."
        text="Our most expressive pieces. Recorded so you can see them move; source and interactive builds arrive with the paid edition."
      />
      <div className="notice">
        <i aria-hidden="true" />
        <p>
          Studio purchasing is not open yet. Pricing, commercial terms, and source access will be announced before launch.
          The recordings are made by a deterministic capture script from the real components.
        </p>
      </div>
      <LibraryBrowser studioOnly />
    </main>
  );
}
function NextDropPage() {
  return (
    <main id="main" className="page next-page shell">
      <span className="next-orbit" aria-hidden="true" />
      <p className="label">// Incoming</p>
      <AsciiDecode as="h1" text="Another signal is out there." />
      <p>We are exploring what comes next for shaders, HUD, ASCII, and buttons. No release date announced.</p>
      <a className="btn" href="/components/">
        Explore Drop 01 <Arrow />
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
  else if (["/components", "/collections/experimental", "/collections/editorial"].includes(path)) page = <LibraryPage />;
  else if (path === "/bookmarks") page = <LibraryPage saved />;
  else if (path === "/collections") page = <ChannelsPage />;
  else if (group) page = <LibraryPage category={group.name} />;
  else if (path === "/studio") page = <StudioPage />;
  else if (["/collections/next", "/collections/object", "/collections/kinetic"].includes(path)) page = <NextDropPage />;
  else if (path === "/docs" || path.startsWith("/docs/")) page = <DocsPage slug={path.slice(5).replace(/^\//, "")} />;
  else
    page = (
      <main id="main" className="page next-page shell">
        <p className="label">// 404</p>
        <AsciiDecode as="h1" text="Signal lost." />
        <p>This page is not part of the current drop.</p>
        <a className="btn" href="/components/">
          Back to the library <Arrow />
        </a>
      </main>
    );
  useEffect(() => {
    const component = catalog.find((c) => path === `/docs/${c.slug}`);
    const titles: [boolean, string][] = [
      [!!component, component?.name || ""],
      [path === "/studio", "Studio"],
      [path.startsWith("/docs"), "Documentation"],
      [path === "/bookmarks", "Bookmarks"],
      [path.startsWith("/collections"), "Channels"],
      [path === "/components", "Library"],
    ];
    document.title = `${titles.find(([match]) => match)?.[1] || "Interfaces from the near future"} — Forme`;
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
