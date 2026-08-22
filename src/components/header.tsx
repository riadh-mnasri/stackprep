"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { TopicIcon } from "./icons";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("home") },
    { href: "/practice", label: t("practice") },
    { href: "/test", label: t("test") },
    { href: "/dashboard", label: t("dashboard") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="btn-gradient flex h-8 w-8 items-center justify-center rounded-lg">
            <TopicIcon topicId="java-core" className="h-4.5 w-4.5" />
          </span>
          <span className="text-[15px]">AceReady</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-surface-raised text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 rounded-full border border-border p-0.5 text-xs font-medium">
          <Link
            href={pathname}
            locale="fr"
            className={`rounded-full px-2.5 py-1 transition-colors ${
              locale === "fr"
                ? "btn-gradient"
                : "text-muted hover:text-foreground"
            }`}
          >
            FR
          </Link>
          <Link
            href={pathname}
            locale="en"
            className={`rounded-full px-2.5 py-1 transition-colors ${
              locale === "en"
                ? "btn-gradient"
                : "text-muted hover:text-foreground"
            }`}
          >
            EN
          </Link>
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border/80 px-5 py-2 sm:hidden">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-full px-3 py-1 text-sm transition-colors ${
                active
                  ? "bg-surface-raised text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
