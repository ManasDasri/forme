import { useEffect, useState } from "react";
import { catalog, exportName, traitInfo, type Trait } from "./catalog";
import { Demo } from "./Demo";
import { Code, Icon, Traits, installCommand, sizeOf, useCopy } from "./ui";
import registry from "../registry.json";

const sources = import.meta.glob("./registry/*.{tsx,css}", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;
const filesOf = (slug: string) =>
  registry.items.find((i) => i.name === slug)!.files.map((f) => f.path.split("/").pop()!);
/** A paste-ready brief for a coding agent, built from the same data as the docs. */
const agentPrompt = (slug: string) => {
  const c = catalog.find((item) => item.slug === slug)!;
  return `Add the Forme ${c.name} component to this React project.

1. Install the source (TypeScript and scoped CSS, no Forme package):
   ${installCommand(slug)}
   If components.json is missing, create one first: https://forme.vercel.app/docs/registry/

2. Import and use it:
   import { ${exportName(slug)} } from "@/components/forme/${slug}"

   ${c.usage.replace(/\n/g, "\n   ")}

Behavior: ${c.props}

Keep the installed files together, since they import each other. Connect any placeholder handlers to real actions.`;
};
const guides = [
  { slug: "", title: "Getting started" },
  { slug: "quality", title: "How we verify" },
  { slug: "theming", title: "Theming" },
  { slug: "accessibility", title: "Motion & accessibility" },
  { slug: "registry", title: "Using the registry" },
];

function Source({ slug, copy }: { slug: string; copy: (text: string, label: string) => void }) {
  const files = filesOf(slug);
  const [file, setFile] = useState(files[0]);
  const [text, setText] = useState("");
  useEffect(() => {
    let current = true;
    sources[`./registry/${file}`]?.().then((value) => current && setText(value));
    return () => {
      current = false;
    };
  }, [file]);
  return (
    <>
      <div className="code-toolbar">
        <div className="file-tabs" role="group" aria-label="Source file">
          {files.map((name) => (
            <button key={name} onClick={() => setFile(name)} aria-pressed={file === name}>
              {name}
            </button>
          ))}
        </div>
        <button onClick={() => copy(text, `${file} copied`)}>
          <Icon name="copy" /> Copy
        </button>
      </div>
      <Code text={text || "Loading…"} />
    </>
  );
}

export function Workbench({ slug }: { slug: string }) {
  const component = catalog.find((c) => c.slug === slug)!;
  const [tab, setTab] = useState(
    new URLSearchParams(location.search).get("view") === "source" ? "source" : "preview",
  );
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [color, setColor] = useState(component.color);
  const [speed, setSpeed] = useState(1);
  const [mobile, setMobile] = useState(false);
  const [light, setLight] = useState(false);
  const [replay, setReplay] = useState(0);
  const [copied, copy] = useCopy();
  const tabs = ["preview", "usage", "source"];
  // The snippet follows the playground, so what you tune is what you copy.
  let snippet = component.usage
    .replace(/color="#[0-9a-f]{6}"/i, `color="${color}"`)
    .replace(/speed=\{[\d.]+\}/, `speed={${speed}}`);
  if (component.text && title) snippet = snippet.replace(component.text, title);
  return (
    <div className="workbench">
      <div className="workbench-toolbar">
        <div className="segmented" role="group" aria-label="Component view">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                history.replaceState(null, "", `${location.pathname}${t === "source" ? "?view=source" : ""}`);
              }}
              aria-pressed={tab === t}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="workbench-actions">
          <button className="btn btn-secondary btn-small" onClick={() => copy(agentPrompt(slug), "Copied prompt for your coding agent")}>
            <Icon name="copy" /> Copy prompt
          </button>
        {tab === "preview" && (
          <div className="segmented">
            {component.adaptive && (
              <button onClick={() => setLight(!light)} aria-pressed={light}>
                Light page
              </button>
            )}
            <button onClick={() => setMobile(!mobile)} aria-pressed={mobile}>
              Narrow
            </button>
            <button onClick={() => setReplay((n) => n + 1)}>Replay</button>
          </div>
        )}
        </div>
      </div>
      {tab === "preview" && (
        <>
          <div className="workbench-canvas">
            <div className={`workbench-stage${mobile ? " is-narrow" : ""}${light ? " is-light" : ""}`} key={replay}>
              <Demo slug={slug} title={title} image={image || undefined} color={color} speed={speed} hint />
            </div>
          </div>
          <div className="workbench-controls">
              {component.text && (
                <label>
                  {component.category === "Buttons" ? "Label" : "Text"}
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={component.text} maxLength={40} />
                </label>
              )}
              {component.color && (
                <label className="control-color">
                  Color
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                </label>
              )}
              {component.speed && (
                <label className="control-speed">
                  Speed {speed.toFixed(1)}×
                  <input type="range" min="0" max="3" step="0.1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
                </label>
              )}
              {slug === "ascii-image" && (
                <label>
                  Image
                  <select value={image} onChange={(e) => setImage(e.target.value)}>
                    <option value="">Architecture</option>
                    <option value="/images/interior.jpg">Interior</option>
                    <option value="/images/landscape.jpg">Landscape</option>
                  </select>
                </label>
              )}
              <button
                className="btn btn-ghost btn-small"
                onClick={() => {
                  setTitle("");
                  setImage("");
                  setMobile(false);
                  setLight(false);
                  setColor(component.color);
                  setSpeed(1);
                  setReplay((n) => n + 1);
                }}
              >
                Reset
              </button>
          </div>
          <div className="code-snippet">
              <div className="code-toolbar">
                <span>Your settings</span>
                <button onClick={() => copy(snippet, "Copied code")}>
                  <Icon name="copy" /> Copy
                </button>
              </div>
              <Code text={snippet} />
          </div>
        </>
      )}
      {tab === "usage" && (
        <div className="prose">
          <h2>Install</h2>
          <p>Run this in a React project with shadcn and import aliases configured.</p>
          <div className="code-toolbar">
            <span>Terminal</span>
            <button onClick={() => copy(installCommand(slug), "Install command copied")}>
              <Icon name="copy" /> Copy
            </button>
          </div>
          <Code text={installCommand(slug)} />
          <h2>Use</h2>
          <Code text={`import { ${exportName(slug)} } from "@/components/forme/${slug}"\n\n${component.usage}`} />
          <h2>Props & behavior</h2>
          <p>{component.props}</p>
          <p className="note">
            Installs {filesOf(slug).join(", ")}. Styles are imported by the component. Demo fonts and photos are not
            installed.
          </p>
        </div>
      )}
      {tab === "source" && <Source slug={slug} copy={copy} />}
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
        <nav aria-label="Documentation">
          <p className="docs-group">Guides</p>
          {guides.map((g) => (
            <a key={g.slug} href={`/docs/${g.slug ? g.slug + "/" : ""}`} aria-current={slug === g.slug ? "page" : undefined}>
              {g.title}
            </a>
          ))}
          <p className="docs-group">Components</p>
          {catalog.map((c) => (
            <a key={c.slug} href={`/docs/${c.slug}/`} aria-current={slug === c.slug ? "page" : undefined}>
              {c.name}
            </a>
          ))}
        </nav>
      </aside>
      <article className="docs-content">
        <div className="breadcrumbs">
          <a href="/docs/">Docs</a>
          <span>/</span>
          {component ? component.category : "Guides"}
        </div>
        <header className="docs-heading">
          <h1>{component?.name || guide?.title || "Page not found"}</h1>
          <p>
            {component?.description ||
              (guide ? "A considered starting point." : "This page is not part of the docs. Pick a guide from the navigation.")}
          </p>
          {component && (
            <div className="docs-facts">
              <Traits traits={component.traits} />
              <span className="fact">{sizeOf(component.slug)} gzipped</span>
              <a className="fact" href="/docs/quality/">
                How these are checked
              </a>
            </div>
          )}
        </header>
        {component ? (
          <Workbench key={slug} slug={slug} />
        ) : guide ? (
          <Guide slug={slug} />
        ) : (
          <a className="btn" href="/docs/">
            Open documentation
          </a>
        )}
      </article>
    </main>
  );
}

