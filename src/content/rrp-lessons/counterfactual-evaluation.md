## Estimating what a new policy would have done

## 1. Ask about another policy

**Off-policy evaluation** estimates a target policy's outcomes using decisions logged by a different policy.

It asks what the new selection rule would achieve, rather than how closely its scores resemble old labels.

## 2. Reweight observed rewards

**Inverse propensity scoring (IPS)** weights an action more when the target would choose it more often:

\[
\hat V(\pi)=\frac1n\sum_{t=1}^{n}\frac{\pi(a_t\mid x_t)}{\mu(a_t\mid x_t)}r_t
\]

\(n\): logged decisions; \(t\): decision index; \(x_t\): context; \(a_t\): action; \(r_t\): reward; \(\mu\): logging probabilities; \(\pi\): target probabilities; \(\hat V\): estimated target value.

The denominator is selection propensity, not an item's predicted CTR.

## 3. Work one finite sample

```rrp-visual
ips-support
```

Weights can exceed 1. The estimate can even fall outside the reward range in a finite sample; it is not a predicted event probability.

## 4. Require support

**Support**, or overlap, requires positive logging probability wherever the target can choose, for the relevant contexts.

A logger that never chose C cannot supply ordinary IPS evidence for a target choosing C there.

Accurate action probabilities, comparable contexts, and stable reward definitions are also required. Hidden assignment differences can invalidate the comparison.

## 5. Define the action precisely

An item's inclusion probability is not an ordered slate's probability. List interactions require an appropriate slate treatment or explicit simplifications.

Log the probability of the actual action being evaluated.

## 6. Inspect unstable weights

**Clipped IPS** caps weights, trading bias for variance. **Self-normalized IPS** divides weighted rewards by total weights and is generally biased in finite samples.

Neither creates missing support. Use uncertainty estimates and inspect rare large contributions.

## 7. Interview reasoning

**Question:** Can a reward model invent the missing observations needed for IPS?

**Answer:** It can supply model-based extrapolation, but it does not create logged overlap. State the additional assumptions rather than claiming unsupported IPS evidence.
