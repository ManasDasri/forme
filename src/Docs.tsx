import { useEffect, useRef, useState } from "react";
import { catalog, exportName } from "./catalog";
import { Demo } from "./Demo";
import { Arrow, Code, repo } from "./ui";

const sources = import.meta.glob(
  [
    "./registry/project-index.{tsx,css}",
    "./registry/expanding-gallery.{tsx,css}",
    "./registry/focus-cursor.{tsx,css}",
    "./registry/magnetic-button.{tsx,css}",
    "./registry/image-reveal.{tsx,css}",
    "./registry/image-compare.{tsx,css}",
  ],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;
const guides = [
  { slug: "", title: "Getting started" },
  { slug: "theming", title: "Theming & customization" },
  { slug: "accessibility", title: "Motion & accessibility" },
  { slug: "registry", title: "Using the registry" },
];

export function Workbench({ slug }: { slug: string }) {
  const [tab, setTab] = useState(
    new URLSearchParams(location.search).get("view") === "source"
      ? "source"
      : "preview",
  );
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("/images/interior.jpg");
  const [customImage, setCustomImage] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [replay, setReplay] = useState(0);
  const [file, setFile] = useState("tsx");
  const [copied, setCopied] = useState("");
  const component = catalog.find((c) => c.slug === slug)!;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
    } catch {
      setCopied("Select the code and copy it manually.");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(""), 2500);
  }
  const source = sources[`./registry/${slug}.${file}`];
  const studio = component.access === "studio";
  return (
    <div className="workbench">
      <div className="workbench-toolbar">
        <div className="segmented" role="group" aria-label="Component view">
          {["preview", "usage", "source"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                history.replaceState(
                  null,
                  "",
                  `${location.pathname}${t === "source" ? "?view=source" : ""}`,
                );
              }}
              aria-pressed={tab === t}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {tab === "preview" && (
          <div className="preview-actions">
            <button onClick={() => setMobile(!mobile)} aria-pressed={mobile}>
              {mobile ? "Mobile" : "Desktop"} <span aria-hidden="true">▤</span>
            </button>
            <button
              onClick={() => setReplay((n) => n + 1)}
              aria-label="Replay component animation"
            >
              ↻ Replay
            </button>
          </div>
        )}
      </div>
      {tab === "preview" && (
        <>
          <div className="workbench-canvas">
            <div
              className={`workbench-stage${mobile ? " viewport-mobile" : ""}`}
              key={replay}
            >
              <Demo
                slug={slug}
                title={title}
                expanded
                image={customImage ? image : undefined}
              />
            </div>
          </div>
          <div className="workbench-controls">
            <label>
              Make it your own
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Try a title, a label, a different point of view…"
                maxLength={80}
              />
            </label>
            {[
              "image-compare",
              "project-index",
              "image-reveal",
              "focus-cursor",
            ].includes(slug) && (
              <label>
                Image
                <select
                  value={customImage ? image : ""}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setCustomImage(true);
                  }}
                >
                  <option value="" disabled>
                    Original image
                  </option>
                  <option value="/images/interior.jpg">Interior</option>
                  <option value="/images/architecture.jpg">Architecture</option>
                  <option value="/images/landscape.jpg">Landscape</option>
                </select>
              </label>
            )}
            <button
              className="reset-control"
              onClick={() => {
                setTitle("");
                setCustomImage(false);
                setMobile(false);
                setReplay((n) => n + 1);
              }}
            >
              Reset
            </button>
          </div>
          <p className="docs-hint">
            Interact with the preview. Fictional brands and example photography
            are for demonstration.
          </p>
        </>
      )}
      {tab === "usage" && studio && (
        <div className="studio-gate">
          <span className="studio-emblem" aria-hidden="true">
            ✳
          </span>
          <h2>Part of Forme Studio.</h2>
          <p>
            This composition is planned for the paid Studio edition. Explore the
            working preview now; purchase and editable source access are not
            open yet.
          </p>
          <h3>Props & behavior</h3>
          <p>{component.props}</p>
          <a className="button" href="/studio/">
            Meet the Studio edition <Arrow />
          </a>
        </div>
      )}
      {tab === "usage" && !studio && (
        <div className="usage-panel">
          <h2>Install the component</h2>
          <p>
            Run the local Forme preview, then use the CLI in your configured
            React project.
          </p>
          <div className="code-toolbar">
            <span>Terminal</span>
            <button
              onClick={() =>
                copy(
                  `npx shadcn@latest add ${window.location.origin.replace(/\/$/, "")}/r/${slug}.json`,
                  "Install command copied",
                )
              }
            >
              Copy command
            </button>
          </div>
          <Code
            text={`npx shadcn@latest add ${window.location.origin.replace(/\/$/, "")}/r/${slug}.json`}
          />
          <h2>Use it in your project</h2>
          <Code
            text={`import { ${exportName(slug)} } from "@/components/forme/${slug}"\n\n${component.usage}`}
          />
          <h2>Props & behavior</h2>
          <p>{component.props}</p>
          <div className="guide-note">
            The stylesheet is imported by the component. Replace example image
            paths with your own assets. No showcase fonts or photos are added to
            your project.
          </div>
        </div>
      )}
      {tab === "source" && studio && (
        <div className="studio-gate">
          <span className="studio-emblem" aria-hidden="true">
            ✳
          </span>
          <h2>A little more, for your studio.</h2>
          <p>
            Editable source for this component is reserved for the planned paid
            edition. Public demos are available; checkout and customer access
            are coming later.
          </p>
          <a className="button" href="/studio/">
            Explore Forme Studio <Arrow />
          </a>
          <button className="quiet-button" onClick={() => setTab("preview")}>
            Back to the live preview
          </button>
        </div>
      )}
      {tab === "source" && !studio && (
        <>
          <div className="code-toolbar">
            <div className="file-tabs" role="group" aria-label="Source file">
              {["tsx", "css"].map((ext) => (
                <button
                  key={ext}
                  onClick={() => setFile(ext)}
                  aria-pressed={file === ext}
                >
                  {slug}.{ext}
                </button>
              ))}
            </div>
            <button onClick={() => copy(source, "Source copied")}>
              Copy source
            </button>
          </div>
          <Code text={source} />
        </>
      )}
      <p className="copy-status" role="status">
        {copied}
      </p>
    </div>
  );
}

