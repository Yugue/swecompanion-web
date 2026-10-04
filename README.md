# SWE Companion

A free, SEO-optimized study guide for software engineering interviews: LeetCode patterns by
topic, and a 57-lesson Google ML domain interview curriculum. Built with Next.js (static export)
and Firebase (Auth + Firestore).

- Every LeetCode topic and every ML lesson has its own indexable page.
- Progress is stored locally and, once signed in, synced to Firestore across devices.
- Mock-interview quizzes (questions public, answers premium) exist for both guides - see
  [SETUP.md](SETUP.md) for the one-time setup and content-review steps.

## Run locally

The Computer Vision / Image Processing guide is available at `/mldomain/cv`: eight Parts and
48 standalone chapters, with sequential navigation, interview prompts and
worked answers, and independent local/account progress. Its lesson sources live in
`src/content/cv-lessons` and its curriculum is defined in `src/lib/cvStudyData.ts`.

Run `npm run check:cv` to validate curriculum coverage, lesson structure, prerequisites,
tables, and equations through the site's lesson parser.
After building, `npm run check:cv -- --export` also checks the 48 exported lesson pages,
internal links, canonical URLs, and sitemap entries.

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
