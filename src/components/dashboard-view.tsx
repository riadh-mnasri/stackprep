"use client";

import { useLocale, useTranslations } from "next-intl";
import { useProgress } from "@/lib/useProgress";
import { computeOverallMastery, computeTopicMastery, getWeakQuestions } from "@/lib/stats";
import { getTopic } from "@/content/topics";
import { resetProgress } from "@/lib/store";
import { GaugeIcon, InboxIcon, TopicIcon } from "./icons";

export function DashboardView() {
  const t = useTranslations("dashboard");
  const locale = useLocale() as "fr" | "en";
  const progress = useProgress();

  const overall = computeOverallMastery(progress.questions);
  const byTopic = computeTopicMastery(progress.questions);
  const weak = getWeakQuestions(progress.questions, 6);
  const hasProgress = byTopic.some((stat) => stat.attempted > 0);
  const recentTests = [...progress.tests].reverse().slice(0, 8);

  function handleReset() {
    if (window.confirm(t("resetConfirm"))) {
      resetProgress();
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("heading")}
          </h1>
          <p className="mt-2 text-muted">{t("subheading")}</p>
        </div>
        {hasProgress && (
          <button
            onClick={handleReset}
            className="shrink-0 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted transition-all duration-150 hover:-translate-y-0.5 hover:border-danger hover:text-danger hover:shadow-md"
          >
            {t("resetButton")}
          </button>
        )}
      </div>

      {!hasProgress ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
          <InboxIcon className="mx-auto mb-3 h-8 w-8 text-muted" />
          <p className="font-medium">{t("emptyHeading")}</p>
          <p className="mt-1 text-sm text-muted">{t("emptyBody")}</p>
        </div>
      ) : (
        <>
          <div className="panel mt-8 rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-muted">
              <GaugeIcon className="h-4 w-4" />
              {t("overallMastery")}
            </div>
            <p className="mt-2 text-4xl font-semibold tabular-nums">
              {overall}%
            </p>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-sm font-medium text-muted">
              {t("topicsHeading")}
            </h2>
            <div className="space-y-4">
              {byTopic.map((stat) => {
                const topic = getTopic(stat.topicId);
                return (
                  <div
                    key={stat.topicId}
                    className="panel rounded-xl border border-border bg-surface p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <TopicIcon
                          topicId={topic.id}
                          className="h-4 w-4"
                          style={{ color: topic.accent }}
                        />
                        {topic.name[locale]}
                      </span>
                      <span className="text-xs tabular-nums text-muted">
                        {t("attemptedOf", {
                          attempted: stat.attempted,
                          total: stat.total,
                        })}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full"
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

          <div className="mt-8">
            <h2 className="mb-4 text-sm font-medium text-muted">
              {t("weakHeading")}
            </h2>
            {weak.length === 0 ? (
              <p className="text-sm text-muted">{t("weakEmpty")}</p>
            ) : (
              <div className="space-y-2">
                {weak.map((question) => {
                  const topic = getTopic(question.topicId);
                  return (
                    <div
                      key={question.id}
                      className="panel flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
                    >
                      <span
                        className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: topic.accentSoft,
                          color: topic.accent,
                        }}
                      >
                        <TopicIcon topicId={topic.id} className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-sm leading-relaxed">
                        {question.question[locale]}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-sm font-medium text-muted">
              {t("testsHeading")}
            </h2>
            {recentTests.length === 0 ? (
              <p className="text-sm text-muted">{t("testsEmpty")}</p>
            ) : (
              <div className="panel overflow-hidden rounded-xl border border-border">
                {recentTests.map((test) => (
                  <div
                    key={test.date}
                    className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 text-sm last:border-b-0"
                  >
                    <span className="text-muted">
                      {new Date(test.date).toLocaleDateString(
                        locale === "fr" ? "fr-FR" : "en-US",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </span>
                    <span className="font-medium tabular-nums">
                      {test.score}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
