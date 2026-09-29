## Estimating what a new policy would have done

**The question offline evaluation really wants to answer is counterfactual: what would have happened if we had shown a different list?**

```text
what you logged:   we showed list A → the user clicked item 3
what you want:     if we had shown list B → would they have clicked?
                                              ↑ never observed
```

There is a way to estimate this from logged data, and it has one hard prerequisite.

---

## 1. The idea: re-weight what you did observe

If the old system showed an item with probability 0.1, and the new system would show it with probability 0.5, then each observed outcome for that item counts for five times as much.

\[
\hat V(\text{new}) = \frac{1}{n}\sum_i \frac{\pi_{\text{new}}(a_i \mid x_i)}{\pi_{\text{old}}(a_i \mid x_i)} \; r_i
\]

```text
old showed it often, new would too      → weight ≈ 1   → counts normally
old rarely showed it, new would a lot   → weight  5    → counts heavily
old showed it, new never would          → weight ≈ 0   → ignored
```

### Core intuition

Here n is the number of logged decisions, x_i the request context, a_i the chosen action, r_i its reward, and π the policy's probability of choosing that action. This **inverse propensity scoring (IPS)** estimate is unbiased under correct logging probabilities, adequate support, and the required stable-outcome assumptions.

---

## 2. Work through one importance weight

Suppose the old policy selected item A with probability 0.2 for a given context, while the candidate policy would select A with probability 0.5. A logged reward of 1 contributes `0.5 / 0.2 × 1 = 2.5` before averaging over all logged requests.

A contribution above 1 is a reweighting term, not a predicted click probability. A few such large terms can dominate the estimate, which is why overlap and uncertainty must be checked.

---

## 3. The prerequisite that stops most teams

You need \(\pi_{\text{old}}\) - **the probability the old system showed each item**. That has to be logged at serving time, by the system that made the choice.

```text
logged:      the slate, the scores, the outcome
NOT logged:  the probability each item was selected      ← without this, nothing works
```

---

## 4. Support: the old policy must sometimes choose the new policy's actions

**Support**, or overlap, means that every action the new policy might choose for a context had a nonzero chance under the logging policy. A deterministic top-6 policy has probabilities of 1 for its chosen slate and 0 for other slates. Outcomes for those alternatives are not identifiable by IPS.

This does not require exploring every possible item combination. It requires evaluating policies within the action space where the logger provides adequate coverage; otherwise gather suitable data or narrow the claim.

### Rule of thumb

> Counterfactual evaluation is a decision you make *before* you need it. Log propensities now, or the option does not exist next quarter.

---

## 5. The practical problem: variance

```text
an action the old policy took with probability 0.001
        ↓
weight = 1000
        ↓
one lucky click dominates the entire estimate
```

Unbiased in expectation, unusable in practice. Standard mitigations:

```text
clipping        cap the weight at, say, 10     → biased, far lower variance
self-normalizing divide by the sum of weights   → biased, better behaved
doubly robust   combine with a reward model     → robust if either part is right
```

### Common issue

Clipping and self-normalization can reduce variance at the cost of bias. Doubly robust estimation instead adds an outcome model; it need not introduce bias when its consistency assumptions hold.

---

## 6. Define the action at the same level as the reward

An action may be one item in one slot, or an entire ordered slate. A per-item selection probability is not automatically the probability of the whole slate.

If interactions between displayed items affect reward, use a slate-aware model or state the simplifying assumptions. Logging only final item IDs and positions is not enough to recover probabilities of arbitrary alternative lists.

---

## 7. Read doubly robust estimates as two sources of evidence

A **reward model** predicts the outcome for an action and context. A **doubly robust estimator** combines that prediction with a propensity-weighted correction based on observed residuals.

Under the required assumptions, it can remain consistent if either the reward model or the propensity model is correct. It still needs overlap: neither model makes unobserved actions magically identifiable.

---

## 8. Where it actually helps

```text
✓  pre-screening candidates for the randomized A/B-test queue, which is always oversubscribed
✓  estimating a policy too risky to run live
✓  reusing one experiment's logs to evaluate several new policies
✗  replacing an A/B test, which randomly compares a control system (A) with a candidate (B)
✗  any policy very different from the one that generated the logs
```

### Rule of thumb

That last exclusion is the binding one. The estimate is only trustworthy where the old policy had some chance of doing what the new one would do.

---

## 9. What to build

```text
at serving time, log:
   the candidate slate
   the scores
   the SELECTION PROBABILITY of the chosen action (item/slot or slate)
   the outcome
   the model and feature versions

and introduce a little randomization,
to provide support for the eligible actions your target policies may choose
```

That small amount of randomization has three benefits: it supports counterfactual evaluation, makes position effects measurable, and collects evidence about new or uncertain items.

---

## What matters most

- **The question is counterfactual:** what would a different list have earned, which is never in the logs.
- **Re-weighting logged outcomes by the ratio of new to old selection probability** gives an unbiased estimate in principle.
- **It requires logging the probability each item was shown,** which must be decided before you need it.
- **Actions outside logging support cannot be evaluated with IPS.** A deterministic logger only supports its own chosen actions.
- **Variance is the practical killer,** so estimates are clipped or self-normalized - trading bias for usability on purpose.
- **It screens candidates for the A/B queue; it does not replace the test.**

Next topic is **Online testing**.
