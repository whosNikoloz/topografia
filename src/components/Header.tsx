"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CaretDown, List, Phone, X } from "@phosphor-icons/react";
import { LOCALES, LOCALE_NAMES, UI, t } from "@/lib/i18n";
import { NAV, href } from "@/lib/nav";
import type { Locale } from "@/lib/types";
import georgianFlag from "@/lib/logos/ka.png";
import russianFlag from "@/lib/logos/ru.png";
import englishFlag from "@/lib/logos/usa.png";
import facebookLogo from "@/lib/logos/facebook.png";

const LANGUAGE_FLAGS: Record<Locale, StaticImageData> = {
  ka: georgianFlag,
  en: englishFlag,
  ru: russianFlag,
};

const PRIMARY_NAV = NAV.filter((item) =>
  ["/about", "/services", "/prices", "/projects"].includes(item.path),
);
const SECONDARY_NAV = NAV.filter((item) =>
  ["/gallery", "/articles", "/contact"].includes(item.path),
);

export default function Header({
  locale,
  phone,
  facebook,
}: {
  locale: Locale;
  phone: string;
  facebook: string;
}) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  /** same page, different language */
  const swap = (l: Locale) => `/${l}${path.replace(/^\/[a-z]{2}(?=\/|$)/, "")}`;

  const closeDrawer = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="container-x flex h-[68px] items-center justify-between gap-6">
        <Link href={href(locale)} aria-label={t(UI.aria.home, locale)} className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt={t(UI.aria.logo, locale)} width={189} height={60} className="h-[42px] w-auto" />
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {PRIMARY_NAV.map((i) => {
            const to = href(locale, i.path);
            const active = path === to;
            return (
              <Link
                key={i.path}
                href={to}
                className={`relative py-1 text-[0.9rem] whitespace-nowrap transition-colors ${
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {t(i.label, locale)}
                {active && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-px bg-sage-deep" aria-hidden />
                )}
              </Link>
            );
          })}

          <div className="group relative -mb-4 pb-4">
            <button
              type="button"
              aria-haspopup="menu"
              className={`flex items-center gap-1 py-1 text-[0.9rem] whitespace-nowrap transition-colors ${
                SECONDARY_NAV.some((item) => path === href(locale, item.path))
                  ? "text-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {t(UI.nav.more, locale)}
              <CaretDown
                size={13}
                weight="bold"
                aria-hidden
                className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
              />
            </button>
            <div
              role="menu"
              className="invisible absolute top-full right-0 min-w-52 translate-y-2 border border-line bg-paper p-2 opacity-0 shadow-lift transition-[opacity,transform,visibility] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
            >
              {SECONDARY_NAV.map((item) => {
                const to = href(locale, item.path);
                return (
                  <Link
                    key={item.path}
                    href={to}
                    role="menuitem"
                    className={`group/item flex items-center justify-between gap-6 px-3 py-3 text-sm whitespace-nowrap transition-colors hover:bg-paper-soft ${
                      path === to ? "text-ink" : "text-ink-soft"
                    }`}
                  >
                    {t(item.label, locale)}
                    <ArrowUpRight
                      size={14}
                      aria-hidden
                      className="text-sage-deep opacity-0 transition-[opacity,transform] duration-200 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 group-hover/item:opacity-100"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1" aria-label={t(UI.aria.language, locale)}>
            {LOCALES.map((l) => (
              <Link
                key={l}
                href={swap(l)}
                hrefLang={l}
                aria-label={LOCALE_NAMES[l]}
                title={LOCALE_NAMES[l]}
                className={`rounded-full p-1 transition-[opacity,box-shadow,transform] duration-200 hover:scale-105 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep ${
                  l === locale
                    ? "shadow-[0_0_0_1.5px_var(--color-sage-deep)]"
                    : "opacity-55"
                }`}
              >
                <Image
                  src={LANGUAGE_FLAGS[l]}
                  alt=""
                  className="size-5 rounded-full object-cover sm:size-6"
                  sizes="24px"
                />
              </Link>
            ))}
          </div>

          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={t(UI.aria.facebook, locale)}
              className="hidden text-ink-soft transition-colors hover:text-ink sm:block"
            >
              <Image src={facebookLogo} alt="" className="size-5 rounded-full" sizes="20px" />
            </a>
          )}

          {phone && (
            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium whitespace-nowrap text-paper transition-colors hover:bg-ink/90 lg:inline-flex"
            >
              <Phone size={15} weight="fill" aria-hidden />
              {phone}
            </a>
          )}

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={t(UI.aria.menu, locale)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="-mr-1 p-1.5 text-ink xl:hidden"
          >
            <List size={24} weight="light" />
          </button>
        </div>
      </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] xl:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label={t(UI.aria.menu, locale)}
          onClick={closeDrawer}
          className={`absolute inset-0 bg-ink/45 transition-opacity duration-200 ease-out ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          id="mobile-navigation"
          className={`absolute inset-y-0 right-0 flex w-[min(88vw,24rem)] flex-col bg-ink text-paper shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-[68px] items-center justify-between border-b border-paper/15 px-6">
            <span className="text-xs font-medium tracking-[0.16em] text-sage uppercase">
              {t(UI.aria.menu, locale)}
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={closeDrawer}
              aria-label={t(UI.aria.menu, locale)}
              className="grid size-10 place-items-center rounded-full border border-paper/20 text-paper transition-colors hover:bg-paper/10"
            >
              <X size={20} weight="light" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-5">
            {NAV.map((item, index) => {
              const to = href(locale, item.path);
              const active = path === to;
              return (
                <Link
                  key={item.path}
                  href={to}
                  tabIndex={open ? 0 : -1}
                  onClick={closeDrawer}
                  className={`group flex items-center justify-between border-b border-paper/12 py-4 transition-colors ${
                    active ? "text-paper" : "text-paper/70 hover:text-paper"
                  }`}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="text-[0.65rem] tabular-nums text-sage">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg font-medium">{t(item.label, locale)}</span>
                  </span>
                  <ArrowUpRight
                    size={17}
                    aria-hidden
                    className={`transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      active ? "text-sage opacity-100" : "opacity-35"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {phone && (
            <div className="border-t border-paper/15 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <a
                href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                tabIndex={open ? 0 : -1}
                className="flex items-center justify-center gap-2 rounded-full bg-paper px-5 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-sage-pale"
              >
                <Phone size={16} weight="fill" aria-hidden />
                {phone}
              </a>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
