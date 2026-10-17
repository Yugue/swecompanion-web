## Regularization: L1, L2, and elastic net

**Regularization** discourages overly complex or unstable fits. In linear models, it commonly adds a coefficient penalty to the data loss:

\[
L_{total}(w)=L_{data}(w)+\lambda R(w)
\]

The strength \(\lambda\) controls the tradeoff. Better training fit alone no longer wins if it requires a costly coefficient pattern.

## 1. L1 and L2 change the shape of the choice

```aml-visual
regularization-geometry
```

| Penalty | Form | Typical effect |
|---|---|---|
| L2, or ridge | \(\sum_jw_j^2\) | Shrinks coefficients; stabilizes correlated directions |
| L1, or lasso | \(\sum_j\lvert w_j\rvert\) | Can set some coefficients exactly to zero |
| Elastic net | A weighted mixture of L1 and L2 | Combines sparsity and stabilization |

**Sparsity** means many coefficients are zero. L1's corners on coordinate axes make zero coefficients common; L2's rounded constraint usually shrinks without selecting exact zeros. Exact zeros under L2 are still possible for some datasets.

## 2. Correlated features need care

If two standardized features contain nearly the same signal, many weight combinations can predict similarly.

Ridge discourages large opposing coefficients and tends to share weight across similar features. Lasso may retain one and remove another, with the choice changing across samples. Elastic net can retain related groups while still producing sparsity.

A selected feature is not proven causal, and a removed one is not proven irrelevant. Selection reflects the model, other available features, and penalty strength.

## 3. Tune the whole procedure

Scale numeric features when their units should be treated comparably. Fit the scaler within each training fold, then tune penalty strength using validation or cross-validation.

```python
pipe = Pipeline([
    ("scale", StandardScaler()),
    ("model", Ridge(alpha=1.0)),
])
```

Larger `alpha` generally means a stronger penalty. For models using `C`, smaller `C` means stronger regularization. Exact normalization conventions differ across estimators; do not assume every library's parameters are numerically interchangeable.

An intercept is commonly left unpenalized. Penalizing it would also pull the baseline prediction toward zero.

## 4. The same idea outside coefficients

Depth limits and minimum leaf sizes constrain trees. Early stopping limits the number of boosting corrections. Larger neighbor counts smooth k-NN predictions.

These mechanisms can reduce sensitivity to training noise, often at the cost of more bias. Too strong a restriction underfits. More representative data can improve generalization too, but it is additional information rather than a coefficient penalty.

> **Mental image:** regularization makes a complicated explanation pay rent. Keep complexity only when its improvement survives validation.
