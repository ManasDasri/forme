import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { catalog } from "./catalog";
import { Icon } from "./ui";

export function SearchDialog({ close }: { close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
    dialog.current?.showModal();
    return () => dialog.current?.close();
  }, []);
  const items = catalog.filter((c) =>
    `${c.name} ${c.category} ${c.description}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  // Arrow keys move through the input and results; Enter follows the focused link.
  function navigate(e: KeyboardEvent) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const stops = [...dialog.current!.querySelectorAll<HTMLElement>("#global-search, .search-results a")];
    const index = stops.indexOf(document.activeElement as HTMLElement);
    const next = stops[(index + (e.key === "ArrowDown" ? 1 : -1) + stops.length) % stops.length];
    e.preventDefault();
    next?.focus();
  }
  return (
    <dialog
      ref={dialog}
      className="search-dialog"
      aria-labelledby="search-title"
      onCancel={close}
      onKeyDown={navigate}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="search-input">
        <Icon name="search" />
        <label className="sr-only" id="search-title" htmlFor="global-search">
          Search the Forme library
        </label>
        <input
          id="global-search"
          autoFocus
          placeholder="Search components"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={close} aria-label="Close search">
          Esc
        </button>
      </div>
      <div className="search-results">
        <p className="search-heading">{query ? `${items.length} ${items.length === 1 ? "result" : "results"}` : "All components"}</p>
        {items.map((c) => (
          <a key={c.slug} href={`/docs/${c.slug}/`}>
            <span>
              <strong>{c.name}</strong>
              <small>{c.access === "studio" ? `${c.category}, Studio` : c.category}</small>
            </span>
          </a>
        ))}
        {!items.length && <div className="search-empty">Nothing matches that. Try “shader”, “ASCII”, or “button”.</div>}
      </div>
      <div className="search-footer">
        <span>Use ↑ and ↓ to move, Enter to open</span>
        <a href="/components/">
          All components
        </a>
      </div>
    </dialog>
  );
}
