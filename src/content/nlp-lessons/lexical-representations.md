# Bag-of-words and n-gram features

## 1. Count explicit evidence

A **bag-of-words** representation assigns a coordinate to each vocabulary word and records its count or presence in a document.

**Sparse** means most coordinates are zero for any one example. A short message typically uses only a small fraction of the corpus vocabulary.

## 2. Construct a vector

With vocabulary [good, not, service]:

```text
“good service”      → [1,0,1]
“not good service”  → [1,1,1]
```

These features preserve word identity and frequency. A classifier can learn a contribution for “not,” but it does not directly observe which phrase that word modifies.

## 3. See the missing order

“The dog chased the child” and “The child chased the dog” have the same unigram counts.

An **n-gram** is a contiguous sequence of \(n\) units. Word bigrams preserve pairs such as “not good”; trigrams preserve three-word windows.

Adding n-grams exposes local interactions while retaining a sparse feature representation.

## 4. Use character patterns

**Character n-grams** count local character sequences. They can share evidence across “refund,” “refunded,” and some misspellings without requiring a known whole-word entry.

Specify whether extraction crosses spaces or stays within word boundaries. This choice changes which patterns exist.

Character features can capture morphology and identifiers, but their usefulness still depends on language, task, and training examples.

## 5. Fit the feature space

Build the vocabulary from designated training text. **Minimum document frequency** can remove very rare features; a maximum-frequency rule can remove widespread ones.

For vocabulary width \(V\), one document has \(V\) possible coordinates. Sparse storage retains nonzero values and indices rather than a full dense vector, although the model may still need parameters for many coordinates.

## 6. Use the baseline where it fits

Lexical features are useful for distinctive phrases, product codes, small labelled datasets, and inspectable errors. They can fail on paraphrases with little word overlap and on dependencies longer than the chosen windows.

A **binary feature** records presence; a count feature records repetitions. Repeated boilerplate can dominate raw counts, motivating the next lesson’s weighting.

## 7. Interview reasoning

**Question:** Why can a linear model with bigram features express something a unigram linear model cannot?

**Answer:** A bigram supplies an explicit coordinate for a combined local condition, such as “not good.” Linear weighting can then respond to that phrase rather than only its separate words.
