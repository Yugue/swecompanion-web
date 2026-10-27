# TF-IDF and feature hashing

## 1. Distinguish common words from distinctive evidence

**Term frequency–inverse document frequency (TF-IDF)** weights within-document evidence by how widespread a term is in a reference corpus.

A word occurring in nearly every document often distinguishes documents less than a rarer term. This is a weighting assumption, not a rule that frequent words are useless.

## 2. Calculate one variant

For term \(t\) in document \(d\):

\[
w_{t,d}=\operatorname{tf}(t,d)\left(1+\log\frac{N}{\operatorname{df}(t)}\right)
\]

Here tf is term count, \(N\) the training-document count, and df the number of those documents containing the term. Logs are natural; df must be positive for this form.

With count 2, four documents, and df 2, the weight is \(2(1+\log2)\approx3.386\).

## 3. State the convention

Other variants use binary or logarithmic term frequency, smoothed IDF, or vector-length normalization. Library defaults need not equal the displayed unsmoothed formula.

**L2 normalization** rescales a nonzero document vector to length one. Its dot product with another normalized vector equals cosine similarity; absolute document magnitude is then removed.

## 4. Fit and reuse corpus statistics

Learn the vocabulary and IDF from training or the explicitly declared indexing corpus. Apply stored values to held-out requests.

A word unseen in a fitted vocabulary needs a defined policy. Do not silently learn a new coordinate from each test example. When retrieval intentionally indexes a new corpus, state that different evaluation procedure.

## 5. Bound width with hashing

**Feature hashing** maps a feature string to a fixed coordinate using a deterministic hash. No complete string vocabulary must be stored.

Two distinct features can land in the same coordinate: a **collision**. Their evidence then combines; signed hashing can reduce systematic collision bias but can also cancel contributions.

Hashing itself is stateless. A later corpus-fitted weighting step still has learned statistics.

## 6. Choose by constraints and errors

| Approach | Strength | Limitation |
|---|---|---|
| Explicit vocabulary | Inspect named weights | Vocabulary storage and unseen features |
| Hashing | Fixed width, simple streaming | Collisions and harder attribution |

Both remain lexical representations. Weighting does not create semantic equivalence between unrelated strings or recover discarded long-range order.

## 7. Interview reasoning

**Question:** Why can increasing hashing width improve quality but increase serving memory?

**Answer:** It reduces collisions while increasing the possible feature coordinates and associated model parameters. Measure the resulting error and resource tradeoff.
