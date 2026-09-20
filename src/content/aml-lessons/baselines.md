## Baselines and when not to use ML

**A baseline is the dumbest thing that could possibly work, scored on exactly the same data as your model.**

Without one, "the model gets 87%" means nothing. You cannot tell whether 87% is a triumph or whether always guessing "no" would have scored 86%.

---

## 1. The trivial baseline

| Task | Trivial baseline |
|---|---|
| Classification | always predict the majority class |
| Imbalanced classification | predict all-negative, then report precision/recall |
| Regression | always predict the training mean or median |
| Time series | predict the last observed value |
| Ranking | rank by popularity, or keep the current order |

```python
DummyClassifier(strategy="most_frequent").fit(X_train, y_train).score(X_test, y_test)
```

### Intuition

On a fraud dataset with a 0.8% positive rate, that dummy scores **99.2% accuracy** — and so does a model that has learned nothing.

### Rule of thumb

> Quote the baseline in the same breath as the model. "0.91 AUC" means nothing; "0.91 vs 0.74 for the current rule" is a result.

---

## 2. The rule-based baseline

Whatever the business does today:

```text
the hand-written fraud rules
the analyst's spreadsheet
"sort by most recent"
the vendor's off-the-shelf score
```

### Core intuition

This is the one that matters most, because it is the thing your model has to **replace**. Beating the dummy but only matching the existing rules means the project produced nothing except a new maintenance burden.

---

## 3. The simple-model baseline

```python
Pipeline([("scale", StandardScaler()), ("clf", LogisticRegression())]).fit(X_train, y_train)
```

### Intuition

Useful in two directions:

```text
complex model barely beats it  →  ship the simple one
simple model is TERRIBLE       →  suspect the features or the labels,
                                   not the capacity
```

---

## 4. Reading the gaps

```text
dummy        0.50 AUC
current rule 0.74 AUC
logistic     0.86 AUC   ← most of the value is here
boosted tree 0.89 AUC   ← the extra 0.03 has a cost
deep model   0.895 AUC  ← probably noise
```

> **AUC** is a single score for how well a classifier separates the two classes: 0.5 is coin-flipping, 1.0 is perfect. Chapter 5 covers it properly; here it is just a consistent yardstick.

### Core intuition

The shape of that ladder is the real finding. Most of the value arrives with the first honest model; everything after is an engineering trade against latency, explainability, and maintenance.

### Rule of thumb

> The value of ML is the gap between the model and the best simple alternative — not the model's absolute score.

---

## 5. When not to use ML at all

Say no when:

- the rule is short, stable, and auditable,
- the cost of a wrong answer is unacceptable and the rule is legally required,
- there is not enough data, or the labels do not exist and cannot be obtained,
- **nobody will own the monitoring and retraining after launch.**

### Common issue

That last one is the adult answer. A model with no owner degrades silently, and a degraded model is worse than the rule it replaced because everyone still trusts it.

---

## 6. Baselines protect you during the project

A baseline is a permanent control:

```text
catches pipeline bugs      if you cannot beat the mean, something is broken
bounds a feature's value   how much is this really worth?
gives a fallback           when the model service fails in production
is cheap to keep running   in shadow mode, as a canary
```

---

## What matters most

- **Quote the baseline in the same breath as the model.** "0.91 AUC" is a number; "0.91 vs 0.74 for the current rule" is a result.
- **There are three baselines:** the trivial one (majority class, mean), whatever the business does today, and a simple model you can build in an hour.
- **The shape of the ladder is the finding.** Most of the value arrives with the first honest model; the rest is a trade against latency and maintenance.
- **A model that can't beat the trivial baseline signals a bug,** and one that barely beats the rules may not be worth shipping.
- **A model with no owner is worse than the rule it replaced,** because it decays silently while everyone still trusts it.

Next topic is **Bias-variance tradeoff**.
