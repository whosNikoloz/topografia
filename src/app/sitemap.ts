import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { projects, articles } = await getContent();

  const pages = ["", "/about", "/services", "/prices", "/projects", "/gallery", "/articles", "/contact"];

  return LOCALES.flatMap((l) => [
    ...pages.map((p) => ({
      url: `${base}/${l}${p}`,
      changeFrequency: "monthly" as const,
      priority: p ? 0.7 : 1,
    })),
    ...projects.map((p) => ({ url: `${base}/${l}/projects/${p.slug}`, lastModified: p.date || undefined })),
    ...articles.map((a) => ({ url: `${base}/${l}/articles/${a.slug}`, lastModified: a.date || undefined })),
  ]);
}
