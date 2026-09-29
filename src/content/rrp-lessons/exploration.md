## Exploration

**A system that always shows what it currently believes is best never finds out whether something else was better.**

A **feedback loop** occurs when yesterday's recommendations determine today's training data, narrowing what the system learns about. Exploration uses controlled exposure to collect new information while bounding user and business cost.

```text
exploit   show the current best guess        → engagement today
explore   show something uncertain           → information for tomorrow
```

Every recommender spends some traffic on the second, whether deliberately or not. Doing it deliberately is the difference between a system that improves and one that ossifies.

---

## 1. Why it is not optional here

Controlled exploration can help with several distinct problems:

```text
cold start        a new item cannot earn data without impressions
feedback loops    unshown items stay unshown, forever
position bias     you cannot separate position from relevance
                         without varying position
counterfactual eval needs support for actions the target policy may choose
```

### Core intuition

Exploration is one mechanism paying for four things. That framing is the strongest version of this answer.

---

## 2. What always-exploit can miss

Consider these observations, with approximate 95% Wilson confidence intervals for click rate:

```text
item A   2,500 clicks / 50,000 impressions   estimate 5.0%   interval 4.8–5.2%
item B       3 clicks /    100 impressions   estimate 3.0%   interval 1.0–8.5%
```

A greedy policy ranks by the point estimate and always chooses A. But B is much less certain and might be better than A. Without further exposure, its uncertainty remains high.

**Thompson sampling** maintains a probability distribution over plausible reward rates, samples one value per item, and selects the sampled winner. A draw might put B at 6% and A at 5%, giving B a chance to produce evidence; another draw may favor A.

As observations accumulate, the policy can distinguish promising uncertainty from consistently weak performance. The rate of learning depends on traffic, examination, reward delay, and how differently the items perform—not a guaranteed number of days.

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

Choose an approach that matches the reward, uncertainty model, safety constraints, and logging requirements. Thompson sampling is useful when its uncertainty estimates are credible; simple randomized exploration may be easier to audit.

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
illustrative starting budget: a small share of eligible impressions
                             or a reserved slot; validate the cost
```

Ways to make it cheap:

```text
put explored items in lower slots        less attention lost
explore within the plausible set         not across the whole catalogue
explore more for new items               where information is worth most
explore less for high-value sessions     a checkout flow is a bad place to experiment
```

---

## 6. Log the policy's actual selection probability

Record the probability with which the exploration policy chose the displayed action, after accounting for the eligible pool and the mixture of exploration and exploitation.

A configured 2% exploration budget is not the probability of choosing each item. Without the actual action probability, importance-weighted evaluation cannot correctly reconstruct the decision.

---

## 7. Explaining it to the business

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

## 8. Set safety limits and measure what was learned

Explore only eligible content, with exposure and complaint limits. Measure information gained for uncertain items, their later successful retrieval, and cost to satisfied engagement—not just exploration CTR.

A low slot can reduce disruption but also receives fewer examinations, slowing learning. Choose placement and budget using measured visibility rather than assuming low placement provides cheap unbiased evidence.

---

## What matters most

- **Exploitation earns today; exploration buys information for tomorrow.**
- **One mechanism pays for four things:** cold start, breaking feedback loops, estimating position bias, and enabling counterfactual evaluation.
- **Choose the exploration method deliberately.** Thompson sampling uses reward uncertainty; simpler randomization can provide more transparent action probabilities.
- **Make it contextual.** Explore where the uncertainty actually is, rather than at random.
- **Set a measured budget with safety limits,** accounting for visibility, learning value, and user cost.

Next topic is **Scale and cost**.
