"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Play, X } from "@phosphor-icons/react";
import { UI, t, tx } from "@/lib/i18n";
import { embedPoster, embedSrc } from "@/lib/video";
import type { Locale, Media } from "@/lib/types";

export default function MediaGrid({
  items,
  locale,
  filter = false,
}: {
  items: Media[];
  locale: Locale;
  filter?: boolean;
}) {
  const ALL = t(UI.gallery.all, locale);
  const [cat, setCat] = useState(ALL);
  const [open, setOpen] = useState<number | null>(null);

  const cats = useMemo(
    () => [ALL, ...new Set(items.map((i) => tx(i.category, locale)).filter(Boolean))],
    [items, locale, ALL],
  );
  const shown = useMemo(
    () => (cat === ALL ? items : items.filter((i) => tx(i.category, locale) === cat)),
    [items, cat, locale, ALL],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % shown.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + shown.length) % shown.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, shown.length]);

  if (!items.length) {
    return (
      <p className="rounded-surface bg-paper-soft p-8 text-center text-ink-soft">{t(UI.gallery.empty, locale)}</p>
    );
  }

  const active = open === null ? null : shown[open];

  return (
    <>
      {filter && cats.length > 2 && (
        <div className="mb-10 flex flex-wrap gap-x-6 gap-y-2">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCat(c);
                setOpen(null);
              }}
              className={`py-1 text-sm transition-colors ${
                cat === c
                  ? "text-ink underline decoration-sage-deep underline-offset-[6px]"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {shown.map((m, i) => {
          const poster = m.kind === "embed" ? embedPoster(m.url) : null;
          const title = tx(m.title, locale);
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group block w-full text-left"
                aria-label={title || t(UI.gallery.open, locale)}
              >
                <span className="relative block aspect-4/3 overflow-hidden rounded-surface bg-paper-soft">
                  {m.kind === "image" ? (
                    <Image
                      src={m.url}
                      alt={title}
                      width={600}
                      height={450}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : poster ? (
                    <Image
                      src={poster}
                      alt={title}
                      width={600}
                      height={450}
                      loading="lazy"
                      unoptimized
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : m.kind === "video" ? (
                    // first frame of the uploaded file stands in for a poster image
                    <video
                      src={`${m.url}#t=0.5`}
                      preload="metadata"
                      muted
                      playsInline
                      tabIndex={-1}
                      aria-hidden
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center bg-sage-pale" />
                  )}
                </span>

                {m.kind !== "image" && (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-paper/90 text-ink">
                      <Play size={20} weight="fill" aria-hidden />
                    </span>
                  </span>
                )}

                {title && (
                  <span className="mt-3 block text-sm leading-snug text-ink-soft">{title}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={tx(active.title, locale) || t(UI.gallery.open, locale)}
          className="fixed inset-0 z-60 flex items-center justify-center bg-ink/92 p-4"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label={t(UI.gallery.close, locale)}
            className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <X size={22} aria-hidden />
          </button>

          {shown.length > 1 && (
            <>
              <button
                type="button"
                aria-label={t(UI.gallery.prev, locale)}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((i) => (i === null ? i : (i - 1 + shown.length) % shown.length));
                }}
                className="absolute left-2 flex size-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:left-6"
              >
                <ArrowLeft size={20} aria-hidden />
              </button>
              <button
                type="button"
                aria-label={t(UI.gallery.next, locale)}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((i) => (i === null ? i : (i + 1) % shown.length));
                }}
                className="absolute right-2 flex size-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:right-6"
              >
                <ArrowRight size={20} aria-hidden />
              </button>
            </>
          )}

          <figure className="max-h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {active.kind === "image" && (
              <Image
                src={active.url}
                alt={tx(active.title, locale)}
                width={1600}
                height={1100}
                className="mx-auto max-h-[78vh] w-auto rounded-surface object-contain"
              />
            )}
            {active.kind === "video" && (
              <video src={active.url} controls autoPlay className="mx-auto max-h-[78vh] w-full rounded-surface bg-black" />
            )}
            {active.kind === "embed" &&
              (embedSrc(active.url) ? (
                <div className="mx-auto aspect-video w-full overflow-hidden rounded-surface bg-black">
                  <iframe
                    src={embedSrc(active.url)!}
                    title={tx(active.title, locale) || "video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="size-full"
                  />
                </div>
              ) : (
                <a
                  href={active.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block p-8 text-center text-white underline"
                >
                  {t(UI.gallery.openExternal, locale)}
                </a>
              ))}
            {tx(active.title, locale) && (
              <figcaption className="pt-3 text-center text-sm text-sage-pale">
                {tx(active.title, locale)}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
