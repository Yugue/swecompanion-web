## Baselines worth beating

## 1. Measure what complexity buys

A **baseline** is a reference method tested under the same conditions as a proposed system.

> Compare the next rung of the ladder, not only the height above the floor.

## 2. Start with useful simple rules

| Baseline | Mechanism | Limitation |
|---|---|---|
| Popularity | Most engaged-with eligible items | Exposure and age affect counts |
| Contextual popularity | Popular within a region or category | Small groups are noisy |
| Recency | Newest items | New need not mean useful |
| Personal history | Resume or replenish | May not support discovery |

The current production policy is another essential reference.

## 3. Add a stronger comparison

**Co-occurrence** is shared consumption within a stated unit, such as a user or session. It can suggest items often used with a recent history item.

History plus co-occurrence may beat popularity before any learned retrieval model is added.

## 4. Read the gain correctly

```text
contextual popularity       recall@100 = 0.24
history + co-occurrence                   0.29
learned retrieval                        0.31
```

The learned model gains **two percentage points** over the stronger simple method. Comparing only with 0.24 exaggerates the added value.

## 5. Hold the test conditions fixed

Use the same requests, eligibility, cutoff, duplicate rules, and label window.

Build popularity using evidence available before each test decision. Tomorrow's clicks would leak future information into the reference.

## 6. Include operational value

Check uncertainty, important user groups, latency, and maintenance. A small reliable gain can matter at scale.

A cached reference can also serve during an outage, with current eligibility checks and an expiration rule.

## 7. Interview reasoning

**Question:** Is a two-point recall gain worth deploying?

**Answer:** Compare against the strongest relevant baseline, estimate uncertainty, and weigh useful outcomes against serving and maintenance costs. The size alone cannot decide.
