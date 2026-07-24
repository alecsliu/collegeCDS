import type { Metadata } from "next";
import Link from "next/link";
import { SECTIONS } from "@/lib/types";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How to read a university page: the CDS sections A–J, the Highlights vs. Full CDS views, unreported (NR) fields, and how calculated metrics like acceptance rate are derived.",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <p className="mb-4 text-sm font-medium uppercase tracking-wide text-crimson">
        How it works
      </p>
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink">
        Reading a university page
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-ink-2">
        Every university page has the same fixed structure, so any two schools
        line up field for field. Here’s how to get around it.
      </p>

      {/* Sections */}
      <h2 className="mt-12 font-serif text-2xl font-semibold text-ink">
        The sections
      </h2>
      <p className="mt-3 text-ink-2">
        The Common Data Set is organized into standardized sections, A through J.
        Each page presents them all, in that order. Use the table of contents on
        the left to jump straight to what you care about.
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

      {/* Highlights vs Full */}
      <h2 className="mt-12 font-serif text-2xl font-semibold text-ink">
        Highlights vs. Full CDS
      </h2>
      <p className="mt-3 text-ink-2">
        Each page opens in <strong>Highlights</strong> — the figures most people
        come for. Switch to <strong>Full CDS</strong> (top-right of the data) to
        expand every reported field: score distributions, aid tables, enrollment
        breakdowns, and more. Printing or saving to PDF always outputs the
        complete Full CDS, whichever view you’re in.
      </p>

      {/* NR */}
      <h2 className="mt-12 font-serif text-2xl font-semibold text-ink">
        “NR” means not reported
      </h2>
      <p className="mt-3 text-ink-2">
        The CDS is a voluntary form, and schools don’t always answer every item.
        Where a field is blank on a university’s own CDS, we show{" "}
        <span className="font-semibold text-ink-2">NR</span> rather than hiding
        the row — so a gap in the data is always visible, never disguised as a
        zero.
      </p>

      {/* Derived metrics */}
      <h2 className="mt-12 font-serif text-2xl font-semibold text-ink">
        Calculated metrics
      </h2>
      <p className="mt-3 text-ink-2">
        A few figures aren’t reported directly on the CDS but are calculated from
        fields that are — for example, <strong>acceptance rate</strong> is
        admitted ÷ applied. These are computed the same way for every school, so
        they stay comparable. Where a calculated figure appears, we note how it’s
        derived so you can trace it back to the underlying CDS numbers.
      </p>

      {/* Sourcing */}
      <h2 className="mt-12 font-serif text-2xl font-semibold text-ink">
        Where the data comes from
      </h2>
      <p className="mt-3 text-ink-2">
        Figures are derived from each institution’s own published Common Data Set
        and attributed to that school. Raw source files are never re-hosted or
        shown here — only the parsed figures.
      </p>
      <p className="mt-4 text-sm text-ink-3">
        This is an early prototype: the figures shown are illustrative mock data,
        not authoritative CDS values.
      </p>

      <div className="mt-12 flex gap-5 text-sm">
        <Link href="/" className="font-medium text-crimson hover:text-crimson-dark">
          ← Back to search
        </Link>
        <Link href="/about" className="text-ink-2 hover:text-crimson">
          About this project
        </Link>
      </div>
    </div>
  );
}
