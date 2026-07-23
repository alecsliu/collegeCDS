import type { Metadata } from "next";
import { Suspense } from "react";
import SearchResults from "@/components/SearchResults";

export const metadata: Metadata = {
  title: "Search",
  description: "Search universities by name or nickname.",
  robots: { index: false },
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}
