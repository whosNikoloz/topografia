import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/auth";
import { newId } from "@/lib/store";

const MAX = 80 * 1024 * 1024; // 80 MB, ვიდეოსთვის
const OK = /^(image\/(jpeg|png|webp|gif|avif|svg\+xml)|video\/(mp4|webm|quicktime))$/;

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export async function POST(req: Request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "ავტორიზაცია საჭიროა" }, { status: 401 });
  }

  const form = await req.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: "ფაილი არ აირჩიეთ" }, { status: 400 });

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });

  const saved: { url: string; kind: "image" | "video"; title: string }[] = [];

  for (const file of files) {
    if (!OK.test(file.type)) {
      return NextResponse.json({ error: `დაუშვებელი ფაილის ტიპი: ${file.type || "უცნობი"}` }, { status: 400 });
    }
    if (file.size > MAX) {
      return NextResponse.json({ error: `ფაილი ძალიან დიდია: ${file.name}` }, { status: 400 });
    }

    const name = `${Date.now().toString(36)}-${newId()}.${EXT[file.type]}`;
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    saved.push({
      url: `/uploads/${name}`,
      kind: file.type.startsWith("video/") ? "video" : "image",
      title: file.name.replace(/\.[^.]+$/, ""),
    });
  }

  return NextResponse.json({ files: saved });
}
