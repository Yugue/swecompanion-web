## Learning to rank

## 1. Learn an ordering

**Learning to rank** fits scores or selection rules for ordering candidates. Objectives differ in which training unit they compare.

## 2. Compare three families

| Family | Unit | Mechanism |
|---|---|---|
| Pointwise | Candidate | Predict its outcome or relevance |
| Pairwise | Two candidates | Encourage the preferred score to be higher |
| Listwise | Request list | Fit competing scores jointly |

These families are not a guaranteed quality ladder.

## 3. See one request three ways

```rrp-visual
ranking-objectives
```

BPR, already taught, is one pairwise objective. Here A/C are relevant and B is not, while the scores place B above C.

## 4. Define a concrete listwise loss

A **surrogate loss** is an optimizable substitute for the desired metric. One listwise surrogate uses normalized relevance targets:

\[
\ell=-\sum_{i=1}^{m}q_i\log a_i,\qquad a_i=softmax(s)_i
\]

\(m\): request's candidate count; \(s\): scores; \(a_i\): predicted share; \(q_i\ge0\): target share summing to 1; \(\ell\): loss. Softmax was introduced in two-tower retrieval.

For scores \(s=[0.8,0.7,0.3]\) and binary A/C relevance, choose \(q=[0.5,0,0.5]\). This is one specified surrogate, not every listwise objective.

## 5. See where the gradient pushes

| Item | Share: predicted → target | Score push |
|---|---|---|
| A | 0.398 → 0.5 | Up |
| B | 0.360 → 0 | Down |
| C | 0.242 → 0.5 | Up more |

The score gradient is \(a_i-q_i\); loss is about **1.171**. C needs more probability mass than A. This loss is not itself NDCG.

## 6. Pair counts can miss important positions

With two relevant items among four, consider:

| Relevant ranks | Correct positive–negative pairs | NDCG@4 |
|---|---|---|
| 1 and 4 | 2 of 4 | 0.877 |
| 2 and 3 | 2 of 4 | 0.693 |

Use binary linear gains and the same reference set. Equal pair accuracy can hide different placement quality. Some pairwise methods weight swaps by NDCG impact.

## 7. Preserve the intended evidence

Keep candidates competing for the same request together. Across-query comparisons create a different task.

Clicked versus unexamined is not certain relevance order. Objectives do not repair biased labels automatically.

## 8. Check the score's downstream use

Pure ordering scores have no automatic probability meaning. Expected-value decisions need validated probabilities or calibration.

Evaluate the whole procedure with the same candidate pool and serving budget.

## 9. Interview reasoning

**Question:** Must listwise training beat a pointwise click model?

**Answer:** No. Label quality, candidate protocol, model capacity, and the downstream score use matter. Compare complete procedures under the same conditions.
