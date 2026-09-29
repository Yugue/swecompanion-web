## Online testing

**The only measurement that settles the question is running both systems on real traffic.** An **A/B test** randomly assigns users to a control version (A) or a candidate version (B) and compares their outcomes. Everything offline is preparation for this.

---

## 1. Randomize by user, not by request

```text
✗  by request:  the same person sees the old ranker, then the new one,
                then the old one again. Their behavior mixes both.

✓  by user:     a person is assigned once and stays assigned.
```

### Common issue

Request-level randomization contaminates the comparison and makes an inconsistent product. For many personalized products with learning or habit effects, user-level assignment is a useful starting point - and it must be sticky across sessions and devices where possible.

---

## 2. How long is long enough

The same experiment, read at three moments:

```text
             treatment    control    lift     what you would conclude
day 2          +7.1%                 +7.1%    "ship it immediately"
week 1         +3.4%                 +3.4%    "a solid win"
week 3         +0.4%                 +0.4%    "inside the noise"
week 6         −1.2%                 −1.2%    "this is worse"
```

Nothing changed except elapsed time. The early lift is people poking at something that looks different, and it decays. By week six the real effect - slightly negative - is visible.

Reading this at day 2 and shipping is one of the most common ways a recommender gets worse while every dashboard says it improved.

```text
duration should cover: required sample size, relevant usage cycles,
                       label maturity, and plausible novelty/carryover effects
```

And the reverse case is just as real: a change people dislike at first can show a false negative in week one and be fine by week four.

---

## 3. Plan sample size and stopping before launch

The **minimum detectable effect** is the smallest improvement the experiment is designed to detect. **Power** is its chance of detecting an effect that size. Smaller effects or noisier user outcomes require more traffic or time.

Choose an analysis horizon or a valid sequential testing procedure in advance. Repeatedly checking ordinary significance tests and stopping at the first positive result inflates false positives.

---

## 4. Decide the metrics before you start

```text
primary metric      the one thing that decides ship / no ship
guardrail metrics   things you refuse to lose, whatever the primary does
                    → complaints, latency, catalogue coverage, seller diversity
```

### Rule of thumb

> "Clicks up 3%, time spent down 5%" has no answer unless you decided beforehand which one wins.

Pre-registering this is what turns a launch decision from an argument into a rule. It is also the single most common thing missing from an interview answer here.

---

## 5. Account for shared inventory and spillovers

User randomization works best when one user's treatment does not change another user's outcome. Limited stock, shared seller incentives, or marketplace congestion can violate this assumption.

Consider cluster assignment or **switchback tests**, which alternate policies over time blocks, when appropriate. These need their own power analysis and controls for time effects and carryover; they are not automatic fixes.

---

## 6. Interleaving, when you are only comparing rankings

Instead of splitting users, mix the two rankers' results into one list and see which side's items get clicked.

```text
ranker A:  a1 a2 a3 ...        interleaved:  a1 b1 a2 b2 b3 a3 ...
ranker B:  b1 b2 b3 ...                      → which side's items win clicks?
```

```text
+  far more sensitive - each user compares both directly, cancelling personal variation
+  needs much less traffic and much less time
−  only compares ORDERINGS; cannot measure retention, revenue, or any system-level effect
```

### Rule of thumb

The usual pattern is interleaving to triage many ranker candidates quickly, then a proper A/B test on the winner for the business metrics.

---

## 7. Things that quietly invalidate the test

| Problem | Symptom |
|---|---|
| Sample ratio mismatch | observed assignment significantly differs from the planned ratio; investigate |
| Network effects | users interact, so treatment leaks into control |
| Marketplace interference | both arms compete for the same finite inventory |
| Peeking | checking daily until it is significant, then stopping |
| Too many metrics | with twenty metrics, one is "significant" by chance |

### Common issue

The marketplace row is specific to this domain and easy to miss: if the new ranker promotes an item, that item's stock or attention is no longer available to the control arm, so the arms are not independent.

---

## 8. Interpret relative lift and uncertainty

If control CTR is 4.0% and treatment CTR is 4.2%, the increase is 0.2 percentage points, or 5% relative—not 5 percentage points.

Read the confidence interval alongside that lift. If the interval includes both a meaningful loss and a meaningful gain, the result is inconclusive; a positive point estimate alone does not justify launch.

---

## What matters most

- **Randomize by user and keep the assignment sticky,** or you contaminate the comparison and the product.
- **Run past the novelty effect,** which can distort early results for a visible change.
- **Pre-register the primary metric and the guardrails,** so a mixed result has a decision rule rather than an argument.
- **Interleaving is far more sensitive and only compares orderings** - use it to triage, then A/B test the winner.
- **Watch for sample ratio mismatch, peeking, and marketplace interference,** where the two arms compete for the same inventory.

Next topic is **Diversity, novelty, and coverage**.
