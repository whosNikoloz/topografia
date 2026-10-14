import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import HeroVideo from "@/components/HeroVideo";
import ServiceIcon from "@/components/ServiceIcon";
import { Btn, Lede, Section } from "@/components/ui";
import { UI, t, tx } from "@/lib/i18n";
import { href } from "@/lib/nav";
import { getContent } from "@/lib/store";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { seo } = await getContent();
  return { title: tx(seo.home.title, locale), description: tx(seo.home.description, locale) };
}

/* Four sections only: hero, services, projects, contact. */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const { settings: s, services, projects } = await getContent();

  return (
    <>
      {/* 1. HERO, full-bleed video with a short statement over it */}
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden lg:min-h-[86svh]">
        <HeroVideo src="/uploads/hero-bg.mp4" poster={s.hero_image || "/uploads/hero-poster.jpg"} />
        {/* scrim: keeps the headline at AA contrast over any frame of the footage */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/25"
          aria-hidden
        />

        <div className="container-x relative pt-28 pb-14 sm:pb-20">
          <h1 className="display max-w-3xl text-[2.1rem] text-balance text-paper sm:text-[2.9rem] lg:text-[3.4rem]">
            {tx(s.hero_title, locale)}
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-sage-pale/90 sm:text-lg">
            {tx(s.hero_subtitle, locale)}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Btn href={href(locale, "/contact")} variant="onInk">
              {t(UI.cta.contactUs, locale)}
              <ArrowRight size={17} weight="bold" aria-hidden />
            </Btn>
            <a
              href={href(locale, "/projects")}
              className="inline-flex items-center rounded-full border border-paper/40 px-7 py-3.5 text-[0.95rem] font-medium text-paper transition-colors hover:bg-paper/10"
            >
              {t(UI.cta.ourProjects, locale)}
            </a>
          </div>
        </div>
      </section>

      {/* 2. SERVICES, two columns on hairlines */}
      <Section>
        <Lede title={t(UI.home.servicesTitle, locale)} text={tx(s.about_short, locale)} />
        <ul className="mt-14 grid gap-x-16 sm:grid-cols-2">
          {services.map((sv) => (
            <li key={sv.id} className="rule reveal py-7">
              <div className="flex items-start gap-5">
                <span className="mt-0.5 shrink-0 text-sage-deep">
                  <ServiceIcon name={sv.icon} />
                </span>
                <div>
                  <h3 className="font-medium">{tx(sv.title, locale)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {tx(sv.description, locale)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-3">
          <Btn href={href(locale, "/services")} variant="ghost">
            {t(UI.cta.allServices, locale)}
          </Btn>
          <Btn href={href(locale, "/prices")} variant="ghost">
            {t(UI.nav.prices, locale)}
          </Btn>
        </div>
      </Section>

      {/* 3. PROJECTS */}
      {projects.length > 0 && (
        <Section tone="soft">
          <Lede title={t(UI.home.projectsTitle, locale)} />
          <ul className="mt-14 grid gap-x-10 gap-y-14 sm:grid-cols-2">
            {projects.slice(0, 2).map((p) => (
              <li key={p.id} className="reveal">
                <Link href={href(locale, `/projects/${p.slug}`)} className="group block">
                  <span className="relative block aspect-4/3 overflow-hidden rounded-surface bg-paper">
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
                  <span className="mt-5 block text-sm text-ink-soft">{tx(p.location, locale)}</span>
                  <span className="mt-1.5 flex items-start gap-2">
                    <span className="display text-xl text-balance sm:text-2xl">
                      {tx(p.title, locale)}
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="mt-1.5 shrink-0 text-sage-deep transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <Btn href={href(locale, "/projects")} variant="ghost">
              {t(UI.cta.allProjects, locale)}
            </Btn>
          </div>
        </Section>
      )}

      {/* 4. CONTACT */}
      <Section tone="ink">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 className="display text-3xl text-balance sm:text-4xl">{t(UI.home.ctaTitle, locale)}</h2>
            <p className="mt-5 max-w-xl leading-relaxed text-sage-pale/80">
              {t(UI.home.ctaText, locale)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            {s.phone1 && (
              <Btn href={`tel:${s.phone1.replace(/[^+\d]/g, "")}`} variant="onInk">
                {s.phone1}
              </Btn>
            )}
            {s.whatsapp && (
              <a
                href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center rounded-full border border-paper/30 px-7 py-3.5 text-[0.95rem] font-medium text-paper transition-colors hover:bg-paper/10"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
