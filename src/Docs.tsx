import { useEffect, useRef, useState } from "react";
import { catalog, exportName, componentFiles } from "./catalog";
import { Demo } from "./Demo";
import { Arrow, Code } from "./ui";

const sources = import.meta.glob(
  [
    "./registry/silk-shader.tsx",
    "./registry/dither-shader.tsx",
    "./registry/shader-canvas.{tsx,css}",
    "./registry/prism-button.{tsx,css}",
    "./registry/magnetic-button.{tsx,css}",
    "./registry/ascii-orbit.{tsx,css}",
    "./registry/ascii-image.{tsx,css}",
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
  const defaultColor =
    slug === "dither-shader"
      ? "#c5dacb"
      : slug === "caustic-shader"
        ? "#73d9ed"
        : slug.startsWith("ascii")
          ? "#b7c3df"
          : "#5376ff";
  const [color, setColor] = useState(defaultColor);
  const [speed, setSpeed] = useState(1);
  const [mobile, setMobile] = useState(false);
  const [replay, setReplay] = useState(0);
  const [file, setFile] = useState(`${slug}.tsx`);
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
  const source = sources[`./registry/${file}`];
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
                color={color}
                speed={speed}
              />
            </div>
          </div>
          <div className="workbench-controls">
            {component.category === "Buttons" && (
              <label>
                Button label
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter the experience"
                  maxLength={40}
                />
              </label>
            )}
            {(component.category === "Shaders" ||
              ["ascii-orbit", "ascii-image", "ascii-surface"].includes(
                slug,
              )) && (
              <label className="control-color">
                Color
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </label>
            )}
            {(component.category === "Shaders" ||
              ["ascii-orbit", "ascii-surface"].includes(slug)) && (
              <label className="control-speed">
                Speed / {speed.toFixed(1)}×
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                />
              </label>
            )}
            {["ascii-image"].includes(slug) && (
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
                setColor(defaultColor);
                setSpeed(1);
                setReplay((n) => n + 1);
              }}
            >
              Reset
            </button>
          </div>
          <p className="docs-hint">
            {slug === "silk-shader"
              ? "An ambient animation. Adjust its color and speed; pointer movement leaves it unchanged."
              : component.category === "Shaders"
                ? "Move your pointer across the canvas. Adjust the color and speed to explore."
                : "Hover, focus, or select the preview. Use the controls to make it your own."}
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
            Run this command in a React project with shadcn and import aliases
            configured.
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
              {componentFiles(slug).map((ext) => (
                <button
                  key={ext}
                  onClick={() => setFile(ext)}
                  aria-pressed={file === ext}
                >
                  {ext}
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
        <a className="docs-back" href="/components/">
          <span aria-hidden="true">←</span> Back to Signal
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
            Signal components <span>{catalog.length}</span>
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
          <a href="/registry.json" target="_blank" rel="noreferrer">
            View the public registry <Arrow diagonal />
          </a>
        </div>
      </aside>
      <article className="docs-content">
        <div className="breadcrumbs">
          <a href="/docs/">Documentation</a>
          <span>/</span>
          {component ? "Signal" : "Guides"}
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
              <span>Part of the Signal collection</span>
              <a href="/components/">
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
  const command = `npx shadcn@latest add ${window.location.origin}/r/prism-button.json`;
  if (slug === "theming")
    return (
      <div className="guide-prose">
        <h2>Your palette. Your personality.</h2>
        <p>
          The Forme website opens in dark mode. The theme toggle saves your
          preference in this browser. Installed components have their own styles
          and do not depend on the website’s theme.
        </p>
        <h2>Color and speed</h2>
        <p>
          Shaders accept a six-digit hex color and a speed between 0 and 3.
          Their container controls the size. ASCII orbit, ASCII reveal, and
          ASCII surface also accept a color. Try these controls on the
          component’s Preview tab.
        </p>
        <Code
          text={
            '<div style={{ height: 480 }}>\n  <SilkShader color="#8566ff" speed={0.6} />\n</div>'
          }
        />
        <h2>Typography and button colors</h2>
        <p>
          Buttons inherit your font. Magnetic button exposes two color
          variables. For other changes, edit the component’s scoped CSS file
          directly.
        </p>
        <Code
          text={
            '.contact-action {\n  font-family: "Your brand font", sans-serif;\n  --forme-button-bg: #ecebff;\n  --forme-button-color: #201a40;\n}'
          }
        />
        <h2>Images and text</h2>
        <p>
          ASCII reveal needs your own image URL and descriptive alt text. Use a
          same-origin image or a remote image that permits cross-origin canvas
          access. It shows the photograph if the image cannot be sampled. ASCII
          surface projects a fabric of characters that responds to movement and
          ripples.
        </p>
      </div>
    );
  if (slug === "accessibility")
    return (
      <div className="guide-prose">
        <h2>Motion with good manners.</h2>
        <p>
          Shaders render a still frame for the operating system’s reduced-motion
          preference. ASCII orbit and ASCII surface become still, and button
          movement switches off. The previews remain usable.
        </p>
        <h2>Pause, keyboard, and touch</h2>
        <p>
          ASCII orbit and ASCII surface include pause controls. Shaders and
          animated ASCII pieces stop rendering when offscreen or in a hidden
          tab. Buttons use native button elements with focus and disabled
          states. Magnetic attraction runs only for a mouse pointer.
        </p>
        <p>
          ASCII reveal supports a centered reveal through click, tap, Enter, or
          Space. Its canvas is decorative; the photograph keeps your alt text.
          ASCII surface supports a ripple through click, tap, Enter, or Space,
          and has a pause control. Silk field is ambient and does not react to
          the pointer.
        </p>
        <h2>Canvas support</h2>
        <p>
          Shaders require WebGL. A static gradient appears if WebGL is
          unavailable or its context is lost. The runtime recreates the shader
          after context restoration. Keep essential content outside a decorative
          canvas.
        </p>
        <h2>Before using it in a client project</h2>
        <p>
          Test your content with a keyboard, supply useful image descriptions,
          and check contrast after recoloring. Review mobile behavior and the
          final page with reduced motion enabled. These previews are checked in
          Chromium; test your project’s other target browsers too.
        </p>
      </div>
    );
  if (slug === "registry")
    return (
      <div className="guide-prose">
        <h2>Install source. Keep control.</h2>
        <p>
          The public registry contains six free components. The three Studio
          previews are excluded. The CLI copies TypeScript and scoped CSS into
          your configured components directory. There is no Forme runtime
          package.
        </p>
        <h2>Install a component</h2>
        <Code text={command} />
        <p>
          Run this in a React project with a shadcn components.json and import
          aliases already configured. Magnetic button also installs Motion. All
          other current components use browser APIs and React.
        </p>
        <h2>What goes into your project</h2>
        <Code
          text={
            "components/forme/\n  prism-button.tsx\n  prism-button.css\n\n# Shader components also include:\n  shader-canvas.tsx\n  shader-canvas.css"
          }
        />
        <p>
          The destination follows the components alias in your components.json.
          Shaders share one canvas runtime; keep it beside the shader component.
        </p>
        <h2>Copy manually</h2>
        <p>
          Open the Source tab and copy every listed file into the same folder.
          Keep relative imports intact. For shaders, include the shared
          TypeScript runtime and its CSS, as well as the shader file. Install
          motion if the component imports motion/react.
        </p>
        <h2>Preview and Studio access</h2>
        <p>
          Working Studio demos are public. Their editable source is reserved for
          the planned paid edition. Purchasing and customer downloads are not
          open yet.
        </p>
      </div>
    );
  return (
    <div className="guide-prose">
      <h2>Start with a little unexpected.</h2>
      <p>
        Signal is Forme’s first drop: three buttons, three shaders, and three
        ASCII experiments. Six include installable source. Three are Studio
        previews, with paid access coming later.
      </p>
      <h2>Add your first component</h2>
      <p>In a React project with shadcn and import aliases configured, run:</p>
      <Code text={command} />
      <h2>Connect it to your project</h2>
      <Code
        text={
          'import { PrismButton } from "@/components/forme/prism-button"\n\nexport function ContactButton() {\n  return (\n    <PrismButton onClick={() => console.log("Connect your action")}>\n      Start a conversation\n    </PrismButton>\n  )\n}'
        }
      />
      <p>
        The stylesheet is imported by the component. Demo fonts and photography
        are not installed. Replace image paths with your own assets. Components
        that need browser APIs include a use client directive for React
        frameworks that use server components.
      </p>
      <a className="button" href="/docs/prism-button/">
        Try Prism button
        <Arrow />
      </a>
      <h2>Explore before you install</h2>
      <p>
        Each component has Preview, Usage, and Source tabs. Change shader colors
        and speed, try a button label, and switch to a narrow preview. You can
        save components to Bookmarks in this browser.
      </p>
      <div className="guide-note">
        Studio purchasing is coming later. Pricing, commercial terms, and
        customer source access will be announced before the paid launch.
      </div>
    </div>
  );
}
