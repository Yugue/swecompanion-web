## Monitoring, drift, and retraining

## 1. Observe the deployed system

**Model monitoring** checks service health, inputs, predictions, and outcomes. **Drift** means a distribution or input–outcome relationship changes.

A drift signal is evidence to investigate; it does not by itself prove prediction quality fell.

## 2. Separate immediate and delayed signals

| Available now | Available after outcomes |
|---|---|
| Errors, latency, feature age | Prediction quality |
| Missing rates, units, ranges | Precision, recall, calibration |
| Score and action distributions | Useful product outcomes |

A missing rate rising from 2% to 31% warrants immediate inspection. A top-500 queue can retain its size while quality deteriorates.

## 3. Name the changed relationship

Let \(x\) denote inputs, \(y\) outcomes, and \(P\) their probability distributions:

| Change | Definition |
|---|---|
| Covariate shift | \(P(x)\) changes; \(P(y\mid x)\) stays fixed |
| Label shift | \(P(y)\) changes; \(P(x\mid y)\) stays fixed |
| Concept drift | \(P(y\mid x)\) changes |

Real changes can mix these cases. More traffic from an already understood group need not require a new predictive relationship.

## 4. Match the response to the cause

A broken join needs repair. Lost coverage may need representative examples. Changed probability meaning may need recalibration. Changed outcome relationships need recent labelled evidence.

Compare meaningful windows and effect sizes. Huge samples can flag tiny changes; one universal statistical alarm cutoff is unreliable.

## 5. Validate updates and feedback

Assess candidates on recent suitable holdouts, slices, calibration, and serving constraints. Recheck the action policy and keep rollback available.

A **feedback loop** occurs when decisions affect later observations. A blocked purchase may never reveal whether fraud would have occurred. Log actions and label availability; unobserved outcomes cannot simply become negative labels.

## 6. Interview reasoning

**Question:** Input drift fired an alarm. Should retraining start automatically?

**Answer:** First identify the change and its consequences. Fix pipeline faults before training, and require evidence that a validated update improves the deployed decision.
