# SWE Companion

A free, SEO-optimized study guide for software engineering interviews: LeetCode patterns by
topic, and a 57-lesson Google ML domain interview curriculum. Built with Next.js (static export)
and Firebase (Auth + Firestore).

Email/password and Google authentication, Pro subscriptions, invoice history, and account
settings are documented in [Authentication and sandbox billing](docs/auth-billing.md).

- Every LeetCode topic and every ML lesson has its own indexable page.
- Progress is stored locally and, once signed in, synced to Firestore across devices.
- All ML domain quizzes and model answers are free, with no sign-in or membership required.
  Each quiz is included in its static page from `scripts/quizzes.json`.

## Run locally

The Computer Vision / Image Processing guide is available at `/mldomain/cv`: eight Parts and
48 standalone chapters, with sequential navigation, interview prompts and
worked answers, and independent local/account progress. Its lesson sources live in
`src/content/cv-lessons` and its curriculum is defined in `src/lib/cvStudyData.ts`.

Run `npm run check:cv` to validate curriculum coverage, lesson structure, prerequisites,
tables, and equations through the site's lesson parser.
After building, `npm run check:cv -- --export` also checks the 48 exported lesson pages,
internal links, canonical URLs, and sitemap entries.

Graphical figures use a fenced `cv-visual` block containing a registered ID, such as
`convolution`. Register titles, captions, and accessible descriptions in
`src/lib/cvVisuals.ts`; renderers live in `src/components/cv/visuals`.
Run `npx tsx scripts/checkCvVisuals.ts` to verify figure placements and the numerical
examples, including convolution outputs and independently checked MLP gradients.

The Deep Learning guide uses `dl-visual` blocks, registered in `src/lib/dlVisuals.ts`,
and shares the convolution and MLP demonstrations. Run `npx tsx scripts/checkDlVisuals.ts`
for its figure and numerical checks; add `--export` after building to check the exported figures.

