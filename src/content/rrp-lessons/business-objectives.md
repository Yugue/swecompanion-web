## Connecting the model to the business

**The thing you can optimize is never quite the thing the business wants,** and naming that gap precisely is most of the judgement being tested.

```text
what you can train on today      clicks, watch time, purchases
what the business actually wants retention, lifetime value, a healthy marketplace
                                 ↑ too slow and too diffuse to optimize directly
```

### 1. Optimizing a proxy finds its flaws

```text
optimize clicks         → clickbait
optimize watch time     → longer content, autoplay, binge loops
optimize purchases      → discounting, and pushing what is easy to sell
optimize session length → making things harder to find
```

Each of these is the optimizer doing its job correctly. The proxy diverged from the goal, and enough pressure found the divergence. That is not a modelling failure - it is what proxies do.

### Rule of thumb

> Assume any metric you optimize hard will eventually be gamed by your own system. Decide in advance what you will hold fixed.

---

### 2. Marketplaces have several parties

```text
buyers      want relevance and good prices
sellers     want exposure and a fair chance
platform    wants transactions, growth, and both sides to stay
```

A ranker optimizing only buyer engagement will concentrate traffic on a few proven sellers, which raises short-term conversion and starves the supply side. Then listings dry up and the catalogue - the platform's real asset - stops growing.

So marketplace ranking usually carries explicit supply-side terms: exposure floors for new sellers, caps on how much traffic one seller can take, and coverage as a tracked metric from Chapter 5.

---

### 3. Long-term value is the real objective and cannot be trained on

```text
retention      measurable in weeks   → far too slow for a training loop
lifetime value measurable in months  → and confounded by everything
```

The practical resolution is a two-layer structure:

```text
train on:      short-term predictions you can measure   (click, watch, complaint)
combine with:  weights set from what correlates with long-term outcomes
validate on:   long-horizon holdback experiments, run for months
```

That last line is what serious teams do and what most candidates never mention: a small slice of traffic held on a fixed policy for a long period, so you can see the long-run effect of everything else.

---

### 4. Guardrails are how you hold the line

```text
primary metric     the thing you are trying to move
guardrails         the things you refuse to lose, at any primary gain
                   → complaint rate, coverage, seller diversity,
                     latency, new-item impression share
```

The point of a guardrail is that it is **not** traded off. Once it becomes another weighted term, optimization will spend it. Declaring these before the experiment is what makes a mixed result decidable, as in Chapter 5.

---

### 5. Answering the trade-off question

```text
"Engagement is up 5%, seller diversity down 20%."

"That is a supply-side risk, not a win. Concentrating traffic raises
 conversion now and reduces the catalogue later, and the catalogue is
 the asset. I'd hold diversity as a guardrail rather than a weighted term,
 add an exposure floor for newer sellers in re-ranking, and check the
 long-horizon holdback before shipping. If the business decides the
 trade is worth it, that is a legitimate call - but it should be made
 explicitly rather than by a loss function."
```

---

## What matters most

- **You optimize a proxy, and enough optimization pressure will find where the proxy diverges** - that is what proxies do, not a modelling bug.
- **Marketplaces have several parties whose interests conflict,** and buyer-only optimization starves the supply side.
- **Long-term value cannot be trained on directly,** so combine short-term predictions and validate with a long-horizon holdback.
- **Guardrails must not be traded off.** Once a guardrail becomes a weighted term, optimization spends it.
- **Name the trade explicitly and let the business decide it** rather than letting a loss function decide by default.

Next topic is **Fairness, policy, and what not to show**.
