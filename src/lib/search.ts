import Fuse from "fuse.js";
import type { University } from "@/lib/types";
import { UNIVERSITIES } from "@/data/universities";

/**
 * Smart search over the mock university set.
 * Ranking: exact alias/name match first, then fuzzy (typo-tolerant) matches.
 * Aliases combine hand-curated nicknames with a programmatic initialism
 * (e.g. "New York University" → "NYU").
 */

const STOP_WORDS = new Set(["of", "the", "and", "at", "in", "for", "a", "&"]);

/** Build an initialism from significant words, e.g. "New York University" → NYU. */
function initialism(name: string): string {
  return name
    .replace(/,/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => !STOP_WORDS.has(w.toLowerCase()))
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

interface Entry {
  university: University;
  /** name + curated aliases + auto initialism, for matching. */
  aliases: string[];
}

const ENTRIES: Entry[] = UNIVERSITIES.map((u) => ({
  university: u,
  aliases: Array.from(new Set([u.name, ...u.aliases, initialism(u.name)])),
}));

const fuse = new Fuse(ENTRIES, {
  includeScore: true,
  threshold: 0.42,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: "university.name", weight: 0.5 },
    { name: "aliases", weight: 0.45 },
    { name: "university.city", weight: 0.05 },
  ],
});

export function searchUniversities(query: string, limit = 6): University[] {
  const q = query.trim();
  if (!q) return [];
  const norm = q.toLowerCase();

  // Exact alias / name matches always rank first.
  const exact = ENTRIES.filter((e) =>
    e.aliases.some((a) => a.toLowerCase() === norm),
  ).map((e) => e.university);

  const fuzzy = fuse.search(q).map((r) => r.item.university);

  const ordered: University[] = [];
  const seen = new Set<string>();
  for (const u of [...exact, ...fuzzy]) {
    if (!seen.has(u.slug)) {
      seen.add(u.slug);
      ordered.push(u);
    }
  }
  return ordered.slice(0, limit);
}
