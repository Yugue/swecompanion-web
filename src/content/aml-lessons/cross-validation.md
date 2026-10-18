## Cross-validation

## 1. Evaluate repeated held-out fits

**Cross-validation (CV)** divides development data into **folds**, or subsets, and repeatedly evaluates on data excluded from that fit.

In five-fold CV, each fit trains on four folds and validates on the remaining one.

## 2. Picture the rotation

```aml-visual
cross-validation
```

Keep the final test set outside this development rotation. CV evaluates a learning procedure; it does not produce one universally best fitted model.

## 3. Choose the fold design

| Intended claim | Suitable design |
|---|---|
| Independent new rows | Shuffled folds |
| Preserve class ratios in independent data | Stratified folds |
| New patients or devices | Grouped folds |
| Future periods | Forward-time folds |

Follow the availability and label-window rules from the split lesson. Ordinary rotation is unsuitable when it violates chronology or entity separation.

## 4. Rebuild every fitted step

```text
training fold → fit transformations → fit model
held-out fold → apply those fitted transformations → evaluate
```

Selecting columns from all labels before CV leaks information. Target encoders and resampling need fold-aware implementations too.

## 5. Separate tuning from assessment

**Nested CV** uses an inner loop to choose settings and an outer held-out loop to evaluate that search procedure.

Alternatively, choose settings with development CV and assess once on a reserved test set. Refit the chosen procedure on designated development data before that final assessment.

Fold spread describes variation across folds; overlapping training sets mean it is not automatically a confidence interval. The model-comparison lesson develops paired uncertainty.

## 6. Interview reasoning

**Question:** Why must a scaler be refitted inside each fold?

**Answer:** Held-out rows must not influence fitted statistics. Reusing a scaler fitted to all rows evaluates a procedure that already saw part of its evaluation data.
