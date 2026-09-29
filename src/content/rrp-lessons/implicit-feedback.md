## Implicit feedback and its biases

**Implicit feedback means learning from observed behavior rather than stated ratings.** Clicks, watches, skips, and purchases are plentiful, so many systems use them as labels alongside explicit feedback.

That is free and plentiful. It is also crooked in specific, predictable ways.

---

## 1. Explicit vs implicit

| | Explicit | Implicit |
|---|---|---|
| What it is | a rating, a thumbs up | a click, a watch, a purchase |
| How much | very little | effectively unlimited |
| Honesty | says what they think | says what they did |
| Negatives | a low rating states dislike | skips or hides can signal dislike; non-clicks are ambiguous |
| Bias | who bothers to rate | what the system chose to show |

The missing negatives are the structural problem: an unobserved user–item pair usually means "unknown," not "disliked," so training needs careful negative sampling or confidence weighting.

---

## 2. The signal is a chain, and you log the middle

```text
shown  →  seen  →  clicked  →  engaged  →  satisfied
  │        │         │           │            │
 logged  rarely    logged     sometimes    almost never
```

### Core intuition

What the product wants is at the right-hand end. What you can measure is in the middle. Every recommender is built on that gap, and the honest thing is to name it rather than pretend the click is the goal.

### A worked example: 10,000 impressions

Follow one video's impressions down the chain:

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

If only impressions and clicks are instrumented, you have two numbers—10,000 and 300—while the product cares about 150. Viewability and engagement logging can illuminate some intermediate steps, but satisfaction remains harder to measure.

Now look at what that does to a single negative label. Of the 9,700 non-clicks:

```text
7,900  never actually saw it        → not evidence of anything
1,800  saw it, not interested       → genuine negative signal
```

### Common issue

Many apparent "negatives" come from people who never saw the item. Treating them as rejections teaches the model that anything shown low is bad. This is **position bias** entering through the label: display position changes the chance of observation and clicking.

---

## 3. A click is weak evidence, and a non-click is weaker

```text
clicked      → probably some interest, or a misleading thumbnail
not clicked  → not interested, OR did not see it,
                                OR was in a hurry,
                                OR it was at the bottom of the page
```

This asymmetry is why click data needs correction for position bias before it can be interpreted as preference.

---

## 4. You only see outcomes for what you showed

```text
the current system chooses what to show
        ↓
you observe outcomes only for those items
        ↓
you train the next model on that
        ↓
it learns to agree with the current system
```

This is **exposure bias**: the data describes what the old system chose to show as much as what users preferred. It can make a model look better offline without improving live results. **Exploration**, deliberately showing some uncertain items, helps collect broader evidence.

### Rule of thumb

> Your training data is a record of your own past decisions. Treat it as evidence about the system, not just about the user.

---

## 5. Choose the signal closest to what you want

```text
weakest  ── click ── long click ── watch 80% ── purchase ── kept it ──  strongest
          plentiful                                              rare, and honest
```

### Rule of thumb

Deeper signals are more meaningful and much sparser, so systems often predict several outcomes at once and combine them. A practical rule is never to optimize the click alone, because clicks are easier to provoke than genuine satisfaction.

---

## What matters most

- **Implicit feedback is abundant and indirect;** explicit feedback is honest and rare. Production runs on the first.
- **Non-clicks are ambiguous negatives.** Explicit hides or complaints provide stronger evidence of dislike.
- **You only observe outcomes for items you chose to show,** so the logs describe the old system as much as the user.
- **The signal you can log sits in the middle of the chain** between "shown" and "satisfied" - name that gap rather than pretending the click is the goal.
- **Pick the signal nearest the outcome you actually want,** and never optimize clicks alone.

Next topic is **Deciding what to predict**.
