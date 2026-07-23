import Link from "next/link";
import type { University } from "@/lib/types";

/**
 * Grid of direct-entry cards for popular universities. Each card links to that
 * school's most-recent-year page. A wordmark stands in for a logo.
 */
export default function PopularGrid({
  universities,
}: {
  universities: University[];
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {universities.map((uni) => (
        <li key={uni.slug}>
          <Link
            href={`/university/${uni.slug}`}
            className="group flex h-full flex-col rounded-card border border-line bg-surface p-4 transition-colors hover:border-crimson"
          >
            <span
              aria-hidden="true"
              className="font-serif text-2xl font-semibold text-crimson"
            >
              {uni.shortName ?? uni.name}
            </span>
            <span className="mt-2 text-sm font-medium leading-snug text-ink group-hover:text-crimson">
              {uni.name}
            </span>
            <span className="mt-1 text-xs text-ink-3">
              {uni.city}, {uni.state}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
