## A ranking system design answer

**"Design the home feed for a video app" is an open prompt,** and the interviewer is watching how you structure one rather than waiting for a specific architecture.

### 1. The skeleton

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

### 2. Worked example, compressed

**Goal.** Help people find something worth watching. Primary metric: satisfied watch time per user per week. Guardrails: complaint rate, new-creator impression share, p95 latency.

**The row.** One impression: user, video, context, features as served, position, propensity. Labels: click, watch fraction, like, hide/report. Click is known in seconds, watch in minutes, so retraining daily is feasible.

**Retrieval.** ~800 candidates from five sources - a two-tower embedding index, item-item co-occurrence over the user's recent watches, subscriptions and history, trending in the user's region, and a fresh-content pool. Each capped, deduplicated, tagged with its source. Target recall@800 measured against what users eventually watched.

```text
10M videos → 5 sources → 800 candidates → rank → 50 → re-rank → 10 shown
```

**Ranking.** A multi-task model over shared embeddings, with heads for click, watch fraction, like, and hide. Features: user long-term interests, recent-session sequence with attention over the last 50 watches, video content and quality, creator affinity, and cross features for this user's history with this creator and category. Score is a weighted combination, negative weight on predicted hide.

**Re-ranking.** Cap per creator, enforce category variety, guarantee a fresh-content slot, apply policy filters as hard rules, place one exploration slot low on the page.

**Evaluation.** Offline with a chronological split and position-bias correction, quoted against a popularity-in-region baseline, sliced by new users and new creators. Online: user-randomized A/B, run past novelty, primary and guardrails pre-registered. A long-horizon holdback for the retention question.

**Cost.** 800 candidates × ~10k requests/sec is 8M scores/sec; that drives the candidate cap, the model size, and a precomputed slate for the heaviest users. Latency budget 50ms, with feature fetching the largest slice.

**Top failure mode.** New creators never getting impressions, which drains supply. Caught by new-creator impression share as a guardrail, and addressed by the fresh-content source and the exploration slot.

---

### 3. Where candidates lose points

```text
✗  naming a model architecture before naming the metric
✗  no training row, no label, no label timing
✗  one retrieval source, or no retrieval stage at all
✗  optimizing clicks with no negative objective
✗  no cost or latency arithmetic anywhere
✗  evaluation mentioned last, in one sentence, if at all
✗  no account of the biases in the logs
```

### Rule of thumb

> Any design answer that never mentions cost, evaluation, or a named failure mode is incomplete, however good the architecture is.

---

### 4. Adapting to the surface

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
