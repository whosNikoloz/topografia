import { saveSettings } from "@/app/admin/actions";
import ImageField from "@/components/admin/ImageField";
import LangBar from "@/components/admin/LangBar";
import RichText from "@/components/admin/RichText";
import { Area, Field, SaveBar } from "@/components/admin/form";
import { DEFAULT_LOCALE, isLocale, tx } from "@/lib/i18n";
import { getContent } from "@/lib/store";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: raw } = await searchParams;
  const lang = raw && isLocale(raw) ? raw : DEFAULT_LOCALE;
  const { settings: s } = await getContent();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">საიტის პარამეტრები</h1>
        <p className="mt-2 text-sm text-ink-soft">კონტაქტები, მთავარი გვერდი და „ჩვენ შესახებ“ ტექსტი.</p>
      </div>

      <LangBar lang={lang} path="/admin/settings" />

      <form action={saveSettings} className="grid gap-10">
        <input type="hidden" name="lang" value={lang} />

        <section className="grid gap-5 rounded-surface border border-line bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">კონტაქტები</h2>
          <p className="-mt-3 text-xs text-ink-soft">ეს ველები საერთოა სამივე ენისთვის.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="ტელეფონი 1" name="phone1" defaultValue={s.phone1} placeholder="+995 555 12 34 56" />
            <Field label="ტელეფონი 2" name="phone2" defaultValue={s.phone2} />
            <Field
              label="WhatsApp ნომერი"
              name="whatsapp"
              defaultValue={s.whatsapp}
              placeholder="995555123456"
              hint="მხოლოდ ციფრები, ქვეყნის კოდით, + ნიშნის გარეშე"
            />
            <Field
              label="Messenger-ის მომხმარებელი"
              name="messenger"
              defaultValue={s.messenger}
              placeholder="geotopografia"
              hint="თქვენი Facebook გვერდის მისამართიდან: m.me/XXXX"
            />
            <Field
              label="Facebook გვერდის ბმული"
              name="facebook"
              defaultValue={s.facebook}
              placeholder="https://facebook.com/..."
            />
            <Field label="ელ. ფოსტა" name="email" defaultValue={s.email} type="email" />
          </div>
          <Area
            label="Google რუკის ბმული"
            name="map_embed"
            defaultValue={s.map_embed}
            rows={2}
            hint="Google Maps → გაზიარება → რუკის ჩასმა → დააკოპირეთ მისამართი src-დან"
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="მისამართი" name="address" defaultValue={tx(s.address, lang)} />
            <Field label="სამუშაო საათები" name="working_hours" defaultValue={tx(s.working_hours, lang)} />
          </div>
        </section>

        <section className="grid gap-5 rounded-surface border border-line bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">მთავარი გვერდი</h2>
          <Field label="მთავარი სათაური (სლოგანი)" name="hero_title" defaultValue={tx(s.hero_title, lang)} />
          <Area label="ქვესათაური" name="hero_subtitle" defaultValue={tx(s.hero_subtitle, lang)} rows={2} />
          <ImageField label="ფონის ფოტო (საერთო)" name="hero_image" defaultValue={s.hero_image} />
        </section>

        <section className="grid gap-5 rounded-surface border border-line bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">ჩვენ შესახებ</h2>
          <Area
            label="მოკლე ტექსტი (მთავარ გვერდზეც ჩანს)"
            name="about_short"
            defaultValue={tx(s.about_short, lang)}
            rows={3}
          />
          <RichText key={lang} label="სრული ტექსტი" name="about_body" defaultValue={tx(s.about_body, lang)} />
        </section>

        <section className="grid gap-5 rounded-surface border border-line bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">საიტის ქვედა ნაწილი</h2>
          <Area label="მოკლე აღწერა ლოგოს ქვეშ" name="footer_text" defaultValue={tx(s.footer_text, lang)} rows={3} />
        </section>

        <SaveBar note="ცვლილებები საიტზე მაშინვე გამოჩნდება." />
      </form>
    </>
  );
}
