## Serving a model: batch, online, and train/serve skew

**Model serving** applies a fitted model to product inputs and delivers predictions. The right serving mode depends on when inputs arrive, when decisions happen, and how fresh predictions must be.

## 1. Three serving modes

| Mode | Flow | Example |
|---|---|---|
| Batch | Scheduled job → stored predictions → lookup | Weekly retention queue |
| Online | Request → features → model → response | Checkout fraud decision |
| Streaming | Event → updated features or prediction → downstream consumer | Continuous equipment monitoring |

Batch simplifies repeated computation, but stored predictions become stale. It still has lookup latency. Online includes features and inference in the request budget; its inputs can also be stale if upstream data is delayed.

A hybrid can precompute expensive history features and combine them with request-time information. Choose from the actual freshness requirement rather than assuming every product needs immediate recomputation.

## 2. Train/serve skew means different inputs

**Train/serve skew** is a mismatch between how inputs or transformations are produced during training and serving.

```text
training:  30-day spend, UTC boundary, missing value → 0
serving:   30-day spend, local boundary, missing value → median
```

Both paths run successfully while supplying different values. Other causes include backfilled history, changed category mappings, units, rounding, and feature arrival delays.

Share definitions and stored transformations. Compare replayed requests or logged live feature vectors with historical reconstruction, using explicit tolerances for floating-point values. A feature store can help coordinate definitions, but it does not automatically guarantee correctness.

## 3. Deploy a complete version

A prediction artifact includes the model, imputer, scaler, encoder, feature definitions, and expected schema. Record the decision threshold or policy too. Test their compatibility and keep a previous usable version.

A **shadow deployment** scores live requests without letting the new score drive the decision. It can reveal compatibility and latency problems; it does not directly measure the causal effect of using the new policy and still consumes resources.

A **canary rollout** exposes a limited portion of eligible traffic before expanding. Define health checks, quality checks when labels arrive, and rollback conditions.

## 4. Plan missing and slow inputs

For each dependency, define an acceptable cached age, a supported missing-value path, or a simpler fallback. Test these paths with real timeout and failure scenarios.

Fallback behavior is a product choice: allowing, blocking, deferring, or requesting review have different consequences. A fallback model must be trained and evaluated for the inputs it will actually receive.

> **Mental image:** shipping a model means shipping the entire measuring and decision instrument, including its calibration settings and backup path.
