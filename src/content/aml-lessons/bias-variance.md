## Bias-variance tradeoff

**There are two different ways for a model to be bad, and the cure for one makes the other worse.**

- It can be **too simple** to capture the pattern, so it is wrong in much the same way every time. That is **bias**.
- It can be **so flexible that it memorized** the particular examples it was shown, so it swings wildly on data it has not seen. That is **variance**.

```text
   too simple              about right            too flexible
       ___                     ╱╲                   ╱╲  ╱╲
   ___╱            vs         ╱  ╲        vs       ╱  ╲╱  ╲╱╲
  misses the real          follows the         chases every wobble
  shape entirely           actual shape        in the training data
```

This is the single most useful mental model in the domain: it turns "the model is bad" into "the model is bad *in this specific way*, so here is the fix that targets it."

### 1. The decomposition

For squared error, expected test error at a point decomposes into:

\[
\mathbb{E}\big[(y - \hat f(x))^2\big] = \underbrace{\text{Bias}^2}_{\text{wrong assumptions}} + \underbrace{\text{Variance}}_{\text{sensitivity to the sample}} + \underbrace{\sigma^2}_{\text{irreducible noise}}
\]

- **Bias**: the error from the model being unable to represent the true relationship. Systematic, repeatable.
- **Variance**: how much the fitted function would change if you trained on a different sample of the same size.
- **Irreducible noise**: ambiguity in the labels themselves. No model beats it, ever.

---

### 2. The two failure modes

```text
HIGH BIAS (underfitting)          HIGH VARIANCE (overfitting)
train error   high                train error   very low
val error     high                val error     much higher
gap           small               gap           large
```

The gap is the diagnostic. Two numbers - training score and validation score - identify the failure mode before you touch anything.

| | High bias | High variance |
|---|---|---|
| Cause | Model too simple, over-regularized, poor features | Model too flexible for the data volume, noisy labels |
| More data helps? | **No** | **Yes** |
| First fix | More capacity, better features, less regularization | Regularize, simplify, get more data |

### Rule of thumb

> If training performance itself is bad, do not add regularization. You would be treating the opposite disease.

---

### 3. The dartboard picture

```text
low bias, low variance    →  tight cluster on the bullseye
low bias, high variance   →  scattered around the bullseye
high bias, low variance   →  tight cluster, off to one side
high bias, high variance  →  scattered, and off to one side
```

Low variance is worthless if it is centered in the wrong place, which is why "stable model" is not by itself good news.

---

### 4. What moves you along the curve

| Lever | Bias | Variance |
|---|---|---|
| More capacity (depth, features, degree) | ↓ | ↑ |
| More regularization (L1/L2, pruning, dropout) | ↑ | ↓ |
| More training data | — | ↓ |
| Better features | ↓ | usually ↓ |
| Ensembling by averaging (bagging) | — | ↓ |
| Ensembling by boosting | ↓ | ↑ (slightly) |

Two rows are worth memorizing: **more data only helps variance**, and **regularization buys variance reduction by paying in bias**. Regularization is not free - too much of it produces underfitting.

---

### 5. Where the classic models sit

```text
high bias ──────────────────────────────── high variance
linear/logistic   naive Bayes   boosted trees   deep tree   1-NN
```

This is why a linear model on a complex problem plateaus no matter how much data you add (bias-limited), and why 1-NN is unstable no matter how careful you are (variance-limited).

---

### 6. The modern caveat

The textbook U-shaped curve - error falls, then rises with capacity - is a good default intuition but is not the whole story. Very large models trained on very large datasets with strong regularization often generalize well despite enormous capacity.

For this interview you do not need double descent. You do need to avoid claiming "a bigger model always overfits more", which is too strong.

---

## Interview mental model

Two numbers - training score and validation score - identify the failure mode before you change anything:

```text
train BAD                       → high bias (underfitting)
   fix: more capacity, better features, less regularization
   more data will NOT help

train GOOD, validation much worse → high variance (overfitting)
   fix: regularize, simplify, get more data
```

The rule that follows: **if training performance itself is poor, do not add regularization** - you would be treating the opposite disease, since regularization buys lower variance by paying in bias.

Keep two more facts ready: more data only ever reduces variance, and irreducible noise sets a floor that no model beats. And avoid the overclaim that a bigger model always overfits more - large, well-regularized models trained on large data often generalize despite huge capacity.

That completes **Chapter 1 — Foundations**. Next topic is **Missing values, outliers, and duplicates**.
