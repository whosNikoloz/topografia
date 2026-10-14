"use client";

import { useState } from "react";
import Uploader from "@/components/admin/Uploader";

/** Single image picker that writes its URL into a hidden input. */
export default function ImageField({
  name,
  defaultValue = "",
  label,
}: {
  name: string;
  defaultValue?: string;
  label: string;
}) {
  const [url, setUrl] = useState(defaultValue);

  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="flex flex-wrap items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="h-28 w-44 rounded-surface border border-line object-cover" />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setUrl("")}
              className="rounded-full bg-paper-soft px-4 py-2 text-sm font-medium text-ink hover:bg-sage-pale"
            >
              შეცვლა
            </button>
          </div>
        </div>
      ) : (
        <Uploader
          multiple={false}
          accept="image/*"
          label="ატვირთეთ ფოტო"
          onDone={(f) => f[0] && setUrl(f[0].url)}
        />
      )}
    </div>
  );
}
