## Factorization for implicit feedback

## 1. Decide what blank cells mean

**Implicit-feedback factorization** fits vectors from behavior instead of ratings. Its objective specifies how observed actions and uncertain missing entries affect learning.

A sampled unknown item is a contrast, not a verified dislike.

## 2. Weighted reconstruction

One approach minimizes:

\[
L=\sum_{u,i}c_{ui}(p_{ui}-v_u^\top v_i)^2+\lambda R(v)
\]

\(L\): total loss; \(u,i\): user/item; \(p_{ui}\): target, often 1 for interaction and 0 otherwise; \(c_{ui}\): confidence weight; \(v\): vectors; \(R\): regularization penalty; \(\lambda\): its strength.

Larger weights make those cells' errors matter more.

## 3. Confidence is a modeling choice

Target 0, score 0.8, weight 1 contributes **0.64**. Target 1, score 0.8, weight 10 contributes **0.4**.

“Confidence” is not a measured probability that a target is true. Low-weight missing zeros still encode an assumption.

## 4. Compare observed and sampled items

**Bayesian Personalized Ranking (BPR)** encourages an observed item to outscore a sampled unobserved alternative:

\[
\ell=-\log\sigma(\Delta),\quad
\Delta=s_+-s_-,\quad
\sigma(z)=\frac{1}{1+e^{-z}}
\]

\(s_+,s_-\): preferred/alternative scores; \(\Delta\): gap; \(\ell\): pair loss. **Sigmoid** \(\sigma\) maps a real input \(z\) to (0,1).

Gap +1 costs about **0.313**; −1 costs **1.313**.

## 5. Follow the two score gradients

\[
w=\sigma(-\Delta),\qquad
\frac{\partial\ell}{\partial s_+}=-w,\quad
\frac{\partial\ell}{\partial s_-}=w
\]

\(w\) is the positive gradient magnitude. Gradient descent pushes the preferred score up and the alternative down.

Even a correctly ordered finite gap has nonzero pressure; larger positive gaps receive less.

## 6. Work a score-level update

Treat the two scores as independently adjustable in this toy step. Starting at 0/0 with learning rate 0.1 gives:

| Quantity | Before | After |
|---|---|---|
| Preferred score | 0 | 0.05 |
| Alternative score | 0 | −0.05 |
| Gap | 0 | 0.1 |
| Pair loss | 0.693 | 0.644 |

A real model updates shared parameters through these gradients; coupled scores need not change by these exact amounts.

## 7. Implement the existing loss

For paired score arrays (PyTorch tensors):

```python
import torch.nn.functional as F
gap = positive_scores - negative_scores
loss = F.softplus(-gap).mean()
```

Softplus computes the same smooth gap loss. Regularization constrains parameter growth; individual scores are not click probabilities.

## 8. Choose the comparison distribution

Uniform, popularity-based, and hard-negative sampling teach different comparisons. The negative-sampling chapter compares those choices and corrections.

Evaluate the full procedure against realistic eligible competition.

## 9. Interview reasoning

**Question:** Does BPR stop updating a correctly ordered pair?

**Answer:** No. Its smooth loss still rewards a larger positive gap; correct order alone does not make the loss or gradient zero.
