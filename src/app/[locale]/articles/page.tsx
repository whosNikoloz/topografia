import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { UI, t, tx } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { getContent } from "@/lib/store";
import type { Locale } from "@/lib/types";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ cat?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { seo } = await getContent();
  return { title: tx(seo.articles.title, locale), description: tx(seo.articles.description, locale) };
}

// Category filter is plain links plus ?cat=, no client JS needed
export default async function ArticlesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { cat } = await searchParams;
  const { articles, seo } = await getContent();

  const ALL = t(UI.gallery.all, locale);
  const cats = [ALL, ...new Set(articles.map((a) => tx(a.category, locale)).filter(Boolean))];
  const active = cat && cats.includes(cat) ? cat : ALL;
  const shown = active === ALL ? articles : articles.filter((a) => tx(a.category, locale) === active);

  return (
    <>
      <PageHero title={tx(seo.articles.title, locale)} text={tx(seo.articles.description, locale)} />

      <div className="container-x py-14 sm:py-16">
        {cats.length > 2 && (
          <div className="mb-12 flex flex-wrap gap-x-6 gap-y-2">
            {cats.map((c) => (
              <Link
                key={c}
                href={
                  c === ALL
                    ? href(locale, "/articles")
                    : href(locale, `/articles?cat=${encodeURIComponent(c)}`)
                }
                className={`py-1 text-sm transition-colors ${
                  active === c
                    ? "text-ink underline decoration-sage-deep underline-offset-[6px]"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        )}

        {shown.length === 0 ? (
          <p className="py-16 text-center text-ink-soft">{t(UI.article.empty, locale)}</p>
        ) : (
          /* Layout family: wide editorial rows, image right, date leading */
          <ul>
            {shown.map((a) => (
              <li key={a.id} className="rule reveal">
                <Link
                  href={href(locale, `/articles/${a.slug}`)}
                  className="group grid gap-5 py-9 sm:grid-cols-12 sm:gap-8"
                >
                  <div className="order-2 sm:order-1 sm:col-span-8 lg:col-span-7">
                    <p className="flex gap-4 text-sm text-ink-soft">
                      <time dateTime={a.date} className="tabular-nums">
                        {a.date}
                      </time>
                      {tx(a.category, locale) && <span>{tx(a.category, locale)}</span>}
                    </p>
                    <h2 className="display mt-3 text-xl text-balance transition-colors group-hover:text-sage-deep sm:text-2xl">
                      {tx(a.title, locale)}
                    </h2>
                    <p className="mt-3 line-clamp-2 leading-relaxed text-ink-soft">
                      {tx(a.excerpt, locale)}
                    </p>
                  </div>
                  {a.cover && (
                    <div className="relative order-1 aspect-16/10 overflow-hidden rounded-surface bg-paper-soft sm:order-2 sm:col-span-4 sm:aspect-4/3 lg:col-start-9">
                      <Image
                        src={a.cover}
                        alt={tx(a.title, locale)}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, 30vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
