# Data curation, deduplication, and contamination

## 1. Define the mixture

A **data mixture** sets how much training exposure comes from each source or category, such as code, books, dialogue, or different languages.

Raw document count is insufficient: token lengths, filtering, and sampling determine actual exposure.

## 2. Remove unwanted repetition

**Deduplication** removes repeated or near-repeated content. Exact matching catches identical documents; approximate matching can catch lightly edited copies.

Ten copies of one answer effectively increase its weight. Deduplicating only within training misses overlap between training and evaluation.

## 3. Separate by source and time

A **split** assigns examples to training, validation, or final test sets. Training updates parameters; validation guides development; the final test estimates performance after decisions are fixed.

Group near-duplicates and related documents before splitting. For future-facing tasks, use time boundaries where appropriate. A sentence-level random split of one book can leak its style and facts.

## 4. Audit benchmark contamination

**Contamination** occurs when evaluation examples, answers, or close derivatives enter training or development in a way that compromises measurement.

Search for exact text and semantic variants; inspect source lineage and dates. **Provenance** records where data came from and how it was transformed. High benchmark accuracy alone cannot establish unseen-task competence.

## 5. Balance quality and coverage

| Intervention | Potential benefit | Failure to check |
|---|---|---|
| Quality filtering | Remove broken or irrelevant text | Discard dialects or minority languages |
| More domain text | Improve specialized coverage | Narrow broad capability |
| More synthetic text | Expand formats cheaply | Repeat teacher errors |

**Synthetic data** is generated rather than directly collected from people. Validate it rather than equating fluent output with a correct target.

## 6. Trace a regression

Compare held-out loss by source, language, and task under a fixed tokenizer. Audit removed and oversampled examples, not just aggregate quality scores.

Keep a versioned manifest of sources, filters, sampling weights, and exclusions. It should be possible to explain which data change preceded a behavior change.
