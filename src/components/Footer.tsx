import Link from "next/link";
import { UI, t, tx } from "@/lib/i18n";
import { NAV, href } from "@/lib/nav";
import type { Locale, Settings } from "@/lib/types";

export default function Footer({ s, locale }: { s: Settings; locale: Locale }) {
  const tel = (p: string) => `tel:${p.replace(/[^+\d]/g, "")}`;
  const link = "text-sage-pale/70 transition-colors hover:text-paper";

  return (
    <footer className="bg-ink text-paper">
      <div className="container-x grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-white.png"
            alt={t(UI.aria.logo, locale)}
            width={189}
            height={60}
            className="h-[46px] w-auto"
          />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-sage-pale/70">
            {tx(s.footer_text, locale)}
          </p>
        </div>

        <nav className="lg:col-span-3">
          <h2 className="text-xs font-medium tracking-[0.12em] text-sage uppercase">
            {t(UI.footer.menu, locale)}
          </h2>
          <ul className="mt-5 grid gap-2.5 text-sm">
            {NAV.map((i) => (
              <li key={i.path}>
                <Link href={href(locale, i.path)} className={link}>
                  {t(i.label, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="text-xs font-medium tracking-[0.12em] text-sage uppercase">
            {t(UI.footer.contact, locale)}
          </h2>
          <ul className="mt-5 grid gap-2.5 text-sm text-sage-pale/70">
            {s.phone1 && (
              <li>
                <a href={tel(s.phone1)} className={link}>
                  {s.phone1}
                </a>
              </li>
            )}
            {s.phone2 && (
              <li>
                <a href={tel(s.phone2)} className={link}>
                  {s.phone2}
                </a>
              </li>
            )}
            {s.email && (
              <li>
                <a href={`mailto:${s.email}`} className={link}>
                  {s.email}
                </a>
              </li>
            )}
            {tx(s.address, locale) && <li className="pt-1">{tx(s.address, locale)}</li>}
            {tx(s.working_hours, locale) && <li>{tx(s.working_hours, locale)}</li>}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xs font-medium tracking-[0.12em] text-sage uppercase">
            {t(UI.footer.social, locale)}
          </h2>
          <ul className="mt-5 grid gap-2.5 text-sm">
            {s.facebook && (
              <li>
                <a href={s.facebook} target="_blank" rel="noreferrer noopener" className={link}>
                  Facebook
                </a>
              </li>
            )}
            {s.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={link}
                >
                  WhatsApp
                </a>
              </li>
            )}
            {s.messenger && (
              <li>
                <a
                  href={`https://m.me/${s.messenger}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={link}
                >
                  Messenger
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-sage-pale/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} არქეტიპი, {t(UI.footer.rights, locale)}
          </p>
          <Link href="/admin" className="transition-colors hover:text-paper">
            {t(UI.footer.admin, locale)}
          </Link>
        </div>
      </div>
    </footer>
  );
}
