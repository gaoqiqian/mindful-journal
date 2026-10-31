# Mindful Journal — English Interactive Demo

An English edition of the student interface from Mindful Journal, a journaling and emotional reflection project (software copyright registration 2025SR1806676).

**[Open the English interactive demo](https://mindful-journal-demo.cooper1872.chatgpt.site/)**

## Try it

Open the hosted site and explore as a guest. Four fictional entries introduce the workflow. Write a new entry, view keyword-based emotion tags, edit it, inspect 7/30-day trends, browse resources, export JSON, or reset the demo.

## Implementation

This is the existing React/TypeScript student interface, localized into English, with a browser-local adapter replacing the Spring Boot API for a portable showcase. ECharts renders the trends. Hash routing supports static hosting and refreshes on nested routes.

The original project has a Java/Spring Boot backend, MySQL, Redis, JWT authentication and student/counselor/administrator workflows. Those services are **not connected** in this demo. New entries stay in this browser's local storage. No account, server, model key or diary upload is required.

Emotion analysis uses transparent English keyword rules, not a live LLM. Weights shown beside tags are fixed rule weights, not calibrated probabilities. Negation, context and sarcasm may be missed. Self-care prompts are predefined. The informal check-in has no clinical scoring and does not administer the original simplified questionnaires. Sharing preferences demonstrate UI state only; no counselor receives entries or alerts. This is not a medical or crisis-response service.

## Run locally

```sh
npm ci
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

Publish the generated `dist` directory to a static host. Use fictional data in public demonstrations. No real user records, credentials, backend configuration or API secrets are included.

## Scope

This standalone English showcase preserves the original Chinese application in the parent directory. It does not claim that the production backend or administrative interface has been fully localized or deployed.

The English display name is Mindful Journal. The original Chinese project is 心愈; the software copyright registration remains 2025SR1806676.

Public demo: https://mindful-journal-demo.cooper1872.chatgpt.site/

## Repository scope and rights

This repository contains the English student demo, not the original server or private database. The original Chinese project is 心愈. Copyright registration 2025SR1806676 is recorded in the project materials and is not a software redistribution license. No general open-source license is granted for project-authored code in this repository. Dependencies retain their respective licenses.
