## Deciding what to predict

**Before choosing a model, write one sentence naming exactly what the model outputs.** Most muddled designs are muddled because nobody did this.

```text
"Given this user, this item, and this context,
 predict the probability of a click within the session."
```

That sentence fixes the training rows, the label, the loss, and half the arguments that follow.

---

## 1. The three decisions inside it

```text
1. the UNIT      what is one row?      per impression? per session? per user-item pair?
2. the TARGET    what are we predicting?  click? watch time? purchase?
3. the TIMING    when is the answer known? instantly? in 14 days?
```

### Core intuition

Get the unit wrong and the model learns the wrong thing. Get the timing wrong and you discover at launch that your freshest training data is two weeks old.

---

## 2. The unit changes what is learnable

| Unit | One row is | Good for |
|---|---|---|
| Impression | one item shown to one user once | click prediction, ads |
| Session | one visit | intent, sequence, session-based recommendation |
| User-item pair | a whole relationship | classical recommenders, affinity |

### Rule of thumb

Impression-level rows suit click prediction. Pairwise or listwise ranking also needs request-level grouping, because candidates compete within a particular list. Repeated displays of an item remain distinct events.

---

## 3. Define the denominator before the target

Compare **purchase per impression** with **purchase given a click**. The first asks whether showing an item leads to a purchase; the second asks what happens after an interested user opens it. Their probabilities are not interchangeable.

If purchase requires a click, then `P(purchase per impression) = P(click) × P(purchase | click)`, with a consistent time window. Write the conditioning explicitly before combining model outputs.

---

## 4. Continuous targets are not free

"Predict watch time" sounds better than "predict a click", and it brings problems:

```text
watch time is skewed    → a handful of long sessions dominate the loss
watch time is censored  → a video the user is still watching has no final value
watch time rewards long → the model learns to prefer long items
```

### Common issue

A common fix is to predict a bounded, well-behaved version instead - the probability of watching past a threshold - rather than the raw number.

---

## 5. Label timing bounds everything

```text
click       → known in seconds        → retrain daily
purchase    → known in hours          → retrain daily, with a wait
return/keep → known in 14-30 days     → freshest training data is 30 days old
```

If the label matures in 14 days, yesterday's examples are not yet complete labels. A model may still learn from fast proxies or an explicitly delay-aware objective. The retraining schedule must account for that delay, so raise it early.

### Rule of thumb

> A label you cannot observe for a month cannot be the only thing you train on.

---

## 6. Proxies are fine if you name them

You will almost never be able to train on the thing you actually care about. Long-term retention is the goal; a click is what you can measure this afternoon.

That is acceptable. What is not acceptable is forgetting it:

```text
"We predict click-through, as a proxy for finding something worth watching.
 It diverges when thumbnails oversell - so we also predict completion
 and subtract predicted complaints."
```

Saying the sentence that way - proxy, how it diverges, what you do about it - is most of what is being graded.

---

## 7. Check that inputs exist at decision time

For a recommendation made at 14:00, the inputs may include earlier behavior, but not the purchase at 14:20 or the item's end-of-day click rate. Using either is **leakage**: training with information unavailable when making the real decision.

A useful target specification names the row, eligible items, observation window, available inputs, and how missing or unfinished outcomes are handled.

---

## What matters most

- **Write the predicted quantity as one sentence.** It settles the rows, the label, the loss, and most later arguments.
- **Name the unit.** Impression, session, and user-item pair give three different models; impression-based click prediction also needs request grouping for list-level training.
- **Continuous targets bring skew, censoring, and a bias toward long items** - a bounded version is often better behaved.
- **Label timing bounds the whole system.** A 30-day label means 30-day-old training data, whatever you build.
- **Proxies are unavoidable and fine, provided you say how yours diverges** and what you do about the divergence.

Next topic is **How a ranked list is scored**.
