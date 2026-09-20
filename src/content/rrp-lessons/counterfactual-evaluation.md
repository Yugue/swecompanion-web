## Estimating what a new policy would have done

**The question offline evaluation really wants to answer is counterfactual: what would have happened if we had shown a different list?**

```text
what you logged:   we showed list A → the user clicked item 3
what you want:     if we had shown list B → would they have clicked?
                                              ↑ never observed
```

There is a way to estimate this from logged data, and it has one hard prerequisite.

### 1. The idea: re-weight what you did observe

If the old system showed an item with probability 0.1, and the new system would show it with probability 0.5, then each observed outcome for that item counts for five times as much.

\[
\hat V(\text{new}) = \frac{1}{n}\sum_i \frac{\pi_{\text{new}}(a_i \mid x_i)}{\pi_{\text{old}}(a_i \mid x_i)} \; r_i
\]

```text
old showed it often, new would too      → weight ≈ 1   → counts normally
old rarely showed it, new would a lot   → weight  5    → counts heavily
old showed it, new never would          → weight ≈ 0   → ignored
```

In principle this is unbiased: it reconstructs what the new policy would have earned, from data the old policy generated.

---

### 2. The prerequisite that stops most teams

You need \(\pi_{\text{old}}\) - **the probability the old system showed each item**. That has to be logged at serving time, by the system that made the choice.

```text
logged:      the slate, the scores, the outcome
NOT logged:  the probability each item was selected      ← without this, nothing works
```

A deterministic ranker - always show the top 6 - has probabilities of exactly 1 and 0, and the method collapses: anything the old system would never show has a zero in the denominator, so you can estimate nothing about it.

### Rule of thumb

> Counterfactual evaluation is a decision you make *before* you need it. Log propensities now, or the option does not exist next quarter.

---

### 3. The practical problem: variance

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

All of them trade bias for variance deliberately. That trade is the subject, and saying so is the sophisticated version of this answer.

---

### 4. Where it actually helps

```text
✓  pre-screening candidates for the A/B queue, which is always oversubscribed
✓  estimating a policy too risky to run live
✓  reusing one experiment's logs to evaluate several new policies
✗  replacing an A/B test
✗  any policy very different from the one that generated the logs
```

That last exclusion is the binding one. The estimate is only trustworthy where the old policy had some chance of doing what the new one would do.

---

### 5. What to build

```text
at serving time, log:
   the candidate slate
   the scores
   the SELECTION PROBABILITY for each shown item
   the outcome
   the model and feature versions

and introduce a little randomization,
so no action has probability exactly zero
```

That small amount of randomization is doing double duty - it is also what makes position bias estimable in the last lesson, and what gathers data on new items in Chapter 6. One mechanism, three payoffs.

---

## What matters most

- **The question is counterfactual:** what would a different list have earned, which is never in the logs.
- **Re-weighting logged outcomes by the ratio of new to old selection probability** gives an unbiased estimate in principle.
- **It requires logging the probability each item was shown,** which must be decided before you need it.
- **A fully deterministic ranker makes it impossible,** because unshown actions have probability zero.
- **Variance is the practical killer,** so estimates are clipped or self-normalized - trading bias for usability on purpose.
- **It screens candidates for the A/B queue; it does not replace the test.**

Next topic is **Online testing**.
