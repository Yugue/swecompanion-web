## Position bias

**Items at the top get clicked partly because they are at the top.** So a click is not evidence of relevance alone - it is evidence of relevance *and* of having been placed somewhere visible.

```text
same item, same user, different slot:
   position 1   →  8% click rate
   position 5   →  3%
   position 10  →  1%
```

Nothing about the item changed.

---

## 1. Why it corrupts training

```text
old ranker puts item A at position 1
        ↓
item A gets clicked a lot
        ↓
the new model learns "item A is great"
        ↓
it puts item A at position 1
```

### Core intuition

The model learns to reproduce the old ranker's placement decisions and calls it relevance. Left uncorrected, this is one of the main reasons a new model cannot outperform the one that generated its training data.

---

## 2. Compare positions without confusing clicks with visibility

Suppose a randomized swap experiment estimates **relative examination** at position 5 to be half that at position 1. Set the reference multipliers to e₁=1 and e₅=0.5; these are relative effects, not directly observed absolute examination probabilities.

```text
item       position   observed CTR   relative examination   adjusted score
A             1           6%                1                  6% / 1 = 6%
B             5           4%               0.5                 4% / 0.5 = 8%
```

Under the examination model, B's adjusted evidence is stronger, despite its lower raw click rate. The adjustment puts both items on a reference-position scale; it does not prove either item's absolute relevance probability.

Estimate position effects from comparable items and audiences with adequate observations. Dividing by the raw click rate of an unrelated item would confuse relevance with examination.

---

## 3. The standard model of what happens

Separate *being looked at* from *being wanted*:

\[
P(\text{click}) \;=\; P(\text{examined} \mid \text{position}) \times P(\text{relevant} \mid \text{user}, \text{item})
\]

```text
examined   depends on position (and layout, device, how far they scrolled)
relevant   depends on the user and the item  ← the only part you want to learn
```

If the model's assumptions hold and the examination term is identified, correction can recover relevance on the appropriate scale. Often an experiment identifies only relative examination effects.

---

## 4. Know the limits of the examination model

The product decomposition assumes that position changes examination, not the item's underlying relevance. Users may also trust top-ranked items more, and one item may change whether they inspect the next.

These **trust** and **interaction** effects violate the simple model. Validate corrections with randomized swaps and relevant device/layout slices instead of treating the formula as a universal causal explanation.

---

## 5. Estimating the position effect

| Method | How | Cost |
|---|---|---|
| Randomization | occasionally shuffle the top k and compare click rates by slot | cleanest, costs a little engagement |
| Swap experiments | sometimes swap two adjacent positions | cheaper, less disruptive |
| Intervention harvesting | find the same item shown at different ranks naturally | free, and confounded |
| Model it jointly | learn examination and relevance together | no traffic cost, relies on assumptions |

Some randomization makes the estimate trustworthy. This is another benefit of **exploration**, which deliberately varies what is shown to collect less biased evidence.

### Rule of thumb

> You cannot separate position from relevance using data where position was never varied.

---

## 6. Correcting for it

One approach uses a **bias-aware learning objective** that weights observed clicks by inverse examination probability, so an observed click from a rarely examined slot receives more weight. This requires an appropriate click model; it is not a recipe to weight every non-click as confirmed dislike.

Another approach includes observed position in a click model, then fixes it to the same reference position for every candidate when scoring. This is simpler but relies on the model separating position from relevance rather than using correlated placement as a shortcut.

Validate either correction using interventions and surface-specific checks. Correcting examination bias is related to—but distinct from—reweighting actions for off-policy evaluation.

---

## 7. Keep weighting assumptions and variance visible

In a bias-aware click objective, clicked observations can be weighted by inverse examination propensity. This does not mean every unclicked low-position item becomes a strong negative.

Small estimated propensities create large weights and noisy estimates. Inspect weight distributions, apply documented clipping if necessary, and report the resulting bias–variance trade-off. Examination probability is also distinct from the probability a logging policy chose an action.

---

## 8. It is not only vertical position

```text
above the fold vs below         a scroll is a bigger barrier than a slot
left vs right                   in a grid layout
image size                      bigger tiles draw more attention
device                          a phone shows two items, a TV shows twenty
```

### Common issue

"Position" means "how likely was this to be seen", and that depends on the whole layout. A correction fitted on desktop and applied to mobile will be wrong.

---

## What matters most

- **A click confounds relevance with placement,** so uncorrected click training teaches the model to reproduce the old ranker.
- **The standard decomposition splits examination from relevance,** and only the second is worth learning.
- **Estimating the examination term needs some randomization,** or the same item observed at different ranks.
- **Two approaches:** a bias-aware click objective using examination weights, or a position-aware model scored at a fixed reference position. Both require validated assumptions.
- **Position means visibility,** so it depends on layout and device - one correction does not transfer across surfaces.

Next topic is **Estimating what a new policy would have done**.
