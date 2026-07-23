"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { University } from "@/lib/types";
import { searchUniversities } from "@/lib/search";

type Variant = "hero" | "compact";

interface SearchBoxProps {
  variant?: Variant;
  /** Placeholder override; falls back to a sensible per-variant default. */
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * Forgiving university search with a live, keyboard-navigable results dropdown.
 * Resolves nicknames and typos (see `@/lib/search`). Selecting a result routes
 * to that university's most-recent-year page.
 */
export default function SearchBox({
  variant = "hero",
  placeholder,
  autoFocus = false,
}: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const results = useMemo<University[]>(
    () => (query.trim() ? searchUniversities(query, variant === "hero" ? 6 : 5) : []),
    [query, variant],
  );

  // Reset the active row whenever the result set changes.
  useEffect(() => setActive(0), [results.length, query]);

  // Close the dropdown on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function go(uni: University) {
    setOpen(false);
    setQuery("");
    router.push(`/university/${uni.slug}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (results[active]) {
        e.preventDefault();
        go(results[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const isHero = variant === "hero";
  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className="relative w-full">
      <div className="relative">
        <SearchIcon
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3 ${
            isHero ? "h-5 w-5" : "h-4 w-4"
          }`}
        />
        <input
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            showDropdown && results[active]
              ? `${listboxId}-opt-${active}`
              : undefined
          }
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={
            placeholder ??
            (isHero ? "Try “NYU”, “UT Austin”, or “Penn”…" : "Search a university…")
          }
          className={`w-full rounded-control border border-line bg-surface pl-11 text-ink shadow-sm placeholder:text-ink-3 focus:border-crimson ${
            isHero ? "py-4 pr-4 text-lg" : "py-2 pr-3 text-sm"
          }`}
        />
      </div>

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-control border border-line bg-surface shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-ink-2">
              No matches. Check the spelling, or try a nickname like “NYU”.
            </li>
          ) : (
            results.map((uni, i) => (
              <li
                key={uni.slug}
                id={`${listboxId}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  // mousedown (not click) so it fires before input blur closes the list
                  e.preventDefault();
                  go(uni);
                }}
                className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm ${
                  i === active ? "bg-crimson-tint" : "bg-surface"
                }`}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-ink">{uni.name}</span>
                  <span className="truncate text-xs text-ink-3">
                    {uni.city}, {uni.state}
                  </span>
                </span>
                <TypeBadge type={uni.type} />
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

function TypeBadge({ type }: { type: University["type"] }) {
  return (
    <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-2">
      {type}
    </span>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="6" />
      <path d="m14 14 4 4" strokeLinecap="round" />
    </svg>
  );
}
