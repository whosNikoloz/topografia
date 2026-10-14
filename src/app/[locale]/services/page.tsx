import type { Metadata } from "next";
import ServiceIcon from "@/components/ServiceIcon";
import { Btn, PageHero, Section } from "@/components/ui";
import { UI, t, tx } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { getContent } from "@/lib/store";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { seo } = await getContent();
  return { title: tx(seo.services.title, locale), description: tx(seo.services.description, locale) };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const { services, seo } = await getContent();

  return (
    <>
      <PageHero title={tx(seo.services.title, locale)} text={tx(seo.services.description, locale)} />

      {/* Layout family: full-width stacked rows, number + icon + copy on a 12-col grid */}
      <div className="container-x">
        <ul>
          {services.map((sv, i) => (
            <li key={sv.id} className="rule reveal">
              <article className="grid gap-4 py-10 sm:grid-cols-12 sm:gap-8 lg:py-14">
                <div className="flex items-center gap-4 sm:col-span-3 sm:block">
                  <span className="text-sm text-ink-soft/60 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sage-deep sm:mt-4 sm:block">
                    <ServiceIcon name={sv.icon} size={30} />
                  </span>
                </div>
                <h2 className="display text-xl text-balance sm:col-span-4 sm:text-2xl">
                  {tx(sv.title, locale)}
                </h2>
                <p className="leading-relaxed text-ink-soft sm:col-span-5">
                  {tx(sv.description, locale)}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <Section tone="tint" className="mt-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-lg text-lg leading-relaxed text-balance">
            {t(UI.services.notFound, locale)}
          </p>
          <div className="flex shrink-0 gap-3">
            <Btn href={href(locale, "/prices")} variant="ghost">
              {t(UI.nav.prices, locale)}
            </Btn>
            <Btn href={href(locale, "/contact")}>{t(UI.cta.contactUs, locale)}</Btn>
          </div>
        </div>
      </Section>
    </>
  );
}
