# ML quiz technical-knowledge review

Updated: 2026-11-03. Current scope: 77 quizzes across 11 ML domains, containing 708 paired knowledge questions and model answers.

## Content standard

Questions test definitions, core mechanisms, objectives, assumptions, important distinctions, and limitations. They ask what a concept means, why a method works, or how two methods differ. Symbolic relationships can be explained when intrinsic to the concept, but there are no numerical calculation exercises, debugging scenarios, or project walkthrough tasks.

All 708 pairs were rewritten for this format. Chapter inventory and advertised counts are unchanged. Answers explain the concept directly without requiring a hypothetical production incident or a numerical worked result.

## Preparation order

The first three displayed questions introduce selected core concepts in each chapter. Remaining questions provide conceptual depth. This is an editorial study order, not an estimate of the probability that a specific Google question will appear. The earlier scenario-oriented review is superseded by this knowledge-focused format.

## Domain focus

| Domain | Core technical knowledge |
|---|---|
| Deep Learning | Gradients, losses, optimization, regularization, architectures, attention |
| Applied ML | Task formulations, feature representations, algorithms, generalization, metrics, calibration |
| Agentic AI | Control flow, tool contracts, state, retrieval, coordination, evaluation, trust boundaries |
| Recommendations | Feedback, factorization, retrieval, ranking objectives, bias, experiments, serving semantics |
| Computer Vision | Signals, geometry, convolution, detection, segmentation, visual representations, transfer |
| NLP | Text representations, probability, sequence objectives, attention, understanding, retrieval, generation |
| GenAI | Generative objectives, adaptation, sampling, latent/image models, grounding, evaluation, inference |
| LLM | Causal modeling, Transformer components, pretraining, post-training, grounding, caching |
| Distributed ML | Parallelism, collective semantics, gradient aggregation, sharding, scaling, recovery, inference |
| Reinforcement Learning | Returns, value functions, Bellman structure, policy learning, off-policy assumptions, evaluation |
| Speech | Sampling, acoustic representations, alignment, recognition, speaker tasks, synthesis, metrics |

## Chapter inventory

Source priority indices below are one-based positions in `ml-quizzes.json`. The server orders these three questions first while preserving their answer pairings and then appends the remaining questions in source order.

