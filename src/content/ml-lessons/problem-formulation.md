## Problem formulation

Before a single feature or model is discussed, an ML system design answer has to translate a vague business ask into a precise, learnable prediction task. Interviewers deliberately give you an underspecified prompt - "reduce churn," "detect fraud," "improve engagement" - to see whether you do this translation explicitly, or jump straight to architecture.

### Business metric to ML objective

The business cares about a metric like revenue, retention, or fraud losses. A model cannot directly optimize most of these - they're too slow to measure, too indirect, or depend on things outside the model's control. So the first move is choosing a **proxy objective** the model can actually learn from that is believed to move the real metric.

\[
\text{business metric (slow, indirect)} \rightarrow \text{proxy ML objective (fast, learnable)}
\]

Example: "reduce churn" (measured monthly, confounded by pricing changes, seasonality, support quality) becomes "predict probability a user cancels in the next 30 days" (a label available on a rolling basis, directly optimizable).

A proxy is never perfect - always be ready to name the gap between what you're optimizing and what the business actually wants.

### Fixing the unit of prediction

The same business goal can be modeled at different granularities, and this choice ripples through the entire system:

- **per-request** (is this specific transaction fraudulent?)
- **per-user** (will this user churn this month?)
- **per-session** (will this session convert?)
- **per-item-pair** (should item A be ranked above item B for this user?)

The unit of prediction determines what a training example even is, what features are available at that granularity, and how the model is served (one call per transaction is a very different serving path than one score per user per day).

> Get the interviewer to confirm the unit of prediction early - guessing wrong here means redoing the rest of the design.

### Choosing the task type

Once the unit is fixed, name the task type and justify it against the downstream decision:

- **Binary classification** - "will this happen or not" (fraud, churn, click)
- **Regression** - "how much" (estimated delivery time, lifetime value)
- **Ranking** - "what order" (search results, feed content, ad auction)
- **Sequence generation** - "what comes next" (autocomplete, chat responses)

A common mistake is defaulting to classification when the actual decision is a ranking (e.g. "will the user like this item" framed as binary, when the real product need is "which 10 items go at the top of the feed"). Ranking problems need ranking-appropriate labels, losses, and metrics - a mismatch here compounds through every later stage.

### What counts as a label, operationally

"Predict churn" sounds simple until you ask: churn from what, measured how, by whom?

- Is churn "cancelled the subscription" (clean, but rare and definitional edge cases like downgrades) or "stopped using the product" (fuzzier, but catches more real disengagement)?
- Over what window - 7 days of inactivity, 30, 90?
- How far in the future does the label become observable, and does that delay match how often you need to retrain or re-evaluate?

Writing down the exact label definition, in operational terms, before moving on is the single highest-leverage thing you can do early in an ML system design answer - most of the later mistakes (leakage, bad splits, unclear evaluation) trace back to a fuzzy label definition.

### A worked example

**Prompt:** "Predict which users will churn next month."

1. Business metric: monthly subscriber retention rate.
2. Proxy ML objective: probability a given active user cancels within the next 30 days.
3. Unit of prediction: per-user, scored once per day (or per week) on the active user base.
4. Task type: binary classification (churn / no churn in the next 30 days), producing a probability so the business can rank users by risk and target the highest-risk ones with a retention offer.
5. Label definition: `churned = 1` if the user's subscription status transitions to cancelled within 30 days of the scoring date; label becomes observable 30 days after scoring, which sets a floor on how fast you can validate a new model online.

Every subsequent design decision - what features are available, what the train/test split looks like, what the serving latency budget is - follows from getting these five things nailed down first.
