import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteArticle, saveArticle } from "@/app/admin/actions";
import ImageField from "@/components/admin/ImageField";
import LangBar from "@/components/admin/LangBar";
import RichText from "@/components/admin/RichText";
import { Area, ConfirmButton, Field, SaveBar } from "@/components/admin/form";
import { DEFAULT_LOCALE, emptyLoc, isLocale, tx } from "@/lib/i18n";
import { getContent } from "@/lib/store";
import type { Article } from "@/lib/types";

const BLANK: Article = {
  id: "",
  slug: "",
  date: new Date().toISOString().slice(0, 10),
  cover: "",
  title: emptyLoc(),
  excerpt: emptyLoc(),
  body: emptyLoc(),
  category: emptyLoc(),
  seo_title: emptyLoc(),
  seo_description: emptyLoc(),
};

export default async function ArticleEdit({
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
  const { articles } = await getContent();
  const a = isNew ? BLANK : articles.find((x) => x.id === id);
  if (!a) notFound();

  const cats = [...new Set(articles.map((x) => tx(x.category, lang)).filter(Boolean))];

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/articles" className="text-sm text-sage-deep hover:text-ink">
          ← სტატიების სია
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-ink sm:text-3xl">
          {isNew ? "ახალი სტატია" : "სტატიის რედაქტირება"}
        </h1>
      </div>

      <LangBar lang={lang} path={`/admin/articles/${id}`} />

      <form action={saveArticle} className="grid gap-8">
        <input type="hidden" name="id" value={a.id} />
        <input type="hidden" name="lang" value={lang} />

        <section className="grid gap-5 rounded-surface border border-line bg-white p-6">
          <Field label="სათაური" name="title" defaultValue={tx(a.title, lang)} required />
          <Area
            label="მოკლე აღწერა (ჩანს სიაში)"
            name="excerpt"
            defaultValue={tx(a.excerpt, lang)}
            rows={3}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="კატეგორია"
              name="category"
              defaultValue={tx(a.category, lang)}
              placeholder="მაგ: საგანმანათლებლო"
              hint={cats.length ? `უკვე გამოყენებული: ${cats.join(", ")}` : undefined}
            />
            <Field label="თარიღი (საერთო)" name="date" defaultValue={a.date} type="date" />
          </div>
          <ImageField label="ქავერის ფოტო (საერთო)" name="cover" defaultValue={a.cover} />
        </section>

        <section className="rounded-surface border border-line bg-white p-6">
          <RichText key={lang} label="სტატიის ტექსტი" name="body" defaultValue={tx(a.body, lang)} />
        </section>

        <section className="grid gap-5 rounded-surface border border-line bg-white p-6">
          <h2 className="text-lg font-semibold text-ink">SEO (Google-ისთვის)</h2>
          <Field
            label="მისამართი საიტზე, slug (საერთო)"
            name="slug"
            defaultValue={a.slug}
            placeholder="ავტომატურად შეივსება"
            hint="ლათინური ასოებით, მაგ: ras-nishnavs-topografia"
          />
          <Field label="გვერდის სათაური" name="seo_title" defaultValue={tx(a.seo_title, lang)} />
          <Area
            label="გვერდის აღწერა"
            name="seo_description"
            defaultValue={tx(a.seo_description, lang)}
            rows={2}
          />
        </section>

        <SaveBar>
          {!isNew && (
            <ConfirmButton
              question={`წავშალოთ სტატია „${tx(a.title, lang)}“? წაიშლება სამივე ენაზე და დაბრუნება შეუძლებელია.`}
              formAction={deleteArticle}
            >
              სტატიის წაშლა
            </ConfirmButton>
          )}
        </SaveBar>
      </form>
    </>
  );
}
