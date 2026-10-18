## Building the training data

## 1. Reconstruct a decision reproducibly

A **training pipeline** converts recorded events into model examples. Its joins, labels, sampling, and splits define the learning problem.

The data and freshness chapters supply the event and availability definitions; this chapter assembles them.

## 2. Audit the joins

```text
impressions → deduplicate → attach outcomes → mature labels → assemble inputs
```

Join through stable event keys. Check row counts, duplicate keys, unmatched outcomes, and joins that unexpectedly produce several rows per impression.

One purchase should not silently become several independent positive examples.

## 3. Respect label maturity

For “click within 30 minutes,” two minutes without a click is not a completed negative.

Use mature examples or an explicitly delay-aware objective. Label delay restricts the newest complete training cohort; it does not prevent current inputs at inference.

A **cohort** groups examples by a shared condition, often display date.

## 4. Preserve the sampling design

**Class downsampling** retains fewer examples from one label class, often non-clicks. Record inclusion probabilities and use appropriate weighting or correction.

This differs from retrieval negative sampling, which constructs competing items. Keep representative evaluation data rather than evaluating on an undocumented altered class mix.

## 5. Keep enough provenance to replay

| Retained evidence | Purpose |
|---|---|
| Request / impression IDs | Example linkage |
| Input snapshots / versions | Historical reconstruction |
| Position / source tags | Funnel diagnosis |
| Actual action probabilities | Supported off-policy evaluation |
| Dataset and policy versions | Reproducibility |

## 6. Validate before fitting

Use deployment-matched temporal or grouped splits. Fit transformations inside the training portion.

Check cross-split duplicates, future-derived inputs, unusual label rates, missing cold slices, and served-versus-rebuilt input differences.

A completed job is not proof of valid training rows.

## 7. Interview reasoning

**Question:** Training rows suddenly double while impression volume is unchanged. First check?

**Answer:** Inspect join multiplicity and duplicate keys before attributing the increase to user behavior or retraining on the larger dataset.
