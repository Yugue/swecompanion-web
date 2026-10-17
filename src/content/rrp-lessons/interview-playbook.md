## Answering RRP questions

A clear explanation defines the concept, names its stage, demonstrates the mechanism with numbers, and states its limits. Clarify an ambiguous surface or constraint; answer direct definition questions directly.

## 1. Use a compact answer structure

```text
define → locate the stage → work an example → state the tradeoff
```

For a design question, first establish the action, row, target, timing, and constraints. A label window influences data maturity, but does not by itself determine the entire retraining schedule or metric.

## 2. A complete example: two-tower retrieval

> “A two-tower model computes a request vector and an item vector separately, then scores their compatibility with a cheap operation such as a dot product. Because the item encoder is independent of the current request, we can precompute item vectors and search an index. With request vector [1, 2] and item vector [2, 1], the score is 4. That is compatibility, not automatically a click probability. The restriction makes arbitrary candidate-specific lookups difficult, so I would use a later joint ranker if those features add enough value.”

This answers the architecture's purpose, calculation, and practical tradeoff without listing unrelated models.

## 3. Explain measured improvements precisely

| Loose claim | More informative statement |
|---|---|
| “Recall is 0.31.” | “Recall@100 is 0.31 versus 0.29 on the same eligible requests, with this reference-positive definition.” |
| “It is calibrated.” | “Predicted rates agree with observed frequencies on the evaluated bands and slices, within uncertainty.” |
| “New items need retraining.” | “Check whether this feature-based encoder can represent them and whether the index includes them.” |
| “A/B testing always randomizes users.” | “Choose an experimental unit that matches carryover and interference.” |

A score gain alone is not proof that personalization caused product value. State what changed between systems and what evaluation supports.

## 4. Answer follow-ups with evidence

For ten times the traffic, recompute scores and feature work, then identify a measured bottleneck and one intervention with its quality cost.

For offline gains without live gains, separate biased labels, candidate differences, uncertainty, metric mismatch, and serving behavior. Choose checks that distinguish them rather than proposing every architecture again.

When uncertain, name the known mechanism, the assumption, and the evidence that would resolve the gap. Stop when the concept is covered and use the follow-up to choose the next level of detail.
