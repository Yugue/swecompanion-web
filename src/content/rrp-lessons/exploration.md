## Exploration

## 1. Buy information about alternatives

**Exploration** was introduced as deliberate variation to gather evidence. **Exploitation** chooses the currently best estimated action.

The tradeoff is immediate utility versus information useful for later choices.

## 2. Inspect uncertainty, not just the estimate

```rrp-visual
exploration-uncertainty
```

A **Wilson interval** gives a range estimating an event rate from independent click/no-click trials. Its confidence level describes the interval procedure’s approximate coverage across repeated samples.

The wider interval for the less-shown item does not prove it is better; unequal audiences or positions can still bias the comparison.

## 3. Compare allocation methods

| Method | Mechanism |
|---|---|
| Epsilon-greedy | Mix the best estimate with randomized choices |
| Upper-confidence method | Add a justified uncertainty bonus |
| Thompson sampling | Sample a plausible reward model, then choose its best action |

**Thompson sampling** uses a posterior distribution, an updated uncertainty distribution after observations, or an approximation to it.

## 4. Use context when it is informative

A **contextual bandit** chooses using context and observes reward for the chosen action. Its usual formulation does not model actions changing future states.

Long-term interest changes or provider responses can require a broader treatment than immediate bandit reward.

## 5. Log the final mixture probability

A is uniquely best; 10% of decisions choose uniformly between A and B:

```text
P(A) = 0.90 + 0.10/2 = 0.95
P(B) =        0.10/2 = 0.05
```

The 10% budget is neither action's final selection probability. Filtering and ties also affect that probability.

## 6. Measure the purchase of information

Explore within the allowed set and exposure limits. Track evidence collected, later useful discovery, and outcome cost.

Low placement can reduce disruption but also examination. A fresh-item slot alone is not proof of an informative experiment.

## 7. Interview reasoning

**Question:** Why not log 0.10 as B's propensity in this example?

**Answer:** B receives only half the exploration branch and none of the greedy branch. Its actual action probability is 0.05.
