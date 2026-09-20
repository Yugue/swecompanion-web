## Bias-variance tradeoff

**There are two different ways for a model to be bad, and the cure for one makes the other worse.**

- Too **simple** to capture the pattern, so it is wrong the same way every time → **bias**.
- So **flexible it memorized** the examples it saw, so it swings wildly on new data → **variance**.

```text
   too simple              about right            too flexible
       ___                     ╱╲                   ╱╲  ╱╲
   ___╱            vs         ╱  ╲        vs       ╱  ╲╱  ╲╱╲
  misses the real          follows the         chases every wobble
  shape entirely           actual shape        in the training data
```

---

## 1. Where the error comes from

\[
\mathbb{E}\big[(y - \hat f(x))^2\big] = \underbrace{\text{Bias}^2}_{\text{wrong assumptions}} + \underbrace{\text{Variance}}_{\text{sensitivity to the sample}} + \underbrace{\sigma^2}_{\text{irreducible noise}}
\]

### Core intuition

```text
bias        error from the model being unable to represent the truth.  Systematic.
variance    how much the fit would change on a different sample.       Random.
noise       ambiguity in the labels themselves.  No model ever beats it.
```

---

## 2. Telling the two apart

```text
HIGH BIAS (underfitting)          HIGH VARIANCE (overfitting)
train error   high                train error   very low
val error     high                val error     much higher
gap           small               gap           large
```

### Core intuition

**The gap is the diagnostic.** Two numbers identify the failure mode before you change anything.

### Rule of thumb

> If training performance itself is bad, do not add regularization. You would be treating the opposite disease.

---

## 3. A worked example

Same data, same features — only capacity changes:

```text
                        train    validation   gap    diagnosis
depth-2 tree             0.71       0.70      0.01   high bias
depth-8 tree             0.88       0.85      0.03   about right
depth-30 tree            1.00       0.72      0.28   high variance
```

### Intuition

The depth-2 tree is bad at data it has **already seen**, so the problem cannot be generalization. The depth-30 tree is perfect on what it saw and poor on anything else — memorization.

```text
depth-2   →  more capacity, better features, LESS regularization
             more data will NOT help
depth-30  →  regularize, simplify, or get more data
             more data WILL help
```

### Common issue

The most frequent mistake in practice is reaching for regularization while looking at the first row.

---

## 4. Why more data only helps variance

### Core intuition

Variance is how much the fit would change on a different sample. More data makes every sample look like every other sample, so the wobble shrinks.

```text
100 rows    →  two samples give two quite different models
100,000     →  two samples give nearly the same model
```

Bias does not work that way. It is the error left when the model is fitted **perfectly**, and it comes from the model's shape:

```text
        ╱╲  ← the true relationship
   ────────  ← the best straight line, at ANY sample size
```

### Rule of thumb

> "Should we collect more data?" is answered by the gap, not by the absolute score.

---

## 5. The dartboard picture

```text
low bias, low variance    →  tight cluster on the bullseye
low bias, high variance   →  scattered around the bullseye
high bias, low variance   →  tight cluster, off to one side
high bias, high variance  →  scattered, and off to one side
```

### Intuition

Low variance is worthless if it is centered in the wrong place — which is why "the model is stable" is not by itself good news.

---

## 6. What moves you along the curve

| Lever | Bias | Variance |
|---|---|---|
| More capacity | ↓ | ↑ |
| More regularization | ↑ | ↓ |
| More training data | — | ↓ |
| Better features | ↓ | usually ↓ |
| Bagging (averaging) | — | ↓ |
| Boosting | ↓ | slightly ↑ |

### Rule of thumb

Two rows are worth memorizing: **more data only helps variance**, and **regularization buys variance reduction by paying in bias**.

---

## 7. Where the classic models sit

```text
high bias ──────────────────────────────── high variance
linear/logistic   naive Bayes   boosted trees   deep tree   1-NN
```

### Intuition

This is why a linear model plateaus no matter how much data you add, and why 1-NN is unstable no matter how careful you are.

### Common issue

Avoid the overclaim that "a bigger model always overfits more". Very large, well-regularized models trained on very large data often generalize well despite enormous capacity.

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
