import Link from "next/link";
import { LOCALES, LOCALE_NAMES } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const HINT: Record<Locale, string> = {
  ka: "ახლა რედაქტირდება ქართული ვერსია. სხვა ენის ტექსტი არ იშლება.",
  en: "You are editing the English version. The other languages stay untouched.",
  ru: "Сейчас редактируется русская версия. Текст других языков не теряется.",
};

/** Admin language selector. Each form edits one language at a time. */
export default function LangBar({ lang, path }: { lang: Locale; path: string }) {
  return (
    <div className="mb-8 rounded-surface border border-line bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 text-sm font-medium text-ink-soft">ენა / Language:</span>
        {LOCALES.map((l) => (
          <Link
            key={l}
            href={`${path}?lang=${l}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              l === lang ? "bg-ink text-white" : "bg-paper-soft text-ink hover:bg-sage-pale"
            }`}
          >
            {LOCALE_NAMES[l]}
          </Link>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink-soft">{HINT[lang]}</p>
    </div>
  );
}
