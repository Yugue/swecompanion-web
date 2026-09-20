## Feature scaling and normalization

Scaling is a small transformation with a sharp rule attached: it is **essential for some model families and irrelevant for others**, and knowing which is which is a standard interview check.

---

## 1. The three transforms

**Standardization** (z-score) - the default:

\[
x' = \frac{x - \mu}{\sigma}
\]

Zero mean, unit variance. Unbounded, preserves the shape of the distribution.

**Min-max normalization** - to a fixed range:

\[
x' = \frac{x - x_{\min}}{x_{\max} - x_{\min}}
\]

Bounded to [0, 1], but a single extreme value squashes everything else.

**Robust scaling** - when outliers are present:

\[
x' = \frac{x - \text{median}}{\text{IQR}}
\]

```python
StandardScaler()  |  MinMaxScaler()  |  RobustScaler()
```

### Rule of thumb

Standardize by default. Reach for robust scaling when outliers are present, and remember min-max is squashed by a single extreme value.

---

## 2. Who needs it and who does not

| Model | Needs scaling? | Why |
|---|---|---|
| k-NN, k-means, SVM (RBF) | **Yes** | They compute distances; a feature in dollars dominates one in years |
| Logistic / linear regression with L1 or L2 | **Yes** | The penalty is applied to raw coefficient size |
| Any model fitted with gradient descent | **Yes** | Wildly different scales make the loss surface elongated and slow to descend |
| PCA | **Yes** | It maximizes variance, and variance is scale-dependent |
| Neural networks | **Yes** | Same gradient argument, plus saturation |
| Decision trees | No | A split is a threshold; monotone rescaling does not change the ordering |
| Random forest, gradient boosting | No | Built from trees |
| Naive Bayes (categorical/multinomial) | No | Works on counts and probabilities |

> **Gradient descent** is the standard way of training a model: nudge the numbers a little, check whether the error went down, and repeat. Chapter 4 covers it properly.

### Rule of thumb

> Distance, dot products, penalties, and gradients care about scale. Threshold splits do not.

---

## 3. Why unscaled features break distance models

Consider two features: annual income (30,000-200,000) and years at the company (0-40).

\[
d = \sqrt{(\text{income}_1-\text{income}_2)^2 + (\text{years}_1-\text{years}_2)^2}
\]

### Intuition

A $10,000 income difference contributes 10,000² to the distance; a 10-year tenure difference contributes 100. Tenure is effectively invisible — k-NN is clustering by income alone, and never tells you.

**Why it changes regularized linear models.** L2 penalizes \(\sum w_j^2\). A feature measured in dollars needs a tiny coefficient to have a normal-sized effect, and a tiny coefficient is barely penalized. A feature measured in units of 0-1 needs a large coefficient, which is heavily penalized.

> Without scaling, the regularizer punishes features according to their unit of measurement rather than their usefulness.

### Common issue

This is why `LogisticRegression` in scikit-learn — which regularizes by default — should essentially always sit behind a scaler.

---

## 4. Fit on train, apply everywhere

```python
scaler = StandardScaler().fit(X_train)   # μ and σ come from TRAIN only
X_train_s = scaler.transform(X_train)
X_val_s   = scaler.transform(X_val)      # same μ and σ
```

Fitting the scaler on all the data before splitting leaks the test distribution's mean and variance into training. The effect is small but it is real, and in an interview it is a red flag. A `Pipeline` inside cross-validation makes it impossible to get wrong.

The same statistics must also be shipped to production: the serving path applies the *stored* μ and σ, never recomputes them from live traffic.

**Related transforms that are not scaling**

- **Log / Box-Cox / Yeo-Johnson**: change the *shape* of a skewed distribution, not just its scale.
- **Quantile transform**: forces a feature to a uniform or normal distribution; powerful and lossy.
- **L2 row normalization**: scales each *row* to unit length - used for text/TF-IDF and cosine similarity, a different operation from column scaling.

---

## What matters most

- **Ask whether the model measures distance, dot products, penalties, or gradients.** If so, scale (k-NN, k-means, RBF-SVM, regularized linear models, PCA, neural nets). Threshold splits don't care, so trees and boosting skip it.
- **Regularization punishes by unit of measurement** when features are unscaled, not by usefulness - that is the real reason to put a scaler in front of logistic regression.
- **Pick the transform for the data:** standardize by default, robust scaling when outliers are present, and remember min-max is squashed by a single extreme value.
- **Fit the scaler on train only,** and ship the stored mean and standard deviation to production rather than recomputing them from live traffic.

Next topic is **Encoding categorical features**.
