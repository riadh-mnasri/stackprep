import type { LocalizedText, TopicId } from "./questions";

export interface Topic {
  id: TopicId;
  name: LocalizedText;
  tagline: LocalizedText;
  accent: string;
  accentSoft: string;
}

export const topics: Topic[] = [
  {
    id: "java-core",
    name: { fr: "Java Core", en: "Java Core" },
    tagline: {
      fr: "Types, collections, streams, concurrence",
      en: "Types, collections, streams, concurrency",
    },
    accent: "#f0a25c",
    accentSoft: "rgba(240, 162, 92, 0.22)",
  },
  {
    id: "spring-boot",
    name: { fr: "Spring Boot", en: "Spring Boot" },
    tagline: {
      fr: "Injection de dépendances, MVC, sécurité, tests",
      en: "Dependency injection, MVC, security, testing",
    },
    accent: "#6fcf7a",
    accentSoft: "rgba(111, 207, 122, 0.2)",
  },
  {
    id: "jpa-hibernate",
    name: { fr: "JPA & Hibernate", en: "JPA & Hibernate" },
    tagline: {
      fr: "Mapping, relations, cache, performance",
      en: "Mapping, relations, caching, performance",
    },
    accent: "#5fb8cf",
    accentSoft: "rgba(95, 184, 207, 0.2)",
  },
  {
    id: "sql",
    name: { fr: "SQL", en: "SQL" },
    tagline: {
      fr: "Jointures, index, transactions, modélisation",
      en: "Joins, indexes, transactions, modeling",
    },
    accent: "#7f9fd6",
    accentSoft: "rgba(127, 159, 214, 0.2)",
  },
  {
    id: "angular",
    name: { fr: "Angular", en: "Angular" },
    tagline: {
      fr: "Change detection, RxJS, signals, formulaires",
      en: "Change detection, RxJS, signals, forms",
    },
    accent: "#ef6b6b",
    accentSoft: "rgba(239, 107, 107, 0.2)",
  },
];

export function getTopic(id: TopicId): Topic {
  const topic = topics.find((t) => t.id === id);
  if (!topic) {
    throw new Error(`Unknown topic: ${id}`);
  }
  return topic;
}
