"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Question } from "@/content/questions";
import { getTopic } from "@/content/topics";
import type { Rating } from "@/lib/store";
import { CheckIcon, CrossIcon, HalfIcon, TopicIcon } from "./icons";

const difficultyDot: Record<Question["difficulty"], string> = {
  easy: "bg-success",
  medium: "bg-warning",
  hard: "bg-danger",
};

export function QuestionRunner({
  questions,
  onAnswer,
  onComplete,
  questionLabel,
}: {
  questions: Question[];
  onAnswer: (question: Question, rating: Rating) => void;
  onComplete: () => void;
  questionLabel: (current: number, total: number) => string;
}) {
  const t = useTranslations("practice");
  const locale = useLocale() as "fr" | "en";
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const question = questions[index];
  const topic = getTopic(question.topicId);

  function handleRate(rating: Rating) {
    onAnswer(question, rating);
    if (index === questions.length - 1) {
      onComplete();
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: topic.accentSoft, color: topic.accent }}
        >
          <TopicIcon topicId={topic.id} className="h-3.5 w-3.5" />
          {topic.name[locale]}
        </div>
        <span className="text-xs text-muted">
          {questionLabel(index + 1, questions.length)}
        </span>
      </div>

      <div className="mb-4 h-1 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div
        className="panel rounded-2xl border border-border bg-surface p-6 sm:p-8"
        style={{ borderLeft: `3px solid ${topic.accent}` }}
      >
        <div className="mb-5 flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${difficultyDot[question.difficulty]}`}
          />
          <span className="text-xs text-muted">
            {t(`difficulty.${question.difficulty}`)}
          </span>
        </div>

        <p className="text-lg font-medium leading-relaxed">
          {question.question[locale]}
        </p>

        <div className={`mt-7 ${!revealed ? "grid" : ""}`}>
          {!revealed && (
            <button
              onClick={() => setRevealed(true)}
              className="z-10 col-start-1 row-start-1 mt-1 w-fit items-center gap-2 justify-self-center self-start rounded-full border border-border bg-surface-raised px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl"
            >
              {t("reveal")}
            </button>
          )}
          <div
            className={`space-y-5 ${!revealed ? "col-start-1 row-start-1 select-none blur-md pointer-events-none" : ""}`}
          >
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">
                {t("answerLabel")}
              </p>
              <p className="leading-relaxed text-foreground">
                {question.answer[locale]}
              </p>
            </div>
            {question.code && (
              <div className="overflow-hidden rounded-xl border border-border bg-background/60">
                <div className="border-b border-border px-4 py-1.5">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted">
                    {question.code.lang}
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
                  <code className="font-mono">{question.code.snippet}</code>
                </pre>
              </div>
            )}
            <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-warning">
                {t("pitfallLabel")}
              </p>
              <p className="text-sm leading-relaxed">
                {question.pitfall[locale]}
              </p>
            </div>
          </div>
        </div>

        {revealed && (
          <div className="mt-5">
            <p className="mb-2.5 text-sm text-muted">{t("rateHeading")}</p>
            <div className="grid grid-cols-3 gap-2">
              <RateButton
                onClick={() => handleRate("unknown")}
                icon={<CrossIcon className="h-4 w-4" />}
                label={t("rateUnknown")}
                tone="danger"
              />
              <RateButton
                onClick={() => handleRate("partial")}
                icon={<HalfIcon className="h-4 w-4" />}
                label={t("ratePartial")}
                tone="warning"
              />
              <RateButton
                onClick={() => handleRate("known")}
                icon={<CheckIcon className="h-4 w-4" />}
                label={t("rateKnown")}
                tone="success"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RateButton({
  onClick,
  icon,
  label,
  tone,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  tone: "danger" | "warning" | "success";
}) {
  const toneClass = {
    danger: "hover:border-danger hover:text-danger hover:bg-danger/10",
    warning: "hover:border-warning hover:text-warning hover:bg-warning/10",
    success: "hover:border-success hover:text-success hover:bg-success/10",
  }[tone];

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-xl border border-border py-3 text-xs font-medium transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${toneClass}`}
    >
      {icon}
      {label}
    </button>
  );
}
