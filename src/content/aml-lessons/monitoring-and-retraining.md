## Monitoring, drift, and retraining

**Model monitoring** checks service health, input quality, predictions, and outcomes after deployment. **Drift** is a change in the data distribution or its relationship with the target. A deployed model may degrade; decline is not inevitable or automatically repaired by retraining.

## 1. Observe what is available now and later

| Layer | Example signals | When available |
|---|---|---|
| Service and inputs | Latency, errors, missing rates, units, feature age | Immediately |
| Predictions | Score distribution, flag rate, slice volumes | Immediately |
| Outcomes | Precision, recall, calibration, business impact | After labels or outcomes arrive |

If a feature's missing rate jumps from 2% to 31%, investigate before waiting a month for churn labels. A changing flag rate is a useful clue, not a diagnosis. A fixed top-500 queue may keep its count constant even while ranking quality deteriorates.

## 2. Name the distribution change carefully

| Type | Formal meaning | Example |
|---|---|---|
| Covariate shift | P(x) changes while P(y given x) stays fixed | More customers from an already understood region |
| Label shift | P(y) changes while P(x given y) stays fixed | Different class proportions under that assumption |
| Concept drift | P(y given x) changes | The same behavior now indicates a different outcome |

Real changes can mix these cases. Input drift alone does not prove quality loss. A well-specified model may remain accurate under some covariate shifts; loss of coverage is a different concern.

Recalibration may help changed probability meaning. Concept drift generally requires recent outcome evidence. Retraining on unchanged old labels cannot teach a newly changed relationship.

## 3. Investigate before triggering retraining

Compare recent and reference distributions using meaningful windows, effect sizes, and counts. Simple schema, range, missingness, and freshness checks often reveal pipeline faults.

Statistical tests or binned drift measures can add evidence, but universal alarm cutoffs are unreliable. Large samples make tiny changes statistically detectable; many monitored features create multiple-testing issues.

Match the response to the cause: repair a broken join, improve coverage, adjust a validated policy, recalibrate, or retrain. Do not train on broken inputs merely because an alarm fired.

## 4. Validate every update and watch feedback

Evaluate a candidate on a recent suitable holdout, important slices, calibration, and operating constraints. Recheck its threshold, roll out with monitoring, and keep rollback available. A retraining schedule is not a quality guarantee.

**Feedback loops** occur when decisions change the outcomes later observed. Blocked transactions may never reveal whether fraud would have occurred. Log decisions and label availability; an unobserved counterfactual outcome cannot simply be logged as ground truth. Appropriate experiments or evaluation designs may be needed.

> **Mental image:** immediate sensors report the instrument's condition; delayed outcomes report whether its predictions still help.
