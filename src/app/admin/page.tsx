import Link from "next/link";
import { getContent } from "@/lib/store";

export default async function AdminHome() {
  const c = await getContent();

  const tiles = [
    { href: "/admin/settings", label: "საიტის პარამეტრები", note: "ტელეფონი, WhatsApp, მისამართი, მთავარი გვერდის ტექსტი" },
    { href: "/admin/services", label: "სერვისები", note: `${c.services.length} სერვისი` },
    { href: "/admin/prices", label: "ფასები", note: `${c.prices.length} პოზიცია` },
    { href: "/admin/projects", label: "პროექტები", note: `${c.projects.length} პროექტი` },
    { href: "/admin/gallery", label: "გალერეა", note: `${c.gallery.length} ფაილი` },
    { href: "/admin/articles", label: "სტატიები", note: `${c.articles.length} სტატია` },
    { href: "/admin/seo", label: "SEO", note: "გვერდების სათაურები Google-ისთვის" },
  ];

  return (
    <>
      <h1 className="text-2xl font-semibold text-ink sm:text-3xl">მოგესალმებით 👋</h1>
      <p className="mt-2 leading-relaxed text-ink-soft">
        აირჩიეთ, რისი შეცვლა გსურთ. ყველა ცვლილება საიტზე მაშინვე გამოჩნდება.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {tiles.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              className="block h-full rounded-surface border border-line bg-white p-6 shadow-lift transition-shadow hover:shadow-lift"
            >
              <span className="block text-lg font-semibold text-ink">{t.label}</span>
              <span className="mt-1 block text-sm text-ink-soft">{t.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
