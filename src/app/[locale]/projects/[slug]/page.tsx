import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import MediaGrid from "@/components/MediaGrid";
import { Btn, Section } from "@/components/ui";
import { UI, t, tx } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { getContent } from "@/lib/store";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

async function find(slug: string) {
  const { projects } = await getContent();
  return projects.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = await find(slug);
  if (!p) return {};
  return {
    title: tx(p.seo_title, locale) || tx(p.title, locale),
    description: tx(p.seo_description, locale) || tx(p.description, locale).slice(0, 160),
    openGraph: { images: p.cover ? [p.cover] : [] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const p = await find(slug);
  if (!p) notFound();

  return (
    <>
      <header className="container-x pt-12 pb-10 sm:pt-16">
        <Link
          href={href(locale, "/projects")}
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} aria-hidden />
          {t(UI.project.backToList, locale)}
        </Link>
        <h1 className="display mt-10 max-w-4xl text-3xl text-balance sm:text-5xl">
          {tx(p.title, locale)}
        </h1>
      </header>

      {p.cover && (
        <div className="container-x">
          <div className="relative aspect-16/9 overflow-hidden rounded-surface bg-paper-soft">
            <Image
              src={p.cover}
              alt={tx(p.title, locale)}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Layout family: sticky meta column beside the description */}
      <div className="container-x grid gap-10 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
        <dl className="grid h-fit gap-6 text-sm lg:sticky lg:top-28 lg:col-span-4">
          {tx(p.location, locale) && (
            <div className="rule pt-4">
              <dt className="text-ink-soft">{t(UI.project.location, locale)}</dt>
              <dd className="mt-1 font-medium">{tx(p.location, locale)}</dd>
            </div>
          )}
          {p.date && (
            <div className="rule pt-4">
              <dt className="text-ink-soft">{t(UI.project.date, locale)}</dt>
              <dd className="mt-1 font-medium tabular-nums">{p.date}</dd>
            </div>
          )}
        </dl>
        <p className="text-lg leading-relaxed whitespace-pre-line text-ink-soft lg:col-span-8">
          {tx(p.description, locale)}
        </p>
      </div>

      <Section tone="soft">
        <h2 className="display mb-10 text-2xl">{t(UI.project.media, locale)}</h2>
        <MediaGrid items={p.media} locale={locale} />
      </Section>

      <div className="container-x flex flex-wrap gap-3 py-16">
        <Btn href={href(locale, "/contact")}>{t(UI.cta.similarProject, locale)}</Btn>
        <Btn href={href(locale, "/projects")} variant="ghost">
          {t(UI.cta.otherProjects, locale)}
        </Btn>
      </div>
    </>
  );
}
