# Learning static word embeddings

## 1. Share evidence through context

**Distributional learning** uses patterns of surrounding words to learn representations. **Static word embeddings** assign one vector per vocabulary word, shared across occurrences.

Similar usage can create nearby vectors. It does not establish equivalent meaning or a real-world relationship between the words.

## 2. Construct predictive pairs

**Skip-gram** predicts surrounding context words from a center word. **CBOW**, continuous bag-of-words, predicts a center word from a combined context representation.

```nlp-visual
skipgram
```

The context window, corpus, and sampling rules determine the evidence. A word’s vector reflects these choices, rather than a dictionary definition.

## 3. Score a pair

Let \(v_c\) be center-word \(c\)'s vector and \(u_o\) context-word \(o\)'s vector. Their score is:

\[
a=u_o^\top v_c
\]

An input table and a context/output table can be learned separately. Choosing one table or a combination for later use is a representation choice.

## 4. Contrast observed and sampled pairs

**Negative sampling** trains observed pairs as positives and sampled alternatives as negatives. For one positive and \(K\) negatives:

\[
\ell=-\log\sigma(u_o^\top v_c)-\sum_{j=1}^{K}\log\sigma(-u_{n_j}^\top v_c)
\]

\(n_j\) is sampled negative \(j\); \(\sigma\) is sigmoid. Increasing a positive score lowers its term; decreasing a negative score lowers its term.

These binary pair probabilities are not a normalized next-word distribution over the vocabulary.

## 5. Follow the fitting direction

At score zero, sigmoid is 0.5. A positive pair’s score derivative is −0.5; a negative pair’s is +0.5.

The parameter gradients also multiply by the participating vectors. Updating one shared word can affect several pair scores, so scores are not independent parameters.

Frequent or easy negatives and rare hard comparisons supply different learning signals.

## 6. Respect the limits

“Hot” and “cold” can share contexts and become close despite opposing meanings. A single “bank” vector mixes financial and river usage.

Averaging static word vectors offers a simple sentence baseline but discards order. “Dog bites man” and “man bites dog” have the same average if their token vectors are unchanged.

## 7. Interview reasoning

**Question:** Does a larger context window necessarily produce better embeddings?

**Answer:** No. It changes the relationships emphasized and may mix more topic-level evidence. Select and evaluate representations for the intended task rather than assuming more context is universally better.
