import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PageHero } from "@/components/ui";
import { UI, t, tx } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { getContent } from "@/lib/store";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { seo } = await getContent();
  return { title: tx(seo.projects.title, locale), description: tx(seo.projects.description, locale) };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const { projects, seo } = await getContent();

  return (
    <>
      <PageHero title={tx(seo.projects.title, locale)} text={tx(seo.projects.description, locale)} />

      <div className="container-x py-16 sm:py-20">
        {projects.length === 0 ? (
          <p className="py-16 text-center text-ink-soft">{t(UI.project.empty, locale)}</p>
        ) : (
          /* Layout family: staggered 2-col, every other item offset down */
          <ul className="grid gap-x-10 gap-y-16 sm:grid-cols-2">
            {projects.map((p, i) => (
              <li key={p.id} className={`reveal ${i % 2 === 1 ? "sm:mt-20" : ""}`}>
                <Link href={href(locale, `/projects/${p.slug}`)} className="group block">
                  <span className="relative block aspect-4/3 overflow-hidden rounded-surface bg-paper-soft">
                    {p.cover && (
                      <Image
                        src={p.cover}
                        alt={tx(p.title, locale)}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, 45vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    )}
                  </span>
                  <span className="mt-5 flex flex-wrap gap-x-4 text-sm text-ink-soft">
                    {tx(p.location, locale) && <span>{tx(p.location, locale)}</span>}
                    {p.date && <span className="tabular-nums">{p.date}</span>}
                  </span>
                  <span className="mt-2 flex items-start gap-2">
                    <span className="display text-xl text-balance sm:text-2xl">
                      {tx(p.title, locale)}
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="mt-1.5 shrink-0 text-sage-deep transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                  <span className="mt-3 line-clamp-2 block leading-relaxed text-ink-soft">
                    {tx(p.description, locale)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
