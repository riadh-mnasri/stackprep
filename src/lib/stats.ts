import { questions, type Question, type TopicId } from "@/content/questions";
import { topics } from "@/content/topics";
import { ratingScore, type QuestionProgress } from "./store";

export interface TopicMastery {
  topicId: TopicId;
  total: number;
  attempted: number;
  masteryPercent: number;
}

export function computeTopicMastery(
  progressByQuestion: Record<string, QuestionProgress>,
): TopicMastery[] {
  return topics.map((topic) => {
    const topicQuestions = questions.filter((q) => q.topicId === topic.id);
    const attempted = topicQuestions.filter(
      (q) => progressByQuestion[q.id] !== undefined,
    );
    const scoreSum = topicQuestions.reduce((sum, q) => {
      const progress = progressByQuestion[q.id];
      return sum + (progress ? ratingScore[progress.lastResult] : 0);
    }, 0);
    return {
      topicId: topic.id,
      total: topicQuestions.length,
      attempted: attempted.length,
      masteryPercent:
        topicQuestions.length === 0
          ? 0
          : Math.round((scoreSum / topicQuestions.length) * 100),
    };
  });
}

export function computeOverallMastery(
  progressByQuestion: Record<string, QuestionProgress>,
): number {
  if (questions.length === 0) return 0;
  const scoreSum = questions.reduce((sum, q) => {
    const progress = progressByQuestion[q.id];
    return sum + (progress ? ratingScore[progress.lastResult] : 0);
  }, 0);
  return Math.round((scoreSum / questions.length) * 100);
}

export function getWeakQuestions(
  progressByQuestion: Record<string, QuestionProgress>,
  limit = 5,
): Question[] {
  return questions
    .filter((q) => {
      const progress = progressByQuestion[q.id];
      return progress && progress.lastResult !== "known";
    })
    .sort((a, b) => {
      const pa = progressByQuestion[a.id];
      const pb = progressByQuestion[b.id];
      return (pb?.lastSeenAt ?? 0) - (pa?.lastSeenAt ?? 0);
    })
    .slice(0, limit);
}

export function pickTestQuestions(
  progressByQuestion: Record<string, QuestionProgress>,
  count: number,
): Question[] {
  const weighted = [...questions].sort((a, b) => {
    const pa = progressByQuestion[a.id];
    const pb = progressByQuestion[b.id];
    const scoreA = pa ? ratingScore[pa.lastResult] : -1;
    const scoreB = pb ? ratingScore[pb.lastResult] : -1;
    return scoreA - scoreB;
  });
  const pool = weighted.slice(0, Math.max(count * 2, count));
  const shuffled = shuffle(pool);
  return shuffled.slice(0, Math.min(count, questions.length));
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
