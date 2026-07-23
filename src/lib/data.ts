import type { CdsRecord, SectionKey, University } from "@/lib/types";
import { POPULAR_SLUGS, UNIVERSITIES } from "@/data/universities";
import { RECORDS } from "@/data/records";

/** All universities, sorted by name. */
export function getAllUniversities(): University[] {
  return [...UNIVERSITIES].sort((a, b) => a.name.localeCompare(b.name));
}

export function getUniversity(slug: string): University | undefined {
  return UNIVERSITIES.find((u) => u.slug === slug);
}

/** The curated home-page grid, in the order defined in the dataset. */
export function getPopularUniversities(): University[] {
  return POPULAR_SLUGS.map((slug) => getUniversity(slug)).filter(
    (u): u is University => Boolean(u),
  );
}

/** Most recent year with data for a university. */
export function getDefaultYear(slug: string): number | undefined {
  const uni = getUniversity(slug);
  if (!uni || uni.years.length === 0) return undefined;
  return Math.max(...uni.years);
}

export function getRecord(slug: string, year: number): CdsRecord | undefined {
  return RECORDS.find((r) => r.slug === slug && r.year === year);
}

/** Every (slug, year) pair with a record — used for static generation. */
export function getAllRecordParams(): { slug: string; year: string }[] {
  return RECORDS.map((r) => ({ slug: r.slug, year: String(r.year) }));
}

/**
 * Which sections are present for a record, in fixed display order.
 * A `null` section is absent and must not appear in the ToC.
 */
export function getAvailableSections(record: CdsRecord): SectionKey[] {
  const order: SectionKey[] = [
    "general",
    "enrollment",
    "admissions",
    "transfer",
    "offerings",
    "studentLife",
    "cost",
    "faculty",
    "degrees",
  ];
  return order.filter((key) => record[key] !== null);
}
