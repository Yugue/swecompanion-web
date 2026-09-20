## Implicit feedback and its biases

**Real systems learn from what people do, not from what they say.** Nobody rates videos out of five, but everybody clicks, watches, skips and buys - so those become the labels.

That is free and plentiful. It is also crooked in specific, predictable ways.

---

## 1. Explicit vs implicit

| | Explicit | Implicit |
|---|---|---|
| What it is | a rating, a thumbs up | a click, a watch, a purchase |
| How much | very little | effectively unlimited |
| Honesty | says what they think | says what they did |
| Negatives | a 1-star is a real negative | there are none |
| Bias | who bothers to rate | what the system chose to show |

The missing negatives are the structural problem, and Chapter 2 spends a whole lesson on how to train without them.

---

## 2. The signal is a chain, and you log the middle

```text
shown  →  seen  →  clicked  →  engaged  →  satisfied
  │        │         │           │            │
 logged  rarely    logged     sometimes    almost never
```

### Core intuition

What the product wants is at the right-hand end. What you can measure is in the middle. Every recommender is built on that gap, and the honest thing is to name it rather than pretend the click is the goal.

---

## 3. What the funnel costs you

Follow 10,000 impressions of one video down the chain:

```text
shown            10,000       logged
  ↓ scrolled past  7,900
seen              2,100       NOT logged - you cannot tell these apart
  ↓ not interested 1,800          from the 7,900 above
clicked             300       logged
  ↓ bounced <10s    110
engaged             190       logged (if you instrument it)
  ↓ disliked it      40
satisfied           150       almost never logged
```

You have two numbers - 10,000 and 300 - and the product cares about 150. Every layer in between is invisible.

Now look at what that does to a single negative label. Of the 9,700 non-clicks:

```text
7,900  never actually saw it        → not evidence of anything
1,800  saw it, not interested       → genuine negative signal
```

### Common issue

Eighty percent of your "negatives" are people who never laid eyes on the item. Training on them as rejections teaches the model that anything placed low is bad - which is the position-bias problem in Chapter 5, arriving through the label rather than the feature.

---

## 4. A click is weak evidence, and a non-click is weaker

```text
clicked      → probably some interest, or a misleading thumbnail
not clicked  → not interested, OR did not see it,
                                OR was in a hurry,
                                OR it was at the bottom of the page
```

This asymmetry is why click data needs correcting before it can be trusted - the correction is called position bias, and it has its own lesson in Chapter 5.

---

## 5. You only see outcomes for what you showed

```text
the current system chooses what to show
        ↓
you observe outcomes only for those items
        ↓
you train the next model on that
        ↓
it learns to agree with the current system
```

This is **exposure bias**. The data describes the old system at least as much as it describes the user. It is the reason a model can look better offline and do nothing online, and the reason exploration exists in Chapter 6.

### Rule of thumb

> Your training data is a record of your own past decisions. Treat it as evidence about the system, not just about the user.

---

## 6. Choose the signal closest to what you want

```text
weakest  ── click ── long click ── watch 80% ── purchase ── kept it ──  strongest
          plentiful                                              rare, and honest
```

### Rule of thumb

Deeper signals are more meaningful and much sparser, so systems usually predict several at once and combine them - the multi-objective lesson in Chapter 4. A practical rule: never optimize the click alone, because the click is the easiest thing to provoke.

---

## What matters most

- **Implicit feedback is abundant and indirect;** explicit feedback is honest and rare. Production runs on the first.
- **There are no true negatives.** A non-click could mean unseen, unnoticed, or uninterested.
- **You only observe outcomes for items you chose to show,** so the logs describe the old system as much as the user.
- **The signal you can log sits in the middle of the chain** between "shown" and "satisfied" - name that gap rather than pretending the click is the goal.
- **Pick the signal nearest the outcome you actually want,** and never optimize clicks alone.

Next topic is **Deciding what to predict**.
