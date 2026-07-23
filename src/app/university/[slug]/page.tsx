import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UniversityView from "@/components/UniversityView";
import { getDefaultYear, getUniversity } from "@/lib/data";
import { UNIVERSITIES } from "@/data/universities";

export function generateStaticParams() {
  return UNIVERSITIES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const uni = getUniversity(slug);
  if (!uni) return {};
  const year = getDefaultYear(slug);
  return {
    title: `${uni.name} — Common Data Set ${year ?? ""}`.trim(),
    description: `Standardized ${year ?? ""} Common Data Set for ${uni.name}: admissions, enrollment, cost & aid, and academics.`,
    alternates: { canonical: `/university/${slug}/${year}` },
  };
}

export default async function UniversityDefaultPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const year = getDefaultYear(slug);
  if (!year) notFound();
  return <UniversityView slug={slug} year={year} />;
}
