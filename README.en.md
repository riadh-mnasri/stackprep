# StackPrep

Interview training for Java, Spring Boot and Angular technical interviews: questions phrased the way a real interviewer would ask them, corrections that call out the classic traps, progress tracking by topic, and a graded test that simulates a pre-interview review.

[README en français](./README.md)

## Features

- Question bank organized by topic: Java Core, Spring Boot, JPA & Hibernate, SQL, Angular
- Practice mode per topic: question, detailed answer, common trap, self-rating (I knew it / partially / I didn't know)
- Progress dashboard: overall mastery, breakdown by topic, questions to revisit, graded test history
- Graded test: a draw of questions across every topic, weighted toward weak spots, with a final score and a readiness tier (ready / almost ready / still work to do)
- Bilingual French/English interface

Unlike devupnow.fr, StackPrep has no user account, no ranking between developers and no mobile app: it's a personal training tool that runs entirely in the browser, with no backend.

## Stack

- Next.js (App Router, Turbopack)
- TypeScript
- Tailwind CSS
- next-intl for bilingual routing and content
- Local storage (`localStorage`) for progress, no database

## Local development

```bash
npm install
npm run dev
```

The app runs on [http://localhost:3690](http://localhost:3690).

## Environment variables

None needed: the app has no backend.

## Tests

```bash
npm run lint
```

No dedicated test suite yet: this is a content app, not an architecture showcase project.

## Deployment

Deployed on Vercel with the GitHub integration connected: pushing to `main` triggers a production deployment.

## Roadmap

- [x] Practice engine (questions, correction, self-rating)
- [x] Progress dashboard
- [x] Weighted graded test
- [ ] Grow the question bank over time
- [ ] Add more topics if needed (Docker, Kubernetes, system design...)

## License

© 2026 Riadh MNASRI
