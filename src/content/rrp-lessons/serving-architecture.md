## Serving inside a latency budget

A **serving architecture** turns a request into a usable recommendation response. Its latency includes features, retrieval, scoring, list selection, communication, and queueing—not just model computation.

## 1. Budget the critical path

```rrp-visual
serving-path
```

Independent retrieval sources can run in parallel. The request waits for whichever responses the merge policy requires, subject to deadlines; adding their elapsed times is not the parallel critical path.

The figure's 50 ms allocation is illustrative. Measure end-to-end latency under realistic traffic and failures. Summing individual stage percentiles does not give the end-to-end percentile.

**p99 latency** is the time within which 99% of measured requests finish. It reveals a slow tail that a mean can hide.

## 2. Choose what runs ahead of time

| Work | Possible placement | Main tradeoff |
|---|---|---|
| Item vectors and neighbor lists | Batch or incremental updates | Cost amortization versus freshness |
| Long-run user summaries | Periodic updates | Reuse versus changing interests |
| Popularity by context | Cached lists | Low request cost versus staleness |
| Current query and session context | Request or recent-event path | Freshness versus latency |

Whole-list precomputation can help when many requests can reuse a list. It can also freeze a feed or waste work on users who never return. Compare actual cache reuse and freshness requirements.

## 3. Bound dependencies and failures

Batch candidate feature reads and scoring where it helps. Profile communication, embedding access, model work, and queueing separately before choosing an optimization.

Give optional sources deadlines. Define supported stale values, missing indicators, or fallback models for failed features. The fallback must be evaluated with the inputs it actually receives.

A cached or curated response still needs current hard eligibility checks. Returning fewer valid items can be preferable to filling slots with unavailable ones.

## 4. Log the final action and outcome linkage

Record request ID, displayed items and positions, versions, feature values or snapshot references, and any fallback. If the policy is randomized, log the actual action probability at the appropriate action granularity.

A candidate returned by retrieval, selected by ranking, sent by the server, and rendered on screen are different events. Link outcomes to the appropriate display so training does not mistake unseen server results for non-clicks.

Version model, transforms, index, calibrator, schema, and decision policy as compatible components, and retain a usable rollback path.

> **Mental image:** latency is a relay with some parallel runners. Measure the route the request actually waits for, including its backup route.