export function DocsPage({ slug }: { slug: string }) {
  const component = catalog.find((c) => c.slug === slug);
  const guide = guides.find((g) => g.slug === slug);
  return (
    <main id="main" className="docs-layout shell">
      <aside className="docs-sidebar">
        <a className="docs-back" href="/collections/editorial/">
          <span aria-hidden="true">←</span> Back to Editorial
        </a>
        <nav aria-label="Documentation">
          <p>Start here</p>
          {guides.map((g) => (
            <a
              key={g.slug}
              href={`/docs/${g.slug ? g.slug + "/" : ""}`}
              aria-current={slug === g.slug ? "page" : undefined}
            >
              {g.title}
            </a>
          ))}
          <p>
            Editorial components <span>{catalog.length}</span>
          </p>
          {catalog.map((c) => (
            <a
              key={c.slug}
              href={`/docs/${c.slug}/`}
              aria-current={slug === c.slug ? "page" : undefined}
            >
              {c.name}
              <span>{c.category}</span>
            </a>
          ))}
        </nav>
        <div className="docs-sidebar-note">
          <span className="status-dot" /> Development preview
          <a href={repo} target="_blank" rel="noreferrer">
            View source on GitHub <Arrow diagonal />
          </a>
        </div>
      </aside>
      <article className="docs-content">
        <div className="breadcrumbs">
          <a href="/docs/">Documentation</a>
          <span>/</span>
          {component ? "Editorial" : "Guides"}
        </div>
        <header className="docs-page-heading">
          <h1>{component?.name || guide?.title || "Page not found"}</h1>
          <p>
            {component?.description ||
              (guide
                ? "A considered starting point. Make the rest your own."
                : "This page is not part of the collection. Choose a guide from the navigation.")}
          </p>
        </header>
        {component ? (
          <>
            <Workbench key={slug} slug={slug} />
            <div className="component-doc-footer">
              <span>Part of the Editorial collection</span>
              <a href="/collections/editorial/">
                Explore all nine <Arrow />
              </a>
            </div>
          </>
        ) : guide ? (
          <Guide slug={slug} />
        ) : (
          <a className="button" href="/docs/">
            Open documentation
          </a>
        )}
      </article>
    </main>
  );
}

