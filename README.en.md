# AceReady

Interview training for Java, Cloud, Data and AI technical interviews: questions phrased the way a real interviewer would ask them, corrections that call out the classic traps, progress tracking by topic, and a graded test that simulates a pre-interview review.

**Live demo: [aceready.vercel.app](https://aceready.vercel.app)**

[README en français](./README.md)

## Table of contents

- [Why AceReady?](#why-aceready)
- [Features](#features)
- [Preview](#preview)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Quality and tests](#quality-and-tests)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

## Why AceReady?

The name comes from the expression "ace it": the app exists to get you ready to ace your next technical interview. The project was originally called StackPrep, but that name directly collided with an existing product, [stackprep.app](https://www.stackprep.app/), which offers the same concept under the same name. Rather than keep feeding that confusion, the project was renamed.

## Features

- **Question bank** organized into 16 topics: Java Core, Spring Boot, JPA & Hibernate, SQL, Angular, Kotlin, Kafka, Docker, Kubernetes, Terraform, Apache Spark, AWS, Azure, GCP, GitHub Copilot, Claude & LLM, each question tagged with a difficulty level
- **Practice mode** per topic: the question is asked with no hint, then a detailed answer, the associated common trap, and finally a self-rating (I knew it / partially / I didn't know)
- **Progress dashboard**: overall mastery, breakdown by topic with progress bars, list of questions to revisit, graded test history
- **Graded test**: a draw of questions across every topic, weighted toward identified weak spots, with a final score and a readiness tier (ready / almost ready / still work to do)
- **Bilingual interface**, French/English, with translated content, not just the UI
- **Fully local**: no account, no data sent to a server, progress stays in the browser

Unlike devupnow.fr, which inspired the original concept, AceReady has no user account, no ranking between developers and no mobile app: it's a personal training tool that runs entirely client-side.

## Preview

| Home | Practice | Dashboard |
|---|---|---|
| ![AceReady home page](./docs/screenshots/home.jpg) | ![Correction of an Angular question](./docs/screenshots/practice.jpg) | ![Progress dashboard](./docs/screenshots/dashboard.jpg) |

## Tech stack

- [Next.js](https://nextjs.org) (App Router, Turbopack)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [next-intl](https://next-intl.dev) for bilingual routing and content
- Local storage (`localStorage`) for progress, no database or API

## Quick start

Requirements: Node.js 20+.

```bash
git clone https://github.com/riadh-mnasri/aceready.git
cd aceready
npm install
npm run dev
```

The app runs on [http://localhost:3690](http://localhost:3690).

## Project structure

```
src/
  app/[locale]/        Routes (home, practice, graded test, dashboard)
  components/          UI components (question engine, dashboard, etc.)
  content/              Question bank and topic metadata
  i18n/                 next-intl configuration (routing, navigation)
  lib/                  Progress store (localStorage) and stats calculations
  proxy.ts             Next.js proxy for locale routing and legacy domain redirect
messages/               FR/EN translation files for the interface
```

## Environment variables

None needed: the app has no backend.

## Quality and tests

```bash
npm run lint
```

No dedicated test suite yet: this is a content app, not an architecture showcase project.

## Deployment

Deployed on Vercel with the GitHub integration connected: pushing to `main` triggers an automatic production deployment.

```bash
vercel --prod
```

## Roadmap

- [x] Practice engine (questions, correction, self-rating)
- [x] Progress dashboard
- [x] Graded test weighted toward weak spots
- [x] Deployed to production
- [x] 16 topics, 214 questions, including senior/architect-level questions with code examples
- [ ] Keep growing the question bank over time

## License

© 2026 Riadh MNASRI
