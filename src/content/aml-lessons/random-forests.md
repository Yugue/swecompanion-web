## Bagging and random forests

## 1. Average models fitted to different samples

**Bagging**, or bootstrap aggregating, combines models fitted to resampled data. A **random forest** bags trees and randomly restricts candidate features at each split.

An **ensemble** is a collection of models whose outputs are combined.

## 2. Build the trees independently

```aml-visual
ensemble-methods
```

A **bootstrap sample** draws rows with replacement. Drawing \(n\) times from \(n\) rows includes about 63.2% of distinct rows for large \(n\).

A forest averages numeric predictions or class probabilities. Its trees can train independently.

## 3. Reduce shared mistakes

If one strong feature starts every tree, the trees may make similar errors. Feature subsampling encourages different fits.

For \(B\) predictions with equal variance \(\sigma^2\) and pairwise correlation \(\rho\):

\[
\operatorname{Var}(\bar f)=\rho\sigma^2+\frac{1-\rho}{B}\sigma^2
\]

\(\bar f\) is their mean prediction. More trees reduce the second term; shared variation remains. Real trees need not satisfy equal-variance assumptions exactly.

## 4. Use out-of-bag predictions

**Out-of-bag (OOB)** rows were not sampled for a particular tree. Predict each row using only its OOB trees for an internal estimate.

OOB works for suitable independent rows. It does not enforce unseen-patient or future-period evaluation, and repeated tuning against it can select lucky results.

## 5. Weigh stability against size

Tune leaf size and feature sampling as well as tree count. Extra trees increase memory and serving work; a finite validation score need not improve with every addition.

Forests are usually more stable than one deep tree. Correlated errors, poor inputs, and miscalibrated probabilities can remain.

## 6. Interview reasoning

**Question:** Why sample features if bootstrap sampling already changes the data?

**Answer:** Row resampling can still produce trees dominated by the same feature. Feature sampling reduces correlated errors, improving the value of averaging.
