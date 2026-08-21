"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Question, TopicId } from "@/content/questions";
import { getTopic } from "@/content/topics";
import { QuestionRunner } from "./question-runner";
import { recordAnswer, type Rating } from "@/lib/store";
import { CheckIcon, TopicIcon } from "./icons";

export function TopicPractice({
  topicId,
  questions,
}: {
  topicId: TopicId;
  questions: Question[];
}) {
  const t = useTranslations("practice");
  const [done, setDone] = useState(false);
  const [sessionKey, setSessionKey] = useState(0);
  const topic = getTopic(topicId);

  function handleAnswer(question: Question, rating: Rating) {
    recordAnswer(question.id, rating);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: topic.accentSoft, color: topic.accent }}
        >
          <CheckIcon className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold">{t("sessionDone")}</h1>
        <p className="mt-2 text-muted">
          {t("sessionDoneBody", { count: questions.length })}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              setDone(false);
              setSessionKey((k) => k + 1);
            }}
            className="btn-gradient inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            {t("restartTopic")}
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:bg-surface-raised"
          >
            {t("toDashboard")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto flex max-w-2xl items-center justify-between px-5 pt-8">
        <Link
          href="/practice"
          className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          <TopicIcon topicId={topicId} className="h-4 w-4" />
          {t("backToTopics")}
        </Link>
      </div>
      <QuestionRunner
        key={sessionKey}
        questions={questions}
        onAnswer={handleAnswer}
        onComplete={() => setDone(true)}
        questionLabel={(current, total) =>
          t("questionOf", { current, total })
        }
      />
    </div>
  );
}
