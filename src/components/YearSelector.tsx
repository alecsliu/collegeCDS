"use client";

import { useRouter } from "next/navigation";

/**
 * Switches the CDS year for a university. Changing the selection changes the URL,
 * so every year view is directly linkable. Only years with data are listed.
 */
export default function YearSelector({
  slug,
  years,
  current,
}: {
  slug: string;
  years: number[];
  current: number;
}) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-ink-2">Year</span>
      <select
        value={current}
        onChange={(e) => router.push(`/university/${slug}/${e.target.value}`)}
        className="rounded-control border border-line bg-surface py-2 pl-3 pr-8 font-medium text-ink shadow-sm focus:border-crimson"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </label>
  );
}
