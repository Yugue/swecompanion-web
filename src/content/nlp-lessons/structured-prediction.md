# Structured prediction with CRFs and Viterbi decoding

## 1. Score a label sequence together

**Structured prediction** chooses related outputs jointly. A **linear-chain conditional random field (CRF)** scores a complete label sequence using token evidence and neighboring-label transitions, conditioned on the input.

It can prefer coherent entity tags over a combination of individually attractive but inconsistent decisions.

## 2. Combine local and transition evidence

For input \(x\) and label sequence \(y\) of length \(T\):

\[
S(y,x)=\sum_{t=1}^{T}e_t(y_t)+\sum_{t=2}^{T}A_{y_{t-1},y_t}
\]

\(e_t(k)\) is the emission score for label \(k\) at position \(t\); \(A_{j,k}\) a transition score from \(j\) to \(k\). A neural encoder can supply emissions. Start/end scores can also be added.

These are scores, not separately normalized token probabilities.

## 3. Follow a coupled decision

```nlp-visual
crf-path
```

The toy sequence’s independent best labels are B-PER then O, totaling 5. B-PER then I-PER has emission total 4 but transition bonus 2, giving 6.

A locally weaker label can therefore belong to the stronger complete path. This does not guarantee the learned transitions reflect correct language rules.

## 4. Normalize for training

\[
P(y\mid x)=\frac{e^{S(y,x)}}{Z(x)},\qquad Z(x)=\sum_{y'\in\mathcal Y}e^{S(y',x)}
\]

\(\mathcal Y\) is the set of permitted label sequences; \(Z\) is the **partition function**, the normalizing sum. Train using the gold sequence’s negative log probability.

Rules such as disallowing an I-PER start can constrain permitted paths. Learned scores alone do not automatically impose those rules.

## 5. Decode with dynamic programming

**Viterbi decoding** retains the best prefix ending in each label:

\[
D_t(k)=e_t(k)+\max_j[D_{t-1}(j)+A_{j,k}]
\]

\(D_t(k)\) is the best score up to position \(t\) ending at \(k\). Save predecessor choices to reconstruct the path. With \(K\) labels, ordinary dense transitions cost roughly \(O(TK^2)\).

## 6. Distinguish the two computations

Best-path decoding uses max; training normalization sums across paths, typically through a stable log-sum-exp recurrence. Computing only the best path does not supply the training denominator.

A CRF adds output dependencies. It does not replace the need for useful input representations or correct entity boundaries in labels.

## 7. Interview reasoning

**Question:** Does a CRF require enumerating every possible tag sequence to decode?

**Answer:** No. The chain structure permits Viterbi to reuse the best prefix for each ending label. This avoids exhaustive enumeration while returning the best path under the declared scores and constraints.
