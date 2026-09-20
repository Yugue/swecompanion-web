## Diagnosing overfitting and underfitting

You already know the definitions. The graded skill is **reading the evidence** and choosing a fix that targets the actual failure.

---

## 1. Start with two numbers

```text
train score   val score   reading
─────────────────────────────────────────────────────────
  0.72          0.70      underfitting / optimization issue
  0.99          0.80      poor generalization
  0.99          0.98      healthy, or leakage - check
  0.55          0.54      model or pipeline is broken
```

### Rule of thumb

Neither number alone is a diagnosis. A validation score of 0.80 is excellent next to 0.78 training and alarming next to 0.99.

---

## 2. The same model, three diagnoses

Three projects, each reporting "the model is not good enough":

```text
            train    val     gap      what is actually wrong
 project A   0.72    0.70    0.02     underfitting - it cannot even fit what it has seen
 project B   0.99    0.80    0.19     overfitting - or leakage, or a tiny val set
 project C   0.55    0.54    0.01     broken - a coin flip on a balanced problem
```

The prescriptions are completely different, and two of them are the opposite of each other:

```text
 A  →  more capacity, better features, LESS regularization
 B  →  more data, MORE regularization, simpler model
 C  →  stop tuning. check the labels, the join, and the target column.
```

Project C is the one worth dwelling on. A score near chance is almost never a modelling problem - it is shuffled labels, a broken join, a target column that leaked away, or features that are all null. The overfit-100-rows check at the end of this lesson catches it in about a minute.

### Common issue

And the most common real mistake is treating project A like project B: seeing a disappointing number, reaching for regularization, and making a model that already could not fit the data fit it even less.

---

## 3. Learning curves over training-set size

Train on 10%, 20%, ... 100% of the data and plot both scores:

```text
score                     score
 │ train ───────────       │ train ─────────────
 │ val   ──────────        │        ╲
 │       (converged)       │ val ────╲────────
 └──────── data →          └──────── data →
   HIGH BIAS                 HIGH VARIANCE
   curves meet, both low     large persistent gap,
   more data won't help      val still rising → more data helps
```

### Core intuition

This is the single most informative plot in applied ML, and naming it in an interview is a strong signal. It answers the expensive question - "should we go collect more data?" - before anyone spends money.

---

## 4. Validation curves over a hyperparameter

Fix the data, sweep one hyperparameter:

```text
max_depth:    2     4     8     16    32
train:      0.74  0.81  0.91  0.98  1.00
val:        0.73  0.80  0.86  0.84  0.79
                          ↑ best generalization
```

### Intuition

The peak is the capacity the data can support. Past it, training keeps improving and validation degrades - the textbook overfitting signature.

---

## 5. Curves over training iterations

For iteratively fitted models (boosting, SGD, neural networks):

```text
iteration   1     50    200   500
train      1.20  0.62  0.31  0.11
val        1.25  0.68  0.55  0.77
                        ↑ early stopping point
```

Early stopping is the cheapest regularizer available: stop where validation stops improving, and keep the best checkpoint.

### Rule of thumb

> Diagnose from the shape over time, not from one final number.

---

## 6. A large gap is not automatically overfitting

Before adding regularization, rule out the impostors:

| Alternative cause | How to check |
|---|---|
| Leakage in training | Audit features against the prediction timestamp |
| Group leakage | Is the same user/patient/item in both splits? |
| Distribution shift between splits | Compare feature distributions train vs val |
| Validation set too small | Re-split with a different seed; how much does the score move? |
| Label noise in validation | Hand-check a sample of the "errors" |
| Different preprocessing per split | Is everything inside one Pipeline? |

### Common issue

A tiny validation set is the most common false alarm: with 200 rows, ±3% is just resampling noise.

---

## 7. The fixes, matched to the diagnosis

**Underfitting**
- increase capacity (depth, features, polynomial terms, a stronger model family),
- reduce regularization,
- train longer / lower the learning rate and let it converge,
- improve the features - usually the real answer.

**Overfitting**
- more data, or augmentation where it applies,
- stronger regularization (L1/L2, pruning, min samples per leaf),
- fewer features, or a simpler model,
- early stopping,
- ensembling by averaging.

---

## 8. The sanity check that catches bugs

Before any of this, verify the model can **overfit 100 examples**:

```python
small = X_train[:100]
model.fit(small, y_train[:100])
model.score(small, y_train[:100])   # should be near 1.0
```

### Rule of thumb

If it cannot memorize 100 rows, you do not have a capacity problem. You have a bug - shuffled labels, a broken transform, a runaway learning rate, or a target column that is not what you think it is.

---

## Interview mental model

Diagnose from shapes over time, not from one final number:

```text
learning curve (vs data size)   → curves meet low = bias; persistent gap = variance
                                  and it answers "should we collect more data?"
validation curve (vs a hyper)   → the peak is the capacity the data supports
iteration curve (vs steps)      → where validation turns up is the early-stopping point
```

Before calling a large gap overfitting, rule out the impostors: leakage, the same entity on both sides, a distribution difference between splits, or simply a validation set small enough that ±3% is resampling noise.

And run the bug check first - a model that cannot memorize 100 rows doesn't have a capacity problem, it has shuffled labels, a broken transform, or the wrong target column.

Next topic is **Cross-validation**.
