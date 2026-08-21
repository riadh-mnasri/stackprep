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
  {
    id: "claude",
    name: { fr: "Claude & LLM", en: "Claude & LLM" },
    tagline: {
      fr: "Prompting, tool use, RAG, sécurité des agents",
      en: "Prompting, tool use, RAG, agent security",
    },
    accent: "#d08a68",
    accentSoft: "rgba(208, 138, 104, 0.22)",
  },
  {
    id: "kubernetes",
    name: { fr: "Kubernetes", en: "Kubernetes" },
    tagline: {
      fr: "Pods, déploiements, scaling, résilience",
      en: "Pods, deployments, scaling, resilience",
    },
    accent: "#4fa8e0",
    accentSoft: "rgba(79, 168, 224, 0.2)",
  },
  {
    id: "gcp",
    name: { fr: "GCP", en: "GCP" },
    tagline: {
      fr: "Compute, IAM, réseau, données managées",
      en: "Compute, IAM, networking, managed data",
    },
    accent: "#e0b84f",
    accentSoft: "rgba(224, 184, 79, 0.2)",
  },
  {
    id: "kafka",
    name: { fr: "Kafka", en: "Kafka" },
    tagline: {
      fr: "Topics, partitions, consumer groups, exactly-once",
      en: "Topics, partitions, consumer groups, exactly-once",
    },
    accent: "#a394d6",
    accentSoft: "rgba(163, 148, 214, 0.2)",
  },
  {
    id: "kotlin",
    name: { fr: "Kotlin", en: "Kotlin" },
    tagline: {
      fr: "Null safety, coroutines, sealed classes, extensions",
      en: "Null safety, coroutines, sealed classes, extensions",
    },
    accent: "#d17fc4",
    accentSoft: "rgba(209, 127, 196, 0.2)",
  },
  {
    id: "copilot",
    name: { fr: "GitHub Copilot", en: "GitHub Copilot" },
    tagline: {
      fr: "Dev assisté par IA, revue de code, risques",
      en: "AI-assisted development, code review, risks",
    },
    accent: "#7fd6c2",
    accentSoft: "rgba(127, 214, 194, 0.2)",
  },
  {
    id: "aws",
    name: { fr: "AWS", en: "AWS" },
    tagline: {
      fr: "EC2, Lambda, IAM, S3, RDS, DynamoDB",
      en: "EC2, Lambda, IAM, S3, RDS, DynamoDB",
    },
    accent: "#e0954f",
    accentSoft: "rgba(224, 149, 79, 0.2)",
  },
  {
    id: "azure",
    name: { fr: "Azure", en: "Azure" },
    tagline: {
      fr: "App Service, AKS, Entra ID, Functions",
      en: "App Service, AKS, Entra ID, Functions",
    },
    accent: "#5c8fe6",
    accentSoft: "rgba(92, 143, 230, 0.2)",
  },
  {
    id: "docker",
    name: { fr: "Docker", en: "Docker" },
    tagline: {
      fr: "Images, couches, réseau, multi-stage builds",
      en: "Images, layers, networking, multi-stage builds",
    },
    accent: "#3fc4d4",
    accentSoft: "rgba(63, 196, 212, 0.2)",
  },
  {
    id: "terraform",
    name: { fr: "Terraform", en: "Terraform" },
    tagline: {
      fr: "State, plan/apply, modules, dérive de configuration",
      en: "State, plan/apply, modules, configuration drift",
    },
    accent: "#9868d9",
    accentSoft: "rgba(152, 104, 217, 0.2)",
  },
  {
    id: "spark",
    name: { fr: "Apache Spark", en: "Apache Spark" },
    tagline: {
      fr: "RDD, DataFrame, shuffle, streaming structuré",
      en: "RDD, DataFrame, shuffle, structured streaming",
    },
    accent: "#e0765f",
    accentSoft: "rgba(224, 118, 95, 0.2)",
  },
];

export function getTopic(id: TopicId): Topic {
  const topic = topics.find((t) => t.id === id);
  if (!topic) {
    throw new Error(`Unknown topic: ${id}`);
  }
  return topic;
}
