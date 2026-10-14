import { addService, deleteService, saveServices } from "@/app/admin/actions";
import LangBar from "@/components/admin/LangBar";
import { ConfirmButton, SaveBar } from "@/components/admin/form";
import { ICON_KEYS } from "@/components/ServiceIcon";
import { DEFAULT_LOCALE, isLocale, tx } from "@/lib/i18n";
import { getContent } from "@/lib/store";

const IN = "w-full rounded-surface border border-line px-4 py-3 text-base outline-none focus:border-sage";

export default async function ServicesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: raw } = await searchParams;
  const lang = raw && isLocale(raw) ? raw : DEFAULT_LOCALE;
  const { services } = await getContent();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">სერვისები</h1>
          <p className="mt-2 text-sm text-ink-soft">შეცვალეთ ტექსტები და დააჭირეთ „შენახვას“.</p>
        </div>
        <form action={addService}>
          <input type="hidden" name="lang" value={lang} />
          <button
            type="submit"
            className="rounded-full bg-sage-pale px-6 py-3 text-sm font-semibold text-ink hover:bg-sage"
          >
            + ახალი სერვისი
          </button>
        </form>
      </div>

      <LangBar lang={lang} path="/admin/services" />

      <form action={saveServices} className="grid gap-4">
        <input type="hidden" name="lang" value={lang} />

        {services.map((s, i) => (
          <div key={s.id} className="grid gap-4 rounded-surface border border-line bg-white p-5">
            <input type="hidden" name="id[]" value={s.id} />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-sage-deep">#{i + 1}</span>
              <ConfirmButton
                question={`წავშალოთ სერვისი „${tx(s.title, lang)}“? წაიშლება სამივე ენაზე.`}
                formAction={deleteService}
                name="delete"
                value={s.id}
              >
                წაშლა
              </ConfirmButton>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">დასახელება</span>
              <input name="title[]" defaultValue={tx(s.title, lang)} className={IN} />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">აღწერა</span>
              <textarea name="description[]" rows={3} defaultValue={tx(s.description, lang)} className={IN} />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink">ხატულა (საერთო)</span>
              <select name="icon[]" defaultValue={s.icon} className={IN}>
                {ICON_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}

        {services.length === 0 && (
          <p className="rounded-surface bg-paper-soft p-8 text-center text-ink-soft">
            სერვისები ჯერ არ არის. დააჭირეთ „+ ახალი სერვისი“.
          </p>
        )}

        <SaveBar />
      </form>
    </>
  );
}
