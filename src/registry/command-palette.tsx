"use client";
import { useId, useRef, useState } from "react";
import "./command-palette.css";

export interface Command {
  id: string;
  label: string;
  group?: string;
  shortcut?: string;
  onSelect?: () => void;
}
/** A searchable command list: a real combobox with arrow keys, Enter, and live results. */
export function CommandPalette({
  commands,
  placeholder = "Type a command",
  emptyText = "No matching commands",
  className = "",
}: {
  commands: Command[];
  placeholder?: string;
  emptyText?: string;
  className?: string;
}) {
  const list = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [ran, setRan] = useState("");
  const scroller = useRef<HTMLUListElement>(null);
  const q = query.trim().toLowerCase();
  const results = commands.filter((c) => `${c.label} ${c.group ?? ""}`.toLowerCase().includes(q));
  const index = Math.min(active, Math.max(0, results.length - 1));
  const move = (next: number) => {
    setActive(next);
    scroller.current?.children[next]?.scrollIntoView({ block: "nearest" });
  };
  const run = (command?: Command) => {
    if (!command) return;
    command.onSelect?.();
    setRan(`Ran ${command.label}`);
  };
  return (
    <div className={`forme-command ${className}`}>
      <input
        role="combobox"
        aria-expanded="true"
        aria-controls={list}
        aria-activedescendant={results.length ? `${list}-${results[index].id}` : undefined}
        aria-label={placeholder}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (!results.length) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            move((index + 1) % results.length);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            move((index - 1 + results.length) % results.length);
          } else if (e.key === "Enter") {
            e.preventDefault();
            run(results[index]);
          }
        }}
      />
      <ul id={list} role="listbox" ref={scroller} aria-label="Commands">
        {results.map((c, i) => (
          <li
            key={c.id}
            id={`${list}-${c.id}`}
            role="option"
            aria-selected={i === index}
            onPointerMove={() => i !== index && setActive(i)}
            onClick={() => run(c)}
          >
            <span>{c.label}</span>
            {c.group && <small>{c.group}</small>}
            {c.shortcut && <kbd>{c.shortcut}</kbd>}
          </li>
        ))}
      </ul>
      {!results.length && <p className="forme-command-empty">{emptyText}</p>}
      <span className="forme-command-status" role="status">
        {ran}
      </span>
    </div>
  );
}
