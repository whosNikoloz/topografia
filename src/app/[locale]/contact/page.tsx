import type { Metadata } from "next";
import { Clock, EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { PageHero } from "@/components/ui";
import { UI, t, tx } from "@/lib/i18n";
import { getContent } from "@/lib/store";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { seo } = await getContent();
  return { title: tx(seo.contact.title, locale), description: tx(seo.contact.description, locale) };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const { settings: s, seo } = await getContent();
  const tel = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;

  return (
    <>
      <PageHero title={tx(seo.contact.title, locale)} text={tx(seo.contact.description, locale)} />

      {/* Layout family: detail column on hairlines beside a full-height map */}
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
        <div className="lg:col-span-5">
          <dl className="grid gap-7">
            {(s.phone1 || s.phone2) && (
              <div className="rule flex gap-4 pt-5">
                <Phone size={20} weight="light" className="mt-0.5 shrink-0 text-sage-deep" aria-hidden />
                <div>
                  <dt className="text-sm text-ink-soft">{t(UI.contact.phone, locale)}</dt>
                  <dd className="mt-1.5 grid gap-1 text-lg">
                    {s.phone1 && (
                      <a href={tel(s.phone1)} className="transition-colors hover:text-sage-deep">
                        {s.phone1}
                      </a>
                    )}
                    {s.phone2 && (
                      <a href={tel(s.phone2)} className="transition-colors hover:text-sage-deep">
                        {s.phone2}
                      </a>
                    )}
                  </dd>
                </div>
              </div>
            )}

            {s.email && (
              <div className="rule flex gap-4 pt-5">
                <EnvelopeSimple size={20} weight="light" className="mt-0.5 shrink-0 text-sage-deep" aria-hidden />
                <div>
                  <dt className="text-sm text-ink-soft">{t(UI.contact.email, locale)}</dt>
                  <dd className="mt-1.5 text-lg">
                    <a href={`mailto:${s.email}`} className="transition-colors hover:text-sage-deep">
                      {s.email}
                    </a>
                  </dd>
                </div>
              </div>
            )}

            {tx(s.address, locale) && (
              <div className="rule flex gap-4 pt-5">
                <MapPin size={20} weight="light" className="mt-0.5 shrink-0 text-sage-deep" aria-hidden />
                <div>
                  <dt className="text-sm text-ink-soft">{t(UI.contact.address, locale)}</dt>
                  <dd className="mt-1.5">{tx(s.address, locale)}</dd>
                </div>
              </div>
            )}

            {tx(s.working_hours, locale) && (
              <div className="rule flex gap-4 pt-5">
                <Clock size={20} weight="light" className="mt-0.5 shrink-0 text-sage-deep" aria-hidden />
                <div>
                  <dt className="text-sm text-ink-soft">{t(UI.contact.hours, locale)}</dt>
                  <dd className="mt-1.5">{tx(s.working_hours, locale)}</dd>
                </div>
              </div>
            )}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            {s.whatsapp && (
              <a
                href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-sage hover:bg-sage-pale/60"
              >
                WhatsApp
              </a>
            )}
            {s.messenger && (
              <a
                href={`https://m.me/${s.messenger}`}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-sage hover:bg-sage-pale/60"
              >
                Messenger
              </a>
            )}
            {s.facebook && (
              <a
                href={s.facebook}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-sage hover:bg-sage-pale/60"
              >
                Facebook
              </a>
            )}
          </div>
        </div>

        {s.map_embed && (
          <div className="overflow-hidden rounded-surface border border-line lg:col-span-7">
            <iframe
              src={s.map_embed}
              title={t(UI.contact.map, locale)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full lg:h-full lg:min-h-[32rem]"
            />
          </div>
        )}
      </div>
    </>
  );
}
