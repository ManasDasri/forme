import { useEffect, useState } from "react";
import type { SVGProps } from "react";

export const repo = "https://github.com/ManasDasri/forme";
export function Arrow({
  diagonal = false,
  ...props
}: SVGProps<SVGSVGElement> & { diagonal?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      {...props}
    >
      {diagonal ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : (
        <path d="M4 12h15m-6-6 6 6-6 6" />
      )}
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

export function Header() {
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState(
    document.documentElement.dataset.theme || "light",
  );
  const path = location.pathname;
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      try {
        if (localStorage.getItem("forme-theme")) return;
      } catch {
        /* Use system preference when storage is unavailable. */
      }
      const next = media.matches ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    media.addEventListener("change", update);
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", escape);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("keydown", escape);
    };
  }, []);
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("forme-theme", next);
    } catch {
      /* Theme still works for this page. */
    }
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="announcement">
        <span className="status-dot" />
        Editorial, expanded. Twelve ways to make an impression.
        <a href="/collections/editorial/">
          Explore the collection <Arrow diagonal />
        </a>
      </div>
      <header className="site-header">
        <div className="header shell">
          <a className="wordmark" href="/" aria-label="Forme home">
            <Mark />
            forme
          </a>
          <nav
            id="main-nav"
            className={`main-nav${menu ? " is-open" : ""}`}
            aria-label="Main navigation"
          >
            <a
              href="/collections/"
              aria-current={
                path.startsWith("/collections") ? "page" : undefined
              }
            >
              Collections <span className="nav-count">3</span>
            </a>
            <a
              href="/collections/editorial/"
              aria-current={
                path.startsWith("/collections/editorial") ? "page" : undefined
              }
            >
              Components <span className="nav-count">12</span>
            </a>
            <a
              href="/studio/"
              aria-current={path.startsWith("/studio") ? "page" : undefined}
            >
              Studio
            </a>
            <a
              href="/docs/"
              aria-current={path.startsWith("/docs") ? "page" : undefined}
            >
              Documentation
            </a>
          </nav>
          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                {theme === "dark" ? (
                  <>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
                  </>
                ) : (
                  <path d="M20.5 13a8.5 8.5 0 0 1-9.5-9.5A8.5 8.5 0 1 0 20.5 13Z" />
                )}
              </svg>
            </button>
            <a className="button button-small" href="/collections/editorial/">
              Explore Editorial <Arrow />
            </a>
            <button
              className="mobile-toggle icon-button"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-controls="main-nav"
              aria-label="Toggle navigation"
            >
              {menu ? "×" : "☰"}
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
        <p>Made with care. Made to move.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/collections/">Collections</a>
        <a href="/docs/">Documentation</a>
        <a href="/studio/">Studio</a>
        <a href={repo} target="_blank" rel="noreferrer">
          GitHub <Arrow diagonal />
        </a>
      </nav>
      <span>© {new Date().getFullYear()} Forme</span>
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
