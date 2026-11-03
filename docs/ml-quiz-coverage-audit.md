# ML quiz coverage and content audit

Current delivery: all 77 ML quiz banks live in `src/content/ml-quizzes.json`.
Questions and model answers ship in the static quiz pages, without Firebase reads. The historical remote
checks below describe the earlier Firestore setup; current export checks verify
static payloads and absence of membership gates.

Current format: every prompt is a technical knowledge question about concepts,
mechanisms, assumptions, distinctions, or limitations. Calculation exercises,
debugging scenarios, and project walkthrough prompts have been replaced.
See [the current review](ml-interview-quiz-review.md) for the topic inventory.

## Historical coverage work

The sections below record the earlier coverage implementation; numerical quiz
formats and four-skill requirements described there have been superseded.

## Gaps found and fixed

| Domain | Initial gap | Action |
|---|---|---|
| Speech / Audio | No question banks, quiz routes, or advertised quizzes in any of six Parts | Added six quizzes with 60 original questions and model answers |
| Reinforcement Learning | No question banks, quiz routes, or advertised quizzes in any of six Parts | Added six quizzes with 60 original questions and model answers |
| NLP | Ten local banks existed, but all ten Firestore documents were missing | Loaded the existing 64 question/answer pairs |
| Generative AI | Eight local banks existed, but all eight Firestore documents were missing | Loaded the existing 64 question/answer pairs |
| LLM | Seven local banks existed, but all seven Firestore documents were missing | Loaded the existing 57 question/answer pairs |

Deep Learning, Applied ML, Agentic AI, CV, RRP, and Distributed ML had matching
local advertised counts and nonempty stored banks. The previous Distributed ML
quiz work remains included; its 60 questions were not replaced by this audit.

All previously committed question banks were preserved. Existing NLP, Generative
AI, and LLM content was activated, not rewritten.

## Verified final inventory

| Domain | Quizzes | Questions with paired model answers |
|---|---:|---:|
| Deep Learning | 6 | 60 |
| Applied ML | 7 | 72 |
| Agentic AI | 7 | 71 |
| Computer Vision | 7 | 70 |
| NLP | 10 | 64 |
| Recommendations / Ranking | 7 | 70 |
| Generative AI | 8 | 64 |
| LLM | 7 | 57 |
| Speech / Audio | 6 | 60 |
| Reinforcement Learning | 6 | 60 |
| Distributed ML | 6 | 60 |
| **Total** | **77** | **708** |

A read-back audit of the configured swecompanion Firestore project verified exact
question and answer equality with local sources for all 77 registered ML quiz
documents. No ML domain is left without quizzes in the local implementation or
quiz store. Public hosting still uses the normal site deployment process.

## Google ML domain practice: editorial approach

The 120 new questions prioritize durable foundations and applied reasoning at the
requested mid-to-senior engineering depth. Every Part mixes four skills:
explaining mechanisms, working small calculations, diagnosing failures, and
comparing tradeoffs. Questions use concrete scenarios and explicit assumptions,
rather than relying on framework trivia or memorized research results.

RL emphasizes task formulation, state and observation, returns and Bellman
reasoning, TD/control targets, exploration, replay and value bias, policy gradients,
actor–critics, offline support, reward mismatch, and independent evaluation.

Speech emphasizes sampling and representations, neural objectives and masking,
recognition targets and alignment, CTC/transducers, speaker and event tasks,
generation and codecs, data leakage, metrics, causality, and user-visible latency.

Public Google material informed topic priorities and technical context:
[Google's ML Crash Course](https://developers.google.com/machine-learning/crash-course)
covers modeling, optimization, generalization, evaluation, and production concepts;
its [exercises](https://developers.google.com/machine-learning/crash-course/exercises)
combine calculations and applied checks.
Google Research's [sequence-to-sequence recognition comparison](https://research.google/pubs/a-comparison-of-sequence-to-sequence-models-for-speech-recognition/)
provides primary context for CTC, transducers, and attention;
its [exploration discussion](https://www.research.google/blog/efficiently-initializing-reinforcement-learning-with-prior-policies/)
illustrates the distinction between useful experience and optimization alone.

These are original practice questions. Public learning material is not evidence
of actual interview-question frequency or a guaranteed Google interview syllabus.
The shared quiz copy now describes practice goals without claiming that prompts
were sourced from real interviews. Existing banks received coverage and storage
checks; this task did not semantically rewrite all 588 pre-existing questions.

## Validation

- npm run check:ml-quizzes: audits all configured ML domains and advertised counts;
  validates all 120 new pairs, four-skill balance, ordered dependencies, and coverage
  of all 64 Speech/RL lessons.
- All 31 calculation questions are tied to independent result checks, including
  Bellman/TD updates, Double DQN selection, signed PPO clipping, GAE, support-weighted
  evaluation, sampling and frame counts, CTC path enumeration, codec bitrate, and
  corpus-versus-utterance metrics.
- npm run check:ml-quizzes -- --export: verifies every ML quiz route, hub links,
  canonical URLs, sitemap entries, premium gates, all new lesson quiz links, and
  absence of the 120 new question/answer payloads from public artifacts.
- npm run check:ml-quizzes -- --remote: reads all registered quiz documents and
  compares their complete question/answer arrays with the local bank.
- Production build and lint passed. Speech, RL, and Distributed ML guide checks
  also passed against their exported pages.
- Scoped seeds wrote only the intended NLP, GenAI, LLM, RL, and Speech banks.
  Existing access rules and premium delivery were retained; no private quiz
  payload is imported by the public application.
