## Bagging and random forests

**Bagging**, short for bootstrap aggregating, fits models on resampled training data and combines their predictions. A **random forest** applies this idea to trees and randomly restricts candidate features at each split.

## 1. Average different trees

```aml-visual
ensemble-methods
```

A **bootstrap sample** draws rows with replacement. Drawing \(n\) times from \(n\) rows includes about 63.2% of distinct rows for large \(n\), some repeatedly.

A forest averages tree probabilities for classification or numeric predictions for regression. Variation can cancel when trees make different errors.

## 2. Why sample features too?

If one feature dominates, every bootstrapped tree may use it first and make similar errors. Considering a random subset of features at each node encourages different trees.

For \(B\) equally variable predictions with variance \(\sigma^2\) and equal pairwise correlation \(\rho\):

\[
\operatorname{Var}(\bar f)=\rho\sigma^2+\frac{1-\rho}{B}\sigma^2
\]

More trees shrink the second term; correlated errors remain in the first. This explains the value of diversity, though real trees need not have equal variances or correlations.

Feature subsampling can weaken individual trees while improving the combined prediction. Its net effect needs validation.

## 3. Out-of-bag evaluation

**Out-of-bag (OOB)** rows are those not selected for a particular tree. Predict each training row using only trees that did not sample it to obtain an internal performance estimate.

```python
RandomForestClassifier(
    n_estimators=300, max_features="sqrt",
    min_samples_leaf=5, oob_score=True, random_state=0,
)
```

OOB evaluation is useful for independent rows. It does not enforce new-patient or forward-time evaluation, and tuning repeatedly against it can make the selected score optimistic.

## 4. Practical tradeoffs

Tune feature sampling and leaf size as well as sufficient tree count. Adding trees often stabilizes performance, but a finite validation score need not improve monotonically and extra trees increase memory and serving work.

Trees can train independently, allowing parallelism. A forest is usually more stable than one deep tree, but is harder to read as a single rule set. It still needs representative data, honest splits, and probability calibration checks.

**Boosting**, shown alongside bagging, builds corrections sequentially instead of averaging independently fitted trees. That difference—not a guaranteed winner—explains their different tuning and training behavior.

> **Mental image:** ask several imperfect observers. Averaging helps most when they do not all make the same mistake.
