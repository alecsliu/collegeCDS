import { notFound } from "next/navigation";
import CdsSections from "@/components/CdsSections";
import YearSelector from "@/components/YearSelector";
import SourcingNote from "@/components/SourcingNote";
import FeedbackWidget from "@/components/FeedbackWidget";
import { getAvailableSections, getRecord, getUniversity } from "@/lib/data";

/**
 * The core university/year screen. Fixed, identical structure for every school:
 * header + year selector, collapsible section ToC + content, sourcing note,
 * and a per-page feedback widget that captures this school and year.
 */
export default function UniversityView({
  slug,
  year,
}: {
  slug: string;
  year: number;
}) {
  const university = getUniversity(slug);
  const record = university && getRecord(slug, year);
  if (!university || !record) notFound();

  const available = getAvailableSections(record);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      {/* Header */}
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {university.name}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-ink-2">
            <span>
              {university.city}, {university.state}
            </span>
            <span aria-hidden className="text-line">
              •
            </span>
            <span>{university.type}</span>
          </p>
        </div>
        <YearSelector slug={slug} years={university.years} current={year} />
      </header>

      <CdsSections record={record} available={available} />

      <SourcingNote name={university.name} year={year} />

      <div className="mt-8">
        <FeedbackWidget
          context={{ slug, year }}
          title="Spot an error on this page?"
        />
      </div>
    </div>
  );
}
