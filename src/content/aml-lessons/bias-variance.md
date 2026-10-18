## Bias-variance tradeoff

## 1. Imagine fitting repeatedly

**Bias** is the difference between the average fitted prediction and the true relationship. **Variance** measures how much predictions change across training samples.

These describe repeated fits, not exact quantities read from one train/validation pair.

## 2. Picture the difference

```aml-visual
bias-variance
```

Rigid fits can repeatedly miss the same bend. Flexible fits can follow the bend while changing their local wiggles between samples.

## 3. Separate squared-error sources

Assume \(y=f(x)+\epsilon\), with zero-mean noise \(\epsilon\) of variance \(\sigma^2\):

\[
\mathbb E[(y-\hat f(x))^2]
=\operatorname{Bias}(\hat f(x))^2
+\operatorname{Var}(\hat f(x))+\sigma^2
\]

\(f\) is the true relationship; \(\hat f\) a fitted predictor. At fixed input \(x\), the expectation averages training samples and new outcomes.

**Irreducible noise** is uncertainty remaining given those inputs. Better measurements can change that floor. This exact decomposition applies to squared error, not classification accuracy.

## 4. Read a training gap cautiously

**Underfitting** misses useful patterns; **overfitting** captures training-specific details that fail to transfer.

```text
shallow tree: training accuracy 71%   validation 70%
deep tree:    training accuracy 100%  validation 72%
```

The first may be too restricted; the second may be sample-sensitive. Shift, weak features, or fitting failures can produce similar clues.

## 5. Choose an evidence-based intervention

| Evidence | Experiment |
|---|---|
| Useful shape is missing | Better features or more capacity |
| Fits change greatly across samples | Regularization, averaging, more data |
| Inputs cannot distinguish outcomes | Better measurements or labels |

The diagnosis lesson develops the curve-based checks. More complexity cannot create absent information.

## 6. Interview reasoning

**Question:** Does a large train/validation gap directly measure variance?

**Answer:** No. It is a clue. Check split validity, population changes, preprocessing, and repeated-fit behavior before attributing it to sample sensitivity.
