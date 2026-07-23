import SearchBox from "@/components/SearchBox";
import PopularGrid from "@/components/PopularGrid";
import FeedbackWidget from "@/components/FeedbackWidget";
import { getPopularUniversities } from "@/lib/data";

export default function Home() {
  const popular = getPopularUniversities();

  return (
    <div className="mx-auto max-w-6xl px-5">
      {/* Hero + search */}
      <section className="mx-auto max-w-2xl pt-16 pb-14 text-center sm:pt-24">
        <p className="mb-4 text-sm font-medium uppercase tracking-wide text-crimson">
          Common Data Set
        </p>
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          University admissions and cost data, on one clean page.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
          Every school reports the same standardized figures. Read them
          here — admissions, enrollment, cost &amp; aid, and academics — without
          opening a single PDF.
        </p>

        <div className="mt-9">
          <SearchBox variant="hero" autoFocus />
          <p className="mt-3 text-sm text-ink-3">
            Handles nicknames and typos — try “NYU”, “UT Austin”, or “Penn”.
          </p>
        </div>
      </section>

      {/* Popular universities */}
      <section className="border-t border-line py-14">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            Popular universities
          </h2>
          <span className="text-sm text-ink-3">Jump straight in</span>
        </div>
        <PopularGrid universities={popular} />
      </section>

      {/* Feedback */}
      <section className="border-t border-line py-14">
        <div className="mx-auto max-w-2xl">
          <FeedbackWidget />
        </div>
      </section>
    </div>
  );
}
