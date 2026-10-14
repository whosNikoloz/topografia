import { saveGallery } from "@/app/admin/actions";
import LangBar from "@/components/admin/LangBar";
import MediaEditor from "@/components/admin/MediaEditor";
import { SaveBar } from "@/components/admin/form";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import { getContent } from "@/lib/store";

export default async function GalleryAdmin({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang: raw } = await searchParams;
  const lang = raw && isLocale(raw) ? raw : DEFAULT_LOCALE;
  const { gallery } = await getContent();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">გალერეა</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          აქ დამატებული ფოტო-ვიდეო ჩანს გალერეის გვერდზე. პროექტებზე მიბმული ფაილები ავტომატურად ემატება,
          აქ ხელახლა ატვირთვა არ არის საჭირო. „კატეგორია“ გამოიყენება ფილტრისთვის.
        </p>
      </div>

      <LangBar lang={lang} path="/admin/gallery" />

      <form action={saveGallery} className="grid gap-8">
        <input type="hidden" name="lang" value={lang} />
        <MediaEditor key={lang} name="media" lang={lang} defaultValue={gallery} />
        <SaveBar />
      </form>
    </>
  );
}
