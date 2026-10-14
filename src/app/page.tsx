import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/i18n";

// ponytail: "/" just points at the default language; every real page lives under /ka, /en, /ru.
export default function RootRedirect() {
  redirect(`/${DEFAULT_LOCALE}`);
}
