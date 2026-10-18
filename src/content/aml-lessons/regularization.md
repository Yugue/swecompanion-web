## Regularization: L1, L2, and elastic net

## 1. Make unstable complexity costly

**Regularization** discourages overly complex or unstable fits. A coefficient-penalized objective is:

\[
L_{total}(w)=L_{data}(w)+\lambda R(w)
\]

\(w\) holds coefficients; \(L_{data}\) measures prediction loss; \(R\) penalizes the fit; \(\lambda\ge0\) controls strength. Increasing strength trades training fit for a stronger restriction.

## 2. Choose a penalty

| Penalty | Form | Typical effect |
|---|---|---|
| L2, ridge | \(\sum_j w_j^2\) | Shrink coefficients |
| L1, lasso | \(\sum_j\lvert w_j\rvert\) | Produce some exact zeros |
| Elastic net | Weighted L1/L2 mixture | Combine selection and stabilization |

\(j\) indexes coefficients. **Sparsity** means many coefficients are zero.

## 3. See why zeros differ

```aml-visual
regularization-geometry
```

L1's constraint has corners on coordinate axes, where a coefficient is zero. L2's rounded boundary usually shrinks without selecting exact zeros.

The diagram uses equivalent constrained problems; equal numeric bounds or penalties need not give equal fits.

## 4. Handle related features

For near-duplicate inputs, ridge tends to share weight and discourages large cancelling coefficients. Lasso may retain one feature, with the choice changing across samples. Elastic net can retain related groups.

A selected input is not proven causal; a removed one may still contain signal duplicated elsewhere.

## 5. Tune on deliberate units

Scale inputs when coefficients should face comparable penalties. Fit the transform inside training folds.

Larger `alpha` commonly strengthens regularization; smaller `C` does so in estimators using inverse strength. Conventions differ. Intercepts are commonly unpenalized to avoid pulling the baseline toward zero.

Tree depth limits and early stopping impose related restrictions outside coefficient penalties. Excessive restriction underfits.

## 6. Interview reasoning

**Question:** Why might lasso choose a different feature after a small data change?

**Answer:** Correlated inputs can substitute for one another. Similar predictive value does not guarantee stable individual selection; compare ridge or elastic net and repeated fits.
