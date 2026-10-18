## Serving a model: batch, online, and train/serve skew

## 1. Deliver the prediction when needed

**Model serving** applies a fitted pipeline to product inputs. Choose its timing from freshness and decision requirements.

| Mode | Mechanism | Example |
|---|---|---|
| Batch | Scheduled computation, stored outputs | Weekly retention queue |
| Online | Request triggers feature retrieval and prediction | Checkout fraud check |
| Streaming | Events update features or predictions | Equipment monitoring |

## 2. Budget freshness and latency

Batch outputs can become stale and still require a lookup. Online inputs can also be stale when upstream events arrive late.

A hybrid precomputes expensive history and combines it with request features. Use the simplest mode that meets the actual requirement.

## 3. Detect train/serve skew

**Train/serve skew** is a mismatch between training and live input construction:

```text
training → 30-day spend, UTC windows, missing filled with zero
serving  → 30-day spend, local windows, missing filled with median
```

Both paths can run successfully while producing different predictions. Share definitions and stored transforms; compare logged live vectors with historical reconstruction.

## 4. Ship a complete version

Version model, preprocessing, feature definitions, expected input schema, and decision policy together. Test compatibility and retain a usable previous version.

A missing encoder or changed unit can break an otherwise valid model.

## 5. Observe before expanding

A **shadow deployment** computes live predictions without using them for decisions. It checks compatibility and latency, but cannot measure the effect of the new policy.

A **canary rollout** exposes limited eligible traffic before expansion. Define health checks, delayed quality checks, and rollback conditions.

## 6. Support dependency failures

Specify acceptable cached age, a trained missing-input path, or a validated fallback. Test actual timeouts.

Blocking, allowing, deferring, and requesting review have different costs. A fallback model must be evaluated with the inputs it will really receive.

## 7. Interview reasoning

**Question:** Offline and live features have identical names. Is that sufficient?

**Answer:** No. Compare values, units, timing, category mappings, and missing-value behavior. Matching names can hide different computations.
