## Online testing

**The only measurement that settles the question is running both systems on real traffic.** Everything offline is preparation for this.

---

## 1. Randomize by user, not by request

```text
✗  by request:  the same person sees the old ranker, then the new one,
                then the old one again. Their behavior mixes both.

✓  by user:     a person is assigned once and stays assigned.
```

### Common issue

Request-level randomization contaminates the comparison and makes an inconsistent product. For anything with a learning or habit effect, user-level assignment is the only valid unit - and it must be sticky across sessions and devices where possible.

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
minimum duration = novelty decay + at least one full weekly cycle
                 ≈ two to three weeks for most consumer surfaces
```

And the reverse case is just as real: a change people dislike at first can show a false negative in week one and be fine by week four.

---

## 3. Outlast the novelty effect

```text
engagement
   │    ╱╲
   │   ╱  ╲___________     ← the real effect
   │  ╱
   │ ╱  ← "it changed, so people poke at it"
   └──────────────────── time
       week 1    week 2-3
```

Any visible change lifts engagement briefly just by being different. Reading the result in week one systematically overstates it. Run long enough to cover weekly cycles and let the novelty decay - and expect the same effect in reverse for changes people initially dislike.

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

## 5. Interleaving, when you are only comparing rankings

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

## 6. Things that quietly invalidate the test

| Problem | Symptom |
|---|---|
| Sample ratio mismatch | the split is not 50/50 - assignment is broken, stop and fix |
| Network effects | users interact, so treatment leaks into control |
| Marketplace interference | both arms compete for the same finite inventory |
| Peeking | checking daily until it is significant, then stopping |
| Too many metrics | with twenty metrics, one is "significant" by chance |

### Common issue

The marketplace row is specific to this domain and easy to miss: if the new ranker promotes an item, that item's stock or attention is no longer available to the control arm, so the arms are not independent.

---

## What matters most

- **Randomize by user and keep the assignment sticky,** or you contaminate the comparison and the product.
- **Run past the novelty effect,** which inflates week-one results for any visible change.
- **Pre-register the primary metric and the guardrails,** so a mixed result has a decision rule rather than an argument.
- **Interleaving is far more sensitive and only compares orderings** - use it to triage, then A/B test the winner.
- **Watch for sample ratio mismatch, peeking, and marketplace interference,** where the two arms compete for the same inventory.

Next topic is **Diversity, novelty, and coverage**.
