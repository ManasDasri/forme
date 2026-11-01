import { useRef, useState } from "react";
import { catalog, categories, code, freeCount, studioCount, type Category } from "./catalog";
import { Demo } from "./Demo";
import { Arrow, Icon, Lazy, Traits, installCommand, sizeOf, useCopy } from "./ui";
import { filterLibrary, restoreBookmarks } from "./library-state";

const glyph: Record<string, string> = { Buttons: "▭", Shaders: "◈", ASCII: "#", HUD: "⌖" };
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
  const [sort, setSort] = useState("curated");
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      return restoreBookmarks(localStorage.getItem("forme-bookmarks"), catalog.map((c) => c.slug));
    } catch {
      return [];
    }
  });
  const [savedView, setSavedView] = useState(savedOnly);
  const [notice, copy] = useCopy();
  const [bookmarkNotice, setBookmarkNotice] = useState("");
  const search = useRef<HTMLInputElement>(null);
  const visible = filterLibrary(catalog, { query, category, access, savedOnly: savedView, saved, sort });
  function bookmark(slug: string) {
    const next = saved.includes(slug) ? saved.filter((x) => x !== slug) : [...saved, slug];
    setSaved(next);
    try {
      localStorage.setItem("forme-bookmarks", JSON.stringify(next));
      setBookmarkNotice(next.includes(slug) ? "Saved to bookmarks" : "Removed from bookmarks");
    } catch {
      setBookmarkNotice("Saved for this visit. Browser storage is unavailable.");
    }
  }
  function reset() {
    setCategory("All components");
    setAccess(studioOnly ? "studio" : "all");
    setQuery("");
    setSavedView(false);
  }
  const status = notice || bookmarkNotice;
  return (
    <div className={`library-app${embedded ? " is-embedded" : ""}`}>
      <aside className="library-sidebar">
        <p className="label">// Index</p>
        <nav aria-label="Library navigation">
          <button aria-pressed={!savedView && category === "All components"} onClick={() => (setSavedView(false), setCategory("All components"))}>
            <span aria-hidden="true">▦</span>All<span>{catalog.length}</span>
          </button>
          <button aria-pressed={savedView} onClick={() => setSavedView(true)}>
            <span aria-hidden="true">◆</span>Bookmarks<span>{saved.length}</span>
          </button>
          <p className="label">// Channels</p>
          {categories
            .filter((c) => c !== "All components")
            .map((c) => (
              <button key={c} onClick={() => (setSavedView(false), setCategory(c))} aria-pressed={!savedView && category === c}>
                <span aria-hidden="true">{glyph[c]}</span>
                {c}
                <span>{catalog.filter((item) => item.category === c).length}</span>
              </button>
            ))}
        </nav>
        <a className="sidebar-studio" href="/studio/">
          <span className="label">// Studio</span>
          <strong>{studioCount} pieces, recorded.</strong>
          <span>Watch them run. Source arrives with the paid edition.</span>
          <b>
            Explore Studio <Arrow />
          </b>
        </a>
        <a className="sidebar-link" href="/docs/quality/">
          How we verify <Arrow diagonal />
        </a>
      </aside>
      <div className="library-main">
        <div className="library-toolbar">
          <div className="segmented" role="group" aria-label="Component access">
            {[
              { key: "all", label: "All", count: catalog.length },
              { key: "free", label: "Free", count: freeCount },
              { key: "studio", label: "Studio", count: studioCount },
            ]
              .filter((item) => !studioOnly || item.key === "studio")
              .map((item) => (
                <button key={item.key} aria-pressed={access === item.key} onClick={() => setAccess(item.key)}>
                  {item.label}
                  <span>{item.count}</span>
                </button>
              ))}
          </div>
          <label className="search-field">
            <Icon name="search" />
            <input
              ref={search}
              type="search"
              aria-label="Search components"
              placeholder="Search the signal…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label className="sort-control">
            <span className="sr-only">Sort components</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="curated">Curated</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>
        <div className="category-pills" role="group" aria-label="Component channels">
          {categories.map((c) => (
            <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>
              {c === "All components" ? "All" : c}
            </button>
          ))}
          <span className="result-count" role="status">
            {String(visible.length).padStart(2, "0")} / {String(catalog.length).padStart(2, "0")}
          </span>
        </div>
        <div className="card-grid">
          {visible.map((c) => {
            const studio = c.access === "studio";
            const isSaved = saved.includes(c.slug);
            return (
              <article className="card" key={c.slug}>
                <div className="card-preview">
                  <Lazy className="card-live">
                    <Demo slug={c.slug} />
                  </Lazy>
                  <span className="card-code" aria-hidden="true">
                    {code(c.slug)}
                  </span>
                  {studio && <span className="card-badge">Studio</span>}
                  <div className="card-actions">
                    <button onClick={() => bookmark(c.slug)} aria-label={`${isSaved ? "Unsave" : "Save"} ${c.name}`} aria-pressed={isSaved}>
                      <Icon name={isSaved ? "bookmark-filled" : "bookmark"} />
                    </button>
                    {!studio && (
                      <button
                        onClick={() => copy(installCommand(c.slug), `Install command for ${c.name} copied`)}
                        aria-label={`Copy install command for ${c.name}`}
                      >
                        <Icon name="copy" />
                      </button>
                    )}
                    <a href={`/docs/${c.slug}/`} aria-label={`Open ${c.name}`}>
                      <Arrow diagonal />
                    </a>
                  </div>
                </div>
                <div className="card-meta">
                  <a href={`/docs/${c.slug}/`}>{c.name}</a>
                  <span>
                    {c.category} · {sizeOf(c.slug)}
                  </span>
                </div>
                <Traits traits={c.traits} compact />
              </article>
            );
          })}
        </div>
        {!visible.length && (
          <div className="library-empty">
            <p className="label">// No signal</p>
            <h3>{savedView && !saved.length ? "Nothing saved yet." : "No components match."}</h3>
            <p>
              {savedView && !saved.length
                ? "Use the bookmark on any card. It will wait here, in this browser."
                : "Try another search or reset the filters."}
            </p>
            <button className="btn" onClick={reset}>
              Show everything <Arrow />
            </button>
          </div>
        )}
        <div className="library-status">
          <span role="status">{status || "Every badge is checked against source in CI."}</span>
          <a href="/docs/registry/">
            Install guide <Arrow diagonal />
          </a>
        </div>
      </div>
    </div>
  );
}
