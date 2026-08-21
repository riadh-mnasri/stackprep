import type { TopicId } from "@/content/questions";

export type Rating = "known" | "partial" | "unknown";

export interface QuestionProgress {
  attempts: number;
  lastResult: Rating;
  lastSeenAt: number;
}

export interface TestResult {
  date: number;
  score: number;
  topicScores: Partial<Record<TopicId, number>>;
}

interface ProgressData {
  questions: Record<string, QuestionProgress>;
  tests: TestResult[];
}

const STORAGE_KEY = "stackprep-progress";

const emptyData: ProgressData = { questions: {}, tests: [] };

function readData(): ProgressData {
  if (typeof window === "undefined") return emptyData;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData;
    const parsed = JSON.parse(raw) as ProgressData;
    return { questions: parsed.questions ?? {}, tests: parsed.tests ?? [] };
  } catch {
    return emptyData;
  }
}

function writeData(data: ProgressData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  listeners.forEach((listener) => listener());
}

const listeners = new Set<() => void>();

let cache: ProgressData = emptyData;
let hydrated = false;

function ensureHydrated() {
  if (!hydrated && typeof window !== "undefined") {
    cache = readData();
    hydrated = true;
  }
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): ProgressData {
  ensureHydrated();
  return cache;
}

export function getServerSnapshot(): ProgressData {
  return emptyData;
}

export const ratingScore: Record<Rating, number> = {
  known: 1,
  partial: 0.5,
  unknown: 0,
};

export function recordAnswer(questionId: string, rating: Rating) {
  ensureHydrated();
  const previous = cache.questions[questionId];
  const next: ProgressData = {
    ...cache,
    questions: {
      ...cache.questions,
      [questionId]: {
        attempts: (previous?.attempts ?? 0) + 1,
        lastResult: rating,
        lastSeenAt: Date.now(),
      },
    },
  };
  cache = next;
  writeData(next);
}

export function recordTest(result: TestResult) {
  ensureHydrated();
  const next: ProgressData = {
    ...cache,
    tests: [...cache.tests, result].slice(-20),
  };
  cache = next;
  writeData(next);
}

export function resetProgress() {
  cache = emptyData;
  writeData(emptyData);
}