The Applied ML → Basics of ML guide has 46 chapters across seven Parts. Its concise
definitions, worked examples, and selective figures live in `src/content/aml-lessons`.
Use 6–12 short sequential sections: intuition, mechanism, essential math with defined
variables, helpful visuals, practical use, limitations, and a closing reasoning question
with a brief answer. Define concepts at first use. Teach shared mechanisms in one main
location and apply them later; keep the final revision free of new prerequisites.
Retain the interview-ready overview and keep operation examples to 1–5 lines.
Use an `aml-visual` fence with an ID from `src/lib/amlVisuals.ts`; its SVG renderers
live in `src/components/aml/visuals`. Run `npx tsx scripts/checkAmlGuide.ts` to check
curriculum coverage, parsed tables and math, figure references, and numerical claims.
It also checks section and paragraph length, closing prompts, and repeated prose.
Add `--export` after building to verify all chapter pages, figures, links, and sitemap entries.
The audit's technical references include scikit-learn's guidance on
[calibration](https://scikit-learn.org/stable/modules/calibration.html),
[cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html),
[preprocessing](https://scikit-learn.org/stable/modules/preprocessing.html), and
[leakage prevention](https://scikit-learn.org/stable/common_pitfalls.html), plus
[metric definitions](https://scikit-learn.org/stable/modules/model_evaluation.html)
and [clustering](https://scikit-learn.org/stable/modules/clustering.html).

The RRP guide has 45 chapters across seven Parts. Sources in `src/content/rrp-lessons`
use 6–12 short numbered sections when appropriate: intuition, mechanism, essential
math with defined variables, helpful visuals, use, limitations, and a closing reasoning
question with a brief answer. Define new concepts at first use and keep one teaching
location for each shared mechanism; later chapters apply it. Keep code examples to
1–5 lines. Each lesson starts with an interview-ready overview containing its summary,
key points, optional example, and interview probe, matching the other topics.
Existing figures are retained only where they aid understanding.
Use an `rrp-visual` fence with an ID from `src/lib/rrpVisuals.ts`; its SVG renderers
live in `src/components/rrp/visuals`. Run `npx tsx scripts/checkRrpGuide.ts` to validate
coverage, tables, math, figure references, and numerical examples. Add `--export`
after building to check all chapter pages, accessible figures, links, and sitemap entries.
The check also verifies short sequential sections, closing prompts, and repeated prose.
Worked RRP examples include factorization and two-tower gradient updates, a listwise
loss, overall-AUC versus request-ordering disagreement, numeric loss choices, and
boosted-tree corrections. Training derivatives are checked with finite differences.
Technical references include Google's [recommendation overview](https://developers.google.com/machine-learning/recommendation/overview/types),
the [YouTube retrieval and ranking paper](https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/),
[Bayesian personalized ranking](https://arxiv.org/abs/1205.2618), and
[counterfactual risk minimization](https://proceedings.mlr.press/v37/swaminathan15.pdf).
Prediction metrics follow Google's [ROC and AUC guide](https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc);
the tree comparison follows scikit-learn's [gradient-boosting documentation](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.GradientBoostingRegressor.html).
The short operation examples follow PyTorch's
[normalization](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.normalize.html)
and [softplus](https://docs.pytorch.org/docs/stable/generated/torch.nn.functional.softplus.html) documentation.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The Reinforcement Learning guide is available at `/mldomain/rl`: 33 standalone lessons
across six Parts, covering probability and neural foundations, Bellman reasoning,
value learning, policy gradients and actor–critics, models and offline data, and
practical reward design, evaluation, and deployment. Sources live in
`src/content/rl-lessons`; the curriculum is defined in `src/lib/rlStudyData.ts`.
Lessons use concise numbered sections, essential equations, small worked examples,
comparison tables, and diagrams.
Progress is independent of other topics and supports the existing account sync.
Run `npm run check:rl` to validate coverage, prerequisites, parsed equations and tables,
lesson structure, short code examples, and numerical learning mechanisms.
After building, `npm run check:rl -- --export` checks all 33 exported lesson pages,
sequential links, canonical metadata, and sitemap entries.

The Distributed Machine Learning guide is available at `/mldomain/distributed`: 28
standalone lessons across six Parts, following the approved curriculum in
`docs/distributed-ml-curriculum.md`. It introduces neural training, GPU execution,
and distributed-systems foundations before collective communication, distributed
optimization, memory efficiency, model partitioning, scaling, recovery, and serving.
Lesson sources live in `src/content/distributed-lessons`; curriculum metadata and
prerequisite links are defined in `src/lib/distributedStudyData.ts`.

Each lesson has 8–9 concise sections, with worked examples, equations, comparison
tables, and execution diagrams. Progress is independent of other topics and uses
the existing local/account sync. The lessons do not add interview-practice,
recap, or reading-list sections. Six separate Part quizzes provide 60 questions
with model answers, free without signing in. Questions and answers live in
`scripts/quizzes.json` and are included in each exported quiz page. No database
seeding is required for ML domain quizzes.

Run `npm run check:distributed` to validate curriculum coverage, dependencies,
parsed equations/tables/diagrams, Python syntax, and independent numerical examples.
After building, `npm run check:distributed -- --export` verifies all 28 lesson
pages, prerequisites, sequential navigation, canonical URLs, and sitemap entries.
GPU snippets are illustrative excerpts; the checks do not launch distributed GPU jobs.

## ML quiz coverage

All 11 ML domains have Part/chapter quizzes: 77 quizzes and 708 paired questions
and model answers. Speech / Audio and Reinforcement Learning each have six
10-question quizzes with concrete examples, worked calculations, diagnostics,
and tradeoffs. Their lesson pages and curriculum link to the corresponding quiz.

Run `npm run check:ml-quizzes` to audit local coverage and new question quality.
ML quiz pages render their questions and model answers directly in the static export.
Add `-- --export` after building to verify free access and public question/answer payloads
on every quiz page. `--remote` only checks legacy Firestore copies. These are original practice questions, not actual Google
interview questions. See [the audit](docs/ml-quiz-coverage-audit.md) for the initial
gaps, content scope, inventory, and validation results.

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
