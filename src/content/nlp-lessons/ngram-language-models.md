# N-gram language models and smoothing

## 1. Predict from a short history

An **n-gram language model** uses at most n−1 earlier tokens: one for a bigram, two for a trigram.

It restricts the context in the probability chain rule.

## 2. Estimate conditional counts

\[
P(w\mid h)=\frac{C(h,w)}{C(h)}
\]

\(h\): history; \(w\): next token; C(h,w): continuation count; C(h): total continuations after h. Require C(h)>0.

“Cats” followed twice by “sleep” and once by “eat” gives probabilities 2/3 and 1/3. This maximum-likelihood estimate fits observed proportions.

## 3. Give unseen continuations support

One zero factor makes sequence probability zero.

**Smoothing** redistributes probability to handle missing or unreliable counts. For vocabulary [sleep, eat, EOS]:

```text
counts:        [2,1,0]
add-one:       [3,2,1]
probabilities: [3/6,2/6,1/6]
```

Seen events surrender some mass to unseen events.

## 4. Control smoothing strength

Apply the pseudo-count rule to each history h:

```text
numerator:   continuation count + α
denominator: all continuations after h + α×V
```

V is vocabulary size; α>0 smoothing strength. Larger α pulls estimates toward uniform. For an unseen history, all counts are zero, giving probability 1/V per supported token.

A large vocabulary makes add-one smoothing aggressive. It still cannot create entries outside the vocabulary.

## 5. Share shorter-history evidence

**Backoff** uses shorter history when detailed evidence is insufficient. **Interpolation** mixes history lengths with nonnegative weights summing to one.

Discount and normalize correctly; adding extra probability to a complete distribution exceeds total mass one.

## 6. Choose order on held-out text

Higher order distinguishes more phrases but creates sparse histories. Better training fit can coexist with worse future predictions.

Use held-out loss to choose order and smoothing.

## 7. Interview reasoning

**Question:** Why smooth when the observed counts are correct?

**Answer:** They describe a finite sample. Smoothing reserves probability for plausible continuations absent from that sample.
