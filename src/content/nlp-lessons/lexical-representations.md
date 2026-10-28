# Bag-of-words and n-gram features

## 1. Count explicit evidence

A **bag-of-words** vector assigns a coordinate to each vocabulary word and records its count or presence.

**Sparse** means most coordinates are zero. A message uses few words relative to the full vocabulary.

## 2. Construct a vector

For vocabulary [good, not, service]:

```text
“good service”     → [1,0,1]
“not good service” → [1,1,1]
```

The representation records “not,” but not which phrase it modifies.

## 3. Restore local order

“Dog bites man” and “man bites dog” have identical unigram counts.

An **n-gram** is a contiguous sequence of n units. Word bigrams add coordinates such as “not good”; trigrams represent three-word windows.

A phrase coordinate lets a classifier weight that combination directly.

## 4. Reuse character patterns

**Character n-grams** count character sequences. They share fragments across “refund,” “refunded,” and some misspellings.

Specify whether fragments cross spaces. Within-word extraction and unrestricted extraction create different features.

## 5. Fit and store the feature space

Learn the vocabulary from training text. **Document frequency** counts documents containing a feature; minimum/maximum frequency rules can filter features.

For vocabulary width V, sparse storage keeps nonzero values and indices instead of V explicit entries. Model coefficients may still require storage across the vocabulary.

## 6. Choose lexical features deliberately

| Signal | Benefit | Limitation |
|---|---|---|
| Binary presence | Ignores repetition | Loses occurrence counts |
| Counts | Preserves repeated evidence | Boilerplate can dominate |
| N-grams | Local phrase evidence | Sparse; limited context |

Lexical features suit exact identifiers and distinctive phrases. Paraphrases with little overlap remain difficult.

## 7. Interview reasoning

**Question:** Why can bigrams help a classifier handle “not good”?

**Answer:** They add a coordinate for that joint phrase. Unigram coefficients only add separate contributions from “not” and “good.”
