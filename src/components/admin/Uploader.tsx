"use client";

import { useRef, useState } from "react";
import { compressImage } from "@/lib/compress";

export type Uploaded = { url: string; kind: "image" | "video"; title: string };

export default function Uploader({
  onDone,
  multiple = true,
  accept = "image/*,video/*",
  label = "გადმოათრიეთ ფაილები აქ ან დააჭირეთ ასარჩევად",
}: {
  onDone: (files: Uploaded[]) => void;
  multiple?: boolean;
  accept?: string;
  label?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [error, setError] = useState("");

  async function send(list: FileList | File[]) {
    const files = [...list];
    if (!files.length) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      for (const f of files) fd.append("files", await compressImage(f));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "ატვირთვა ვერ შესრულდა");
      onDone(json.files as Uploaded[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "ატვირთვა ვერ შესრულდა");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void send(e.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center gap-2 rounded-surface border-2 border-dashed px-6 py-8 text-center transition-colors ${
          over ? "border-sage-deep bg-sage-pale" : "border-line bg-paper-soft hover:bg-sage-pale"
        } ${busy ? "opacity-60" : ""}`}
      >
        <svg viewBox="0 0 24 24" className="size-8 text-sage-deep" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M12 16V4m0 0L8 8m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
        <span className="text-sm font-medium text-ink">{busy ? "იტვირთება…" : label}</span>
        <span className="text-xs text-ink-soft">ფოტოები ავტომატურად იკუმშება ატვირთვამდე</span>
      </button>

      <input
        ref={input}
        type="file"
        hidden
        multiple={multiple}
        accept={accept}
        onChange={(e) => e.target.files && void send(e.target.files)}
      />

      {error && <p className="mt-2 rounded-surface bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
