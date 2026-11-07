import { useState } from "react";
import { catalog, categories, type Category } from "./catalog";
import { Demo } from "./Demo";
import { Icon, Lazy, cardHandlers, installCommand, sizeOf } from "./ui";
import { toast } from "./registry/toast";
import { filterLibrary, restoreBookmarks } from "./library-state";

export function LibraryBrowser({
  embedded = false,
  savedOnly = false,
  initialCategory,
}: {
  embedded?: boolean;
  savedOnly?: boolean;
  initialCategory?: string;
}) {
  const params = new URLSearchParams(location.search);
  const valid = (c: string | null | undefined): c is Category => categories.includes(c as Category);
  const [category, setCategory] = useState<Category>(
    valid(initialCategory) ? initialCategory : valid(params.get("category")) ? (params.get("category") as Category) : "All components",
  );
  const [query, setQuery] = useState(params.get("q") || "");
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      return restoreBookmarks(localStorage.getItem("forme-bookmarks"), catalog.map((c) => c.slug));
    } catch {
      return [];
    }
  });
  const copy = async (text: string, name: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Install command copied", { description: name, tone: "success" });
    } catch {
      toast("Couldn't copy", { description: "Open the component to copy the command manually.", tone: "error" });
    }
  };
  const visible = filterLibrary(catalog, { query, category, savedOnly, saved, sort: "curated" });
  const shown = embedded ? visible.slice(0, 9) : visible;
  function bookmark(slug: string) {
    const next = saved.includes(slug) ? saved.filter((x) => x !== slug) : [...saved, slug];
    setSaved(next);
    try {
      localStorage.setItem("forme-bookmarks", JSON.stringify(next));
      toast(next.includes(slug) ? "Saved to bookmarks" : "Removed from bookmarks", {
        description: catalog.find((c) => c.slug === slug)?.name,
      });
    } catch {
      toast("Saved for this visit only", { description: "Browser storage is unavailable." });
    }
  }
  return (
    <div className="library">
      <div className="library-toolbar">
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
            <span>{c === "All components" ? catalog.length : catalog.filter((item) => item.category === c).length}</span>
          </button>
        ))}
      </div>
      <div className="card-grid">
        {shown.map((c) => {
          const isSaved = saved.includes(c.slug);
          return (
            <article className="card" key={c.slug}>
              <div className="card-preview" {...cardHandlers(`/docs/${c.slug}/`)}>
                <Lazy className="card-live">
                  <Demo slug={c.slug} />
                </Lazy>
                <div className="card-actions">
                  <button onClick={() => bookmark(c.slug)} aria-label={`${isSaved ? "Remove" : "Save"} ${c.name}`} aria-pressed={isSaved}>
                    <Icon name={isSaved ? "bookmark-filled" : "bookmark"} />
                  </button>
                  <button
                    onClick={() => copy(installCommand(c.slug), c.name)}
                    aria-label={`Copy install command for ${c.name}`}
                  >
                    <Icon name="copy" />
                  </button>
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
    </div>
  );
}
