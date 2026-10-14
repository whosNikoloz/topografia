import Link from "next/link";
import type { Metadata } from "next";
import { loginAction } from "@/app/admin/actions";
import AdminShell from "@/components/admin/AdminShell";
import { isLoggedIn } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ადმინ პანელი",
  robots: { index: false, follow: false },
};

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

  return <AdminShell>{children}</AdminShell>;
}
