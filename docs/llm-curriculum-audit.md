# LLM curriculum structure audit

Completed October 29, 2026. This review supersedes the earlier editorial audit's conclusion that uniform six-lesson chapters were adequate. Both levels were reviewed: chapter lesson boundaries and the numbered internal sections in lessons such as 1.1 and the former 4.5.

## Structural changes

The topic now has 54 lessons across seven chapters. Thirteen focused lessons were added by separating distinct concepts and supplying their missing explanations. The standalone “Choosing prompting, retrieval, fine-tuning, or tools” recap was removed; its decision table and controlled comparisons now live in the final deployment-diagnosis lesson.

| Chapter | Lesson count | Reason |
|---|---|---|
| 1. Foundations | 6 → 8 | Separates numerical shapes, learned representations, predictive loss, and distribution mismatch before neural-network learning. |
| 2. Transformer architecture | 6 → 8 | Separates head structure from legal access and positionwise feature transformation from complete-block integration. |
| 3. Pretraining and training systems | 6 → 7 | Separates fitting state into memory from distributing state and computation across devices. |
| 4. Adaptation and post-training | 6 → 8 | Separates RL prerequisites, preference feedback, verifiable rewards, behavior transfer, and generated-data quality. |
| 5. Generation, context, and grounding | 6 → 9 | Separates deterministic search, random sampling, task conditioning, serialization constraints, inference budgets, and evidence search. |
| 6. Evaluation, reliability, and safety | 6 → 7 | Separates privacy exposure from uneven behavior, harmful completions, and over-refusal. |
| 7. Inference and serving | 6 → 7 | Separates estimating resource requirements from numerical approximation; final diagnosis absorbs the redundant intervention recap. |

Internal section counts follow the explanation rather than a template: 29 lessons have five sections, 21 have six, three have seven, and one has eight. These are observed counts, not required limits. The checker no longer asserts six lessons per chapter or a six-section minimum; page and quiz inventories derive from curriculum metadata.

The revised guide has 300 internal sections, 31 figures, 16 tables, 29 display formulas, and 17,070 source words (231–504 per lesson). Average lesson length fell from about 349 to 316 source words while the topic gained clearer prerequisite separation. No lesson word quota was added.

## Important splits and sequencing

- Vectors and tensor shapes precede token embeddings; entropy and KL follow hard-target cross-entropy in their own lesson.
- Attention heads/GQA, causal and padding masks, positional information, FFNs/SwiGLU, and complete blocks have separate learning goals.
- Training memory/precision precedes data parallelism, tensor and pipeline parallelism, and state sharding.
- RL state/action/reward/advantage is taught before RLHF/PPO. Verifiable reward training and GRPO are separate from inference-time candidate generation and selection.
- Distillation explains transfer objectives; synthetic data explains provenance, verification, deduplication, and mixture quality.
- Beam search is distinct from temperature/top-k/top-p sampling. Prompt conditioning is distinct from constrained serialization and semantic validation.
- Retrieval mechanisms precede RAG context construction and source-supported generation.
- Privacy and data removal are distinct from bias, harmful outcomes, and refusal quality.
- Inference memory estimates are distinct from quantization. The final diagnosis lesson consolidates earlier methods without introducing new prerequisites.

The original URLs were retained for narrowed lessons when practical. The removed, unpublished `choosing-adaptation` route is no longer listed or exported. Progress counters ignore retired lesson IDs without deleting saved records or changing another topic's progress.

## Presentation and diagrams

All lessons retain an interview-ready overview, three takeaways, and a reasoning probe. First-use definitions and formula variables are checked in reading order. There are no Builds on, Further reading, or closing Interview reasoning sections.

A native gated-FFN diagram shows equal-width feature branches, their elementwise product, and projection back to model width. Five existing mechanism diagrams are now used where they support newly separated lessons: multi-head mixing, the RL update loop, sequence search, candidate verification, and evidence chunk boundaries. No diagram is repeated within this topic.

## Chapter quizzes

Chapter counts are 8, 8, 8, 8, 10, 8, and 7 questions: 57 private question/answer pairs. All 42 original pairs remain, with the inference-time Pass@N question moved into the generation chapter. Fifteen new pairs cover the separated fundamentals. Other topics' private quiz documents are unchanged.

Quiz seeding was dry-run only. No credentials were loaded, no database documents were written, and no deployment, commit, or push was performed.

## Verification

- Production build passes and exports 506 total pages, including all 62 LLM routes.
- `npm run check:llm -- --built` passes inventory, numbering, first-use definition guards, duplicate-passage checks, numerical examples, table parsing, KaTeX, diagram registration, sitemap, canonical URLs, structured data, internal links, premium entry gates, and exported quiz privacy.
- New examples check masked softmax, an expanded FFN's parameter count, optimizer-state sharding, and concurrent KV storage.
- Targeted ESLint, TypeScript, and whitespace checks pass.
- All 54 lessons checked at 375×812: correct title, internal headings, no KaTeX errors, and no page overflow. The new gated-FFN diagram was visually inspected on desktop and mobile. Viewport overrides were reset after testing.

## Sources used for added mechanics

- [ZeRO](https://arxiv.org/abs/1910.02054): removing replicated training state.
- [Mixed Precision Training](https://arxiv.org/abs/1710.03740): loss scaling and numerical training state.
- [Training language models with human feedback](https://arxiv.org/abs/2203.02155): demonstration, reward-model, and policy stages.
- [DeepSeekMath](https://arxiv.org/html/2402.03300v3): group-relative advantage estimation and policy updates.
- [Dense Passage Retrieval](https://arxiv.org/abs/2004.04906): separate query/document encoders and learned passage retrieval.

The earlier editorial audit records sources for unchanged attention, RoPE, SwiGLU, DPO, quantization, and serving mechanisms.
