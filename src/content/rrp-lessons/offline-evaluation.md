## Offline evaluation and its limits

**Offline evaluation** tests a model or policy using existing data without deploying it to make the live decisions being assessed. Its interpretation depends on how examples, labels, and candidate sets were collected.

Recommendation logs usually contain outcomes selected by an earlier serving policy.

## 1. Match the claimed deployment setting

```rrp-visual
temporal-evaluation
```

For future recommendations, train on earlier available evidence and evaluate later decisions. Reconstruct inventory, features, and label availability at each historical cutoff.

Use separate development and final evaluation periods. Account for unfinished outcomes or overlapping windows. Holding out entire users answers a new-user question; it does not automatically match predictions for returning users.

## 2. State which stage is being tested

| Evaluation | What it measures | Important limit |
|---|---|---|
| Reorder a fixed candidate pool | Ordering within that pool | Does not test missing candidates |
| Retrieve from eligible inventory | Recovery of reference positives | Unobserved relevant items lack labels |
| Score recorded impressions | Predictions under logged exposure | Does not directly measure a new display policy |

A positive among 99 easy sampled distractors is a different task from a million-item catalogue. Keep candidate construction identical across candidates and report the difference.

A held-out click is evidence about a shown item. Treating an unshown item as irrelevant can penalize useful discoveries. Conversely, a high score on recorded positives can reward agreement with the old policy.

## 3. Report paired evidence and slices

Compare systems on the same evaluation units. Define metric cutoff, gain, denominator, tie handling, and aggregation. A user with 100 requests otherwise contributes much more than one with a single request.

A **bootstrap** repeatedly resamples units to estimate variability. Resample users or appropriate blocks when requests are dependent; independent row resampling can understate uncertainty.

Report a credible baseline and cold-user, new-item, surface, and other important slices with counts. Inspect failure cases as well as aggregate scores.

## 4. Treat policy-value claims separately

An offline improvement may fail to transfer because of exposure bias, a changed population, serving mismatches, a small uncertain gain, or a metric that does not represent the product goal.

**Off-policy evaluation** uses additional assumptions and action probabilities to estimate a different policy's outcomes. A suitable randomized experiment provides another form of evidence about deployed effects.

> **Mental image:** an offline test replays recorded evidence. It cannot directly reveal the outcome of an item choice that was never observed.
