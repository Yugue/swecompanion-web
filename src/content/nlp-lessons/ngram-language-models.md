# N-gram language models and smoothing

## 1. Predict with a short history

An **n-gram language model** predicts the next token from at most the previous \(n-1\) tokens.

A bigram uses one previous token. A trigram uses two. This limits the context in the conditional probabilities from the sequence chain rule.

## 2. Estimate from counts

For history \(h\) and next token \(w\):

\[
P(w\mid h)=\frac{C(h,w)}{C(h)}
\]

\(C(h,w)\) counts that continuation; \(C(h)\) counts continuations following the history. This **maximum-likelihood estimate** fits the empirical proportions when the history has observations.

For “cats” followed twice by “sleep” and once by “eat,” the estimates are 2/3 and 1/3.

## 3. Avoid zeroing unseen continuations

The model gives zero to any unobserved continuation, even a plausible one. A single zero makes the corresponding sequence probability zero.

**Smoothing** redistributes probability to handle missing or unreliable counts. With add-one smoothing and vocabulary [sleep, eat, EOS]:

```text
counts             [2,1,0]
counts + 1         [3,2,1]
probabilities      [3/6,2/6,1/6]
```

Seen continuations surrender some mass so unseen ones receive nonzero support.

## 4. Define the smoothed distribution

\[
P_\alpha(w\mid h)=\frac{C(h,w)+\alpha}{C(h)+\alpha V}
\]

\(\alpha>0\) is pseudo-count strength and \(V\) the supported vocabulary size. Larger strength pulls estimates toward a uniform distribution in this simple scheme.

A large vocabulary can make add-one smoothing too aggressive. Smoothing does not create entries outside the declared vocabulary.

## 5. Share evidence with shorter histories

**Backoff** uses a shorter history when detailed evidence is insufficient. **Interpolation** mixes several history lengths with nonnegative weights summing to one.

Both address sparse long histories. Discounting and normalization must leave a valid distribution; merely appending a shorter-history probability to existing estimates can exceed total mass one.

## 6. Know the context tradeoff

Higher order distinguishes more phrases but produces more sparsely observed histories. It can fit training text better while estimating future continuations worse.

Choose order and smoothing using held-out text. A simple count model is useful for understanding probability estimates and as a reference, even when a neural model is ultimately required.

## 7. Interview reasoning

**Question:** Why does a model need smoothing when its training counts are correct?

**Answer:** Correct counts describe a finite sample, not every possible future continuation. Smoothing supplies support and reduces overconfidence in those limited observations.
