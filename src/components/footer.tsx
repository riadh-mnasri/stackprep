import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-foreground">{t("tagline")}</p>
          <p className="mt-0.5 text-xs">{t("localOnly")}</p>
        </div>
        <p className="text-xs">{t("copyright", { year })}</p>
      </div>
    </footer>
  );
}
