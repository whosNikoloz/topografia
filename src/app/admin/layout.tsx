import Link from "next/link";
import type { Metadata } from "next";
import { loginAction, logoutAction } from "@/app/admin/actions";
import { isLoggedIn } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ადმინ პანელი",
  robots: { index: false, follow: false },
};

const MENU = [
  { href: "/admin", label: "მთავარი" },
  { href: "/admin/settings", label: "საიტის პარამეტრები" },
  { href: "/admin/services", label: "სერვისები" },
  { href: "/admin/prices", label: "ფასები" },
  { href: "/admin/projects", label: "პროექტები" },
  { href: "/admin/gallery", label: "გალერეა" },
  { href: "/admin/articles", label: "სტატიები" },
  { href: "/admin/seo", label: "SEO (Google-ისთვის)" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isLoggedIn())) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-soft p-5">
        <form action={loginAction} className="w-full max-w-sm rounded-surface bg-white p-8 shadow-lift">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="ლოგო" width={189} height={60} className="mx-auto h-12 w-auto" />
          <h1 className="mt-6 text-center text-xl font-semibold text-ink">ადმინ პანელი</h1>
          <p className="mt-1 text-center text-sm text-ink-soft">შეიყვანეთ პაროლი გასაგრძელებლად</p>

          <label className="mt-6 block">
            <span className="mb-1.5 block text-sm font-medium text-ink">პაროლი</span>
            <input
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="w-full rounded-surface border border-line px-4 py-3 text-base outline-none focus:border-sage"
            />
          </label>

          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-ink py-3.5 text-base font-semibold text-white hover:bg-ink/90"
          >
            შესვლა
          </button>

          <Link href="/" className="mt-5 block text-center text-sm text-ink-soft hover:text-ink">
            ← საიტზე დაბრუნება
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-soft lg:flex">
      <aside className="border-b border-line bg-white lg:w-72 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-4 p-5">
          <Link href="/admin">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ლოგო" width={189} height={60} className="h-10 w-auto" />
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="rounded-full bg-paper-soft px-4 py-2 text-sm font-medium text-ink hover:bg-sage-pale">
              გასვლა
            </button>
          </form>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-3 pb-4 lg:grid lg:overflow-visible">
          {MENU.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="flex shrink-0 items-center gap-3 rounded-surface px-4 py-3 text-sm font-medium whitespace-nowrap text-ink hover:bg-paper-soft"
            >
                {m.label}
            </Link>
          ))}
          <Link
            href="/"
            target="_blank"
            className="flex shrink-0 items-center gap-3 rounded-surface px-4 py-3 text-sm font-medium whitespace-nowrap text-sage-deep hover:bg-paper-soft"
          >
            საიტის ნახვა
          </Link>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10">{children}</div>
      </div>
    </div>
  );
}
