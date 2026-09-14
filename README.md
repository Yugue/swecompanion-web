# SWE Companion

A free, SEO-optimized study guide for software engineering interviews: LeetCode patterns by
topic, and a 57-lesson Google ML domain interview curriculum. Built with Next.js (static export)
and Firebase (Auth + Firestore).

- Every LeetCode topic and every ML lesson has its own indexable page.
- Progress is stored locally and, once signed in, synced to Firestore across devices.
- Mock-interview quizzes (questions public, answers premium) exist for both guides - see
  [SETUP.md](SETUP.md) for the one-time setup and content-review steps.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build the static site

```bash
npm run build
```

Static files are written to `out/`.

## Deploy

```bash
firebase deploy --only hosting
```

See [SETUP.md](SETUP.md) for the Firebase console setup (sign-in providers, Firestore rules,
seeding quiz answers) this depends on.
