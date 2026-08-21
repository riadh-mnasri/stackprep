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
    accent: "#d98c3f",
    accentSoft: "rgba(217, 140, 63, 0.14)",
  },
  {
    id: "spring-boot",
    name: { fr: "Spring Boot", en: "Spring Boot" },
    tagline: {
      fr: "Injection de dépendances, MVC, sécurité, tests",
      en: "Dependency injection, MVC, security, testing",
    },
    accent: "#5a9c5e",
    accentSoft: "rgba(90, 156, 94, 0.14)",
  },
  {
    id: "jpa-hibernate",
    name: { fr: "JPA & Hibernate", en: "JPA & Hibernate" },
    tagline: {
      fr: "Mapping, relations, cache, performance",
      en: "Mapping, relations, caching, performance",
    },
    accent: "#4f8a9c",
    accentSoft: "rgba(79, 138, 156, 0.14)",
  },
  {
    id: "sql",
    name: { fr: "SQL", en: "SQL" },
    tagline: {
      fr: "Jointures, index, transactions, modélisation",
      en: "Joins, indexes, transactions, modeling",
    },
    accent: "#5c7ea3",
    accentSoft: "rgba(92, 126, 163, 0.14)",
  },
  {
    id: "angular",
    name: { fr: "Angular", en: "Angular" },
    tagline: {
      fr: "Change detection, RxJS, signals, formulaires",
      en: "Change detection, RxJS, signals, forms",
    },
    accent: "#c94f4f",
    accentSoft: "rgba(201, 79, 79, 0.14)",
  },
];

export function getTopic(id: TopicId): Topic {
  const topic = topics.find((t) => t.id === id);
  if (!topic) {
    throw new Error(`Unknown topic: ${id}`);
  }
  return topic;
}
