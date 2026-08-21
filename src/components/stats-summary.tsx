"use client";

import { useLocale, useTranslations } from "next-intl";
import { useProgress } from "@/lib/useProgress";
import { computeOverallMastery, computeTopicMastery } from "@/lib/stats";
import { topics } from "@/content/topics";
import { GaugeIcon } from "./icons";

export function StatsSummary() {
  const t = useTranslations("home");
  const locale = useLocale() as "fr" | "en";
  const progress = useProgress();
  const overall = computeOverallMastery(progress.questions);
  const byTopic = computeTopicMastery(progress.questions);
  const hasProgress = byTopic.some((t) => t.attempted > 0);

  if (!hasProgress) return null;

  return (
    <section className="mx-auto max-w-5xl px-5 pb-4">
      <div className="panel rounded-2xl border border-border bg-surface p-6">
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-muted">
          <GaugeIcon className="h-4 w-4" />
          {t("statsHeading")}
        </div>
        <div className="mb-6 flex items-baseline gap-2">
          <span className="text-gradient text-4xl font-extrabold tabular-nums">
            {overall}%
          </span>
          <span className="text-sm text-muted">
            {locale === "fr" ? "maîtrise globale" : "overall mastery"}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {byTopic.map((stat) => {
            const topic = topics.find((tp) => tp.id === stat.topicId)!;
            return (
              <div key={stat.topicId}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium">{topic.name[locale]}</span>
                  <span className="tabular-nums text-muted">
                    {stat.masteryPercent}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${stat.masteryPercent}%`,
                      backgroundColor: topic.accent,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
