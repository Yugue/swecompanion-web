## Exploration

**A system that always shows what it currently believes is best never finds out whether something else was better.**

```text
exploit   show the current best guess        → engagement today
explore   show something uncertain           → information for tomorrow
```

Every recommender spends some traffic on the second, whether deliberately or not. Doing it deliberately is the difference between a system that improves and one that ossifies.

---

## 1. Why it is not optional here

Three separate problems from earlier chapters all have the same fix:

```text
cold start (Ch.1)        a new item cannot earn data without impressions
feedback loops (Ch.5)    unshown items stay unshown, forever
position bias (Ch.5)     you cannot separate position from relevance
                         without varying position
counterfactual eval (Ch.5) needs non-zero probability on every action
```

### Core intuition

Exploration is one mechanism paying for four things. That framing is the strongest version of this answer.

---

## 2. What always-exploit actually costs

Two items, and what the system knows about them:

```text
item A    shown 50,000 times    2,500 clicks    CTR 5.00% ± 0.10%
item B    shown     40 times        3 clicks    CTR 7.50% ± 4.20%
```

A pure exploit policy ranks by the estimate and shows A, every time, forever. That looks right - 5.0% is a known quantity and B's 7.5% comes from three clicks.

But look at the uncertainty. B's true rate is somewhere around 3% to 12%. It might be much better than A. And because it is never shown, that interval never narrows:

```text
week 1   B shown 40 times     interval 3.3% - 11.7%
week 4   B shown 40 times     interval 3.3% - 11.7%      ← no new information, ever
week 12  B shown 40 times     interval 3.3% - 11.7%
```

Thompson sampling breaks this by drawing a plausible value from each item's distribution and showing whichever wins:

```text
draw 1    A: 5.02%   B: 9.10%   → show B     (and learn something)
draw 2    A: 4.98%   B: 4.30%   → show A
draw 3    A: 5.01%   B: 6.80%   → show B
```

B gets shown roughly as often as it is plausibly the better item - frequently at first, then less as evidence accumulates and its interval tightens. If it really is 7.5%, you find out in days. If it is 3%, you stop showing it having spent very little.

The cost is visible and small; the benefit is invisible and compounding, which is exactly why it needs defending in business terms rather than left to the optimizer.

---

## 3. The standard approaches

```text
ε-greedy          show a random item ε% of the time
                  simple, and wastes the budget on obviously bad items

upper confidence  score = estimate + bonus for uncertainty
                  → uncertain items get a boost until they have data

Thompson sampling sample a plausible value from each item's distribution,
                  show the winner → explores in proportion to how likely
                  it is that this item is actually best
```

### Rule of thumb

Thompson sampling is usually the best default: it explores more where the uncertainty is real, and it degrades gracefully into exploitation as evidence accumulates.

---

## 4. Contextual, not global

```text
non-contextual:  "this item is uncertain"           → show it to anyone
contextual:      "this item is uncertain FOR THIS
                  KIND OF USER"                     → show it to them
```

A cooking video that is unproven with cooking enthusiasts should be explored *there*, not on someone who only watches motorsport. Contextual exploration costs far less engagement for the same information.

### Rule of thumb

> Explore where the uncertainty is, not at random. Random exploration is a tax; targeted exploration is an investment.

---

## 5. Budgeting it

```text
typical: 1-5% of impressions, or a reserved slot low on the page
```

Ways to make it cheap:

```text
put explored items in lower slots        less attention lost
explore within the plausible set         not across the whole catalogue
explore more for new items               where information is worth most
explore less for high-value sessions     a checkout flow is a bad place to experiment
```

---

## 6. Explaining it to the business

This comes up, and the answer should be in business terms:

```text
"We spend about 2% of impressions on items we're unsure about. That buys
 three things: new listings get discovered, so supply keeps growing;
 we find out when our model is wrong, instead of confirming itself; and
 it's what lets us measure position bias and evaluate new rankers offline.
 Without it the catalogue narrows to whatever was popular last quarter,
 and engagement decays slowly in a way that is hard to diagnose."
```

---

## What matters most

- **Exploitation earns today; exploration buys information for tomorrow.**
- **One mechanism pays for four things:** cold start, breaking feedback loops, estimating position bias, and enabling counterfactual evaluation.
- **Thompson sampling is the usual default,** exploring in proportion to the chance an item is genuinely best.
- **Make it contextual.** Explore where the uncertainty actually is, rather than at random.
- **Budget it around a few percent,** place explored items in lower slots, and avoid high-value sessions.

Next topic is **Scale and cost**.
