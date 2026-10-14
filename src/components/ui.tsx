import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Section bands. Default is paper white; `soft` is a barely-there off-white and
 * `tint` the pastel green. The green is rationed on purpose, it is an accent,
 * not the page background.
 */
export function Section({
  tone = "paper",
  children,
  className = "",
}: {
  tone?: "paper" | "soft" | "tint" | "ink";
  children: ReactNode;
  className?: string;
}) {
  const bg = {
    paper: "bg-paper",
    soft: "bg-paper-soft",
    tint: "bg-sage-pale",
    ink: "bg-ink text-paper",
  }[tone];

  return (
    <section className={`${bg} py-20 sm:py-28 lg:py-32 ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

/** Section headline. No eyebrow by default: the page position already says what this is. */
export function Lede({
  title,
  text,
  as: Tag = "h2",
  className = "",
}: {
  title: string;
  text?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <Tag className="display text-3xl text-balance sm:text-4xl lg:text-[2.75rem]">{title}</Tag>
      {text && <p className="mt-5 text-lg leading-relaxed text-ink-soft">{text}</p>}
    </div>
  );
}

/**
 * Buttons. Primary is deep green on white text (10:1), which fixes the old
 * white-on-pastel combination that failed WCAG AA.
 */
export function Btn({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "onInk";
}) {
  const styles = {
    primary: "bg-ink text-paper hover:bg-ink/90",
    ghost: "border border-line text-ink hover:border-sage hover:bg-sage-pale/60",
    onInk: "bg-paper text-ink hover:bg-sage-pale",
  }[variant];

  const cls = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 py-3.5 text-[0.95rem] font-medium transition-[background-color,border-color,transform] duration-200 active:translate-y-px ${styles}`;
  const external = href.startsWith("http");

  if (external || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} {...(external && { target: "_blank", rel: "noreferrer noopener" })}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** Inner-page header. Asymmetric, hairline under it, no tinted band. */
export function PageHero({ title, text }: { title: string; text?: string }) {
  return (
    <header className="border-b border-line">
      <div className="container-x grid gap-6 py-16 sm:py-20 lg:grid-cols-12 lg:items-end lg:py-24">
        <h1 className="display text-4xl text-balance sm:text-5xl lg:col-span-7 lg:text-[3.25rem]">
          {title}
        </h1>
        {text && (
          <p className="max-w-xl leading-relaxed text-ink-soft lg:col-span-5 lg:pb-2">{text}</p>
        )}
      </div>
    </header>
  );
}
