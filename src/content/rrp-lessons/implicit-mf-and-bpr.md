## Factorization for implicit feedback

**Implicit-feedback factorization** learns vector scores from behavior rather than explicit ratings. Its objective must specify what to do with observed interactions and uncertain missing entries.

A sampled unobserved item is a training contrast, not a verified dislike.

## 1. Confidence-weighted reconstruction

A common approach sets a binary preference target \(p_{ui}\): 1 for an observed interaction and 0 otherwise. It minimizes:

\[
L=\sum_{u,i}c_{ui}(p_{ui}-v_u^\top v_i)^2+\lambda R(v)
\]

\(c_{ui}\) weights each cell, \(R\) penalizes vector complexity, and \(\lambda\) controls that penalty. Unobserved cells often receive low weight; interaction counts can increase the weight on observed cells.

“Confidence” here is a chosen weight, not a validated probability that the label is true. Low-weight zeros remain a modelling assumption about missing data.

For target 0 and score 0.8, weight 1 contributes 0.64. For target 1 and score 0.8, weight 10 contributes 0.4. The weights determine the balance of these pressures.

## 2. Pairwise ordering with BPR

**Bayesian Personalized Ranking (BPR)** uses an observed item \(i\) and sampled unobserved item \(j\) for user \(u\). Its pairwise loss is:

\[
\ell=-\log\sigma(s(u,i)-s(u,j)),\qquad
\sigma(z)=\frac{1}{1+e^{-z}}
\]

**Sigmoid** maps a score gap to a value between 0 and 1. A gap of +1 gives loss about 0.313; a gap of −1 gives about 1.313.

Even a correctly ordered pair has nonzero loss and can receive an update. Regularization and other pairs help determine how large gaps should become. Neither individual score is thereby a click probability.

## 3. Sampling defines which comparisons matter

Uniform negatives cover the catalogue; popularity-based negatives emphasize frequently observed competitors; hard negatives challenge the current model with high-scoring alternatives.

A **false negative** is an item treated as negative despite being a plausible positive. Remove known positives where appropriate, but recognize that unobserved preferences remain uncertain. Harder is not automatically better.

Sampling changes the optimization target unless an appropriate objective-specific correction is used. It is not inherently a popularity-bias cure.

## 4. Compare procedures, not labels

Confidence-weighted ALS uses structure in squared reconstruction objectives. BPR typically uses sampled comparisons and gradient updates. Both need validation, regularization, and realistic candidate evaluation.

If training contains only positive targets with no contrast or other informative structure, many high scores can satisfy it. If every blank is treated as a definite rejection, the procedure overstates what was observed. Choose and test the assumption between those extremes.
