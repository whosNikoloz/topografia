import { addPrice, deletePrice, savePrices } from "@/app/admin/actions";
import LangBar from "@/components/admin/LangBar";
import { ConfirmButton, SaveBar } from "@/components/admin/form";
import { DEFAULT_LOCALE, isLocale, tx } from "@/lib/i18n";
import { getContent } from "@/lib/store";

const IN = "w-full rounded-surface border border-line px-4 py-3 text-base outline-none focus:border-sage";

export default async function PricesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: raw } = await searchParams;
  const lang = raw && isLocale(raw) ? raw : DEFAULT_LOCALE;
  const { prices } = await getContent();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">ფასები</h1>
          <p className="mt-2 text-sm text-ink-soft">
            ფასი ჩაწერეთ ისე, როგორც გსურთ ჩანდეს. მაგალითად „350 ₾-დან“ ან „from 350 GEL“.
          </p>
        </div>
        <form action={addPrice}>
          <input type="hidden" name="lang" value={lang} />
          <button
            type="submit"
            className="rounded-full bg-sage-pale px-6 py-3 text-sm font-semibold text-ink hover:bg-sage"
          >
            + ახალი პოზიცია
          </button>
        </form>
      </div>

      <LangBar lang={lang} path="/admin/prices" />

      <form action={savePrices} className="grid gap-4">
        <input type="hidden" name="lang" value={lang} />

        {prices.map((p) => (
          <div
            key={p.id}
            className="grid gap-4 rounded-surface border border-line bg-white p-5 sm:grid-cols-[2fr_1fr] sm:items-start"
          >
            <input type="hidden" name="id[]" value={p.id} />

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">სერვისი</span>
              <input name="title[]" defaultValue={tx(p.title, lang)} className={IN} />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">ფასი</span>
              <input name="price[]" defaultValue={tx(p.price, lang)} className={IN} />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-ink">შენიშვნა</span>
              <input name="note[]" defaultValue={tx(p.note, lang)} className={IN} />
            </label>

            <div className="sm:col-span-2">
              <ConfirmButton
                question={`წავშალოთ „${tx(p.title, lang)}“? წაიშლება სამივე ენაზე.`}
                formAction={deletePrice}
                name="delete"
                value={p.id}
              >
                წაშლა
              </ConfirmButton>
            </div>
          </div>
        ))}

        {prices.length === 0 && (
          <p className="rounded-surface bg-paper-soft p-8 text-center text-ink-soft">
            ჯერ არაფერია. დააჭირეთ „+ ახალი პოზიცია“.
          </p>
        )}

        <SaveBar />
      </form>
    </>
  );
}
