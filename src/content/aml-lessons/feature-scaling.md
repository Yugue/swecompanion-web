## Feature scaling and normalization

**Feature scaling** changes numeric units so a model can compare or penalize features on a deliberate basis. It usually changes a column's scale rather than adding information.

## 1. Units change distance

```aml-visual
feature-scaling
```

A $10,000 income difference contributes \(10{,}000^2\) to squared Euclidean distance. A ten-year tenure difference contributes only \(10^2\). Without rescaling, the neighborhood is driven almost entirely by dollars.

**Euclidean distance** is straight-line distance: \(\sqrt{\sum_j(x_j-x'_j)^2}\). Scaling chooses how much each coordinate contributes.

## 2. Three column transforms

| Transform | Formula | Effect |
|---|---|---|
| Standardization | \((x-\mu)/\sigma\) | Training mean 0 and variance 1 for a nonconstant column |
| Min-max | \((x-x_{\min})/(x_{\max}-x_{\min})\) | Training range maps to [0, 1] |
| Robust scaling | \((x-\text{median})/\text{IQR}\) | Uses median and interquartile range |

The **interquartile range (IQR)** is the 75th percentile minus the 25th. Robust scaling reduces the influence of extremes on the scaling statistics; it does not remove outliers.

Standardization does not make a skewed distribution Gaussian. New observations can fall outside a fitted min-max range. Constant columns need a zero-denominator convention, which standard library scalers handle.

## 3. Which models care?

Distance methods, kernel methods, coefficient penalties, and gradient-based fitting are often sensitive to scale. Scaling can improve optimization and make penalties more comparable across numeric features.

For a linear prediction \(wx\), multiplying \(x\) by 1,000 allows the same contribution with a coefficient 1,000 times smaller. An L2 penalty on coefficient size therefore changes unless scale is accounted for.

Ordinary axis-aligned trees generally need no scaling: a strictly monotonic transformation preserves split ordering. Numerical approximations and interpolation at thresholds can still introduce small differences.

Choose feature scales from their meaning as well as convenience. Unit variance does not guarantee that every feature deserves equal influence.

## 4. Fit once on training data

```python
scaler = StandardScaler().fit(X_train)
X_val_scaled = scaler.transform(X_val)
```

Put the scaler inside the model pipeline so each cross-validation fold learns its own statistics. Serving uses the stored statistics too.

**Row normalization** is different: it scales each example vector, often to length one for direction-based similarity. A log transform is different again: it changes a feature's distribution shape.
