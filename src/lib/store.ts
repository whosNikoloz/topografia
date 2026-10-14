import { readFile, writeFile, rename, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { connection } from "next/server";
import type { Content } from "@/lib/types";

// ponytail: the whole site's content is one JSON file. No DB, no migrations, no SQL.
// Needs a host with a writable disk (VPS / Railway or Render with a volume), not serverless.

const FILE = path.join(process.cwd(), "data", "content.json");

let cache: { mtime: number; data: Content } | null = null;
let writing: Promise<unknown> = Promise.resolve();

export async function getContent(): Promise<Content> {
  // ponytail: opts every page that reads content into dynamic rendering, so an admin
  // save is visible on the next request. One line beats per-route segment config.
  await connection();
  const mtime = await stat(FILE).then((s) => s.mtimeMs, () => 0);
  if (cache && cache.mtime === mtime) return cache.data;
  const data = JSON.parse(await readFile(FILE, "utf8")) as Content;
  cache = { mtime, data };
  return data;
}

/** Mutate the content file. Writes are serialized and atomic (tmp + rename). */
export async function updateContent(fn: (c: Content) => void | Promise<void>) {
  const run = writing.then(async () => {
    const current = JSON.parse(await readFile(FILE, "utf8")) as Content;
    await fn(current);
    await mkdir(path.dirname(FILE), { recursive: true });
    const tmp = `${FILE}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(current, null, 2), "utf8");
    await rename(tmp, FILE);
    cache = null;
  });
  writing = run.catch(() => {});
  return run;
}

export const newId = () => Math.random().toString(36).slice(2, 10);

export function slugify(s: string) {
  const map: Record<string, string> = {
    ა: "a", ბ: "b", გ: "g", დ: "d", ე: "e", ვ: "v", ზ: "z", თ: "t", ი: "i", კ: "k",
    ლ: "l", მ: "m", ნ: "n", ო: "o", პ: "p", ჟ: "zh", რ: "r", ს: "s", ტ: "t", უ: "u",
    ფ: "p", ქ: "k", ღ: "gh", ყ: "q", შ: "sh", ჩ: "ch", ც: "ts", ძ: "dz", წ: "ts",
    ჭ: "ch", ხ: "kh", ჯ: "j", ჰ: "h",
  };
  const base = [...s.toLowerCase()].map((ch) => map[ch] ?? ch).join("");
  return (
    base
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || newId()
  );
}
