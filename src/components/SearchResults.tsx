"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SearchBox from "@/components/SearchBox";
import { searchUniversities } from "@/lib/search";
import { getPopularUniversities } from "@/lib/data";
import type { University } from "@/lib/types";

function ResultCard({ uni }: { uni: University }) {
  return (
    <li>
      <Link
        href={`/university/${uni.slug}`}
        className="flex items-center justify-between gap-4 rounded-card border border-line bg-surface px-5 py-4 shadow-[var(--shadow-card)] transition-colors hover:border-crimson"
      >
        <span className="min-w-0">
          <span className="block font-serif text-lg font-medium text-ink">
            {uni.name}
          </span>
          <span className="block text-sm text-ink-3">
            {uni.city}, {uni.state} · {uni.type}
          </span>
        </span>
        <span className="shrink-0 text-right text-xs text-ink-3">
          {uni.years.join(", ")}
        </span>
      </Link>
    </li>
  );
}

export default function SearchResults() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const results = q ? searchUniversities(q, 24) : [];

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
        {q ? <>Results for “{q}”</> : "Search universities"}
      </h1>

      <div className="mt-6">
        <SearchBox variant="hero" autoFocus />
      </div>

      {q && results.length > 0 && (
        <>
          <p className="mt-8 text-sm text-ink-3">
            {results.length} {results.length === 1 ? "match" : "matches"}
          </p>
          <ul className="mt-3 space-y-3">
            {results.map((uni) => (
              <ResultCard key={uni.slug} uni={uni} />
            ))}
          </ul>
        </>
      )}

      {q && results.length === 0 && (
        <div className="mt-8">
          <p className="text-ink-2">
            No matches for “{q}”. Here are some popular universities:
          </p>
          <ul className="mt-3 space-y-3">
            {getPopularUniversities()
              .slice(0, 6)
              .map((uni) => (
                <ResultCard key={uni.slug} uni={uni} />
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
