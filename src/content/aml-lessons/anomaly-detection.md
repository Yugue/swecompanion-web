## Anomaly detection

## 1. Score difference from a reference

**Anomaly detection** scores how unusual an observation is relative to data or a fitted model.

A legitimate large purchase can be unusual; common fraud can look ordinary. Unusualness alone does not establish harm.

## 2. Define the reference setup

| Setup | Training reference |
|---|---|
| Outlier detection | May contain unusual observations already |
| Novelty detection | Intended to represent normal behavior for future comparisons |

Estimator-specific behavior matters. If useful outcome labels exist, compare a supervised baseline even when positives are rare.

## 3. Understand what the score measures

| Method | Unusual means |
|---|---|
| Isolation Forest | Random feature splits isolate a point in few steps |
| Local-neighbor methods | Neighborhood is sparse relative to nearby neighborhoods |
| One-class SVM | Outside a fitted reference boundary in kernel space |
| Density model | Low estimated density |
| Reconstruction model | Large error when compressing and rebuilding the input |

These are different assumptions. Some unusual inputs reconstruct well, and irrelevant dimensions can mislead distance-based methods.

## 4. Translate a cutoff into workload

**Contamination** commonly sets a cutoff from an assumed anomaly proportion. It does not guarantee false-positive rate, precision, or future alert volume.

Flagging 0.1% of ten million daily events creates 10,000 alerts. A 500-case team needs a capacity-aware policy or another filtering stage. Confirm which score direction means more anomalous.

## 5. Evaluate incomplete evidence

Measure known-positive recall and reviewed-alert precision, acknowledging selection. Review some unflagged cases where feasible to investigate misses.

Synthetic anomalies test specific mechanisms, not total real-world quality. New reviewed labels can support a supervised model, but the reviewed sample may be unrepresentative.

## 6. Interview reasoning

**Question:** Does a contamination setting of 0.1% guarantee 0.1% false alarms?

**Answer:** No. It helps select a score cutoff under a reference distribution. False alarms require outcome labels; future traffic can also change the flag rate.
