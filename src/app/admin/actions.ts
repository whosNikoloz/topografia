"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, login, logout, requireAdmin } from "@/lib/auth";
import { DEFAULT_LOCALE, emptyLoc, isLocale } from "@/lib/i18n";
import { newId, slugify, updateContent } from "@/lib/store";
import type { Loc, Locale, Media, PageKey } from "@/lib/types";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

/** Which language this form was editing. */
function langOf(fd: FormData): Locale {
  const l = str(fd, "lang");
  return isLocale(l) ? l : DEFAULT_LOCALE;
}

/** Write one language into a translated field, keeping the other two. */
function putLoc(current: Loc | string | undefined, lang: Locale, value: string): Loc {
  const base: Loc =
    typeof current === "string"
      ? { ...emptyLoc(), [DEFAULT_LOCALE]: current }
      : { ...emptyLoc(), ...(current ?? {}) };
  return { ...base, [lang]: value };
}

function parseMedia(fd: FormData, key: string, lang: Locale, before: Media[]): Media[] {
  try {
    const raw = JSON.parse(str(fd, key) || "[]");
    if (!Array.isArray(raw)) return before;
    return raw
      .map((m) => {
        const old = before.find((b) => b.id === m.id);
        return {
          id: String(m.id ?? newId()),
          kind: m.kind === "video" || m.kind === "embed" ? m.kind : "image",
          url: String(m.url ?? ""),
          title: putLoc(old?.title, lang, String(m.title ?? "")),
          category: putLoc(old?.category, lang, String(m.category ?? "")),
        } as Media;
      })
      .filter((m) => m.url);
  } catch {
    return before;
  }
}

/** Parallel arrays from a "save all rows" form (`name[]` inputs keep document order). */
function rowsOf(fd: FormData, keys: string[]) {
  const cols = keys.map((k) => fd.getAll(`${k}[]`).map((v) => String(v).trim()));
  return (cols[0] ?? []).map(
    (_, i) => Object.fromEntries(keys.map((k, c) => [k, cols[c][i] ?? ""])) as Record<string, string>,
  );
}

function done(path: string, lang: Locale) {
  revalidatePath("/", "layout");
  redirect(`${path}?lang=${lang}`);
}

// ---------------- ავტორიზაცია / Auth ----------------

export async function loginAction(fd: FormData) {
  if (!checkPassword(str(fd, "password"))) redirect("/admin?error=1");
  await login();
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin");
}

// ---------------- პარამეტრები ----------------

const SETTINGS_PLAIN = [
  "phone1",
  "phone2",
  "whatsapp",
  "messenger",
  "facebook",
  "email",
  "map_embed",
  "hero_image",
] as const;

const SETTINGS_LOC = [
  "address",
  "working_hours",
  "hero_title",
  "hero_subtitle",
  "about_short",
  "about_body",
  "footer_text",
] as const;

export async function saveSettings(fd: FormData) {
  await requireAdmin();
  const lang = langOf(fd);
  await updateContent((c) => {
    for (const k of SETTINGS_PLAIN) if (fd.has(k)) c.settings[k] = str(fd, k);
    for (const k of SETTINGS_LOC) {
      if (fd.has(k)) c.settings[k] = putLoc(c.settings[k], lang, str(fd, k));
    }
  });
  done("/admin/settings", lang);
}

export async function saveSeo(fd: FormData) {
  await requireAdmin();
  const lang = langOf(fd);
  await updateContent((c) => {
    for (const slug of Object.keys(c.seo) as PageKey[]) {
      c.seo[slug] = {
        title: putLoc(c.seo[slug]?.title, lang, str(fd, `t_${slug}`)),
        description: putLoc(c.seo[slug]?.description, lang, str(fd, `d_${slug}`)),
      };
    }
  });
  done("/admin/seo", lang);
}

// ---------------- სერვისები ----------------

export async function saveServices(fd: FormData) {
  await requireAdmin();
  const lang = langOf(fd);
  await updateContent((c) => {
    const before = c.services;
    c.services = rowsOf(fd, ["id", "title", "description", "icon"])
      .filter((r) => r.title)
      .map((r) => {
        const old = before.find((s) => s.id === r.id);
        return {
          id: r.id || newId(),
          icon: r.icon || "map",
          title: putLoc(old?.title, lang, r.title),
          description: putLoc(old?.description, lang, r.description),
        };
      });
  });
  done("/admin/services", lang);
}

export async function addService(fd: FormData) {
  await requireAdmin();
  const lang = langOf(fd);
  await updateContent((c) => {
    c.services.push({
      id: newId(),
      icon: "map",
      title: putLoc(undefined, lang, "..."),
      description: emptyLoc(),
    });
  });
  done("/admin/services", lang);
}

