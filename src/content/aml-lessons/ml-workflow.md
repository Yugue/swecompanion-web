## The applied ML workflow

## 1. Start with a decision

An **applied ML workflow** connects framing, data, fitting, evaluation, serving, and outcomes. Evaluation can send you back to an earlier choice.

For a retention team, start with the action budget: 500 calls each week.

## 2. Write the prediction contract

```text
unit:        subscriber scored on Monday
prediction:  inactivity in the next 30 days
inputs:      information available on Monday
label known: after 30 days plus reporting delay
action:      choose a 500-person call queue
```

Define what mistakes and calls cost before choosing an algorithm.

## 3. Establish credible evidence

Use the deployment-matched split and historical availability rules from foundations. Compare a simple queue rule, the current process, and a simple fitted model.

**Recall@500** counts the fraction of eventual inactive subscribers captured in the queue. State tie-breaking if a reference gives equal scores.

## 4. Iterate with a hypothesis

```text
baseline → fit → inspect errors → targeted change → evaluate
                  ↑                                  │
                  └──────────────────────────────────┘
```

Incorrect renewal labels call for a label fix. Missing useful history calls for a feature experiment. Choose the change from evidence rather than algorithm novelty.

## 5. Deploy and measure the action

Freeze choices before final assessment. Version the pipeline and decision policy; monitor live inputs immediately and quality when labels mature.

A weekly queue may suit batch serving. Keep a supported fallback and rollback.

High churn risk does not imply high benefit from calling. Use an appropriate experiment to measure the intervention, since decisions can change observed outcomes.

## 6. Interview reasoning

**Question:** What would you postpone in a new churn project?

**Answer:** Large model searches and real-time serving until the label, decision, baseline, and evaluation are credible. Those establish what complexity would need to improve.
