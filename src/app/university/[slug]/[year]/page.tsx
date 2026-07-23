import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UniversityView from "@/components/UniversityView";
import { getAllRecordParams, getUniversity } from "@/lib/data";

export function generateStaticParams() {
  return getAllRecordParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; year: string }>;
}): Promise<Metadata> {
  const { slug, year } = await params;
  const uni = getUniversity(slug);
  if (!uni) return {};
  return {
    title: `${uni.name} — Common Data Set ${year}`,
    description: `Standardized ${year} Common Data Set for ${uni.name}: admissions, enrollment, cost & aid, and academics.`,
    alternates: { canonical: `/university/${slug}/${year}` },
  };
}

export default async function UniversityYearPage({
  params,
}: {
  params: Promise<{ slug: string; year: string }>;
}) {
  const { slug, year } = await params;
  const parsed = Number(year);
  if (!Number.isInteger(parsed)) notFound();
  return <UniversityView slug={slug} year={parsed} />;
}
