import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { topics } from "@/content/topics";
import { questions } from "@/content/questions";
import { ArrowRightIcon, TopicIcon } from "@/components/icons";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as "fr" | "en";
  const t = await getTranslations("practice");
  const home = await getTranslations("home");
  const tp = await getTranslations("topic");

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("heading")}
      </h1>
      <p className="mt-2 text-muted">{t("subheading")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    {home("questionsCount", { count })}
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
    </div>
  );
}
