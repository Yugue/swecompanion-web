# Training-data quality

## 1. Choose what the model learns from

A **training corpus** is the collection used to fit a model. Its quality, diversity, and frequency patterns shape the learning signal. Adding more text can also add duplication, errors, and unwanted behavior.

A **data mixture** sets the relative contribution of sources such as books, code, or conversation.

## 2. Filter for the intended objective

Remove corrupt text, parsing failures, and irrelevant boilerplate. Quality filters can use rules or learned scores, but their errors can exclude useful dialects, languages, and specialist material.

Inspect accepted and rejected samples by source. A high aggregate filter score is not a complete quality guarantee.

## 3. Deduplicate at meaningful levels

**Deduplication** detects repeated or near-repeated content. Exact matching catches identical copies; approximate matching catches lightly edited versions.

Ten mirrors of one document do not provide ten independent explanations. Repetition can overweight that source and increase memorization risk.

## 4. Protect evaluation boundaries

**Benchmark contamination** is training exposure to evaluation questions, solutions, or close variants. It can inflate a score without improving performance on new problems.

Hold out related document families together. Search for answer-containing variants, not only identical question strings.

## 5. Balance coverage and sampling

Suppose source A has 90% of raw tokens and source B 10%. Sampling equally changes the training distribution to 50/50 and repeats B more often.

Oversampling can improve an underserved domain, but excessive reuse can overfit it. Measure outcomes by language, domain, and difficulty.

## 6. Keep provenance and ablate changes

**Provenance** records where data came from and how it was transformed. Retain source versions, filter settings, and mixture weights so a training regression can be investigated.

Compare candidate mixtures under similar compute. A better average can conceal a severe decline on an important minority slice.
