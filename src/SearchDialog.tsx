import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { catalog, code } from "./catalog";
import { Arrow, Icon } from "./ui";

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
          placeholder="Search the signal…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={close} aria-label="Close search">
          Esc
        </button>
      </div>
      <div className="search-results">
        <p className="label">// {query ? `${items.length} results` : "All channels"}</p>
        {items.map((c) => (
          <a key={c.slug} href={`/docs/${c.slug}/`}>
            <span className="search-code">{code(c.slug)}</span>
            <span>
              <strong>{c.name}</strong>
              <small>
                {c.category} · {c.access === "studio" ? "Studio" : "Free"}
              </small>
            </span>
            <Arrow diagonal />
          </a>
        ))}
        {!items.length && <div className="search-empty">No signal. Try “shader”, “ascii”, or “hud”.</div>}
      </div>
      <div className="search-footer">
        <span>↑↓ to move · Enter to open · Esc to close</span>
        <a href="/components/">
          Open library <Arrow />
        </a>
      </div>
    </dialog>
  );
}