| Quiz | Questions | Core source indices |
|---|---:|---|
| `ml-foundations` | 10 | 5, 3, 8 |
| `ml-learning` | 10 | 1, 4, 7 |
| `ml-architectures` | 10 | 1, 6, 10 |
| `ml-transformers` | 10 | 1, 5, 10 |
| `ml-modern-deep-learning` | 10 | 2, 3, 9 |
| `ml-practical-reasoning` | 10 | 3, 5, 4 |
| `aml-foundations` | 12 | 3, 4, 6 |
| `aml-data-and-features` | 10 | 8, 5, 2 |
| `aml-supervised-algorithms` | 10 | 2, 9, 10 |
| `aml-training-and-generalization` | 10 | 1, 8, 9 |
| `aml-evaluation` | 10 | 1, 3, 4 |
| `aml-unsupervised` | 10 | 7, 8, 9 |
| `aml-applied-practice` | 10 | 1, 6, 7 |
| `agentic-foundations` | 11 | 8, 3, 5 |
| `agentic-tool-use` | 10 | 2, 4, 6 |
| `agentic-reasoning` | 10 | 3, 5, 6 |
| `agentic-memory-and-retrieval` | 10 | 4, 8, 10 |
| `agentic-multi-agent` | 10 | 1, 8, 9 |
| `agentic-evaluation-and-safety` | 10 | 1, 4, 9 |
| `agentic-production` | 10 | 1, 6, 7 |
| `rrp-foundations` | 10 | 1, 2, 5 |
| `rrp-classical-recommenders` | 10 | 7, 6, 8 |
| `rrp-retrieval` | 10 | 4, 6, 9 |
| `rrp-ranking` | 10 | 2, 3, 8 |
| `rrp-evaluation` | 10 | 3, 6, 8 |
| `rrp-production` | 10 | 4, 5, 2 |
| `rrp-applied-practice` | 10 | 9, 3, 7 |
| `cv-images-and-signals` | 10 | 6, 4, 1 |
| `cv-classical-vision` | 10 | 6, 7, 9 |
| `cv-learning-foundations` | 10 | 2, 4, 6 |
| `cv-cnn-representations` | 10 | 1, 6, 10 |
| `cv-vision-tasks` | 10 | 1, 4, 6 |
| `cv-modern-vision` | 10 | 4, 3, 8 |
| `cv-practical-cv` | 10 | 3, 4, 8 |
| `nlp-foundations` | 3 | 3, 2, 1 |
| `nlp-mathematics-and-probability` | 5 | 4, 5, 3 |
| `nlp-text-representations` | 6 | 1, 4, 6 |
| `nlp-classical-models` | 4 | 4, 2, 3 |
| `nlp-neural-foundations` | 4 | 2, 3, 1 |
| `nlp-embeddings-and-sequences` | 8 | 4, 5, 7 |
| `nlp-transformers` | 7 | 2, 1, 4 |
| `nlp-pretraining-and-adaptation` | 6 | 1, 2, 5 |
| `nlp-understanding-tasks` | 11 | 3, 7, 10 |
| `nlp-retrieval-and-generation` | 10 | 1, 2, 10 |
| `genai-foundations` | 8 | 1, 3, 5 |
| `genai-language-and-transformers` | 8 | 3, 5, 7 |
| `genai-training-and-adaptation` | 8 | 1, 7, 5 |
| `genai-generation-and-reasoning` | 8 | 3, 4, 8 |
| `genai-image-and-multimodal` | 8 | 4, 1, 8 |
| `genai-grounding-and-retrieval` | 8 | 8, 5, 3 |
| `genai-evaluation-and-safety` | 8 | 1, 4, 6 |
| `genai-inference-and-diagnosis` | 8 | 1, 2, 8 |
| `llm-foundations` | 8 | 1, 4, 6 |
| `llm-transformers` | 8 | 2, 1, 8 |
| `llm-pretraining` | 8 | 1, 3, 6 |
| `llm-post-training` | 8 | 1, 6, 2 |
| `llm-generation-and-grounding` | 10 | 4, 6, 2 |
| `llm-evaluation-and-safety` | 8 | 1, 3, 8 |
| `llm-inference-and-serving` | 7 | 1, 2, 7 |
| `distributed-execution-foundations` | 10 | 1, 2, 3 |
| `distributed-data-and-optimization` | 12 | 3, 8, 9 |
| `distributed-memory-and-partitioning` | 12 | 1, 3, 9 |
| `distributed-scaling-training` | 8 | 4, 5, 7 |
| `distributed-correctness-and-recovery` | 8 | 1, 5, 6 |
| `distributed-distributed-inference` | 10 | 2, 4, 5 |
| `rl-foundations` | 10 | 1, 7, 8 |
| `rl-learning-values` | 10 | 3, 6, 7 |
| `rl-deep-values` | 10 | 2, 4, 7 |
| `rl-policy-optimization` | 10 | 1, 2, 4 |
| `rl-models-and-data` | 10 | 3, 4, 7 |
| `rl-practical-systems` | 10 | 1, 6, 7 |
| `speech-audio-signals` | 10 | 3, 7, 9 |
| `speech-learning-foundations` | 10 | 2, 6, 8 |
| `speech-speech-recognition` | 10 | 3, 7, 10 |
| `speech-audio-understanding` | 10 | 2, 3, 10 |
| `speech-audio-generation` | 10 | 2, 4, 8 |
| `speech-practical-systems` | 10 | 1, 3, 6 |

## Validation

Checks cover exact curriculum inventory, nonempty paired answers, within-chapter uniqueness, explicit priorities, knowledge-prompt structure, and the absence of numerical setups and debugging instructions. Existing Speech, RL, and Distributed ML lesson mappings are retained with knowledge-only labels. Numerical quiz fixtures were removed because those exercises are no longer part of the quizzes; numerical checks of lesson material remain separate.

Production export validation checks every quiz route, its source content, rendered question count and priority order, links, metadata, and sitemap. Structural checks support integrity; they do not establish interview frequencies or replace editorial review.

## Public background sources

The current format follows the user's requirement for technical knowledge questions. Earlier background research used Google's [structured-interview guidance](https://rework.withgoogle.com/intl/en/guides/a-guide-to-structured-interviewing-for-better-hiring-practices), [ML Crash Course](https://developers.google.com/machine-learning/crash-course), [Rules of ML](https://developers.google.com/machine-learning/guides/rules-of-ml), and [recommendation systems course](https://developers.google.com/machine-learning/recommendation/overview). These public materials inform topic relevance; they do not publish an ML interview question-frequency distribution or constitute an official question bank.
