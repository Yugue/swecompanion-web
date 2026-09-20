## Position bias

**Items at the top get clicked partly because they are at the top.** So a click is not evidence of relevance alone - it is evidence of relevance *and* of having been placed somewhere visible.

```text
same item, same user, different slot:
   position 1   →  8% click rate
   position 5   →  3%
   position 10  →  1%
```

Nothing about the item changed.

### 1. Why it corrupts training

```text
old ranker puts item A at position 1
        ↓
item A gets clicked a lot
        ↓
the new model learns "item A is great"
        ↓
it puts item A at position 1
```

The model learns to reproduce the old ranker's placement decisions and calls it relevance. Left uncorrected, this is one of the main reasons a new model cannot outperform the one that generated its training data.

---

### 2. The standard model of what happens

Separate *being looked at* from *being wanted*:

\[
P(\text{click}) \;=\; P(\text{examined} \mid \text{position}) \times P(\text{relevant} \mid \text{user}, \text{item})
\]

```text
examined   depends on position (and layout, device, how far they scrolled)
relevant   depends on the user and the item  ← the only part you want to learn
```

If you can estimate the first term, you can divide it out and recover the second. That is the whole idea behind the corrections below.

---

### 3. Estimating the position effect

| Method | How | Cost |
|---|---|---|
| Randomization | occasionally shuffle the top k and compare click rates by slot | cleanest, costs a little engagement |
| Swap experiments | sometimes swap two adjacent positions | cheaper, less disruptive |
| Intervention harvesting | find the same item shown at different ranks naturally | free, and confounded |
| Model it jointly | learn examination and relevance together | no traffic cost, relies on assumptions |

Some randomization is what makes the estimate trustworthy. This is another reason exploration (Chapter 6) earns its keep beyond cold start.

### Rule of thumb

> You cannot separate position from relevance using data where position was never varied.

---

### 4. Correcting for it

**Weight each example** by how likely it was to be examined - an example from position 10 counts for more than one from position 1, because it survived a harder test:

\[
\text{weight}_i = \frac{1}{P(\text{examined} \mid \text{position}_i)}
\]

**Or include position as a feature**, as in Chapter 4: train with the real position so the model can attribute part of the click to it, then serve with position fixed to a constant so every candidate is scored as if it were at the top.

The second is simpler and very widely used. The first is more principled and connects directly to the next lesson.

---

### 5. It is not only vertical position

```text
above the fold vs below         a scroll is a bigger barrier than a slot
left vs right                   in a grid layout
image size                      bigger tiles draw more attention
device                          a phone shows two items, a TV shows twenty
```

"Position" means "how likely was this to be seen", and that depends on the whole layout. A correction fitted on desktop and applied to mobile will be wrong.

---

## What matters most

- **A click confounds relevance with placement,** so uncorrected click training teaches the model to reproduce the old ranker.
- **The standard decomposition splits examination from relevance,** and only the second is worth learning.
- **Estimating the examination term needs some randomization,** or the same item observed at different ranks.
- **Two corrections:** weight examples by inverse examination probability, or include position as a feature and fix it at serving.
- **Position means visibility,** so it depends on layout and device - one correction does not transfer across surfaces.

Next topic is **Estimating what a new policy would have done**.
