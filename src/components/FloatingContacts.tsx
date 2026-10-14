import Image from "next/image";
import { Phone } from "@phosphor-icons/react/dist/ssr";
import { UI, t } from "@/lib/i18n";
import type { Locale, Settings } from "@/lib/types";
import facebookLogo from "@/lib/logos/facebook.png";
import whatsappLogo from "@/lib/logos/whatsapp.png";

/**
 * Quiet contact rail. Brand-neutral surfaces instead of the platform brand colours,
 * so three saturated circles do not fight the page.
 */
const BRAND_BTN =
  "block size-12 rounded-full ring-1 ring-paper/70 shadow-lift transition-transform duration-200 hover:scale-105 active:scale-95";
const PHONE_BTN =
  "flex size-12 items-center justify-center rounded-full bg-ink text-paper ring-1 ring-paper/60 shadow-lift transition-transform duration-200 hover:scale-105 active:scale-95";

export default function FloatingContacts({ s, locale }: { s: Settings; locale: Locale }) {
  const phone = s.phone1 || s.phone2;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2.5 sm:right-6 sm:bottom-6">
      {s.messenger && (
        <a
          href={`https://m.me/${s.messenger}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={t(UI.aria.messenger, locale)}
          className={BRAND_BTN}
        >
          <Image src={facebookLogo} alt="" className="size-full rounded-full object-cover" sizes="48px" />
        </a>
      )}
      {s.whatsapp && (
        <a
          href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={t(UI.aria.whatsapp, locale)}
          className={BRAND_BTN}
        >
          <Image src={whatsappLogo} alt="" className="size-full rounded-full object-cover" sizes="48px" />
        </a>
      )}
      {phone && (
        <a
          href={`tel:${phone.replace(/[^+\d]/g, "")}`}
          aria-label={t(UI.aria.call, locale)}
          className={PHONE_BTN}
        >
          <Phone size={20} weight="fill" aria-hidden />
        </a>
      )}
    </div>
  );
}
