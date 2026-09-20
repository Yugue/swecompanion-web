## Exploration

**A system that always shows what it currently believes is best never finds out whether something else was better.**

```text
exploit   show the current best guess        → engagement today
explore   show something uncertain           → information for tomorrow
```

Every recommender spends some traffic on the second, whether deliberately or not. Doing it deliberately is the difference between a system that improves and one that ossifies.

### 1. Why it is not optional here

Three separate problems from earlier chapters all have the same fix:

```text
cold start (Ch.1)        a new item cannot earn data without impressions
feedback loops (Ch.5)    unshown items stay unshown, forever
position bias (Ch.5)     you cannot separate position from relevance
                         without varying position
counterfactual eval (Ch.5) needs non-zero probability on every action
```

Exploration is one mechanism paying for four things. That framing is the strongest version of this answer.

---

### 2. The standard approaches

```text
ε-greedy          show a random item ε% of the time
                  simple, and wastes the budget on obviously bad items

upper confidence  score = estimate + bonus for uncertainty
                  → uncertain items get a boost until they have data

Thompson sampling sample a plausible value from each item's distribution,
                  show the winner → explores in proportion to how likely
                  it is that this item is actually best
```

Thompson sampling is usually the best default: it explores more where the uncertainty is real, and it degrades gracefully into exploitation as evidence accumulates.

---

### 3. Contextual, not global

```text
non-contextual:  "this item is uncertain"           → show it to anyone
contextual:      "this item is uncertain FOR THIS
                  KIND OF USER"                     → show it to them
```

A cooking video that is unproven with cooking enthusiasts should be explored *there*, not on someone who only watches motorsport. Contextual exploration costs far less engagement for the same information.

### Rule of thumb

> Explore where the uncertainty is, not at random. Random exploration is a tax; targeted exploration is an investment.

---

### 4. Budgeting it

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

### 5. Explaining it to the business

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
