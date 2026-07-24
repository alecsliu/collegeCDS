import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { UNIVERSITIES } from "@/data/universities";
import { getAllRecordParams } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/how-it-works", "/about"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "yearly" as const,
    priority: path === "/" ? 1 : 0.6,
  }));

  const universityRoutes = UNIVERSITIES.map((u) => ({
    url: `${SITE_URL}/university/${u.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  const yearRoutes = getAllRecordParams().map(({ slug, year }) => ({
    url: `${SITE_URL}/university/${slug}/${year}`,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...universityRoutes, ...yearRoutes];
}
