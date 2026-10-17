## Features, freshness, and skew

**Feature freshness** describes how current a value is when used. **Train/serve skew** is a mismatch between how values or transformations are produced for training and live decisions.

A recent-looking timestamp does not guarantee that all recent events were included.

## 1. Separate three update rhythms

| Rhythm | Example | Appropriate when |
|---|---|---|
| Batch | Long-run category interests | Slow-changing evidence is sufficient |
| Near real time | Session actions or recent item demand | Recent events add measured value |
| Request time | Query, current device, current candidate context | Information is specific to this decision |

Faster updates add operational cost and can amplify noise. Validate the quality benefit rather than assuming the fastest feature is always the most valuable.

Define both the window and its endpoint. “Clicks in ten minutes before the last nightly job” differs from “clicks in the ten minutes before this request.”

## 2. Event time is not availability time

```rrp-visual
feature-availability
```

A click at 13:59 arriving at 14:02 was unavailable for the 14:00 prediction. A historical reconstruction that includes it leaks information, despite its earlier event timestamp.

A **point-in-time join** retrieves the feature version available at the decision time. It must respect arrival and publication delays as well as when underlying events occurred.

A **watermark** describes a streaming pipeline's estimate of event-time progress. It helps manage windows and late arrivals; it is not a guarantee that no later event can appear.

## 3. Preserve the serving definition

Different timezones, deduplication, units, null rules, and window boundaries can turn similarly named features into different values.

Log values as served or sufficient versioned references, share transformation definitions, and replay representative requests to compare reconstruction. Floating-point comparisons may require documented tolerances.

Logging helps preserve original inputs. Later schema, preprocessing, or representation changes can still introduce skew, so it does not remove every future failure.

## 4. Make stale and missing behavior explicit

Zero recent clicks differs from a failed counter lookup. Define acceptable ages, missing-value representation, and fallback behavior per feature. Train and test the model with the fallback states it must handle.

Monitor arrival delay, publication delay, feature age, null rate, coverage, timeout rate, and useful distribution changes. These signals distinguish a slow data path from a genuine shift in behavior.

> **Mental image:** each feature has both a date on the event and a date it reached the model's desk. Historical predictions can use only what had reached the desk.
