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
            className="group flex h-full flex-col rounded-card border border-line bg-surface p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-crimson/40 hover:shadow-[var(--shadow-lift)]"
          >
            <span
              aria-hidden="true"
              className="font-serif text-2xl font-semibold text-crimson"
            >
              {uni.shortName ?? uni.name}
            </span>
            <span className="mt-2 text-sm font-medium leading-snug text-ink">
              {uni.name}
            </span>
            <span className="mt-auto flex items-center justify-between pt-3 text-xs text-ink-3">
              <span>
                {uni.city}, {uni.state}
              </span>
              <span
                aria-hidden
                className="translate-x-0 text-crimson opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
              >
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
