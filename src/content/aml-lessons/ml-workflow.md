## The applied ML workflow

An **applied ML workflow** connects a prediction problem to a useful, maintained decision process. It is iterative: evaluation may send you back to the labels, features, or original framing.

## 1. Frame a concrete decision

For a retention team with 500 weekly calls:

```text
unit:        one active subscriber scored each Monday
prediction:  probability of no sessions in the following 30 days
inputs:      information available at scoring time
label known: after the outcome window and reporting delay
action:      choose customers for a limited call queue
```

**Recall@500** measures the fraction of eventual inactive subscribers in the queue. It measures identification, not whether calling prevents inactivity. The best customers to contact may differ from the highest-risk customers if response to intervention varies.

Define error costs, action costs, and success criteria before choosing an algorithm.

## 2. Build data and baselines

Reserve an evaluation set that matches deployment. Explore training data to define transformations; keep final test outcomes out of model and feature choices.

For forward-time evaluation, use features and labels available at each historical training cutoff. A 30-day label delay restricts recent labelled examples, not the live features usable for today's predictions.

Compare a simple queue rule, the current process, and a simple fitted model on the same development protocol. A constant-score ranking needs a stated tie-breaking policy; it is not equivalent to an all-negative classification decision.

## 3. Iterate with a hypothesis

```text
data and baseline → fit → inspect errors → test a targeted change
                         ↑                          │
                         └──────────────────────────┘
```

If annual subscribers are repeatedly mislabelled around renewals, fix that definition before interpreting the mistakes as a capacity problem. If labels are sound but a relevant history signal is missing, test an available feature.

Validate probability quality when used, choose the action policy, inspect important slices, and quantify uncertainty in comparisons. Once choices are fixed, evaluate on the reserved final set.

## 4. Deploy, observe, and learn

Choose batch or on-demand prediction from freshness and latency requirements. A weekly queue can often use a scheduled batch.

Version preprocessing, feature definitions, model, schema, and action policy together. Check live inputs and service health immediately; measure prediction quality when labels mature. Keep an operational fallback and rollback.

When appropriate, test the action's effect through an experiment with defined outcomes and guardrails. Feed new evidence back into the workflow, accounting for the fact that interventions change observed outcomes.

> **Mental image:** the model sits inside a loop from decision to outcome to evidence. Improving one prediction score is only one part of that loop.
