# Learning static word embeddings

## 1. Learn from surrounding words

**Distributional learning** uses context patterns to learn representations. **Static word embeddings** assign one vector per word across occurrences.

Words sharing contexts can become close without being synonyms.

## 2. Construct prediction pairs

**Skip-gram** predicts context words from a center word. **CBOW**, continuous bag-of-words, predicts the center from combined context.

```nlp-visual
skipgram
```

The **word-context window** selects neighbors used for training pairs. Changing its radius changes the relationships emphasized.

## 3. Score a pair

\[
a=u_o^\top v_c
\]

v_c is center c’s vector; u_o context o’s vector; a their compatibility score. Input and context tables can have separate learned parameters.

## 4. Contrast observed and sampled pairs

**Negative sampling** trains observed pairs as positives and sampled alternatives as negatives:

\[
\ell=-\log\sigma(u_o^\top v_c)-\sum_{j=1}^{K}\log\sigma(-u_{n_j}^\top v_c)
\]

\(\ell\) is loss; K negative count; \(n_j\) negative j; sigma sigmoid. Raise positive scores and lower negative scores to reduce loss.

These are binary pair decisions, not a normalized next-word distribution.

## 5. Follow gradient signs

At score zero, sigmoid=0.5:

| Pair | Score derivative | Favored direction |
|---|---|---|
| Positive | −0.5 | Increase score |
| Negative | +0.5 | Decrease score |

Parameter gradients also depend on the participating vectors. Sampled negatives are not necessarily impossible language.

## 6. Recognize representation limits

“Hot” and “cold” share contexts despite opposite meanings. One “bank” vector mixes its senses.

Averaging static vectors loses order: “dog bites man” and “man bites dog” have the same average.

## 7. Interview reasoning

**Question:** Does a larger context window always improve vectors?

**Answer:** It changes the learning signal, often toward broader topical relationships. Evaluate the relationships your task needs.
