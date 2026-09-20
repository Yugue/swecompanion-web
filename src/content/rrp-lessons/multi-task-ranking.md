## Multiple objectives

**Optimizing clicks alone reliably produces clickbait,** because the click is the easiest thing in the chain to provoke and the least connected to whether anyone was glad.

```text
optimize clicks   →  shocking thumbnails, misleading titles
                  →  clicks go up, satisfaction goes down
                  →  the metric says you won
```

So real rankers predict several outcomes and combine them.

---

## 1. What single-objective optimization converges on

Rank purely by predicted click rate and watch what wins over six months:

```text
week 1    CTR 4.1%   avg watch 8m12s   complaints 0.2%   sessions/user 5.1
week 8    CTR 5.3%   avg watch 6m40s   complaints 0.5%   sessions/user 5.0
week 16   CTR 6.8%   avg watch 4m05s   complaints 1.4%   sessions/user 4.6
week 24   CTR 7.9%   avg watch 2m50s   complaints 2.9%   sessions/user 3.9
```

The optimized metric nearly doubled. Everything else fell.

Nothing malfunctioned. The system searched for what makes people click and found it: shocking thumbnails, overstated titles, and content engineered for the first five seconds. Those genuinely do raise click rate, and they are why the user is now opening the app less often.

### Core intuition

That is the whole case for multiple objectives in one table. And note which column noticed first - **average watch time** started falling in week 8, long before sessions per user moved. Cheap counter-signals are your early warning; the business metric confirms it much later.

---

## 2. One model, several heads

```text
                     ┌──► P(click)
shared body ─────────┼──► E[watch time]
(embeddings + layers)├──► P(like)
                     ├──► P(share)
                     └──► P(complaint)
```

### Intuition

The body is shared, which is the main technical benefit: the abundant signal (clicks) helps the model learn representations that the sparse signals (shares, complaints) could never learn on their own.

---

## 3. Combining into one score

```text
score = w₁·P(click) + w₂·E[watch] + w₃·P(share) − w₄·P(complaint)
```

Two things are worth saying about those weights:

- **They are a product decision, not a modelling one.** How much is a share worth relative to a complaint is a question for the people who own the product, and it should be argued explicitly rather than tuned quietly.
- **They only mean anything if the predictions are comparable.** Adding a well-calibrated probability to a badly calibrated one produces a number with no interpretation - which is the subject of the next lesson.

### Rule of thumb

> If you cannot say what one unit of each objective is worth, you do not have a combined score - you have an arbitrary weighting.

---

## 4. When tasks help and when they fight

```text
help:   click and watch-time are related
        → shared representations transfer, the sparse task gets stronger

fight:  click and complaint often pull in opposite directions
        → gradients conflict, and the shared body can end up worse at both
```

### Common issue

Architectures exist specifically to give conflicting tasks room to diverge - mixtures of experts with per-task gating, so each task can lean on different parts of the shared capacity. The point to remember is that multi-task is not free: badly matched tasks degrade each other.

---

## 5. Negative objectives are the important ones

```text
P(complaint)        "report", "not interested", "hide"
P(unsubscribe)      the strongest signal a platform gets
P(regret)           surveyed satisfaction, very sparse and very valuable
```

### Rule of thumb

These are rare, which makes them hard to model, and they are the only thing standing between engagement optimization and a bad product. Subtracting a predicted complaint rate is the mechanism by which "do not chase clicks" becomes something the system actually does.

---

## 6. What this looks like in an interview

The strong version of this answer names the trade-off explicitly:

```text
"Engagement is up 5% and complaints are up 8%. That is not obviously a win.
 I'd put the complaint rate into the ranker as a negative term with a weight
 set from how much a complaint costs us in retention, and I'd hold the
 complaint rate as a guardrail in the A/B test rather than as a tuning knob."
```

Guardrail metrics come from Chapter 5, and naming one here is what makes the answer sound like it came from a real launch.

---

## What matters most

- **Clicks alone produce clickbait,** because the click is the easiest outcome to provoke.
- **One shared body with several heads** lets abundant signals teach representations that sparse signals cannot learn alone.
- **The combining weights are a product decision** and should be argued explicitly.
- **Weights only mean something if the predictions are comparable,** which requires calibration.
- **Tasks can conflict as well as help,** which is why architectures exist to give them separate capacity.
- **Negative objectives - complaints, hides, unsubscribes - are what keep engagement optimization honest.**

Next topic is **When the score has to be a real probability**.
