import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="no-print mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Data derived from institutions’ published Common Data Sets. Figures
          shown are illustrative mock data.
        </p>
        <nav className="flex gap-5">
          <Link href="/" className="hover:text-crimson">
            Home
          </Link>
          <Link href="/about" className="hover:text-crimson">
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
}
