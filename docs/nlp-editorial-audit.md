# NLP editorial audit — October 25, 2026

Historical audit: superseded by the October 27 replacement curriculum. See [current curriculum and validation](nlp-guide-validation.md) for the 10-chapter, 55-lesson guide. Counts and organization below describe the earlier version.

## Outcome

Revised all 29 NLP chapters using the current CV presentation as the style reference: a concrete intuition, one mechanism at a time, essential math with variable meanings, useful visuals/examples, applications and failure modes, and a short closing reasoning question/answer.

Source text fell from **12,647 to 9,005 words (28.8% less)**. Chapters now contain **278–345 words**, averaging **311**. Counts include headings, tables, formula source, and code, using whitespace tokenization without empty tokens; they exclude the separately rendered overview and figure captions. The preserved overviews contain 48–67 words including the probe.

The 29 chapter IDs, seven Part IDs, progress behavior, 37 NLP routes, and all 58 premium question/answer pairs were retained. The NLP curriculum and quiz inventory were compared byte-for-byte with the pre-audit snapshot. No other topic is a prerequisite.

## Findings and repairs

- Long sections mixed definitions, operations, cautions, and several alternatives. Each now focuses on one idea, using short paragraphs and compact comparisons.
- “Projection,” “task head,” “span,” “inference,” “sentiment,” and related terms needed clearer first-use explanations. Their definitions now live at explicit locations below.
- Backpropagation and training steps appeared in both learning chapters. Score/loss/update mathematics stays in 2.2; layer computation, chain-rule flow, and the PyTorch step live in 2.3.
- Source/target masking, target alignment, and teacher forcing repeated one another. Attention masking is taught in 3.1, architecture access in 3.3, and the worked input/target shift and loss mask in 5.1.
- Metrics were partly explained before their main chapter. Earlier task chapters now state what must be counted; 6.2 owns the formulas, aggregation, retrieval metrics, and generation comparisons.
- Generic caveats and repeated setup were trimmed from applications. System design and final revision consolidate by referring to earlier mechanisms rather than teaching them again.
- The local word co-occurrence window and model context window needed distinct names. Chapters 2.4 and 3.2 now make that distinction explicit.
- CRF wording could imply that learned transitions automatically guarantee legal BIO tags. Chapter 4.2 distinguishes learned path scores from explicit constraints.

## Teaching locations

| Main location | Concepts taught there |
|---|---|
| 1.1 Language tasks | NLP/NLU, task outputs, labels, abstention, accuracy |
| 1.2 Text interface | Unicode/storage, normalization, spans/offsets, inference, minimal pairs |
| 1.3 Tokenization | Tokens/vocabulary, subword methods, padding/truncation, alignment |
| 1.4 Lexical representation | Vectors/features, counts, TF–IDF, dot product/cosine, BM25 |
| 2.1 Probability | Conditional probability, expectation, sequence chain rule, n-grams, smoothing |
| 2.2 Learning | Logits, softmax, cross-entropy, gradients, updates, split roles, regularization |
| 2.3 Neural features | Lookup tables, task heads, dense layers, ReLU, sigmoid, backpropagation |
| 2.4 Static embeddings | Distributional learning, local windows, negative sampling, pooling |
| 2.5 Sequences | Contextual vectors, recurrence, gates, gradient failures, future leakage |
| 3.1 Attention | Projections, query/key/value, weights/masks, self/cross/multi-head attention |
| 3.2 Transformer blocks | Residuals, normalization, shared FFN, positions, context length |
| 3.3 Architectures | Encoder/decoder legal information flow |
| 3.4 Adaptation | Pretraining objectives, fine-tuning/freezing, low-rank updates, prompting |
| 4.1–4.4 Understanding | Task objectives, BIO/CRF/Viterbi, syntax/roles/coreference/NLI, QA/grounding |
| 5.1–5.4 Generation | Teacher forcing/perplexity, search/sampling, translation/alignment, summaries |
| 6.1–6.4 Evidence/evaluation | Retrieval objectives, task metrics, leakage/annotation, multilingual tests |
| 7.1–7.2 Decisions/serving | Error analysis, calibration, thresholds, resource/release/drift mechanisms |
| 7.3–7.4 Synthesis | Apply and revise earlier concepts; no new prerequisite |

A short reminder or task-specific use is intentional. Foundational explanations are not copied between application chapters; final revision intentionally consolidates earlier ideas.

## Mathematics and visuals

Retained numerical examples for TF–IDF, probability products, smoothing, softmax/gradient updates, dense layers, negative sampling, attention, perplexity, search/sampling, metrics, thresholds, padding, and latency allocation. Equations define symbols and describe how changing relevant values changes behavior. Formula rendering is checked with strict KaTeX parsing.

The five existing figures remain, with shorter captions. Added one geometric figure in 1.4: A=[1,1] and B=[2,2] share direction but differ in length relative to q=[1,0]. Dot products are 1 and 2 while both cosines are 1/√2. Its SVG, caption, accessible description, and numeric checks share the existing repo-native figure framework. There is no per-chapter diagram quota.

The revised lessons contain 14 display formulas, 26 concise tables, and six figures. Code is limited to the four-line training step and three-line masked-loss operation. No image-processing code was added to NLP.

## Verification

- `npm run check:nlp -- --built`: section numbering, overviews, closing prompts, explicit definition locations, sentence/paragraph duplication, source length, formulas/tables, figures, numerical examples, routes, links, metadata, sitemap, and premium text exclusion.
- `npm run lint` and `npm run build`.
- Existing CV, RRP, and Applied ML validation scripts.
- `git diff --check`.
- Representative browser layouts: shortened lexical/attention lessons, vector geometry, definitions, formula/table scrolling, and final revision on desktop and phone-sized viewports.

Automated regression limits flag chapters above 400 source words, paragraphs above 55 words, closing answers above 55 words, repeated long sentences across chapters, and repeated foundational definition markers. These checks supplement manual conceptual and first-use review; they cannot prove that every paraphrased overlap or possible learning difficulty is absent.

No deployment, Firebase quiz upload, or other production-data change was performed. Existing quiz access and account-sync limitations remain as documented in `nlp-guide-validation.md`.

## Per-chapter source comparison

| Chapter file | Before | After |
|---|---:|---:|
| attention | 465 | 301 |
| calibration-and-error-analysis | 433 | 317 |
| decoding | 414 | 280 |
| encoder-decoder-masks | 408 | 283 |
| entities-and-spans | 412 | 332 |
| labels-and-leakage | 409 | 299 |
| language-tasks | 470 | 314 |
| learning-text-models | 448 | 294 |
| lexical-representations | 462 | 315 |
| multilingual-and-linguistic-failures | 424 | 325 |
| neural-text-features | 552 | 345 |
| nlp-revision | 480 | 315 |
| nlp-system-design | 487 | 308 |
| pretraining-and-adaptation | 464 | 321 |
| probability-and-language | 400 | 293 |
| question-answering | 398 | 312 |
| semantic-retrieval | 427 | 304 |
| sequence-models | 417 | 282 |
| sequence-objectives | 399 | 293 |
| serving-and-drift | 460 | 310 |
| static-embeddings | 423 | 319 |
| summarization | 418 | 332 |
| syntax-relations-and-meaning | 447 | 316 |
| task-metrics | 414 | 329 |
| text-and-preprocessing | 446 | 335 |
| text-classification | 421 | 322 |
| tokens-and-subwords | 429 | 317 |
| transformer-blocks | 437 | 314 |
| translation | 383 | 278 |
