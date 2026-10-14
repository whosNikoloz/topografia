import { UI } from "@/lib/i18n";
import type { Loc, Locale } from "@/lib/types";

/** ponytail: plain module so both server and client components can import it. */
export const NAV: { path: string; label: Loc }[] = [
  { path: "", label: UI.nav.home },
  { path: "/about", label: UI.nav.about },
  { path: "/services", label: UI.nav.services },
  { path: "/prices", label: UI.nav.prices },
  { path: "/projects", label: UI.nav.projects },
  { path: "/gallery", label: UI.nav.gallery },
  { path: "/articles", label: UI.nav.articles },
  { path: "/contact", label: UI.nav.contact },
];

/** Build a locale-prefixed href: href("en", "/prices") -> "/en/prices" */
export const href = (l: Locale, path = "") => `/${l}${path}`;