function Guide({ slug }: { slug: string }) {
  if (slug === "theming")
    return (
      <div className="guide-prose">
        <h2>A canvas for your own identity.</h2>
        <p>
          The Forme showcase follows your system theme on first visit. Use the
          sun or moon in the header to choose a theme; your preference is saved
          locally and shared across pages.
        </p>
        <h2>Bring your own typography</h2>
        <p>
          Components inherit the surrounding font where possible. Use a
          consistent brand typeface across the assembled experience. Set your
          font at the app root or override the component’s scoped class in your
          own stylesheet.
        </p>
        <Code
          text={`.my-project {\n  font-family: "Your brand font", sans-serif;\n}\n\n.forme-index {\n  background: #e2e7df;\n  color: #17231c;\n}`}
        />
        <h2>Use component color tokens</h2>
        <p>
          New components expose CSS variables for their main surfaces. Set these
          on a wrapper or theme root. The component CSS files are editable
          source, so every remaining color is yours to change.
        </p>
        <Code
          text={`[data-theme="dark"] {\n  --forme-button-bg: #e2e9d5;\n  --forme-button-color: #243327;\n  --forme-case-bg: #17191b;\n  --forme-case-ink: #edf0eb;\n  --forme-reel-bg: #24272a;\n  --forme-reel-ink: #e6eae8;\n}`}
        />
        <h2>Content and imagery</h2>
        <p>
          Pass your own title, descriptions, alt text, and image URLs through
          props. Multi-image components accept arrays of items. The interactive
          preview on each component page lets you try text and test the layout
          at a narrower width.
        </p>
      </div>
    );
  if (slug === "accessibility")
    return (
      <div className="guide-prose">
        <h2>Motion with good manners.</h2>
        <p>
          All animated pieces consult the operating system’s reduced-motion
          preference. Pointer attraction and layout movement switch off; image
          changes and state changes remain usable. No component needs an
          animation to communicate its state.
        </p>
        <h2>Keyboard and touch</h2>
        <p>
          Interactive controls use native buttons and links. Tab to a control
          and use Enter or Space to activate a button. Preview navigation uses a
          native dialog for focus trapping and Escape. Gallery and accordion
          controls expose their selected or expanded states.
        </p>
        <h2>The cursor stays yours</h2>
        <p>
          Focus cursor adds a local lens inside one image. It preserves the
          native pointer and offers a centered lens that can be pinned with
          keyboard or touch. Magnetic button behaves as a regular button on
          touch screens.
        </p>
        <h2>Respect the user’s preference in your app</h2>
        <Code
          text={`import { MotionConfig } from "motion/react"\n\n<MotionConfig reducedMotion="user">\n  <YourApp />\n</MotionConfig>`}
        />
        <h2>Before shipping a client project</h2>
        <p>
          Supply descriptive alt text, test the final content at mobile widths,
          check text contrast after recoloring, and walk through the page with a
          keyboard. Independent component support does not replace checking the
          assembled website.
        </p>
        <div className="guide-note">
          The collection has been checked in Chromium. Broader browser and
          assistive technology testing is still part of the commercial release
          process.
        </div>
      </div>
    );
  if (slug === "registry")
    return (
      <div className="guide-prose">
        <h2>Install source. Keep control.</h2>
        <p>
          The public registry contains six free-preview pieces. Three Studio
          compositions are intentionally excluded. The registry adds the
          selected TypeScript component and its CSS to your project. Motion is
          installed where required. It follows your configured components alias;
          it does not require a runtime Forme package.
        </p>
        <h2>Generate and serve the registry</h2>
        <Code
          text={`# In the Forme repository\nnpm run build\nnpm run dev\n\n# In your configured React project\nnpx shadcn@latest add ${window.location.origin.replace(/\/$/, "")}/r/magnetic-button.json`}
        />
        <h2>What goes into your project</h2>
        <Code
          text={`src/components/forme/\n  magnetic-button.tsx\n  magnetic-button.css`}
        />
        <p>
          The exact destination depends on the components alias in your
          components.json. Registry target placeholders preserve that
          configuration.
        </p>
        <h2>Hosting the registry</h2>
        <p>
          Build output includes the registry at /r/ and its manifest at
          /registry.json. Once a public deployment is available, replace the
          localhost origin in install commands with that deployment’s origin.
        </p>
        <div className="guide-note">
          The GitHub repository is private. The public demo distributes only the
          free-preview registry. Hosted CLI installation will be enabled when
          the registry is published publicly. This update is prepared locally
          for review.
        </div>
        <h2>Copy manually</h2>
        <p>
          Open any component’s Source tab and copy both the TypeScript and CSS
          files into the same directory. Keep the stylesheet import intact.
          Install motion if the component imports motion/react.
        </p>
      </div>
    );
  return (
    <div className="guide-prose">
      <h2>Start with an interaction.</h2>
      <p>
        Editorial is a collection of nine React components for brand websites:
        expressive typography, image interactions, navigation, buttons, cursors,
        and layouts. The free pieces include editable TypeScript and scoped CSS;
        Studio compositions have working previews.
      </p>
      <div className="guide-note">
        This is a development preview. Checkout, customer entitlements, and
        commercial licensing are planned before the public launch.
      </div>
      <h2>Add your first component</h2>
      <p>
        In a React project that already has a shadcn components.json and import
        aliases configured, run:
      </p>
      <Code
        text={`npx shadcn@latest add ${window.location.origin.replace(/\/$/, "")}/r/magnetic-button.json`}
      />
      <p>
        The generated registry is checked into the repository. If you change
        component source locally, run npm run build to refresh it.
      </p>
      <h2>Use it</h2>
      <Code
        text={`import { MagneticButton } from "@/components/forme/magnetic-button"\n\nexport function ContactButton() {\n  return (\n    <MagneticButton onClick={() => console.log("Connect your action")}>\n      Start a conversation\n    </MagneticButton>\n  )\n}`}
      />
      <h2>Your project, your source</h2>
      <p>
        The component imports its CSS automatically. Fonts and demo photos are
        not installed. Open an individual component’s Usage tab for its props
        and a complete example.
      </p>
      <a className="button" href="/docs/magnetic-button/">
        Try magnetic button <Arrow />
      </a>
      <h2>For contributors: run Forme locally</h2>
      <p>
        You need Node.js 22.12+ or 24+, npm, and access to the private
        repository.
      </p>
      <Code text={`git clone ${repo}.git\ncd forme\nnpm ci\nnpm run dev`} />
      <h2>Prefer to copy and paste?</h2>
      <p>
        The six free-preview component pages include TypeScript and CSS in their
        Source tabs. Three Studio compositions have public demos; their editable
        source is reserved for the planned paid edition. Copy both files into
        the same folder, then install motion for components that use it.
      </p>
    </div>
  );
}
