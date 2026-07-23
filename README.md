# Common Data Set webapp

A web app that presents university [Common Data Set](https://commondataset.org/) (CDS)
information in a standardized, on-page format. Search for a university, then read
its CDS data for a given year on one clean page — no PDFs, spreadsheets, or
downloads.

This is the **frontend MVP** ("MVP of the MVP"): it runs entirely against a mock
dataset. No scraper, database, or live pipeline is required to build, review, or
demo it. The mock data is shaped like the eventual pipeline output, so the two
workstreams stay cleanly decoupled.

## Features

- **Home** — value prop, a prominent forgiving search, a popular-universities
  grid, and collapsible feedback.
- **University / year pages** (`/university/[slug]` and `/university/[slug]/[year]`)
  with a fixed, identical structure for every school: header + year selector, a
  collapsible section table of contents, CDS content sections (Admissions,
  Enrollment & outcomes, Cost & aid, Academics & faculty), a sourcing note, and
  per-page feedback that auto-captures the school + year + URL.
- **Smart search** — nickname/abbreviation aliases plus typo-tolerant fuzzy
  matching (`New Work university` → New York University), powered by Fuse.js.
- **Crimson / academic design system** — one accent, editorial serif headings, a
  legible sans with tabular numerals, and explicit "Not reported" states so
  missing data is never hidden.
- **Accessible & shareable** — keyboard-navigable search/ToC/year selector, skip
  link, `prefers-reduced-motion` support, per-page canonical URLs, dynamic Open
  Graph images, `sitemap.xml`/`robots.txt`, JSON-LD, and a print / save-as-PDF view.
- **Dedicated search page** (`/search?q=`) in addition to the live dropdown, with
  match highlighting and popular-school fallbacks (never a dead end).

## Tech

- [Next.js](https://nextjs.org) 16 (App Router) — university/year pages are
  statically generated; the feedback route is a serverless function.
- TypeScript, [Tailwind CSS](https://tailwindcss.com) v4, [Fuse.js](https://fusejs.io).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (static generation)
```

## Project structure

```
src/
  app/                     routes (home, /about, /university/*, /api/feedback)
  components/              SearchBox, CdsSections, DataTable, FeedbackWidget, …
  data/
    universities.ts        university metadata, aliases, popular list
    records.ts             mock CDS records (source-of-truth contract)
  lib/
    types.ts               the CDS data contract (TypeScript schema)
    data.ts                data accessors
    search.ts              alias + fuzzy search
    format.ts              value formatting ("Not reported" handling)
```

## The data contract

`src/lib/types.ts` is the documented schema the future ingest pipeline must
fulfill. Any field typed `... | null` may render as "Not reported"; a whole
section typed `... | null` is absent for that university/year and is dropped from
the table of contents (see `ut-austin`, which omits Academics).

## Roadmap

- **MVP** — real ingest pipeline, database + private file storage, persisted
  feedback.
- **V2+** — university comparison, multi-year trends & charts, blog.

> Figures shown in the app are illustrative mock data, not authoritative CDS
> values.
