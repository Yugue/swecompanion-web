## A ranking system design answer

**"Design the home feed for a video app" is an open prompt,** and the interviewer is watching how you structure one rather than waiting for a specific architecture.

This lesson is self-contained synthesis: it defines the objective, retrieval, ranking, re-ranking, evaluation, and serving components while assembling them into one end-to-end answer.

---

## 1. The skeleton

```text
1. goal + metric      what decision, what success, what you refuse to lose
2. the row + label    what is one training example, and when is it known
3. retrieval          sources, recall target, budget
4. ranking            features, model, objectives
5. re-ranking         diversity, policy, business rules
6. evaluation         offline, online, and the bias you correct
7. cost + latency     the arithmetic, out loud
8. failure modes      the top one, and what catches it
```

Steps 6 to 8 are what separate someone who has shipped one of these from someone who has read about them.

---

## 2. Home-feed example: goal and metric

Before any model, say what decision is made and what success means. The metric has two halves and candidates usually give only the first.

```text
primary     satisfied watch time per user per week
guardrails  complaint rate, new-creator impression share, p95 latency
            ↑ things you refuse to lose, whatever the primary does
```

A guardrail is a predefined limit on an outcome the launch must not worsen beyond an agreed threshold. p95 is the latency within which 95% of requests finish.

---

## 3. Home-feed example: the training row and the label

```text
one row  = one impression
           user, video, context, features AS SERVED, position, propensity
labels   = click (seconds), watch fraction (minutes), like, hide (minutes)
```

Two details do real work. **Features as served** means recording the exact inputs the deployed model used rather than recomputing them from future data. This helps avoid training-serving skew: a mismatch between training and deployed inputs. **Position** records placement. A **propensity** records the serving policy's probability of choosing the action; it must come from the actual selection policy, not from a relevance score. Correct action probabilities make later off-policy evaluation possible where the logged policy provides coverage.

Label timing sets the cadence: clicks arrive in seconds, so daily retraining is feasible.

---

## 4. Home-feed example: retrieval

Retrieve about 800 candidates from five sources, each capped, deduplicated, and tagged with its provenance:

```text
two-tower embedding index    jointly trained user/item vectors; new videos via features
item-item co-occurrence      "people who watched this also watched"
subscriptions and history    the obvious next thing
trending in region           today's events, which no trained model has seen
fresh-content pool           guarantees new uploads get a chance
```

Measure it on its own: recall@800 is the fraction of held-out watched items found among the 800 candidates. If the right video was never a candidate, nothing downstream can recover it.

---

## 5. Home-feed example: ranking

```text
multi-task model over shared embeddings
  heads: P(click), E[watch fraction], P(like), P(hide)

features
  user     long-term interests, language, subscriptions
  item     category, creator, length, age, quality signals
  context  device, hour, surface, position (held constant at serving)
  cross    this user × this creator, this user × this category   ← personalization
  session  attention over the last 50 watches                    ← what they want NOW

score = w₁·click + w₂·watch + w₃·like − w₄·hide
```

Each **head** predicts one outcome from a shared representation. P denotes probability and E denotes an expected value. Cross features describe user–item relationships; session attention emphasizes relevant recent actions.

The negative term discourages items predicted to cause hides. Validate all heads and their scales, and set serving weights as an explicit product trade-off rather than assuming click optimization alone captures satisfaction.

---

## 6. Home-feed example: re-ranking

Re-ranking selects a coherent final list rather than judging each candidate alone:

```text
cap per creator        no single channel owning the page
category variety       relevance minus similarity to what is already chosen
one fresh slot         new uploads get impressions they have not yet earned
policy filters         HARD rules, applied as filters rather than score penalties
one exploration slot   placed low, where attention is cheapest
```

---

## 7. Home-feed example: evaluation

```text
offline   chronological split, position-bias corrected,
          quoted against popularity-in-region,
          sliced by new users and new creators
online    user-randomized A/B test (control A versus candidate B), run past the novelty effect,
          primary metric and guardrails pre-registered
long-run  a holdback on a fixed policy, for the retention question
```

---

## 8. Home-feed example: cost and latency

Do the arithmetic out loud; it is what turns the funnel's shape into a decision rather than a default.

```text
800 candidates × 10,000 req/sec = 8,000,000 scores/sec
   → drives the candidate cap, the model size,
     and precomputed slates for the heaviest users

50ms budget:  retrieve 10 · fetch features 15 · score 15 · re-rank 5 · slack 5
              ↑ feature fetching and inference tie here; measure the actual bottleneck
```

---

## 9. Home-feed example: failure modes

Name the failure you actually expect, and what catches it.

```text
most likely    new creators never get impressions → supply leaves
caught by      new-creator impression share, tracked as a guardrail
addressed by   the fresh-content retrieval source and the exploration slot
```

---

## 10. Where candidates lose points

```text
✗  naming a model architecture before naming the metric
✗  no training row, no label, no label timing
✗  no justification for the chosen candidate strategy and budget
✗  optimizing clicks with no negative objective
✗  no cost or latency arithmetic anywhere
✗  evaluation mentioned last, in one sentence, if at all
✗  no account of the biases in the logs
```

### Rule of thumb

> Any design answer that never mentions cost, evaluation, or a named failure mode is incomplete, however good the architecture is.

---

## 11. Adapting to the surface

The skeleton holds; the emphasis moves:

```text
search          the query is the dominant feature; relevance beats personalization
ads             calibration is mandatory - the score meets money
marketplace     supply-side fairness and coverage become first-class
notifications   the cost of a bad recommendation is much higher; precision leads
short video     the session sequence dominates; long-term profile matters less
```

Naming the shift explicitly is a strong signal that you understand why the pieces are there.

---

## What matters most

- **Cover eight things in order:** goal and metric, the row and label, retrieval, ranking, re-ranking, evaluation, cost, failure modes.
- **State the metric before naming any model,** including the guardrails you refuse to lose.
- **Define the training row and when the label becomes observable** - most vague answers are vague because this was skipped.
- **Do the cost arithmetic out loud;** the funnel's shape is an economic decision.
- **Name the biases in the logs** - position, exposure, feedback - before the interviewer does.
- **Adapt the emphasis to the surface:** search leans on the query, ads on calibration, marketplaces on supply-side fairness.

Next topic is **Answering RRP questions**.
