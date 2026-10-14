"use client";

import { useRef, useState } from "react";
import Uploader from "@/components/admin/Uploader";

// ponytail: contenteditable + execCommand. Deprecated but universally supported and ~40 lines,
// instead of a 300 KB editor dependency. Swap for Tiptap only if the client needs tables etc.

const TOOLS: { cmd: string; arg?: string; label: string; title: string }[] = [
  { cmd: "bold", label: "B", title: "მსხვილი" },
  { cmd: "italic", label: "I", title: "დახრილი" },
  { cmd: "formatBlock", arg: "h2", label: "H2", title: "სათაური" },
  { cmd: "formatBlock", arg: "h3", label: "H3", title: "ქვესათაური" },
  { cmd: "formatBlock", arg: "p", label: "¶", title: "ჩვეულებრივი ტექსტი" },
  { cmd: "insertUnorderedList", label: "•", title: "სია" },
  { cmd: "insertOrderedList", label: "1.", title: "ნუმერირებული სია" },
];

export default function RichText({
  name,
  defaultValue = "",
  label,
}: {
  name: string;
  defaultValue?: string;
  label: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(defaultValue);

  const sync = () => setHtml(box.current?.innerHTML ?? "");

  const run = (cmd: string, arg?: string) => {
    box.current?.focus();
    document.execCommand(cmd, false, arg);
    sync();
  };

  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      <input type="hidden" name={name} value={html} />

      <div className="overflow-hidden rounded-surface border border-line bg-white">
        <div className="flex flex-wrap gap-1 border-b border-line bg-paper-soft p-2">
          {TOOLS.map((t) => (
            <button
              key={t.label}
              type="button"
              title={t.title}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => run(t.cmd, t.arg)}
              className="min-w-9 rounded-surface bg-white px-2.5 py-1.5 text-sm font-semibold text-ink shadow-lift hover:bg-sage-pale"
            >
              {t.label}
            </button>
          ))}
          <button
            type="button"
            title="ბმული"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              const url = prompt("ჩასვით ბმული:");
              if (url) run("createLink", url);
            }}
            className="min-w-9 rounded-surface bg-white px-2.5 py-1.5 text-sm font-semibold text-ink shadow-lift hover:bg-sage-pale"
          >
            🔗
          </button>
        </div>

        <div
          ref={box}
          contentEditable
          suppressContentEditableWarning
          onInput={sync}
          onBlur={sync}
          dir="auto"
          className="prose-ge min-h-64 max-w-none px-5 py-4 outline-none"
          dangerouslySetInnerHTML={{ __html: defaultValue }}
        />

        <div className="border-t border-line bg-paper-soft p-3">
          <Uploader
            multiple={false}
            accept="image/*"
            label="ტექსტში ფოტოს ჩასმა"
            onDone={(f) => f[0] && run("insertHTML", `<img src="${f[0].url}" alt="">`)}
          />
        </div>
      </div>
    </div>
  );
}
