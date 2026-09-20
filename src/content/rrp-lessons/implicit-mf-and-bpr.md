## Factorization for implicit feedback

**With clicks instead of ratings, every example you have is a positive.** There is no such thing as a logged "this user disliked this item", so a training objective has to be invented.

```text
ratings:   1★ 2★ 3★ 4★ 5★     positives AND negatives, both observed
clicks:    ✓  ✓  ✓            positives only; everything else is a blank
```

---

## 1. The trap at both extremes

```text
treat every blank as a 0   →  claims the user rejected 10 million items
                              they never saw. Wildly wrong, and it buries
                              everything unpopular.

ignore every blank         →  the model has nothing to push down, so it
                              learns "everything is good" and ranks nothing.
```

### Core intuition

Neither works. The two standard fixes take opposite routes out.

---

## 2. Why the obvious approaches both fail

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
pairwise     never score a blank at all - only claim A ranks above C
```

---

## 3. Route one: weighted, with confidence

Treat all cells as observed, but say how much you trust each one.

```text
interacted     →  target 1,  HIGH confidence
not interacted →  target 0,  LOW  confidence
```

\[
\text{loss} = \sum_{u,i} c_{ui}\big(x_{ui} - \mathbf{p}_u \cdot \mathbf{q}_i\big)^2 + \lambda(\lVert \mathbf p\rVert^2 + \lVert \mathbf q\rVert^2)
\]

where confidence grows with how much the user engaged - watched once versus watched ten times. The blanks still pull the score down, but gently, which is the honest statement of what a blank actually means.

### Rule of thumb

This is what "implicit ALS" refers to, and it is a workhorse.

---

## 4. Route two: learn from comparisons

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

## 5. Which j do you compare against?

The un-clicked item is sampled, and how you sample it changes what the model learns:

```text
uniform random     → usually wildly irrelevant → easy to beat → a blurry model
popular items      → corrects for popularity bias → but over-punishes good popular items
plausible-but-not  → sharpens the boundary → and destabilizes training if overdone
```

This is the same question that dominates retrieval training, where it gets a full lesson in Chapter 3. The short version: easy negatives teach little, hard negatives teach a lot and are temperamental.

---

## 6. Choosing between the two

| | Weighted / confidence | Pairwise ranking |
|---|---|---|
| Optimizes | reconstruction of the matrix | the ordering |
| Scales by | passes over all cells, parallelizes well | sampled pairs |
| Output score | closer to a calibrated value | ordering only |
| Reach for it when | you want a solid batch retrieval model | you care only about rank order |

### Common issue

Both are still fitted with regularization, and both still learn one vector per id - so both still have the cold-start problem from the previous lesson.

---

## What matters most

- **Implicit data has no negatives,** so an objective has to be constructed rather than taken off the shelf.
- **Treating blanks as zeros over-claims; ignoring them leaves nothing to push down.** Both extremes fail.
- **Weighted approaches keep the blanks as low-confidence negatives,** which matches what a blank actually means.
- **Pairwise approaches learn "this beats that",** which is a weaker claim and a better match for ranking.
- **How you sample the negative decides what is learned** - easy ones teach little, hard ones teach a lot and destabilize training.

Next topic is **Factorization machines**.
