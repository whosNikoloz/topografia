"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

const BASE = "w-full rounded-surface border border-line bg-white px-4 py-3 text-base outline-none focus:border-sage";

export function Field({
  label,
  name,
  defaultValue = "",
  placeholder,
  hint,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={BASE}
      />
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}

export function Area({
  label,
  name,
  defaultValue = "",
  rows = 4,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <textarea name={name} rows={rows} defaultValue={defaultValue} className={`${BASE} leading-relaxed`} />
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}

export function SaveBar({ children, note }: { children?: ReactNode; note?: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center gap-3 border-t border-line bg-white/95 px-1 py-4 backdrop-blur">
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-8 py-3.5 text-base font-semibold text-white shadow-lift hover:bg-ink/90 disabled:opacity-60"
      >
        {pending ? "ინახება…" : "შენახვა"}
      </button>
      {children}
      {note && <span className="text-sm text-ink-soft">{note}</span>}
    </div>
  );
}

/** Submit button that asks for confirmation first. */
export function ConfirmButton({
  children,
  question,
  formAction,
  name,
  value,
}: {
  children: ReactNode;
  question: string;
  formAction?: (fd: FormData) => void | Promise<void>;
  name?: string;
  value?: string;
}) {
  return (
    <button
      type="submit"
      name={name}
      value={value}
      formAction={formAction}
      onClick={(e) => {
        if (!confirm(question)) e.preventDefault();
      }}
      className="rounded-full bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
    >
      {children}
    </button>
  );
}
