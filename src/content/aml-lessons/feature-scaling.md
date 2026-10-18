## Feature scaling and normalization

## 1. Units influence the model

**Feature scaling** changes numeric units. It affects distances, coefficient penalties, and optimization without adding information.

**Euclidean distance** is straight-line separation:

\[
d(x,x')=\sqrt{\sum_j(x_j-x'_j)^2}
\]

\(x,x'\) are feature vectors; \(j\) indexes coordinates. Larger numeric differences contribute more.

## 2. Watch a neighbor change

```aml-visual
feature-scaling
```

Income measured in dollars can dominate tenure measured in years. Rescaling changes which difference matters most.

## 3. Choose column statistics

| Transform | Formula | Effect |
|---|---|---|
| Standardization | \((x-\mu)/\sigma\) | Center and scale by standard deviation |
| Min-max | \((x-a)/(b-a)\) | Map training range to [0, 1] |
| Robust scaling | \((x-m)/\text{IQR}\) | Use less extreme-sensitive statistics |

\(x\) is one value; \(\mu,\sigma\) are the training mean and standard deviation; \(a,b\) the training minimum and maximum; \(m\) the median. **IQR** is the 75th minus 25th percentile.

Constant columns need a zero-denominator convention.

## 4. Match scaling to the method

Distance and kernel methods depend on geometry. Coefficient penalties depend on units: multiplying an input by 1,000 permits the same linear contribution with a coefficient 1,000 times smaller.

Ordinary threshold trees usually need no scaling because monotonic transforms preserve ordering.

## 5. Reuse the fitted transform

```python
scaler = StandardScaler().fit(X_train)
X_val_scaled = scaler.transform(X_val)
```

**Row normalization** instead rescales each example vector, often to unit length. Standardization does not make data Gaussian; min-max scaling does not bound future values; robust scaling does not remove outliers.

## 6. Interview reasoning

**Question:** Why might changing dollars to thousands alter a regularized linear fit?

**Answer:** It changes the coefficient size needed for the same prediction, hence its penalty. Use deliberate feature scales and tune the complete procedure.
