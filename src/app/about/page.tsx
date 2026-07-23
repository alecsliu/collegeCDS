import type { Metadata } from "next";
import Link from "next/link";
import { SECTIONS } from "@/lib/types";

export const metadata: Metadata = {
  title: "About",
  description:
    "What the Common Data Set is, how to read it, and where this site's data comes from.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <p className="mb-4 text-sm font-medium uppercase tracking-wide text-crimson">
        About
      </p>
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink">
        What the Common Data Set is
      </h1>

      <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-2">
        <p>
          The Common Data Set (CDS) is a standardized questionnaire that nearly
          every U.S. college completes each year. Because every school answers
          the same numbered questions, the same figures — acceptance rate, test
          ranges, cost, retention — can be read the same way from one school to
          the next.
        </p>
        <p>
          In practice, that data usually lives inside a PDF, Word document, or
          spreadsheet buried on a university’s institutional-research page. This
          site parses those files and presents the figures on one clean,
          consistent page per university and year — no downloads required.
        </p>
      </div>

      <h2 className="mt-12 font-serif text-2xl font-semibold text-ink">
        How to read a university page
      </h2>
      <p className="mt-3 text-ink-2">
        Each page groups the CDS into four sections. The official CDS reference
        is shown alongside each plain-language label so you can trace any figure
        back to the source form.
      </p>
      <ul className="mt-5 space-y-3">
        {SECTIONS.map((s) => (
          <li
            key={s.key}
            className="flex items-baseline justify-between gap-4 border-b border-line pb-3"
          >
            <div>
              <span className="font-medium text-ink">{s.title}</span>
              <span className="ml-2 text-sm text-ink-3">{s.cdsRef}</span>
              <p className="text-sm text-ink-2">{s.blurb}</p>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 font-serif text-2xl font-semibold text-ink">
        Sourcing
      </h2>
      <p className="mt-3 text-ink-2">
        Data is derived from each institution’s own published Common Data Set and
        attributed to that school. Raw source files are never re-hosted or shown
        here — only the parsed figures. Where a field isn’t reported, the page
        says so explicitly rather than hiding it.
      </p>
      <p className="mt-4 text-sm text-ink-3">
        This is an early prototype: the figures shown are illustrative mock data,
        not authoritative CDS values.
      </p>

      <div className="mt-12">
        <Link
          href="/"
          className="text-sm font-medium text-crimson hover:text-crimson-dark"
        >
          ← Back to search
        </Link>
      </div>
    </div>
  );
}
