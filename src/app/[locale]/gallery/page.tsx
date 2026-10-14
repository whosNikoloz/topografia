import type { Metadata } from "next";
import MediaGrid from "@/components/MediaGrid";
import { PageHero } from "@/components/ui";
import { tx } from "@/lib/i18n";
import { getContent } from "@/lib/store";
import type { Locale, Media } from "@/lib/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { seo } = await getContent();
  return { title: tx(seo.gallery.title, locale), description: tx(seo.gallery.description, locale) };
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  const { gallery, projects, seo } = await getContent();

  // ponytail: gallery = its own items + everything attached to projects, tagged by project name
  const fromProjects: Media[] = projects.flatMap((p) =>
    p.media.map((m) => ({
      ...m,
      id: `${p.id}-${m.id}`,
      category: tx(m.category, locale) ? m.category : p.title,
    })),
  );

  return (
    <>
      <PageHero title={tx(seo.gallery.title, locale)} text={tx(seo.gallery.description, locale)} />
      <div className="container-x py-14 sm:py-16">
        <MediaGrid items={[...gallery, ...fromProjects]} locale={locale} filter />
      </div>
    </>
  );
}
