## Estimating what a new policy would have done

**Off-policy evaluation** estimates a target policy's outcome using decisions logged by another policy. A **policy** assigns action probabilities given context; an action can be an item choice or an ordered slate.

The counterfactual question is what would happen under the target policy, not merely whether its scores resemble the log.

## 1. Reweight observed decisions

**Inverse propensity scoring (IPS)** gives observations more weight when the target policy would choose them more often than the logging policy did:

\[
\hat V(\pi)=\frac1n\sum_{t=1}^{n}\frac{\pi(a_t\mid x_t)}{\mu(a_t\mid x_t)}r_t
\]

\(x_t\) is context, \(a_t\) the logged action, \(r_t\) its reward, \(\mu\) the logging policy, and \(\pi\) the target. The denominator is the action's **propensity**, its selection probability under the logger.

```rrp-visual
ips-support
```

A weight or individual contribution above 1 is not a predicted probability. The estimator itself can fall outside the reward's range in a finite sample.

## 2. Check support and the action definition

**Support**, or overlap, requires nonzero logging probability wherever the target puts probability, for relevant contexts. A deterministic logger cannot provide IPS evidence for actions it never chose in those contexts.

Use known or justified estimated action probabilities, comparable context populations, correctly measured rewards, and the required outcome-stability and assignment assumptions. A relevance score is not a selection propensity.

An item's marginal inclusion probability is not automatically the probability of an ordered slate. If items interact, evaluating whole-list reward needs a compatible slate treatment or explicit simplifying assumptions.

## 3. Inspect variance and alternatives

Rare logged actions can receive huge weights. Inspect their distribution, effective evidence, and uncertainty before trusting a mean.

**Clipped IPS** caps weights, trading bias for variance. **Self-normalized IPS** divides weighted rewards by the sum of weights and is generally biased in finite samples. Neither creates missing support.

A **doubly robust estimator** combines a reward-model prediction with a propensity-weighted correction of its observed errors. Under suitable conditions it remains consistent if either the reward model or the propensity model is correct, but still requires the relevant support and outcome assumptions.

## 4. Build the evidence before needing it

Log context, eligible action definition, chosen action, actual selection probability, reward timing, and policy version. Randomized exploration can supply useful coverage when designed for the policies to be evaluated.

Use off-policy estimates to screen and compare policies within the evidence's scope. They can answer some evaluation questions without a new experiment; they are not a universal substitute for live evidence or long-run effects.
