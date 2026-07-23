import SearchBox from "@/components/SearchBox";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="mb-4 text-sm font-medium uppercase tracking-wide text-crimson">
        Not found
      </p>
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
        We couldn’t find that page.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-ink-2">
        The university or year you’re looking for isn’t available yet. Try a
        search — it handles nicknames and typos.
      </p>
      <div className="mx-auto mt-8 max-w-md">
        <SearchBox variant="hero" />
      </div>
    </div>
  );
}
