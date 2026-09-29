## Factorization for implicit feedback

**A click-only interaction table contains observed positives and uncertain missing entries.** Explicit hides or dislikes, if available, are additional evidence; they are not equivalent to ordinary missing clicks.

```text
ratings:   1★ 2★ 3★ 4★ 5★     positives AND negatives, both observed
clicks:    ✓  ✓  ✓            positives only; everything else is a blank
```

---

## 1. Why the obvious approaches both fail

One user, five items. They watched two:

```text
item        watched?    "treat blanks as 0"      "ignore blanks"
  A            ✓            target 1                target 1
  B            ✓            target 1                target 1
  C            ·            target 0   ← claims      (not in the loss at all)
  D            ·            target 0      they        (not in the loss)
  E            ·            target 0      disliked    (not in the loss)
                                          these
```

**Blanks as zeros.** The user has seen maybe 40 of a 10-million catalogue. You have just asserted 9,999,958 rejections they never made. The model dutifully learns that almost everything is bad, and the items it is most confident are bad are the ones nobody has got around to showing yet - which is the unpopular tail.

**Ignore blanks.** Now every target in the loss is 1. There is nothing to push down, so the model's best solution is to score everything highly. It has learned that things people watch are things people watch.

The two fixes take opposite routes out of that, and both are honest about what a blank means:

```text
weighted     keep the blanks, but say you are not sure about them
pairwise     score both items, but train on the gap: A should rank above C
```

---

## 2. Route one: weighted, with confidence

Treat all cells as observed, but say how much you trust each one.

```text
interacted     →  target 1,  HIGH confidence
not interacted →  target 0,  LOW  confidence
```

\[
\text{loss} = \sum_{u,i} c_{ui}\big(x_{ui} - \mathbf{p}_u \cdot \mathbf{q}_i\big)^2 + \lambda(\lVert \mathbf p\rVert^2 + \lVert \mathbf q\rVert^2)
\]

Here x_ui is 1 for an observed interaction and 0 otherwise; c_ui is its confidence weight; λ controls regularization. Confidence can grow with engagement count, such as watching once versus ten times. The blanks still pull the score down, but gently, which is the honest statement of what a blank actually means.

### Rule of thumb

This is **implicit alternating least squares (ALS)**: alternate between solving user vectors and item vectors while holding the other side fixed. It is a production workhorse.

---

## 3. Route two: Bayesian Personalized Ranking

**Bayesian Personalized Ranking (BPR)** is a pairwise objective: it learns that an observed item should rank above an unobserved sampled item, rather than trying to predict an absolute rating.

Do not predict a value at all. Predict an **order**.

```text
for a user u:
   i  = an item they engaged with
   j  = an item they did not
   the model should score i above j
```

\[
\text{maximize} \quad \log \sigma\big(\text{score}(u,i) - \text{score}(u,j)\big)
\]

Only the *difference* matters, so the model never has to claim that an un-clicked item is bad - only that it is less appealing than one that was clicked. That is a much weaker and much more defensible claim.

### Rule of thumb

> Pairwise objectives match the task. You need the order of the list, not the value of any single score.

---

## 4. Read the pairwise loss with numbers

The sigmoid `σ(z) = 1 / (1 + exp(−z))` turns a score difference into a number between 0 and 1. BPR minimizes `−log σ(score(i) − score(j))`.

If positive i scores 2 and sampled j scores 1, the gap is 1 and loss is about 0.31. Reversing them gives a gap of −1 and loss about 1.31. Training favors the correct ordering; it does not turn either score into a click probability.

---

## 5. Which j do you compare against?

The un-clicked item is sampled, and how you sample it changes what the model learns:

```text
uniform random     → usually wildly irrelevant → easy to beat → a blurry model
popular items      → corrects for popularity bias → but over-punishes good popular items
plausible-but-not  → sharpens the boundary → and destabilizes training if overdone
```

Negative sampling also shapes retrieval training. Easy negatives teach little; **hard negatives**—items the current model scores highly even though the user did not choose them—teach more but can make training unstable.

---

## 6. Choosing between the two

| | Weighted / confidence | Pairwise ranking |
|---|---|---|
| Optimizes | reconstruction of the matrix | the ordering |
| Scales by | efficient ALS updates using sparse observations | sampled pairs |
| Output score | preference score, not a calibrated probability | ordering only |
| Reach for it when | you want a solid batch retrieval model | you care only about rank order |

### Common issue

Both are still fitted with regularization, and both still learn one vector per id. A new user or item has no interactions and therefore no learned vector—the cold-start problem.

---

## What matters most

- **A click-only log has uncertain missing entries,** so the objective must state how those entries are treated.
- **Treating blanks as zeros over-claims; ignoring them leaves nothing to push down.** Both extremes fail.
- **Weighted approaches keep the blanks as low-confidence negatives,** which matches what a blank actually means.
- **Pairwise approaches learn "this beats that",** which is a weaker claim and a better match for ranking.
- **How you sample the negative decides what is learned** - easy ones teach little, hard ones teach a lot and destabilize training.

Next topic is **Factorization machines**.
