## Exploration

**Exploration** deliberately varies eligible actions to gather information about uncertain alternatives. **Exploitation** chooses what currently appears best for the defined outcome.

The tradeoff is immediate utility versus information that can improve later decisions.

## 1. A lower estimate can still deserve investigation

```rrp-visual
exploration-uncertainty
```

Item A has 2,500 clicks from 50,000 impressions; B has three from 100. Their observed rates are 5% and 3%, but B is far less precisely estimated.

The figure's intervals assume independent click/no-click trials (Bernoulli observations). Unequal audiences or positions can make these rates incomparable; uncertainty bars do not themselves remove exposure bias.

## 2. Three ways to allocate exploration

| Method | Mechanism | Main requirement |
|---|---|---|
| Epsilon-greedy | Mix a greedy action with a randomized choice | Define the eligible exploration distribution |
| Upper-confidence method | Add a justified uncertainty bonus to an estimate | Credible assumptions and uncertainty model |
| Thompson sampling | Sample a plausible reward model and choose its preferred action | A suitable posterior or approximation |

A **contextual bandit** chooses actions using context and observes reward for chosen actions. Unlike a general long-horizon reinforcement learner, its usual formulation does not model actions changing future states.

Some products need more than immediate bandit reward: recommendations can affect later interests or supplier behavior.

## 3. Log the actual mixture probability

Suppose two eligible items A and B exist, A is the unique greedy choice, and 10% of decisions choose uniformly at random:

```text
P(A) = 0.90 + 0.10/2 = 0.95
P(B) =        0.10/2 = 0.05
```

The exploration budget of 0.10 is neither item's final action probability. Log the actual policy probability after filtering, mixture rules, and tie handling.

For complex slate policies or posterior sampling, obtaining the required exact probabilities may be harder. Plan the evaluation and logging design together.

## 4. Measure information and cost

Explore only within the allowed action set and stated exposure limits. Relevant contexts can produce more useful evidence than arbitrary audiences, but can also restrict the overlap available for later policy evaluation.

A lower slot may reduce disruption and also reduce examination, slowing learning. Track evidence collected, subsequent useful discovery, satisfied engagement, and complaints, not exploration CTR alone.

> **Mental image:** exploration purchases a measurement. Choose where the measurement is informative and what short-term cost is acceptable.
