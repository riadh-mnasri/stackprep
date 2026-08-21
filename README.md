# StackPrep

Entraînement aux entretiens techniques Java, Spring Boot et Angular : questions posées comme en vrai entretien, correction avec les pièges classiques, suivi de progression par thème et test noté façon mise en situation.

[README in English](./README.en.md)

## Fonctionnalités

- Banque de questions organisée par thème : Java Core, Spring Boot, JPA & Hibernate, SQL, Angular
- Mode entraînement par thème : question, correction détaillée, piège classique, auto-évaluation (je savais / partiellement / je ne savais pas)
- Tableau de bord de progression : maîtrise globale, détail par thème, questions à retravailler, historique des tests notés
- Test noté : tirage de questions sur tous les thèmes, pondéré vers les points faibles, avec un score final et un niveau (prêt / presque prêt / à retravailler)
- Interface bilingue français/anglais

Contrairement à devupnow.fr, StackPrep n'a pas de compte utilisateur, de classement entre développeurs ni d'application mobile : c'est un outil d'entraînement personnel qui tourne entièrement dans le navigateur, sans backend.

## Stack

- Next.js (App Router, Turbopack)
- TypeScript
- Tailwind CSS
- next-intl pour le routage et le contenu bilingues
- Stockage local (`localStorage`) pour la progression, aucune base de données

## Développement local

```bash
npm install
npm run dev
```

L'application tourne sur [http://localhost:3690](http://localhost:3690).

## Variables d'environnement

Aucune variable d'environnement n'est nécessaire : l'application n'a pas de backend.

## Tests

```bash
npm run lint
```

Pas de suite de tests dédiée pour l'instant : c'est une application de contenu, pas un projet de démonstration d'architecture.

## Déploiement

Déployé sur Vercel, avec l'intégration GitHub connectée : un push sur `main` déclenche un déploiement en production.

## État d'avancement

- [x] Moteur d'entraînement (questions, correction, auto-évaluation)
- [x] Tableau de bord de progression
- [x] Test noté pondéré
- [ ] Étoffer la banque de questions au fil du temps
- [ ] Ajouter d'autres thèmes si besoin (Docker, Kubernetes, system design...)

## Licence

© 2026 Riadh MNASRI
