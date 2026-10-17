## Train, validation, and test splits

A **data split** separates examples used for learning from examples used for evaluation. Train, validation, and test sets have different jobs.

## 1. Three roles

```aml-visual
data-splits
```

- **Training:** fit parameters and preprocessing statistics.
- **Validation:** choose features, model family, hyperparameters, and thresholds.
- **Test:** estimate performance after those choices are fixed.

A 60/20/20 split is an example, not a requirement. Ensure evaluation has enough examples of important outcomes. With limited data, **cross-validation** rotates held-out folds through the validation role.

Repeatedly changing the model after seeing test results makes that set part of development. A fresh evaluation is then needed for an independent final estimate.

## 2. Make the split match deployment

| What must the model handle? | Suitable evaluation |
|---|---|
| New independent examples from the same population | Random split |
| Previously unseen patients or customers | Hold entire entities out |
| Future transactions | Train on earlier data, evaluate later |
| Both new entities and future periods | Enforce both restrictions |

The same customer appearing in train and validation is not automatically leakage. It may match predicting that customer's future purchases. It is unsuitable for estimating performance on entirely new customers.

For classification, **stratification** preserves approximate class proportions. It does not fix time or group leakage; those restrictions come first.

## 3. Account for label availability

Imagine training a churn model on July 1 using a label that needs 30 days to mature. A June 25 snapshot has no complete label yet. Exclude it from that historical training run.

A temporal evaluation may therefore need a gap or removal of overlapping outcome windows. Size that gap from label availability and dependence, rather than from an arbitrary percentage.

New request features can still be used at prediction time even when recent labels are unavailable.

## 4. Fit transformations inside training

```python
pipe.fit(X_train, y_train)  # learns imputation, scaling, and model values
scores = pipe.predict_proba(X_val)[:, 1]
```

A **pipeline** bundles transformations with a model. During cross-validation, each fold must fit its own pipeline. Computing a mean, encoding, or feature selection using evaluation rows leaks information into the process being evaluated.

> **Mental image:** training is practice, validation is rehearsal, and test is the final assessment. Rehearsing on the final questions changes what the assessment measures.
