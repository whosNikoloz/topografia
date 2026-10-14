import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Btn } from "@/components/ui";
import { UI, t, tx } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { getContent } from "@/lib/store";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

async function find(slug: string) {
  const { articles } = await getContent();
  return articles.find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const a = await find(slug);
  if (!a) return {};
  return {
    title: tx(a.seo_title, locale) || tx(a.title, locale),
    description: tx(a.seo_description, locale) || tx(a.excerpt, locale).slice(0, 160),
    openGraph: { type: "article", images: a.cover ? [a.cover] : [], publishedTime: a.date },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const a = await find(slug);
  if (!a) notFound();

  return (
    <article>
      <header className="container-x max-w-3xl pt-12 pb-10 sm:pt-16">
        <Link
          href={href(locale, "/articles")}
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} aria-hidden />
          {t(UI.article.backToList, locale)}
        </Link>
        <p className="mt-10 flex gap-4 text-sm text-ink-soft">
          <time dateTime={a.date} className="tabular-nums">
            {a.date}
          </time>
          {tx(a.category, locale) && <span>{tx(a.category, locale)}</span>}
        </p>
        <h1 className="display mt-3 text-3xl text-balance sm:text-[2.75rem]">{tx(a.title, locale)}</h1>
        {tx(a.excerpt, locale) && (
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{tx(a.excerpt, locale)}</p>
        )}
      </header>

      {a.cover && (
        <div className="container-x max-w-5xl">
          <div className="relative aspect-16/9 overflow-hidden rounded-surface bg-paper-soft">
            <Image
              src={a.cover}
              alt={tx(a.title, locale)}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 64rem"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="container-x max-w-3xl py-14 sm:py-20">
        <div className="prose-ge" dangerouslySetInnerHTML={{ __html: tx(a.body, locale) }} />

        <aside className="rule mt-16 pt-10">
          <h2 className="display text-xl">{t(UI.article.questionsTitle, locale)}</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">{t(UI.article.questionsText, locale)}</p>
          <div className="mt-7">
            <Btn href={href(locale, "/contact")}>{t(UI.cta.contactUs, locale)}</Btn>
          </div>
        </aside>
      </div>
    </article>
  );
}
