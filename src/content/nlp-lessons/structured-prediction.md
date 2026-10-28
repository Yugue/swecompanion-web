# Structured prediction with CRFs and Viterbi decoding

## 1. Choose related labels together

**Structured prediction** selects interdependent outputs. A **linear-chain conditional random field (CRF)** scores full label sequences using token evidence and neighboring-label transitions.

A locally attractive label can lose to a stronger complete path.

## 2. Combine emissions and transitions

An **emission score** measures local label evidence. A **transition score** measures compatibility between neighboring labels.

\[
S(y,x)=\sum_{t=1}^{T}e_t(y_t)+\sum_{t=2}^{T}A_{y_{t-1},y_t}
\]

S is sequence score; x input; y labels; T length; \(e_t(k)\) emission for label k at t; \(A_{j,k}\) transition score. Start/end scores may be added.

An encoder can supply emissions. The scores are not separately normalized token probabilities.

## 3. Trace competing prefixes

```nlp-visual
crf-path
```

B-PER/O has emissions 2+3 and transition 0 → score 5. B-PER/I-PER has emissions 2+2 and transition 2 → score 6.

The transition changes the preferred sequence.

## 4. Normalize for learning

\[
P(y\mid x)=\frac{e^{S(y,x)}}{Z(x)},\qquad Z(x)=\sum_{y'\in\mathcal Y}e^{S(y',x)}
\]

Y is permitted sequences. The **partition function** Z sums their weights. Minimize the gold sequence’s negative log probability.

Explicit constraints can forbid an I-PER start or O→I-PER. Learned transitions alone do not guarantee legality.

## 5. Decode with Viterbi

**Viterbi decoding** keeps the best prefix ending in each label:

\[
D_t(k)=e_t(k)+\max_j[D_{t-1}(j)+A_{j,k}]
\]

D_t(k) is that prefix score. Save predecessor choices, select the best final label, then backtrack. K labels with dense transitions cost roughly O(TK²).

## 6. Separate max and sum

Viterbi finds one best path. Training normalization sums all permitted paths, using a stable log-sum-exp recurrence.

Best-path scores alone cannot supply Z.

## 7. Interview reasoning

**Question:** Must decoding enumerate every possible sequence?

**Answer:** No. The chain structure lets Viterbi reuse the best prefix per ending label and reconstruct the optimal permitted path.
