"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FacebookLogo, List, Phone, X } from "@phosphor-icons/react";
import { LOCALES, LOCALE_SHORT, UI, t } from "@/lib/i18n";
import { NAV, href } from "@/lib/nav";
import type { Locale } from "@/lib/types";

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

  /** same page, different language */
  const swap = (l: Locale) => `/${l}${path.replace(/^\/[a-z]{2}(?=\/|$)/, "")}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="container-x flex h-[68px] items-center justify-between gap-6">
        <Link href={href(locale)} aria-label={t(UI.aria.home, locale)} className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt={t(UI.aria.logo, locale)} width={189} height={60} className="h-[42px] w-auto" />
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {NAV.map((i) => {
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
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1" aria-label={t(UI.aria.language, locale)}>
            {LOCALES.map((l) => (
              <Link
                key={l}
                href={swap(l)}
                hrefLang={l}
                className={`px-1.5 py-1 text-xs font-medium tracking-wide transition-colors ${
                  l === locale ? "text-ink underline underline-offset-4 decoration-sage-deep" : "text-ink-soft/70 hover:text-ink"
                }`}
              >
                {LOCALE_SHORT[l]}
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
              <FacebookLogo size={20} weight="light" />
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
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={t(UI.aria.menu, locale)}
            aria-expanded={open}
            className="-mr-1 p-1.5 text-ink xl:hidden"
          >
            {open ? <X size={24} weight="light" /> : <List size={24} weight="light" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper xl:hidden">
          <div className="container-x py-2">
            {NAV.map((i) => {
              const to = href(locale, i.path);
              return (
                <Link
                  key={i.path}
                  href={to}
                  onClick={() => setOpen(false)}
                  className={`rule block py-3.5 ${path === to ? "text-ink" : "text-ink-soft"}`}
                >
                  {t(i.label, locale)}
                </Link>
              );
            })}
            {phone && (
              <a
                href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                className="my-4 flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 font-medium text-paper"
              >
                <Phone size={16} weight="fill" aria-hidden />
                {phone}
              </a>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
