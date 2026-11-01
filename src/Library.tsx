import { useEffect, useRef, useState } from "react";
import { catalog, categories, freeCount, studioCount, type Category } from "./catalog";
import { Demo } from "./Demo";
import { Icon, Lazy, installCommand, sizeOf, useCopy } from "./ui";
import { filterLibrary, restoreBookmarks } from "./library-state";

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
  const valid = (c: string | null | undefined): c is Category => categories.includes(c as Category);
  const [category, setCategory] = useState<Category>(
    valid(initialCategory) ? initialCategory : valid(params.get("category")) ? (params.get("category") as Category) : "All components",
  );
  const [access, setAccess] = useState(studioOnly ? "studio" : params.get("access") || "all");
  const [query, setQuery] = useState(params.get("q") || "");
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      return restoreBookmarks(localStorage.getItem("forme-bookmarks"), catalog.map((c) => c.slug));
    } catch {
      return [];
    }
  });
  const [notice, copy] = useCopy();
  const [bookmarkNotice, setBookmarkNotice] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(noticeTimer.current), []);
  const scoped = catalog.filter((c) => (access === "all" ? true : access === "studio" ? c.access === "studio" : c.access !== "studio"));
  const visible = filterLibrary(catalog, { query, category, access, savedOnly, saved, sort: "curated" });
  const shown = embedded ? visible.slice(0, 9) : visible;
  function bookmark(slug: string) {
    const next = saved.includes(slug) ? saved.filter((x) => x !== slug) : [...saved, slug];
    setSaved(next);
    try {
      localStorage.setItem("forme-bookmarks", JSON.stringify(next));
      setBookmarkNotice(next.includes(slug) ? "Saved to bookmarks" : "Removed from bookmarks");
    } catch {
      setBookmarkNotice("Saved for this visit only. Browser storage is unavailable.");
    }
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setBookmarkNotice(""), 2200);
  }
  return (
    <div className="library">
      <div className="library-toolbar">
        {!studioOnly && (
          <div className="tabs" role="group" aria-label="Access">
            {[
              { key: "all", label: "All", count: catalog.length },
              { key: "free", label: "Free", count: freeCount },
              { key: "studio", label: "Studio", count: studioCount },
            ].map((item) => (
              <button key={item.key} aria-pressed={access === item.key} onClick={() => setAccess(item.key)}>
                {item.label}
                <span>{item.count}</span>
              </button>
            ))}
          </div>
        )}
        <label className="search-field">
          <Icon name="search" />
          <input
            type="search"
            aria-label="Search components"
            placeholder="Search components"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="filters" role="group" aria-label="Category">
        {categories.map((c) => (
          <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>
            {c === "All components" ? "All" : c}
            <span>{c === "All components" ? scoped.length : scoped.filter((item) => item.category === c).length}</span>
          </button>
        ))}
      </div>
      <div className="card-grid">
        {shown.map((c) => {
          const studio = c.access === "studio";
          const isSaved = saved.includes(c.slug);
          return (
            <article className="card" key={c.slug}>
              <div className="card-preview">
                <Lazy className="card-live">
                  <Demo slug={c.slug} />
                </Lazy>
                {studio && <span className="card-badge">Studio</span>}
                <div className="card-actions">
                  <button onClick={() => bookmark(c.slug)} aria-label={`${isSaved ? "Remove" : "Save"} ${c.name}`} aria-pressed={isSaved}>
                    <Icon name={isSaved ? "bookmark-filled" : "bookmark"} />
                  </button>
                  {!studio && (
                    <button
                      onClick={() => copy(installCommand(c.slug), `Copied install command for ${c.name}`)}
                      aria-label={`Copy install command for ${c.name}`}
                    >
                      <Icon name="copy" />
                    </button>
                  )}
                </div>
              </div>
              <div className="card-meta">
                <a href={`/docs/${c.slug}/`}>{c.name}</a>
                <span>{sizeOf(c.slug)}</span>
              </div>
              <p className="card-category">{c.category}</p>
            </article>
          );
        })}
      </div>
      {!visible.length && (
        <div className="library-empty">
          <h3>{savedOnly && !saved.length ? "Nothing saved yet" : "No components match"}</h3>
          <p>
            {savedOnly && !saved.length
              ? "Save a component from its card and it will appear here, in this browser."
              : "Try a different search or category."}
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setCategory("All components");
              setQuery("");
              if (!studioOnly) setAccess("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      {embedded && visible.length > shown.length && (
        <div className="library-more">
          <a className="btn btn-secondary" href="/components/">
            View all {catalog.length} components
          </a>
        </div>
      )}
      <p className="toast" role="status" data-visible={Boolean(notice || bookmarkNotice) || undefined}>
        {notice || bookmarkNotice}
      </p>
    </div>
  );
}
