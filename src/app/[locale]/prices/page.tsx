import type { Metadata } from "next";
import { Btn, PageHero } from "@/components/ui";
import { UI, t, tx } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { getContent } from "@/lib/store";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { seo } = await getContent();
  return { title: tx(seo.prices.title, locale), description: tx(seo.prices.description, locale) };
}

export default async function PricesPage({ params }: Props) {
  const { locale } = await params;
  const { prices, settings: s, seo } = await getContent();

  return (
    <>
      <PageHero title={tx(seo.prices.title, locale)} text={tx(seo.prices.description, locale)} />

      {/* Layout family: price as display figure, one hairline per row, no table chrome */}
      <div className="container-x py-4">
        <ul>
          {prices.map((p) => (
            <li key={p.id} className="rule reveal">
              <div className="grid gap-2 py-8 sm:grid-cols-12 sm:items-baseline sm:gap-8">
                <h2 className="font-medium text-balance sm:col-span-5">{tx(p.title, locale)}</h2>
                <p className="display text-2xl text-sage-deep sm:col-span-3 sm:text-[1.75rem]">
                  {tx(p.price, locale)}
                </p>
                <p className="text-sm leading-relaxed text-ink-soft sm:col-span-4">
                  {tx(p.note, locale)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="rule grid gap-8 py-12 lg:grid-cols-12 lg:items-start">
          <p className="leading-relaxed text-ink-soft lg:col-span-7">
            <strong className="font-medium text-ink">{t(UI.prices.noticeLabel, locale)}</strong>{" "}
            {t(UI.prices.notice, locale)}
          </p>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            {s.phone1 && <Btn href={`tel:${s.phone1.replace(/[^+\d]/g, "")}`}>{s.phone1}</Btn>}
            <Btn href={href(locale, "/contact")} variant="ghost">
              {t(UI.cta.priceCheck, locale)}
            </Btn>
          </div>
        </div>
      </div>
    </>
  );
}
