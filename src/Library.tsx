import { useEffect, useRef, useState } from "react";
import {
  catalog,
  categories,
  freeCount,
  studioCount,
  type Category,
} from "./catalog";
import { Demo } from "./Demo";
import { Arrow, Mark } from "./ui";
import { filterLibrary, restoreBookmarks } from "./library-state";

export function BookmarkIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M6 4h12v17l-6-4-6 4V4Z" />
    </svg>
  );
}
export function SearchIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

export function LibraryBrowser({
  embedded = false,
  savedOnly = false,
  studioOnly = false,
  initialCategory,
}: {
  embedded?: boolean;
  savedOnly?: boolean;
  studioOnly?: boolean;
  initialCategory?: string;
}) {
  const params = new URLSearchParams(location.search);
  const [category, setCategory] = useState<Category>(
    categories.includes(initialCategory as Category)
      ? (initialCategory as Category)
      : categories.includes(params.get("category") as Category)
        ? (params.get("category") as Category)
        : "All components",
  );
  const [access, setAccess] = useState(
    studioOnly ? "studio" : params.get("access") || "all",
  );
  const [query, setQuery] = useState(params.get("q") || "");
  const [sort, setSort] = useState("curated");
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      return restoreBookmarks(
        localStorage.getItem("forme-bookmarks"),
        catalog.map((c) => c.slug),
      );
    } catch {
      return [];
    }
  });
  const [savedView, setSavedView] = useState(savedOnly);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => () => clearTimeout(noticeTimer.current), []);
  const visible = filterLibrary(catalog, {
    query,
    category,
    access,
    savedOnly: savedView,
    saved,
    sort,
  });
  function bookmark(slug: string) {
    const next = saved.includes(slug)
      ? saved.filter((x) => x !== slug)
      : [...saved, slug];
    setSaved(next);
    try {
      localStorage.setItem("forme-bookmarks", JSON.stringify(next));
      setNotice(
        next.includes(slug)
          ? "Saved to your bookmarks"
          : "Removed from your bookmarks",
      );
    } catch {
      setNotice("Saved for this visit. Browser storage is unavailable.");
    }
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 2200);
  }
  function reset() {
    setCategory("All components");
    setAccess(studioOnly ? "studio" : "all");
    setQuery("");
    setSavedView(false);
  }
  return (
    <div className={`library-app${embedded ? " is-embedded" : ""}`}>
      <aside className="library-sidebar">
        <a className="sidebar-brand" href="/">
          <Mark />
          forme<span>Library</span>
        </a>
        <button
          className="sidebar-search"
          onClick={() => {
            search.current?.focus();
            search.current?.scrollIntoView({ block: "center" });
          }}
        >
          <SearchIcon />
          Find a component<span>⌘ K</span>
        </button>
        <nav aria-label="Library navigation">
          <button aria-pressed={!savedView} onClick={() => setSavedView(false)}>
            <span className="sidebar-nav-icon" aria-hidden="true">
              ▦
            </span>
            All components<span>{catalog.length}</span>
          </button>
          <button aria-pressed={savedView} onClick={() => setSavedView(true)}>
            <BookmarkIcon />
            Bookmarks<span>{saved.length}</span>
          </button>
          <p>Collections</p>
          <a href="/collections/experimental/" aria-current="page">
            <span className="collection-dot experimental-dot" />
            Signal<span>{catalog.length}</span>
          </a>
          <a href="/collections/next/">
            <span className="collection-dot next-dot" />
            Next drop<span className="soon-label">Soon</span>
          </a>
          <p>Browse by category</p>
          {categories
            .filter((c) => c !== "All components")
            .map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className="category-nav"
              >
                <span aria-hidden="true">
                  {
                    (
                      { Buttons: "▱", Shaders: "◈", ASCII: "⌘" } as Record<
                        string,
                        string
                      >
                    )[c]
                  }
                </span>
                {c}
                <span>
                  {catalog.filter((item) => item.category === c).length}
                </span>
              </button>
            ))}
        </nav>
        <a className="sidebar-studio" href="/studio/">
          <span className="studio-mini-mark" aria-hidden="true">
            ✦
          </span>
          <strong>A little more. Studio.</strong>
          <span>Experiments with a little extra.</span>
          <b>
            Explore Studio
            <Arrow />
          </b>
        </a>
        <a className="sidebar-docs" href="/docs/">
          Documentation
          <Arrow diagonal />
        </a>
      </aside>
      <div className="library-main">
        <div className="browser-topline">
          <span>
            Forme / {savedView ? "Your bookmarks" : "Component library"}
          </span>
          <div>
            <span className="live-indicator" />
            Signal preview
          </div>
        </div>
        <div className="browser-heading">
          <div>
            <h2>
              {savedView
                ? "Your saved inspiration."
                : embedded
                  ? "Find your next great detail."
                  : "Explore the library."}
            </h2>
            <p>
              {savedView
                ? "The pieces you want to come back to. Saved in this browser."
                : "Buttons, shaders, and ASCII. Live, interactive, and a little unexpected."}
            </p>
          </div>
          {embedded && (
            <a href="/components/" aria-label="Open full component library">
              <Arrow diagonal />
            </a>
          )}
        </div>
        <div className="browser-toolbar">
          <div
            className="browse-tabs"
            role="group"
            aria-label="Component access"
          >
            {[
              { key: "all", label: "All components", count: catalog.length },
              { key: "free", label: "Free", count: freeCount },
              { key: "studio", label: "Studio", count: studioCount },
            ]
              .filter((item) => !studioOnly || item.key === "studio")
              .map((item) => (
                <button
                  key={item.key}
                  aria-pressed={access === item.key}
                  onClick={() => setAccess(item.key)}
                >
                  {item.label}
                  <span>{item.count}</span>
                </button>
              ))}
          </div>
          <label className="browser-search">
            <SearchIcon />
            <input
              ref={search}
              aria-label="Search components"
              placeholder="Search components…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd>⌘ K</kbd>
          </label>
        </div>
        <div className="browser-filter-row">
          <div
            className="category-pills"
            role="group"
            aria-label="Component categories"
          >
            {categories.map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c === "All components" ? "All" : c}
              </button>
            ))}
          </div>
          <label className="sort-control">
            <span className="sr-only">Sort components</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="curated">Curated</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>
        <div className="browser-result-line">
          <span role="status">
            {visible.length} {visible.length === 1 ? "component" : "components"}
            {category !== "All components"
              ? ` in ${category.toLowerCase()}`
              : ""}
          </span>
          <span>React · TypeScript</span>
        </div>
        <div className="discovery-grid">
          {visible.map((c) => (
            <article className="discovery-card" key={c.slug}>
              <div className={`discovery-preview preview-${c.slug}`}>
                <Demo slug={c.slug} />
                <div className="card-floating-actions">
                  <button
                    onClick={() => bookmark(c.slug)}
                    aria-label={`${saved.includes(c.slug) ? "Unsave" : "Save"} ${c.name}`}
                    aria-pressed={saved.includes(c.slug)}
                  >
                    <BookmarkIcon filled={saved.includes(c.slug)} />
                  </button>
                  <a
                    href={`/docs/${c.slug}/`}
                    aria-label={`Open ${c.name} preview`}
                  >
                    <Arrow diagonal />
                  </a>
                </div>
                {c.access === "studio" && (
                  <a className="card-studio-badge" href="/studio/">
                    Studio
                  </a>
                )}
              </div>
              <div className="discovery-card-title">
                <a href={`/docs/${c.slug}/`}>{c.name}</a>
                <span>{c.category}</span>
              </div>
              <div className="discovery-card-byline">
                <span className="creator-avatar">f</span>
                <span>Forme</span>
                <span className="creator-separator">/</span>
                <span>Signal</span>
                <a
                  href={`/docs/${c.slug}/?view=source`}
                  aria-label={`View ${c.name} source`}
                >
                  〈/〉
                </a>
              </div>
            </article>
          ))}
        </div>
        {!visible.length && (
          <div className="library-empty">
            <BookmarkIcon />
            <h3>
              {savedView && !saved.length
                ? "A place for your next idea."
                : "No components found."}
            </h3>
            <p>
              {savedView && !saved.length
                ? "Save a component with the bookmark icon. It will be waiting here."
                : "Try another search or reset your filters."}
            </p>
            <button className="button" onClick={reset}>
              Explore all components
              <Arrow />
            </button>
          </div>
        )}
        <div className="browser-bottom">
          <span>{notice || "Made with care by Forme."}</span>
          <a href="/docs/">
            Install your first component
            <Arrow diagonal />
          </a>
        </div>
        <span className="sr-only" role="status">
          {notice}
        </span>
      </div>
    </div>
  );
}
