# End-to-end ML system reasoning

A useful ML system connects predictions to decisions and observable outcomes. This lesson combines earlier work on splits, baselines, error analysis, and serving rather than introducing another modeling recipe.

## 1. Specify the decision before the model

Consider detecting fraudulent payments. State what is predicted, when the decision occurs, what information is then available, and whether the action is to approve, review, or block.

A low false-positive rate matters because legitimate customers can be blocked. Review capacity limits how many cases people can inspect. Those constraints shape the threshold and evaluation.

## 2. Trace information through the system

```text
payment event → features available now → risk score → action
                    ↑                                  ↓
             versioned pipeline               delayed outcome labels
                    ↑                                  ↓
                training ← evaluation ← checked historical records
```

A later chargeback can be a label, but it cannot be an input to the earlier payment decision. Build historical features as they existed at prediction time. Account for delayed outcomes when splitting data.

## 3. Establish evidence for improvement

Start with an existing rule or simple model. Compare a stronger candidate on the same time-respecting split, using precision and recall at the actual review budget.

Inspect errors by payment type, customer history, and relevant groups. Log the model version and decision policy so later outcomes can be attributed to the system that produced them.

## 4. Treat deployment as another experiment

| Stage | What it establishes |
|---|---|
| Offline evaluation | Predictive performance on held-out historical cases |
| Shadow serving | Live inputs, feature consistency, latency, and reliability |
| Controlled rollout | Effect of model-driven actions on measured outcomes |
| Monitoring | Whether performance and system behavior remain acceptable |

Shadow predictions alone cannot establish the business effect of taking different actions. During rollout, include guardrails and a tested rollback route.

## 5. Close the feedback loop carefully

Monitor missing features, input changes, latency, action rates, and eventual outcome metrics. **Data drift** changes the input distribution; **concept drift** changes the relationship between inputs and outcomes. Input drift alone does not prove quality loss.

Blocked payments may never reveal what would have happened if approved. This selection effect can bias future labels and retraining. Revalidate retrained models against a stable baseline and representative outcomes before replacing production behavior.
