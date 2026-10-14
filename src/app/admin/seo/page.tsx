import { saveSeo } from "@/app/admin/actions";
import LangBar from "@/components/admin/LangBar";
import { Area, Field, SaveBar } from "@/components/admin/form";
import { DEFAULT_LOCALE, isLocale, tx } from "@/lib/i18n";
import { getContent } from "@/lib/store";
import type { PageKey } from "@/lib/types";

const NAMES: Record<PageKey, string> = {
  home: "მთავარი",
  about: "ჩვენ შესახებ",
  services: "სერვისები",
  prices: "ფასები",
  projects: "პროექტები",
  gallery: "გალერეა",
  articles: "სტატიები",
  contact: "კონტაქტი",
};

export default async function SeoAdmin({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: raw } = await searchParams;
  const lang = raw && isLocale(raw) ? raw : DEFAULT_LOCALE;
  const { seo } = await getContent();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">SEO (Google-ისთვის)</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          სათაური ჩანს Google-ის ძიების შედეგებში. ჩაწერეთ ისეთი სიტყვები, რომლითაც თქვენ ეძებენ,
          მაგალითად „ტოპოგრაფია თბილისი“. აღწერა სასურველია 150 სიმბოლომდე.
        </p>
      </div>

      <LangBar lang={lang} path="/admin/seo" />

      <form action={saveSeo} className="grid gap-8">
        <input type="hidden" name="lang" value={lang} />

        {(Object.keys(NAMES) as PageKey[]).map((k) => (
          <section key={k} className="grid gap-4 rounded-surface border border-line bg-white p-6">
            <h2 className="text-lg font-semibold text-ink">{NAMES[k]}</h2>
            <Field label="გვერდის სათაური" name={`t_${k}`} defaultValue={tx(seo[k]?.title, lang)} />
            <Area
              label="გვერდის აღწერა"
              name={`d_${k}`}
              defaultValue={tx(seo[k]?.description, lang)}
              rows={2}
            />
          </section>
        ))}

        <p className="rounded-surface bg-paper-soft p-5 text-sm leading-relaxed text-ink-soft">
          პროექტებისა და სტატიების SEO ცალ-ცალკე იცვლება, თითოეული პროექტის ან სტატიის რედაქტირების გვერდზე.
        </p>

        <SaveBar />
      </form>
    </>
  );
}
