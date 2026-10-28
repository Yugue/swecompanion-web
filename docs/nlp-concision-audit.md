# NLP concision and first-use audit — October 27, 2026

## Outcome

Revised every lesson in the 10-chapter NLP curriculum, using CV as the presentation reference. The 55 lesson IDs, numbering, interview-ready overviews, previous/next links, progress keys, quiz inventory, and primary reference lists are retained. Chapters 11 and 12 remain excluded.

Source text decreased from **21,564 to 15,995 words (25.8%)**. Lessons now contain **255–331 words**, across 6–8 numbered sections. Counts include source headings, tables, equations, and code; they exclude separately rendered overviews and figure captions. There is no fixed word ceiling.

## Editorial changes

- Replaced long setup and repeated general cautions with a definition, operation, example, and specific failure.
- Gave concepts a primary teaching location. Later lessons apply them or give a brief contextual reminder instead of repeating their full explanation.
- Removed early uses of TF-IDF, dropout, tokenizer, and token terminology where the reader had not learned them. Embeddings receive a brief definition at first use in 3.2; 6.1 teaches lookup, dimensions, and gradients.
- Defined residual connections, layer normalization, and the positionwise network before using their names in the Transformer block. Unrolled recurrence/backpropagation through time is introduced with RNNs rather than assumed in the earlier gradient lesson.
- Kept probability and derivative chain rules distinct. Separated word-context training windows from model context limits.
- Corrected the claim that flattening token positions necessarily changes the task. The token-loss example preserves the class axis, label pairing, ignored targets, and reduction convention.
- Corrected “learned nonlinearities” for the fixed ReLU operation. The learned quantities are the surrounding weights and offsets.
- Replaced repeated smoothing derivation with a history-count application and an unseen-history example.
- Retained a short mechanism/diagnosis/choice question and answer at the end of every lesson. No new synthesis chapter or extra mock-interview layer was added.

## Examples and visuals

The guide retains 26 selected figures and now uses 43 concise tables plus 55 display equations. Three figures were improved rather than adding a diagram quota:

| Lesson | Improvement |
|---|---|
| 7.1 Attention | Column inputs and toy projections produce q/k/v before scores, scaling, softmax, and value mixing; key/value widths may differ |
| 9.2 NER | Toy Ada → A + ##da split shows first-piece versus all-piece targets and source reconstruction |
| 9.3 CRF/Viterbi | Two-column lattice shows best prefix scores, blocked transitions, the selected end state, and predecessor backtracking |

Additional short examples cover decision thresholds/precision–recall, confidence versus observed correctness, NDCG with graded labels, and global-versus-minority-language performance. Mathematical variables and the effect of relevant settings are explained locally. Code remains limited to 1–5-line operation sketches.

## Verification

The NLP audit checks curriculum/file registration, all overviews, numbered sections, closing prompts, balanced fences/equations, strict KaTeX, table shape, code length, duplicated long passages, selected concept order and unique primary definition markers, figure registration, and numerical examples. Numerical additions cover query/key projections, NER piece/word/offset alignment, Viterbi prefix maxima/backtracking, threshold decisions, NDCG, and multilingual aggregation.

The built-output check covers all 66 NLP routes, links/anchors, canonical and structured metadata, figure rendering, removed lesson routes, sitemap entries, quiz counts, and exclusion of complete private quiz text from static artifacts. Lint, the production build, and whitespace checks are run after editing.

Browser QA used the local preview: the updated Viterbi figure was visually checked on desktop and the NER alignment figure at 375 pixels, with no page overflow on that observed page. The broader sweep was interrupted by loss of the browser inspection connection, so a complete all-page layout pass and final attention-layout recheck are not claimed. Static export checks cover every NLP page. Authenticated Firestore synchronization and premium-unlocked questions were not exercised.

The complete private quiz file and all non-NLP files were compared with the pre-audit snapshot. RRP and unrelated coding-guide work were preserved. No push, deployment, dependency installation, or Firestore write was performed during this audit.

## Per-lesson source comparison

| Lesson file | Before | After |
|---|---:|---:|
| attention-types | 384 | 287 |
| attention | 380 | 284 |
| backpropagation | 439 | 288 |
| baselines-and-metrics | 359 | 298 |
| context-and-compute | 398 | 290 |
| contextual-representations | 405 | 309 |
| decoding | 411 | 280 |
| embedding-lookup | 392 | 294 |
| encoder-decoder-masks | 381 | 267 |
| entities-and-spans | 405 | 265 |
| examples-and-labels | 400 | 292 |
| fine-tuning | 417 | 299 |
| gated-sequence-models | 381 | 282 |
| generalization | 382 | 299 |
| information-theory | 358 | 287 |
| instruction-and-preference-tuning | 413 | 278 |
| labels-and-leakage | 390 | 286 |
| language-and-context | 400 | 308 |
| language-model-evaluation | 381 | 275 |
| language-tasks | 404 | 296 |
| learning-paradigms | 397 | 306 |
| lexical-representations | 386 | 298 |
| linear-text-models | 369 | 275 |
| naive-bayes | 375 | 293 |
| neural-output-heads | 391 | 308 |
| neural-text-features | 340 | 270 |
| ngram-language-models | 371 | 297 |
| optimization | 404 | 319 |
| positional-information | 376 | 270 |
| pretraining-objectives | 420 | 295 |
| probability-and-language | 389 | 292 |
| question-answering | 400 | 276 |
| reranking | 393 | 268 |
| retrieval-augmented-qa | 435 | 301 |
| semantic-retrieval | 401 | 294 |
| sentence-embeddings | 391 | 280 |
| sentence-pair-understanding | 411 | 282 |
| sequence-models | 379 | 294 |
| sequence-objectives | 384 | 285 |
| sequence-probability | 376 | 279 |
| static-embeddings | 372 | 280 |
| structured-prediction | 376 | 287 |
| summarization | 399 | 302 |
| text-and-preprocessing | 412 | 308 |
| text-classification | 409 | 331 |
| text-convolution | 379 | 270 |
| tfidf-and-hashing | 391 | 293 |
| tokens-and-subwords | 379 | 286 |
| tokens-and-vocabularies | 423 | 317 |
| training-diagnostics | 407 | 316 |
| transformer-architectures | 396 | 304 |
| transformer-blocks | 354 | 255 |
| translation | 447 | 324 |
| vectors-and-tensors | 355 | 269 |
| wordpiece-and-unigram | 397 | 307 |
