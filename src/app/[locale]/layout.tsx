import { notFound } from "next/navigation";
import FloatingContacts from "@/components/FloatingContacts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { LOCALES, isLocale } from "@/lib/i18n";
import { getContent } from "@/lib/store";

// ponytail: content lives in a JSON file, so render on every request; admin edits show up instantly.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { settings } = await getContent();

  return (
    <>
      <Header locale={locale} phone={settings.phone1} facebook={settings.facebook} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer s={settings} locale={locale} />
      <FloatingContacts s={settings} locale={locale} />
    </>
  );
}
