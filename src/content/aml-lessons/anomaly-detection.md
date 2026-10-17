## Anomaly detection

**Anomaly detection** scores observations by how unusual they are relative to a reference dataset or model. Unusual does not necessarily mean fraudulent, dangerous, or incorrect.

A legitimate car purchase can be unusual. A common fraud pattern can look ordinary. Those distinctions matter when acting on alerts.

## 1. Outlier versus novelty detection

| Setup | Training data | Goal |
|---|---|---|
| Outlier detection | May already contain unusual observations | Find observations that differ from the bulk |
| Novelty detection | Intended to represent normal behavior | Identify unusual future observations |

The appropriate model and method calls depend on the estimator. This distinction is not a universal `fit_predict` versus `predict` rule.

Supervised classification uses known outcomes. It can outperform anomaly detection even with rare positives if those positives provide useful patterns; compare rather than choosing solely by class frequency.

## 2. Different models define “unusual” differently

- **Isolation Forest:** repeated random feature splits tend to isolate separated points in fewer steps. The score summarizes isolation depth across trees.
- **Local-neighbor methods:** compare neighborhood distances or density; isolated local points receive higher anomaly scores.
- **One-class SVM:** fits a boundary around a reference distribution in a kernel-defined space.
- **Density models:** flag low estimated density, under the model's assumptions.
- **Reconstruction models:** compress and reconstruct inputs, flagging large reconstruction error. Some unusual inputs reconstruct well, so test this assumption.

```python
IsolationForest(contamination=0.001, random_state=0).fit(X_train)
```

A model score is not automatically a probability of being anomalous. High dimensionality and irrelevant features can make each method's notion of unusual unreliable.

## 3. A flag fraction is not a false-alarm rate

**Contamination** commonly helps choose a cutoff from an assumed anomaly proportion. It does not guarantee the false-positive rate, precision, or future alert rate.

At 10 million events per day, flagging 0.1% creates 10,000 alerts. A team handling 500 needs a different policy, possibly a top-500 queue or a second-stage filter.

Choose the operating policy from validation evidence, response cost, and capacity. Confirm the estimator's score direction before taking its largest values.

## 4. Evaluate with incomplete labels

Measure recall among known positives and precision from reviewed alerts, while acknowledging selection bias. Review samples outside the flagged set where feasible to investigate missed cases. Synthetic anomalies test specific mechanisms, not complete real-world quality.

A useful hybrid routes unusual cases to review, creates labels, and trains a supervised model on recurring patterns. Monitor label coverage: the cases you review are not a random sample of all events.

> **Mental image:** an anomaly detector is a spotlight on difference. A separate judgement decides which differences require action.
