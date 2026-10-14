import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProject, saveProject } from "@/app/admin/actions";
import ImageField from "@/components/admin/ImageField";
import LangBar from "@/components/admin/LangBar";
import MediaEditor from "@/components/admin/MediaEditor";
import { Area, ConfirmButton, Field, SaveBar } from "@/components/admin/form";
import { DEFAULT_LOCALE, emptyLoc, isLocale, tx } from "@/lib/i18n";
import { getContent } from "@/lib/store";
import type { Project } from "@/lib/types";

const BLANK: Project = {
  id: "",
  slug: "",
  date: new Date().toISOString().slice(0, 10),
  cover: "",
  media: [],
  title: emptyLoc(),
  description: emptyLoc(),
  location: emptyLoc(),
  seo_title: emptyLoc(),
  seo_description: emptyLoc(),
};

export default async function ProjectEdit({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const { lang: raw } = await searchParams;
  const lang = raw && isLocale(raw) ? raw : DEFAULT_LOCALE;

  const isNew = id === "new";
  const { projects } = await getContent();
  const p = isNew ? BLANK : projects.find((x) => x.id === id);
  if (!p) notFound();

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/projects" className="text-sm text-sage-deep hover:text-ink">
          ← პროექტების სია
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">
          {isNew ? "ახალი პროექტი" : "პროექტის რედაქტირება"}
        </h1>
      </div>

      <LangBar lang={lang} path={`/admin/projects/${id}`} />

      <form action={saveProject} className="grid gap-8">
        <input type="hidden" name="id" value={p.id} />
        <input type="hidden" name="lang" value={lang} />

        <section className="grid gap-5 rounded-surface border border-line bg-white p-6">
          <Field label="სათაური" name="title" defaultValue={tx(p.title, lang)} required />
          <Area label="აღწერა" name="description" defaultValue={tx(p.description, lang)} rows={6} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="მდებარეობა"
              name="location"
              defaultValue={tx(p.location, lang)}
              placeholder="თბილისი, საბურთალო"
            />
            <Field label="შესრულების თარიღი (საერთო)" name="date" defaultValue={p.date} type="date" />
          </div>
          <ImageField label="მთავარი ფოტო, ქავერი (საერთო)" name="cover" defaultValue={p.cover} />
        </section>

        <section className="grid gap-5 rounded-surface border border-line bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">ფოტოები და ვიდეოები</h2>
          <MediaEditor key={lang} name="media" lang={lang} defaultValue={p.media} />
        </section>

        <section className="grid gap-5 rounded-surface border border-line bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">SEO (Google-ისთვის)</h2>
          <Field
            label="მისამართი საიტზე, slug (საერთო)"
            name="slug"
            defaultValue={p.slug}
            placeholder="ავტომატურად შეივსება"
            hint="ლათინური ასოებით, მაგ: topografia-saburtalo"
          />
          <Field label="გვერდის სათაური" name="seo_title" defaultValue={tx(p.seo_title, lang)} />
          <Area
            label="გვერდის აღწერა"
            name="seo_description"
            defaultValue={tx(p.seo_description, lang)}
            rows={2}
          />
        </section>

        <SaveBar>
          {!isNew && (
            <ConfirmButton
              question={`წავშალოთ პროექტი „${tx(p.title, lang)}“? წაიშლება სამივე ენაზე და დაბრუნება შეუძლებელია.`}
              formAction={deleteProject}
            >
              პროექტის წაშლა
            </ConfirmButton>
          )}
        </SaveBar>
      </form>
    </>
  );
}
