import { useEffect, useRef, useState } from "react";
import type { ReactNode, SVGProps } from "react";
import { catalog, freeCount, studioCount, traitInfo, type Trait } from "./catalog";
import sizes from "./sizes.json";

export const installCommand = (slug: string) =>
  `npx shadcn@latest add ${location.origin}/r/${slug}.json`;
export const sizeOf = (slug: string) =>
  `${(((sizes as Record<string, number>)[slug] || 0) / 1024).toFixed(1)} kB`;
export const medianSize = () => {
  const values = catalog
    .map((c) => (sizes as Record<string, number>)[c.slug])
    .sort((a, b) => a - b);
  return `${(values[Math.floor(values.length / 2)] / 1024).toFixed(1)} kB`;
};

export function Arrow({
  diagonal = false,
  ...props
}: SVGProps<SVGSVGElement> & { diagonal?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      {...props}
    >
      {diagonal ? (
        <path d="M6 18 18 6M8 6h10v10" />
      ) : (
        <path d="M4 12h15m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}
export function Icon({ name }: { name: "search" | "bookmark" | "bookmark-filled" | "copy" | "check" | "sun" | "moon" }) {
  const paths = {
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    bookmark: <path d="M6 4h12v17l-6-4-6 4V4Z" />,
    "bookmark-filled": <path d="M6 4h12v17l-6-4-6 4V4Z" fill="currentColor" />,
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="1" />
        <path d="M16 8V4H4v12h4" />
      </>
    ),
    check: <path d="m5 12 5 5L20 7" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </>
    ),
    moon: <path d="M20.5 13a8.5 8.5 0 0 1-9.5-9.5A8.5 8.5 0 1 0 20.5 13Z" />,
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
export function Mark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
/** Mounts live previews only near the viewport, keeping WebGL contexts bounded. */
export function Lazy({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: "240px",
    });
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {near ? children : null}
    </div>
  );
}
export function Traits({ traits, compact = false }: { traits: Trait[]; compact?: boolean }) {
  return (
    <ul className={`traits${compact ? " is-compact" : ""}`} aria-label="Verified behavior">
      {traits.map((t) => (
        <li key={t} title={traitInfo[t].check}>
          <Icon name="check" />
          {traitInfo[t].label}
        </li>
      ))}
    </ul>
  );
}
export function useCopy() {
  const [copied, setCopied] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
    } catch {
      setCopied("Copy failed. Select the text and copy it manually.");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(""), 2200);
  }
  return [copied, copy] as const;
}

export function Header({ onSearch }: { onSearch: () => void }) {
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || "dark");
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#05060a" : "#f3f5f9");
    try {
      localStorage.setItem("forme-theme", next);
    } catch {}
  }
  const path = location.pathname;
  const links = [
    ["/components/", "Library"],
    ["/collections/", "Channels"],
    ["/studio/", "Studio"],
    ["/docs/", "Docs"],
  ];
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header shell">
          <a className="wordmark" href="/" aria-label="Forme home">
            <Mark />
            forme
          </a>
          <span className="header-signal" aria-hidden="true">
            <i /> Signal // Drop 01
          </span>
          <nav id="main-nav" className={`main-nav${menu ? " is-open" : ""}`} aria-label="Main navigation">
            {links.map(([href, label]) => (
              <a key={href} href={href} aria-current={path.startsWith(href.slice(0, -1)) ? "page" : undefined}>
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button className="header-search" onClick={onSearch} aria-label="Search the library">
              <Icon name="search" />
              <span>Search</span>
              <kbd>⌘K</kbd>
            </button>
            <a className="icon-button" href="/bookmarks/" aria-label="Your bookmarks">
              <Icon name="bookmark" />
            </a>
            <button
              className="icon-button"
              onClick={toggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} />
            </button>
            <button
              className="icon-button mobile-toggle"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-controls="main-nav"
              aria-label="Toggle navigation"
            >
              {menu ? "×" : "≡"}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer shell">
      <div>
        <a className="wordmark" href="/">
          <Mark />
          forme
        </a>
        <p>Interfaces from the near future.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/components/">Library</a>
        <a href="/collections/">Channels</a>
        <a href="/docs/quality/">How we verify</a>
        <a href="/studio/">Studio</a>
      </nav>
      <span className="footer-meta">
        {catalog.length} components · {freeCount} free · {studioCount} Studio · © {new Date().getFullYear()} Forme
      </span>
    </footer>
  );
}
export function Code({ text }: { text: string }) {
  return (
    <pre className="code-block" tabIndex={0}>
      <code>{text}</code>
    </pre>
  );
}
