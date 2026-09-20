## Logistic regression

The default classifier in industry, and the one worth knowing precisely: it is a **linear model of the log-odds**, not a regression on 0/1 labels.

### 1. The model

\[
z = w^{\top}x + b, \qquad p = \sigma(z) = \frac{1}{1+e^{-z}}
\]

The sigmoid maps any real number into (0, 1):

```text
z = -4  → p ≈ 0.02
z =  0  → p = 0.50
z = +4  → p ≈ 0.98
```

The decision boundary is where \(p = 0.5\), i.e. \(w^{\top}x + b = 0\) - a **line, plane, or hyperplane**. The model is nonlinear in p but linear in the boundary it can draw.

```python
LogisticRegression(C=1.0).fit(X_train, y_train).predict_proba(X_test)[:, 1]
```

---

### 2. The loss

Log loss (binary cross-entropy):

\[
L = -\frac{1}{n}\sum_i \Big[ y_i\log p_i + (1-y_i)\log(1-p_i) \Big]
\]

If the truth is 1, the loss is \(-\log p\): predicting 0.99 costs almost nothing, predicting 0.01 costs a lot. It punishes **confident mistakes** hard, which is exactly the behavior you want from something that outputs probabilities.

This loss is **convex** - it has one single lowest point, like a bowl, rather than several dips to get stuck in. So training always lands in the same place, and where it starts does not matter.

### Why not squared error?

Two reasons, and the second is the better answer:

1. Squared error with a sigmoid is non-convex in \(w\), so optimization can get stuck.
2. Log loss is the maximum-likelihood objective for a Bernoulli outcome - minimizing it *is* fitting a probability model, while squared error is fitting a number that happens to lie in [0,1].

---

### 3. Log-odds and the odds ratio

Rearranging the sigmoid gives the reason this model is used in regulated industries:

\[
\log\frac{p}{1-p} = w^{\top}x + b
\]

So \(w_j\) is the change in **log-odds** per unit of \(x_j\), and \(e^{w_j}\) is an **odds ratio**.

> A coefficient of 0.7 means the odds multiply by e^0.7 ≈ 2 for each unit increase.

That sentence - reportable, auditable, defensible - is why logistic regression survives in credit, insurance, and medicine regardless of what else is available.

---

### 4. Regularization is on by default

scikit-learn's `LogisticRegression` applies L2 with strength `C` (where **C is the inverse** of the penalty: small C = strong regularization). Two consequences:

- you must **scale your features**, or the penalty punishes features by their unit of measurement,
- C is the one hyperparameter genuinely worth tuning.

Use `penalty="l1"` when you want sparse coefficients for feature selection.

---

### 5. Multiclass

Two ways to extend past binary:

| Approach | How | Notes |
|---|---|---|
| One-vs-rest | C independent binary models | Simple; probabilities do not sum to 1 without normalizing |
| Multinomial (softmax) | One model, softmax over C scores | The usual default, properly normalized |

\[
p_c = \frac{e^{z_c}}{\sum_{k} e^{z_k}}
\]

For **multilabel** problems (several labels can be true at once), use C independent sigmoids instead - softmax would force them to compete.

---

### 6. Strengths and limits

| Strengths | Limits |
|---|---|
| Fast to train and to serve (a dot product) | Boundary is linear unless you engineer features |
| Well-calibrated probabilities out of the box | Needs scaling, and sensitive to outliers in x |
| Coefficients are explainable | Underperforms boosted trees on rich tabular data |
| Convex - reproducible fits | Cannot capture interactions unless you add them |

The calibration point is underrated: logistic regression is a *probability* model, so its 0.7 usually means 70%. Random forests and SVMs do not give you that for free (see the **calibration** lesson).

---

## What matters most

- **It is a linear model of the log-odds,** which is why the boundary is a hyperplane and why a coefficient converts cleanly into an odds ratio you can report.
- **Log loss is the maximum-likelihood objective for a Bernoulli outcome,** convex, and punishes confident mistakes - a better answer than "squared error gets stuck."
- **It regularizes by default, with C as the *inverse* penalty,** so scale your features and treat C as the hyperparameter worth tuning.
- **Its probabilities are usually trustworthy out of the box,** unlike forests and SVMs.
- **Use softmax when classes compete and independent sigmoids when several labels can be true.**

Next topic is **k-Nearest Neighbors**.
