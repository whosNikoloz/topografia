import { headers } from "next/headers";
import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Georgian } from "next/font/google";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import ogImage from "./og-image.png";
import "./globals.css";

const notoGe = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-ge",
});

const notoCy = Noto_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-cy",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "არქეტიპი | Archetype", template: "%s | არქეტიპი" },
  description: "სრული და პროფესიონალური გეოდეზიური მომსახურება თბილისსა და საქართველოს რეგიონებში.",
  openGraph: {
    type: "website",
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height,
        alt: "არქეტიპი — პროფესიონალური გეოდეზიური მომსახურება",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImage.src],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const seg = (await headers()).get("x-locale") ?? "";
  const lang = isLocale(seg) ? seg : DEFAULT_LOCALE;

  return (
    <html lang={lang} className={`${notoGe.variable} ${notoCy.variable}`}>
      <body>{children}</body>
    </html>
  );
}
