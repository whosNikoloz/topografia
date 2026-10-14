"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowSquareOut, List, SignOut, X } from "@phosphor-icons/react";
import { logoutAction } from "@/app/admin/actions";

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

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="grid gap-1 px-3">
      {MENU.map((item) => {
        const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex min-h-11 items-center rounded-surface px-4 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-ink text-paper" : "text-ink hover:bg-paper-soft"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <NavLinks pathname={pathname} onNavigate={onNavigate} />
      <div className="mt-auto grid gap-1 border-t border-line p-3">
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className="flex min-h-11 items-center justify-between rounded-surface px-4 py-2.5 text-sm font-medium text-sage-deep transition-colors hover:bg-paper-soft"
        >
          საიტის ნახვა
          <ArrowSquareOut size={17} aria-hidden />
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex min-h-11 w-full items-center justify-between rounded-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper-soft"
          >
            გასვლა
            <SignOut size={17} aria-hidden />
          </button>
        </form>
      </div>
    </>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="min-h-screen overflow-x-clip bg-paper-soft lg:flex">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-line bg-white py-5 lg:flex">
        <Link href="/admin" className="mx-7 mb-7 block">
          <Image src="/logo.png" alt="ლოგო" width={189} height={60} className="h-11 w-auto" priority />
        </Link>
        <SidebarContent pathname={pathname} />
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/95 px-5 backdrop-blur lg:hidden">
        <Link href="/admin">
          <Image src="/logo.png" alt="ლოგო" width={189} height={60} className="h-9 w-auto" priority />
        </Link>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="admin-mobile-navigation"
          aria-label="მენიუს გახსნა"
          className="grid size-11 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-paper-soft"
        >
          <List size={23} aria-hidden />
        </button>
      </header>

      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="მენიუს დახურვა"
          onClick={close}
          className={`absolute inset-0 bg-ink/45 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          id="admin-mobile-navigation"
          className={`absolute inset-y-0 left-0 flex w-[min(88vw,20rem)] flex-col bg-white py-5 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6 flex h-11 items-center justify-between px-6">
            <Image src="/logo.png" alt="ლოგო" width={189} height={60} className="h-10 w-auto" />
            <button
              ref={closeRef}
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={close}
              aria-label="მენიუს დახურვა"
              className="grid size-11 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-paper-soft"
            >
              <X size={21} aria-hidden />
            </button>
          </div>
          <SidebarContent pathname={pathname} onNavigate={close} />
        </aside>
      </div>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-10">{children}</div>
      </main>
    </div>
  );
}
