## Train, validation, and test splits

## 1. Separate three jobs

A **data split** assigns different examples to fitting, development choices, and final evaluation.

| Set | Role |
|---|---|
| Training | Fit model values and preprocessing statistics |
| Validation | Choose features, settings, and action thresholds |
| Test | Assess the fixed procedure |

## 2. Picture the separation

```aml-visual
data-splits
```

The 60/20/20 proportions are illustrative. Choose sizes that leave enough important outcomes for evaluation.

**Cross-validation** rotates subsets through the validation role when one holdout would waste scarce data.

## 3. Match the deployment claim

| Must handle | Split design |
|---|---|
| New independent examples | Random |
| Unseen patients or customers | Hold entire entities out |
| Future events | Train earlier, evaluate later |
| Unseen entities in the future | Enforce both restrictions |

**Stratification** preserves approximate class proportions. It cannot override group or time restrictions.

## 4. Respect label delays

Training on July 1 with 30-day churn labels cannot use complete labels for June 25 snapshots. Their outcomes have not matured.

A time split may need a gap or removal of overlapping outcome windows. Size it from actual availability and dependence, not a fixed percentage.

## 5. Fit the whole procedure inside training

A **pipeline** bundles learned transformations with a model:

```python
pipe.fit(X_train, y_train)
scores = pipe.predict_proba(X_val)[:, 1]
```

Validation receives stored transformations. Repeated test-driven edits turn the test set into development data; a fresh assessment is then needed.

## 6. Interview reasoning

**Question:** Is the same customer appearing on both sides always leakage?

**Answer:** It depends on the claim. It can match future predictions for existing customers, but cannot assess generalization to entirely unseen customers.
