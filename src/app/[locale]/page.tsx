import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { topics } from "@/content/topics";
import { questions } from "@/content/questions";
import { TopicIcon, ArrowRightIcon } from "@/components/icons";
import { StatsSummary } from "@/components/stats-summary";
import { siteName, siteUrl } from "@/lib/site";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as "fr" | "en";
  const t = await getTranslations("home");
  const tp = await getTranslations("topic");
  const meta = await getTranslations("meta");

  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteName,
    url: `${siteUrl}/${locale}`,
    description: meta("description"),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative overflow-hidden bg-noise">
        <div className="hero-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-5 pb-14 pt-16 sm:pt-24">
          <p className="mb-4 text-sm font-semibold tracking-wide text-gradient">
            {t("kicker")}
          </p>
          <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl">
            {t("titlePrefix")}{" "}
            <span className="text-gradient">{t("titleHighlight")}</span>{" "}
            {t("titleSuffix")}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">{t("subtitle")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/practice"
              className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-[0_8px_24px_-8px_var(--grad-mid)] transition-all hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_14px_32px_-10px_var(--grad-mid)] active:translate-y-0 active:scale-[0.98]"
            >
              {t("ctaPractice")}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/test"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              {t("ctaTest")}
            </Link>
          </div>
        </div>
      </section>

      <StatsSummary />

      <section className="mx-auto max-w-5xl px-5 py-10">
        <h2 className="mb-5 text-lg font-semibold">{t("topicsHeading")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => {
            const count = questions.filter(
              (q) => q.topicId === topic.id,
            ).length;
            return (
              <Link
                key={topic.id}
                href={`/practice/${topic.id}`}
                className="panel-interactive group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 hover:border-transparent"
                style={{ ["--topic-accent" as string]: topic.accent }}
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: topic.accentSoft }}
                />
                <div className="relative">
                  <div
                    className="icon-tile mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: topic.accentSoft,
                      color: topic.accent,
                    }}
                  >
                    <TopicIcon topicId={topic.id} className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium">{topic.name[l]}</h3>
                  <p className="mt-1 text-sm text-muted">{topic.tagline[l]}</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-muted">
                      {t("questionsCount", { count })}
                    </span>
                    <span
                      className="flex items-center gap-1 font-medium opacity-0 transition-opacity group-hover:opacity-100"
                      style={{ color: topic.accent }}
                    >
                      {tp("practiceLink")}
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-20">
        <h2 className="mb-5 text-lg font-semibold">
          {t("howItWorksHeading")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="panel rounded-2xl border border-border bg-surface p-5"
            >
              <span className="text-xs font-bold text-gradient">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-medium">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