function Quality() {
  const traits = Object.keys(traitInfo) as Trait[];
  return (
    <div className="prose">
      <h2>Badges you can audit</h2>
      <p>
        Every badge on this site maps to a concrete check in <code>scripts/traits.test.mjs</code>. The test reads each
        component's installed files and fails the build if a claimed behavior is missing from the source. It also fails if
        a render loop has no offscreen pause. CI runs it on every push.
      </p>
      <ul className="check-list">
        {traits.map((t) => (
          <li key={t}>
            <strong>{traitInfo[t].label}</strong>
            <span>{traitInfo[t].check}</span>
          </li>
        ))}
      </ul>
      <p className="note">
        These checks confirm that the handling exists in code. They are not a substitute for testing your finished page with
        a keyboard, a screen reader, and reduced motion enabled.
      </p>
      <h2>Per component</h2>
      <div className="quality-table" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th scope="col">Component</th>
              <th scope="col">Size</th>
              {traits.map((t) => (
                <th scope="col" key={t}>
                  {traitInfo[t].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {catalog.map((c) => (
              <tr key={c.slug}>
                <th scope="row">
                  <a href={`/docs/${c.slug}/`}>{c.name}</a>
                </th>
                <td>{sizeOf(c.slug)}</td>
                {traits.map((t) => (
                  <td key={t}>{c.traits.includes(t) ? <span aria-label="Yes">✓</span> : <span aria-label="Not applicable">–</span>}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">
        Size is every file the CLI copies, gzipped, measured by <code>scripts/build-registry.mjs</code>. Your bundler's
        output after minification will usually be smaller.
      </p>
    </div>
  );
}

function Guide({ slug }: { slug: string }) {
  const command = installCommand("lens-button");
  if (slug === "quality") return <Quality />;
  if (slug === "theming")
    return (
      <div className="prose">
        <h2>Color and speed</h2>
        <p>
          Shaders, ASCII pieces, and HUD instruments accept a six-digit hex color and, where animated, a speed from 0 to 3.
          Their container controls the size. Shader color and speed update a uniform without recompiling the program.
        </p>
        <Code text={'<div style={{ height: 480 }}>\n  <ChromeShader color="#ff9b5c" speed={0.6} />\n</div>'} />
        <h2>Buttons</h2>
        <p>Buttons inherit your font. Most expose CSS variables for their accents; everything else lives in the scoped CSS file.</p>
        <Code
          text={
            '.launch {\n  --forme-plasma-a: #6ee7ff;\n  --forme-plasma-b: #8b7bff;\n  --forme-plasma-c: #ff7ad9;\n}\n.danger {\n  --forme-hold-fill: #f87171;\n}\n.cta {\n  --forme-lens-tint: #ff9b5c;\n}'
          }
        />
        <h2>The site theme</h2>
        <p>The Forme site opens in dark mode and remembers your toggle. Installed components carry their own styles.</p>
      </div>
    );
  if (slug === "accessibility")
    return (
      <div className="prose">
        <h2>Reduced motion</h2>
        <p>
          Every component handles the reduced-motion preference. Shaders render one still frame. ASCII pieces and HUD
          instruments freeze. Plasma, lens, and scramble effects hold still. Hold to confirm keeps its progress bar,
          because the bar carries information.
        </p>
        <h2>Pause, keyboard, and touch</h2>
        <p>
          Canvas pieces include a visible pause control. Radar sweep responds to Enter and Space; the ASCII globe, oscilloscope, command palette, and segmented switch
          respond to arrow keys. Buttons are native button elements with focus and disabled states.
          Hold to confirm works by holding Space or Enter and announces the confirmation.
        </p>
        <h2>Rendering budget</h2>
        <p>
          Render loops stop when offscreen or in a hidden tab. Shaders cap pixel density and fall back to a static gradient
          if WebGL is unavailable or the context is lost. This site mounts previews only near the viewport.
        </p>
        <h2>Before shipping a client project</h2>
        <p>
          Test with a keyboard and a screen reader, check contrast after recoloring, and review the page with reduced
          motion enabled. Previews are checked in Chromium; test your other target browsers too.
        </p>
      </div>
    );
  if (slug === "registry")
    return (
      <div className="prose">
        <h2>Install the source</h2>
        <p>
          The public registry contains all {catalog.length} components. The CLI
          copies TypeScript and scoped CSS into your components directory. There is no Forme runtime package.
        </p>
        <Code text={command} />
        <h2>Setup</h2>
        <p>
          The CLI needs a components.json and an @ import alias. Forme doesn't use Tailwind, so if you don't already use
          shadcn, you can skip its init and add this file yourself:
        </p>
        <Code
          text={
            '{\n  "style": "new-york",\n  "rsc": true,\n  "tsx": true,\n  "tailwind": { "css": "app/globals.css", "baseColor": "neutral", "cssVariables": true },\n  "aliases": {\n    "components": "@/components",\n    "utils": "@/lib/utils",\n    "ui": "@/components/ui",\n    "lib": "@/lib",\n    "hooks": "@/hooks"\n  }\n}'
          }
        />
        <p>Use "rsc": false outside Next.js, and point the css path at any stylesheet in your project.</p>
        <p>
          The CLI reads the @ alias from your root tsconfig.json. Vite's template only sets paths in tsconfig.app.json, so
          add them to the root file too, or the CLI reports files as skipped and writes nothing where you expect:
        </p>
        <Code text={'{\n  "compilerOptions": { "paths": { "@/*": ["./src/*"] } }\n}'} />
        <p className="note">
          Last tested on 4 November 2026: all 35 components installed from this registry into new Next.js 16.4.5 (App Router,
          production build) and Vite 8.3.5 projects with React 19.3. Both type-checked in strict mode and rendered on one
          page with no hydration or runtime errors in Chromium. Safari and Firefox have not been tested.
        </p>
        <h2>What goes into your project</h2>
        <Code
          text={
            "components/forme/\n  lens-button.tsx\n  lens-button.css\n\n# Shaders also include the shared runtime:\n  shader-canvas.tsx\n  shader-canvas.css\n\n# Scramble button also includes:\n  ascii-decode.tsx\n  ascii-decode.css"
          }
        />
        <p>Magnetic button installs Motion. Every other component uses React and browser APIs only.</p>
        <h2>License</h2>
        <p>
          Every component is MIT licensed. Use it in personal and commercial projects, change it however you like, and
          keep the MIT copyright notice with the code.
        </p>
        <h2>Copy manually</h2>
        <p>Open the Source tab and copy every listed file into one folder. Keep relative imports intact.</p>
      </div>
    );
  return (
    <div className="prose">
      <h2>Install your first component</h2>
      <p>
        Forme has {catalog.length} components, from shaders and ASCII to navigation, inputs, and feedback. All of them are free, MIT licensed, and include installable source.
      </p>
      <Code text={command} />
      <Code
        text={
          'import { LensButton } from "@/components/forme/lens-button"\n\nexport function Launch() {\n  return <LensButton onClick={() => start()}>Request access</LensButton>\n}'
        }
      />
      <p>
        Components that use browser APIs include a use client directive for frameworks with server components. Styles are
        imported by the component.
      </p>
      <a className="btn" href="/docs/lens-button/">
        Try Lens button
      </a>
    </div>
  );
}
