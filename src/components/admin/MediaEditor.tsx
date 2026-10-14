"use client";

import { useState } from "react";
import Uploader from "@/components/admin/Uploader";
import { tx } from "@/lib/i18n";
import { embedPoster } from "@/lib/video";
import type { Locale, Media, MediaKind } from "@/lib/types";

const rid = () => Math.random().toString(36).slice(2, 10);

/** Flat row used while editing: title/category are plain text in the selected language. */
type Row = { id: string; kind: MediaKind; url: string; title: string; category: string };

/**
 * Photo + video list editor. Serialises to a hidden input as JSON;
 * the server action merges the edited language back into the other two.
 */
export default function MediaEditor({
  name,
  lang,
  defaultValue,
}: {
  name: string;
  lang: Locale;
  defaultValue: Media[];
}) {
  const [items, setItems] = useState<Row[]>(
    defaultValue.map((m) => ({
      id: m.id,
      kind: m.kind,
      url: m.url,
      title: tx(m.title, lang),
      category: tx(m.category, lang),
    })),
  );
  const [link, setLink] = useState("");

  const patch = (id: string, p: Partial<Row>) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const remove = (m: Row) => {
    if (confirm(`წავშალოთ „${m.title || "ეს ფაილი"}“ სიიდან?`)) {
      setItems((xs) => xs.filter((x) => x.id !== m.id));
    }
  };

  const move = (i: number, dir: -1 | 1) =>
    setItems((xs) => {
      const j = i + dir;
      if (j < 0 || j >= xs.length) return xs;
      const copy = [...xs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  return (
    <div className="grid gap-4">
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      <Uploader
        onDone={(files) =>
          setItems((xs) => [
            ...xs,
            ...files.map((f) => ({ id: rid(), kind: f.kind, url: f.url, title: f.title, category: "" })),
          ])
        }
      />

      <div className="rounded-surface bg-paper-soft p-4">
        <label className="block text-sm font-medium text-ink" htmlFor={`${name}-link`}>
          ან დაამატეთ ვიდეოს ბმული (YouTube / Facebook)
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id={`${name}-link`}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 rounded-surface border border-line bg-white px-4 py-3 text-sm outline-none focus:border-sage"
          />
          <button
            type="button"
            onClick={() => {
              if (!link.trim()) return;
              setItems((xs) => [
                ...xs,
                { id: rid(), kind: "embed", url: link.trim(), title: "", category: "" },
              ]);
              setLink("");
            }}
            className="rounded-surface bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-ink/90"
          >
            დამატება
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <ul className="grid gap-3">
          {items.map((m, i) => {
            const poster = m.kind === "image" ? m.url : m.kind === "embed" ? embedPoster(m.url) : null;
            return (
              <li
                key={m.id}
                className="flex flex-wrap items-start gap-4 rounded-surface border border-line bg-white p-4"
              >
                <span className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-surface bg-paper-soft">
                  {poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={poster} alt="" className="size-full object-cover" />
                  ) : (
                    <span className="text-xs text-ink-soft">ვიდეო</span>
                  )}
                </span>

                <div className="grid min-w-50 flex-1 gap-2">
                  <input
                    value={m.title}
                    onChange={(e) => patch(m.id, { title: e.target.value })}
                    placeholder="სათაური (არასავალდებულო)"
                    className="rounded-surface border border-line px-3 py-2 text-sm outline-none focus:border-sage"
                  />
                  <input
                    value={m.category}
                    onChange={(e) => patch(m.id, { category: e.target.value })}
                    placeholder="კატეგორია (გალერეის ფილტრისთვის)"
                    className="rounded-surface border border-line px-3 py-2 text-sm outline-none focus:border-sage"
                  />
                  <p className="truncate text-xs text-ink-soft">{m.url}</p>
                </div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    aria-label="ზემოთ"
                    className="size-9 rounded-surface bg-paper-soft text-ink hover:bg-sage-pale"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    aria-label="ქვემოთ"
                    className="size-9 rounded-surface bg-paper-soft text-ink hover:bg-sage-pale"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(m)}
                    aria-label="წაშლა"
                    className="size-9 rounded-surface bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
