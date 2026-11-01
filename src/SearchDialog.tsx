import { useEffect, useRef, useState } from "react";
import { catalog } from "./catalog";
import { SearchIcon } from "./Library";
import { Arrow } from "./ui";

export function SearchDialog({ close }: { close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const first = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
    return () => dialog.current?.close();
  }, []);
  const items = catalog.filter((c) =>
    `${c.name} ${c.category} ${c.description}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <dialog
      ref={dialog}
      className="search-dialog"
      aria-labelledby="search-title"
      onCancel={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="search-dialog-input">
        <SearchIcon />
        <label className="sr-only" id="search-title" htmlFor="global-search">
          Search the Forme library
        </label>
        <input
          id="global-search"
          autoFocus
          placeholder="What are you looking for?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              first.current?.focus();
            }
          }}
        />
        <button onClick={close} aria-label="Close search">
          Esc
        </button>
      </div>
      <div className="search-dialog-results">
        <p>{query ? "Search results" : "Explore the collection"}</p>
        {items.map((c, i) => (
          <a
            ref={i === 0 ? first : undefined}
            key={c.slug}
            href={`/docs/${c.slug}/`}
          >
            <span className="search-result-icon" aria-hidden="true">
              {c.category === "ASCII"
                ? "⌖"
                : c.category === "Buttons"
                  ? "▱"
                  : "▦"}
            </span>
            <span>
              <strong>{c.name}</strong>
              <small>
                {c.category} /{" "}
                {c.access === "studio" ? "Studio preview" : "Free preview"}
              </small>
            </span>
            <Arrow diagonal />
          </a>
        ))}
        {!items.length && (
          <div className="search-no-results">
            No components found. Try a category such as “shaders” or “buttons”.
          </div>
        )}
      </div>
      <div className="search-dialog-footer">
        <span>Type to search. Tab to explore.</span>
        <a href="/components/">
          Browse the library
          <Arrow />
        </a>
      </div>
    </dialog>
  );
}
