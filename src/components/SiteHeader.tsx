"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBox from "@/components/SearchBox";

export default function SiteHeader() {
  const pathname = usePathname();
  // The home page has the hero search as its center of gravity — no compact
  // duplicate in the header there.
  const showSearch = pathname !== "/";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
        <Link href="/" className="flex shrink-0 items-baseline gap-2">
          <span className="font-serif text-xl font-semibold tracking-tight text-crimson">
            CDS
          </span>
          <span className="hidden text-sm text-ink-2 sm:inline">
            Common Data Set
          </span>
        </Link>

        {showSearch && (
          <div className="ml-auto w-full max-w-xs">
            <SearchBox variant="compact" />
          </div>
        )}

        <nav className={showSearch ? "shrink-0" : "ml-auto shrink-0"}>
          <Link
            href="/about"
            className="text-sm text-ink-2 hover:text-crimson"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
