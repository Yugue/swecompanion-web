## Offline evaluation and its limits

## 1. Test recorded evidence

**Offline evaluation** assesses a model or policy using existing data rather than deploying the decisions being tested.

Its meaning depends on which examples, outcomes, and candidates were recorded.

## 2. Match the future decision

```rrp-visual
temporal-evaluation
```

For future recommendations, fit on earlier available data and assess later requests. Reconstruct historical inventory and inputs.

Keep a final period outside development choices; allow labels to mature. Holding out entire users instead answers a new-user question.

## 3. Name the layer under test

| Test | Measures | Does not establish |
|---|---|---|
| Reorder a fixed pool | Ordering within it | Recovery of absent items |
| Retrieve from inventory | Recovery of reference positives | Every unseen preference |
| Score logged impressions | Prediction under recorded exposure | Value of a new display policy |

## 4. Fix the competition

A positive among 99 easy distractors is not the same task as a million-item catalogue.

Keep candidate construction identical across compared models. State eligibility, labels, cutoff, and aggregation rather than reporting a metric alone.

## 5. Estimate uncertainty at the right unit

A **bootstrap** repeatedly resamples evaluation units to estimate variability.

Resample users or suitable time blocks when requests are dependent. Treating their rows as independent can understate uncertainty.

Compare paired differences on the same units and inspect important slices with counts.

## 6. Limit the conclusion

A held-out click supplies evidence for an exposed item. An unshown item has no logged outcome; assigning it irrelevance can penalize useful discovery.

Off-policy evaluation and online experiments address different policy-effect questions in the following chapters.

## 7. Interview reasoning

**Question:** Why can better offline NDCG fail to improve the product?

**Answer:** The test may miss new exposure effects, use unsuitable labels or candidates, or differ from serving. Trace those assumptions before choosing a larger model.
