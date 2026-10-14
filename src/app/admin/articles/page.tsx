import Link from "next/link";
import { DEFAULT_LOCALE, tx } from "@/lib/i18n";
import { getContent } from "@/lib/store";

export default async function ArticlesAdmin() {
  const { articles } = await getContent();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">სტატიები</h1>
          <p className="mt-2 text-sm text-ink-soft">დაამატეთ სასარგებლო სტატიები, ეს ეხმარება Google-ში მოძებნაში.</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-ink/90"
        >
          + ახალი სტატია
        </Link>
      </div>

      <ul className="mt-8 grid gap-3">
        {articles.map((a) => (
          <li key={a.id}>
            <Link
              href={`/admin/articles/${a.id}`}
              className="flex flex-wrap items-center gap-4 rounded-surface border border-line bg-white p-4 hover:shadow-lift"
            >
              {a.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.cover} alt="" className="h-16 w-24 rounded-surface object-cover" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink">{tx(a.title, DEFAULT_LOCALE)}</span>
                <span className="mt-0.5 block text-sm text-ink-soft">
                  {[tx(a.category, DEFAULT_LOCALE), a.date].filter(Boolean).join(" · ")}
                </span>
              </span>
              <span className="text-sm font-medium text-sage-deep">რედაქტირება →</span>
            </Link>
          </li>
        ))}
        {articles.length === 0 && (
          <li className="rounded-surface bg-paper-soft p-8 text-center text-ink-soft">სტატიები ჯერ არ არის.</li>
        )}
      </ul>
    </>
  );
}
