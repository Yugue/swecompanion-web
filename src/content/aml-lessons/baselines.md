## Baselines and when not to use ML

## 1. Establish a reference

A **baseline** is a reference method evaluated under the same conditions as the proposed model.

> A score needs a meaningful starting point.

## 2. Use three levels

| Reference | Example |
|---|---|
| Trivial predictor | Majority class; training mean or median |
| Current process | Existing rules or analyst queue |
| Simple fitted model | Regularized linear or logistic model |

Use a mean reference for squared error and a median for absolute error. Forecasts should also face last-value or seasonal references.

## 3. Expose a misleading headline

At 0.8% positives, predicting everything negative gives 99.2% accuracy and zero recall.

A candidate with 99.2% accuracy has not established useful improvement. Compare the errors and the action budget.

## 4. Compare at equal capacity

A team can review 100 cases daily:

| Method | Frauds found in 100 reviews |
|---|---|
| Existing rules | 24 |
| Logistic model | 37 |
| Boosted trees | 39 |

The logistic model adds 13 detections over rules. Boosting adds two more; assess uncertainty, fraud value, and operating cost before choosing it.

## 5. Decide whether complexity pays

Learn baseline values from training data; compare on shared evaluation examples.

Keep rules when they meet the requirement and added modelling does not justify its cost. Keep a useful baseline available as a regression check or supported fallback.

Failure to beat a trivial reference warrants investigation. Weak available signal can also be the explanation.

## 6. Interview reasoning

**Question:** A complex model beats the majority class. Is that enough?

**Answer:** Compare it with the current process and a credible simple model at the same decision constraints. A trivial reference alone sets too low a bar.
