## Baselines and when not to use ML

A baseline turns "the model gets 87%" into a sentence that means something. Without one, an accuracy number is not evidence of anything.

### 1. The trivial baseline

Before any model, compute what a system with no intelligence achieves:

| Task | Trivial baseline |
|---|---|
| Classification | always predict the majority class |
| Imbalanced classification | predict all-negative, and report precision/recall, not accuracy |
| Regression | always predict the training mean (or median) |
| Time series | predict the last observed value |
| Ranking | rank by popularity, or keep the current order |

```python
DummyClassifier(strategy="most_frequent").fit(X_train, y_train).score(X_test, y_test)
```

For a fraud dataset with a 0.8% positive rate, that dummy scores **99.2% accuracy**. So does a model that has learned nothing. This is the single most common interview trap in this domain, and the baseline is what exposes it.

### Rule of thumb

> Quote the baseline in the same breath as the model. "0.91 AUC" means nothing; "0.91 vs 0.74 for the current rule" is a result.

---

### 2. The rule-based baseline

The second baseline is whatever the business does today:

- the hand-written fraud rules,
- the analyst's spreadsheet,
- "sort by most recent",
- the vendor's off-the-shelf score.

This one matters most, because it is the thing your model has to replace. If the model beats the dummy but only matches the existing rules, the project has produced nothing except a new maintenance burden.

---

### 3. The simple-model baseline

The third baseline is a model you can build in an hour:

```python
Pipeline([("scale", StandardScaler()), ("clf", LogisticRegression())]).fit(X_train, y_train)
```

or gradient-boosted trees with default settings for tabular data.

This baseline is useful in two directions:

- if the complex model barely beats it, ship the simple one,
- if the simple model is *terrible*, suspect the features or the labels before reaching for capacity.

---

### 4. Reading the gaps

```text
dummy        0.50 AUC
current rule 0.74 AUC
logistic     0.86 AUC   ← most of the value is here
boosted tree 0.89 AUC   ← the extra 0.03 has a cost
deep model   0.895 AUC  ← probably noise
```

The shape of that ladder is the real finding. Most of the value usually arrives with the first honest model; everything after is an engineering trade against latency, explainability, and maintenance.

### Rule of thumb

> The value of ML is the gap between the model and the best simple alternative - not the model's absolute score.

---

### 5. When not to use ML at all

Say no when:

- the rule is short, stable, and auditable ("block transactions over $10,000 from accounts under one day old"),
- the cost of a wrong answer is unacceptable and the rule is legally required,
- there is not enough data, or the labels do not exist and cannot be obtained,
- nobody will own the monitoring and retraining after launch.

That last one is the adult answer. A model with no owner degrades silently, and a degraded model is worse than the rule it replaced because everyone still trusts it.

---

### 6. Baselines also protect you during the project

A baseline is a permanent control:

- it catches pipeline bugs (if your model cannot beat the mean, something is broken),
- it bounds how much a new feature is really worth,
- it gives you something to fall back to when the model fails in production,
- and it is cheap to keep running in shadow mode.

---

## What you should say in an interview

For "our fraud model has 99.2% accuracy":

> The first thing I would compute is the majority-class baseline. With a fraud rate under 1%, predicting "never fraud" also gets about 99%, so that number tells us nothing yet. I would look at precision and recall at the operating threshold, compare against the existing rules, and ask what the model catches that the rules do not - that gap is the actual result.

Next topic is **Missing values, outliers, and duplicates**.
