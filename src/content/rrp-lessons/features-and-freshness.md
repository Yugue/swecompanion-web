## Features, freshness, and skew

## 1. Ask what was on the model's desk

**Feature freshness** describes how current an input is when used. **Train/serve skew** is a mismatch between training and live feature computation.

> An event has a date it happened and a date it reached the desk.

## 2. Choose an update rhythm

| Rhythm | Example |
|---|---|
| Batch | Long-run category interests |
| Near real time | Session actions or recent demand |
| Request time | Current query and device |

Faster updates add cost and can add noise. Use the rhythm justified by predictive value.

## 3. Respect availability, not just event time

```rrp-visual
feature-availability
```

The click happened before the decision but arrived after it. A later reconstruction must not sneak it into the earlier prediction.

## 4. Reconstruct the available version

A **point-in-time join** selects the feature version available at a historical decision. Respect arrival and publication delays as well as event timestamps.

A **watermark** estimates a streaming pipeline's event-time progress. It helps manage late events; it does not guarantee none will arrive later.

## 5. Share the feature definition

“Recent clicks” must specify window, endpoint, timezone, deduplication, units, and missing-value rules.

Compare logged serving values or versioned references with historical replay. Identical feature names do not guarantee identical computations.

## 6. Distinguish zero, stale, and missing

Zero clicks differs from a failed lookup. Set maximum accepted age, missing indicators, and fallback behavior for each dependency.

Monitor arrival delay, feature age, nulls, coverage, and timeouts. Train and evaluate the fallback states the model will actually receive.

## 7. Interview reasoning

**Question:** Is a 13:59 event always valid for a 14:00 feature?

**Answer:** No. It must have arrived and been published by 14:00. Its occurrence timestamp alone does not establish availability.