export async function deleteService(fd: FormData) {
  await requireAdmin();
  const lang = langOf(fd);
  const id = str(fd, "delete");
  await updateContent((c) => {
    c.services = c.services.filter((s) => s.id !== id);
  });
  done("/admin/services", lang);
}

// ---------------- ფასები ----------------

export async function savePrices(fd: FormData) {
  await requireAdmin();
  const lang = langOf(fd);
  await updateContent((c) => {
    const before = c.prices;
    c.prices = rowsOf(fd, ["id", "title", "price", "note"])
      .filter((r) => r.title)
      .map((r) => {
        const old = before.find((p) => p.id === r.id);
        return {
          id: r.id || newId(),
          title: putLoc(old?.title, lang, r.title),
          price: putLoc(old?.price, lang, r.price),
          note: putLoc(old?.note, lang, r.note),
        };
      });
  });
  done("/admin/prices", lang);
}

export async function addPrice(fd: FormData) {
  await requireAdmin();
  const lang = langOf(fd);
  await updateContent((c) => {
    c.prices.push({
      id: newId(),
      title: putLoc(undefined, lang, "..."),
      price: emptyLoc(),
      note: emptyLoc(),
    });
  });
  done("/admin/prices", lang);
}

export async function deletePrice(fd: FormData) {
  await requireAdmin();
  const lang = langOf(fd);
  const id = str(fd, "delete");
  await updateContent((c) => {
    c.prices = c.prices.filter((p) => p.id !== id);
  });
  done("/admin/prices", lang);
}

// ---------------- პროექტები ----------------

export async function saveProject(fd: FormData) {
  await requireAdmin();
  const lang = langOf(fd);
  const id = str(fd, "id");
  const title = str(fd, "title");

  await updateContent((c) => {
    const old = c.projects.find((p) => p.id === id);

    const next = {
      date: str(fd, "date"),
      cover: str(fd, "cover"),
      media: parseMedia(fd, "media", lang, old?.media ?? []),
      title: putLoc(old?.title, lang, title),
      description: putLoc(old?.description, lang, str(fd, "description")),
      location: putLoc(old?.location, lang, str(fd, "location")),
      seo_title: putLoc(old?.seo_title, lang, str(fd, "seo_title")),
      seo_description: putLoc(old?.seo_description, lang, str(fd, "seo_description")),
    };

    const taken = (s: string) => c.projects.some((p) => p.slug === s && p.id !== id);
    let slug = str(fd, "slug") || slugify(title || newId());
    while (taken(slug)) slug = `${slug}-${newId().slice(0, 3)}`;

    if (old) Object.assign(old, next, { slug });
    else c.projects.unshift({ id: newId(), slug, ...next });
  });
  done("/admin/projects", lang);
}

export async function deleteProject(fd: FormData) {
  await requireAdmin();
  const lang = langOf(fd);
  const id = str(fd, "id");
  await updateContent((c) => {
    c.projects = c.projects.filter((p) => p.id !== id);
  });
  done("/admin/projects", lang);
}

// ---------------- გალერეა ----------------

export async function saveGallery(fd: FormData) {
  await requireAdmin();
  const lang = langOf(fd);
  await updateContent((c) => {
    c.gallery = parseMedia(fd, "media", lang, c.gallery);
  });
  done("/admin/gallery", lang);
}

// ---------------- სტატიები ----------------

export async function saveArticle(fd: FormData) {
  await requireAdmin();
  const lang = langOf(fd);
  const id = str(fd, "id");
  const title = str(fd, "title");

  await updateContent((c) => {
    const old = c.articles.find((a) => a.id === id);

    const next = {
      date: str(fd, "date") || new Date().toISOString().slice(0, 10),
      cover: str(fd, "cover"),
      title: putLoc(old?.title, lang, title),
      excerpt: putLoc(old?.excerpt, lang, str(fd, "excerpt")),
      body: putLoc(old?.body, lang, str(fd, "body")),
      category: putLoc(old?.category, lang, str(fd, "category")),
      seo_title: putLoc(old?.seo_title, lang, str(fd, "seo_title")),
      seo_description: putLoc(old?.seo_description, lang, str(fd, "seo_description")),
    };

    const taken = (s: string) => c.articles.some((a) => a.slug === s && a.id !== id);
    let slug = str(fd, "slug") || slugify(title || newId());
    while (taken(slug)) slug = `${slug}-${newId().slice(0, 3)}`;

    if (old) Object.assign(old, next, { slug });
    else c.articles.unshift({ id: newId(), slug, ...next });
  });
  done("/admin/articles", lang);
}

export async function deleteArticle(fd: FormData) {
  await requireAdmin();
  const lang = langOf(fd);
  const id = str(fd, "id");
  await updateContent((c) => {
    c.articles = c.articles.filter((a) => a.id !== id);
  });
  done("/admin/articles", lang);
}
