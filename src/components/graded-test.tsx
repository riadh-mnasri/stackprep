"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Question, TopicId } from "@/content/questions";
import { questions as allQuestions } from "@/content/questions";
import { topics } from "@/content/topics";
import { pickTestQuestions } from "@/lib/stats";
import { recordAnswer, recordTest, ratingScore, type Rating } from "@/lib/store";
import { useProgress } from "@/lib/useProgress";
import { QuestionRunner } from "./question-runner";
import { GaugeIcon, TopicIcon } from "./icons";

type Phase = "setup" | "running" | "results";

interface TestOutcome {
  score: number;
  topicScores: Partial<Record<TopicId, number>>;
}

const LENGTH_OPTIONS = [10, 20, 30];

export function GradedTest() {
  const t = useTranslations("test");
  const locale = useLocale() as "fr" | "en";
  const progress = useProgress();
  const [phase, setPhase] = useState<Phase>("setup");
  const [length, setLength] = useState(
    Math.min(20, allQuestions.length) || LENGTH_OPTIONS[0],
  );
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [outcome, setOutcome] = useState<TestOutcome | null>(null);

  const answers = useRef(new Map<string, Rating>()).current;

  const availableLengths = LENGTH_OPTIONS.filter(
    (n) => n <= allQuestions.length,
  );
  if (availableLengths.length === 0 && allQuestions.length > 0) {
    availableLengths.push(allQuestions.length);
  }

  function startTest() {
    const picked = pickTestQuestions(progress.questions, length);
    answers.clear();
    setSessionQuestions(picked);
    setPhase("running");
  }

  function handleAnswer(question: Question, rating: Rating) {
    recordAnswer(question.id, rating);
    answers.set(question.id, rating);
  }

  function handleComplete() {
    const topicTotals = new Map<TopicId, { sum: number; count: number }>();
    let sum = 0;
    for (const question of sessionQuestions) {
      const rating = answers.get(question.id) ?? "unknown";
      const score = ratingScore[rating];
      sum += score;
      const entry = topicTotals.get(question.topicId) ?? {
        sum: 0,
        count: 0,
      };
      entry.sum += score;
      entry.count += 1;
      topicTotals.set(question.topicId, entry);
    }
    const score = Math.round((sum / sessionQuestions.length) * 100);
    const topicScores: Partial<Record<TopicId, number>> = {};
    topicTotals.forEach((value, key) => {
      topicScores[key] = Math.round((value.sum / value.count) * 100);
    });
    const result = { score, topicScores };
    recordTest({ date: Date.now(), ...result });
    setOutcome(result);
    setPhase("results");
  }

  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-xl px-5 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("heading")}
        </h1>
        <p className="mt-2 text-muted">{t("subheading")}</p>

        {allQuestions.length === 0 ? (
          <p className="mt-8 text-sm text-muted">{t("noQuestions")}</p>
        ) : (
          <div className="panel mt-8 rounded-2xl border border-border bg-surface p-6">
            <p className="mb-3 text-sm font-medium">{t("lengthLabel")}</p>
            <div className="flex gap-2">
              {availableLengths.map((n) => (
                <button
                  key={n}
                  onClick={() => setLength(n)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all duration-150 ${
                    length === n
                      ? "btn-gradient border-transparent shadow-md"
                      : "border-border hover:-translate-y-0.5 hover:bg-surface-raised hover:shadow-md"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              onClick={startTest}
              className="btn-gradient mt-6 w-full rounded-full py-2.5 text-sm font-semibold shadow-[0_8px_24px_-8px_var(--grad-mid)] transition-all hover:scale-[1.01] hover:shadow-[0_14px_32px_-10px_var(--grad-mid)] active:scale-[0.99]"
            >
              {t("start")}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (phase === "running") {
    return (
      <QuestionRunner
        questions={sessionQuestions}
        onAnswer={handleAnswer}
        onComplete={handleComplete}
        questionLabel={(current, total) => t("questionOf", { current, total })}
      />
    );
  }

  if (!outcome) return null;

  const tier =
    outcome.score >= 85
      ? { label: t("tierReady"), color: "var(--success)" }
      : outcome.score >= 60
        ? { label: t("tierAlmost"), color: "var(--warning)" }
        : { label: t("tierWork"), color: "var(--danger)" };

  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <div className="panel rounded-2xl border border-border bg-surface p-8 text-center">
        <div className="btn-gradient mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
          <GaugeIcon className="h-6 w-6" />
        </div>
        <h1 className="text-lg font-medium text-muted">
          {t("resultsHeading")}
        </h1>
        <p className="text-gradient mt-2 text-6xl font-extrabold tabular-nums">
          {outcome.score}%
        </p>
        <p
          className="mt-2 text-sm font-medium"
          style={{ color: tier.color }}
        >
          {tier.label}
        </p>

        <div className="mt-8 space-y-3 text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {t("breakdownHeading")}
          </p>
          {topics
            .filter((topic) => outcome.topicScores[topic.id] !== undefined)
            .map((topic) => (
              <div key={topic.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <TopicIcon
                      topicId={topic.id}
                      className="h-3.5 w-3.5"
                      style={{ color: topic.accent }}
                    />
                    {topic.name[locale]}
                  </span>
                  <span className="tabular-nums text-muted">
                    {outcome.topicScores[topic.id]}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${outcome.topicScores[topic.id]}%`,
                      backgroundColor: topic.accent,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setPhase("setup")}
            className="btn-gradient inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            {t("retry")}
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:bg-surface-raised"
          >
            {t("toDashboard")}
          </Link>
        </div>
      </div>
    </div>
  );
}
