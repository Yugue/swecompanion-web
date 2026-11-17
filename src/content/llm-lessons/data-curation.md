# Data curation, deduplication, and contamination

## 1. Define the mixture

A **data mixture** controls exposure to sources such as code, books, and languages. Count sampled tokens, not only documents.

## 2. Remove unwanted repetition

**Deduplication** removes exact or near-copies. Ten copies of one answer increase its effective training weight. Check overlap across train/evaluation boundaries too.

## 3. Separate by source and time

A **split** separates training (parameter updates), validation (development decisions), and test (final measurement).

Group related documents and near-copies before splitting. Splitting sentences from one book can leak source-specific patterns.

## 4. Audit benchmark contamination

**Contamination** places evaluation examples, answers, or close variants into training/development, compromising measurement.

**Provenance** records source and transformations. Audit exact/semantic overlap, lineage, and dates before interpreting a benchmark jump.

## 5. Balance quality and coverage

| Intervention | Potential benefit | Failure to check |
|---|---|---|
| Quality filtering | Remove broken or irrelevant text | Discard dialects or minority languages |
| More domain text | Improve specialized coverage | Narrow broad capability |
| More synthetic text | Expand formats cheaply | Repeat teacher errors |

**Synthetic data** is generated rather than directly collected from people. Validate it rather than equating fluent output with a correct target.

## 6. Trace a regression

Compare held-out loss by source, language, and task under fixed scoring. Version sources, filters, and sampling weights so regressions can be traced.

> **Reason it through:** Benchmark performance jumps after adding crawled text. How would you separate useful coverage from evaluation contamination?
