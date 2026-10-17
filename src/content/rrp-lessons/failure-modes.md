## Characteristic failure modes

A **failure mode** is a recurring way a system misses its intended behavior. Treat a symptom as a starting hypothesis, then locate the mechanism before choosing a fix.

## 1. Trace one affected request

```text
valid inputs? → eligible inventory? → candidate pool? → scores? → final list? → display?
```

Retain versions, intermediate item IDs, removal reasons, feature values, and fallback use. A useful item can disappear at several different transitions.

## 2. Match symptoms to discriminating checks

| Symptom | Plausible causes | Check first |
|---|---|---|
| Same items everywhere | Demand concentration, raw-count dominance, merge or cache bug | Exposure by source, user, and context |
| New items invisible | Unsupported IDs, missing index entry, filters, little exposure | Publication-to-index and stage membership |
| Good offline score, weak live result | Bias, metric mismatch, uncertainty, skew | Evaluation protocol and served inputs |
| Candidate ordering looks good, discovery falls | Retrieval source failure or narrowed inventory | Candidate recall and source counts |
| Sudden score or click change | Data incident, layout change, population change | Input health, versions, instrumentation |

None of these symptoms uniquely identifies a cause. Popularity or narrow lists can be appropriate for some tasks.

## 3. Distinguish quality problems from measurement problems

A click drop may reflect missing outcome events. An improved next-item metric may reflect easier sampled negatives. A flat new-item rate may hide a changed denominator or growing inventory.

Compare counts and definitions before interpreting rates. Inspect the actual displayed action rather than only the server's intended list. Grouped and temporal dependence affect uncertainty too.

For session complaints, check event freshness and how long recent intent persists. For repeated items, distinguish accidental duplicate IDs, legitimate continue-watching, and distinct items that are merely similar.

## 4. Recover and test one hypothesis

For an active incident, use the established valid fallback or compatible previous bundle and preserve request evidence. Avoid changing several model and data components at once unless recovery requires it.

Reproduce the failure on those requests. Test the proposed fix against the affected stage, broader quality, hard eligibility, and latency. A repaired index should restore candidate discovery; it need not require a new ranker.

> **Mental image:** diagnose a missing parcel by tracing each handoff. Rebuilding the delivery truck cannot fix a parcel never admitted to the depot.
