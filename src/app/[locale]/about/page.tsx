import Image from "next/image";
import type { Metadata } from "next";
import { Btn, PageHero, Section } from "@/components/ui";
import { UI, t, tx } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { getContent } from "@/lib/store";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { seo } = await getContent();
  return { title: tx(seo.about.title, locale), description: tx(seo.about.description, locale) };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const { settings: s, seo } = await getContent();

  return (
    <>
      <PageHero title={tx(seo.about.title, locale)} text={tx(s.about_short, locale)} />

      {/* Layout family: full-bleed banner image, then a single reading column */}
      <div className="container-x pt-10">
        <div className="relative aspect-21/9 overflow-hidden rounded-surface bg-paper-soft">
          <Image
            src="/uploads/services-overview.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="container-x py-16 sm:py-20">
        <article className="prose-ge reveal" dangerouslySetInnerHTML={{ __html: tx(s.about_body, locale) }} />
      </div>

      <Section tone="tint">
        <div className="flex flex-wrap gap-3">
          <Btn href={href(locale, "/contact")}>{t(UI.cta.contactUs, locale)}</Btn>
          <Btn href={href(locale, "/projects")} variant="ghost">
            {t(UI.cta.ourProjects, locale)}
          </Btn>
        </div>
      </Section>
    </>
  );
}
