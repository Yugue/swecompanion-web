## Similarity and co-occurrence

## 1. Choose what “related” means

A **similarity measure** assigns a numeric comparison to two representations. Shared reach and unusually strong association answer different questions.

## 2. Start with counts

Among 1,000 users:

| Item | Users | Shared users with A |
|---|---|---|
| A | 100 | 100 |
| B | 400 | 20 |
| C | 20 | 10 |

Raw overlap favors B. Yet C shares half its audience with A, while B shares one twentieth.

## 3. Normalize in two different ways

For binary user-incidence vectors:

\[
cosine(A,B)=\frac{n_{AB}}{\sqrt{n_A n_B}},\qquad
Jaccard(A,B)=\frac{n_{AB}}{n_A+n_B-n_{AB}}
\]

\(n_A,n_B\): audience counts; \(n_{AB}\): shared audience.

**Cosine** compares direction; **Jaccard** divides intersection by union. Here cosine is **0.10 for A–B**, about **0.224 for A–C**.

## 4. Compare with independence

**Pointwise mutual information (PMI)** measures association relative to independent occurrence:

\[
PMI(A,B)=\log\frac{P(A,B)}{P(A)P(B)}
\]

\(P(A,B)\): shared-user probability; \(P(A),P(B)\): individual probabilities within the same population and window.

Positive PMI means more overlap than independence predicts. Rare coincidences can score highly.

## 5. Check support before trusting a score

Two items sharing one sole user have cosine 1, with almost no evidence.

**Shrinkage** pulls weakly supported estimates toward a reference. One heuristic multiplies similarity by \(n_{AB}/(n_{AB}+\alpha)\), where \(\alpha>0\) controls shrinkage strength.

At \(\alpha=10\), one shared user retains 1/11 of the score; 100 retain 100/110.

## 6. Validate the recommendation use

Normalize to address the relationship you want, then evaluate candidate quality and coverage. No formula automatically removes exposure bias.

Minimum-support rules improve stability but can suppress useful rare pairs.

## 7. Interview reasoning

**Question:** Why do the same bestsellers appear beside every item?

**Answer:** Raw counts may reward reach rather than specific association. Compare normalized scores and support, then measure whether the resulting recommendations improve.
