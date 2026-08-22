# AceReady

Entraînement aux entretiens techniques Java, Cloud, Data et IA : questions posées comme en vrai entretien, correction avec les pièges classiques, suivi de progression par thème et test noté façon mise en situation.

**Démo en ligne : [aceready.vercel.app](https://aceready.vercel.app)**

[README in English](./README.en.md)

## Sommaire

- [Pourquoi AceReady ?](#pourquoi-aceready-)
- [Fonctionnalités](#fonctionnalités)
- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Démarrage rapide](#démarrage-rapide)
- [Structure du projet](#structure-du-projet)
- [Variables d'environnement](#variables-denvironnement)
- [Qualité et tests](#qualité-et-tests)
- [Déploiement](#déploiement)
- [État d'avancement](#état-davancement)
- [Licence](#licence)

## Pourquoi AceReady ?

Le nom vient de l'expression « ace it », réussir haut la main : l'appli existe pour te rendre prêt à ace ton prochain entretien technique. Le projet s'appelait à l'origine StackPrep, mais ce nom entrait en collision directe avec un produit existant, [stackprep.app](https://www.stackprep.app/), qui propose le même concept sous le même nom. Plutôt que d'entretenir la confusion, le projet a été renommé.

## Fonctionnalités

- **Banque de questions** organisée en 16 thèmes : Java Core, Spring Boot, JPA & Hibernate, SQL, Angular, Kotlin, Kafka, Docker, Kubernetes, Terraform, Apache Spark, AWS, Azure, GCP, GitHub Copilot, Claude & LLM, avec un niveau de difficulté par question
- **Mode entraînement** par thème : question posée sans indice, correction détaillée, piège classique associé, puis auto-évaluation (je savais / partiellement / je ne savais pas)
- **Tableau de bord de progression** : maîtrise globale, détail par thème avec barres de progression, liste des questions à retravailler, historique des tests notés
- **Test noté** : tirage de questions sur tous les thèmes, pondéré vers les points faibles identifiés, avec un score final et un niveau de préparation (prêt / presque prêt / à retravailler)
- **Interface bilingue** français/anglais, contenu traduit et pas seulement l'UI
- **100% local** : aucune inscription, aucune donnée envoyée à un serveur, la progression reste dans le navigateur

Contrairement à devupnow.fr, dont AceReady s'inspire pour le concept initial, l'application n'a pas de compte utilisateur, de classement entre développeurs ni d'application mobile : c'est un outil d'entraînement personnel qui tourne entièrement côté client.

## Aperçu

| Accueil | Entraînement | Tableau de bord |
|---|---|---|
| ![Accueil d'AceReady](./docs/screenshots/home.jpg) | ![Correction d'une question Angular](./docs/screenshots/practice.jpg) | ![Tableau de bord de progression](./docs/screenshots/dashboard.jpg) |

## Stack technique

- [Next.js](https://nextjs.org) (App Router, Turbopack)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [next-intl](https://next-intl.dev) pour le routage et le contenu bilingues
- Stockage local (`localStorage`) pour la progression, aucune base de données ni API

## Démarrage rapide

Prérequis : Node.js 20+.

```bash
git clone https://github.com/riadh-mnasri/aceready.git
cd aceready
npm install
npm run dev
```

L'application tourne sur [http://localhost:3690](http://localhost:3690).

## Structure du projet

```
src/
  app/[locale]/        Routes (accueil, entraînement, test noté, tableau de bord)
  components/          Composants UI (moteur de question, tableau de bord, etc.)
  content/              Banque de questions et métadonnées des thèmes
  i18n/                 Configuration next-intl (routage, navigation)
  lib/                  Store de progression (localStorage) et calculs de statistiques
  proxy.ts             Proxy Next.js pour le routage par locale et la redirection de l'ancien domaine
messages/               Fichiers de traduction FR/EN de l'interface
```

## Variables d'environnement

Aucune variable d'environnement n'est nécessaire : l'application n'a pas de backend.

## Qualité et tests

```bash
npm run lint
```

Pas de suite de tests dédiée pour l'instant : c'est une application de contenu, pas un projet de démonstration d'architecture.

## Déploiement

Déployé sur Vercel avec l'intégration GitHub connectée : un push sur `main` déclenche un déploiement en production automatique.

```bash
vercel --prod
```

## État d'avancement

- [x] Moteur d'entraînement (questions, correction, auto-évaluation)
- [x] Tableau de bord de progression
- [x] Test noté pondéré vers les points faibles
- [x] Déployé en production
- [x] 16 thèmes, 214 questions, dont des questions niveau senior/architecte avec exemples de code
- [ ] Étoffer encore la banque de questions au fil du temps

## Licence

© 2026 Riadh MNASRI
