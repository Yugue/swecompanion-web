## From traces to improvements

Improve through a measured loop from observed failures to validated fixes.

## 1. The loop

```text
traces → diagnose → prioritize → reproduce → fix → evaluate → monitor
```

Keep representative successes as well as failures for comparison.

## 2. Prioritize clusters

Group by cause, frequency, impact, and repair effort.

Many identifier-search misses suggest lexical/structured retrieval work. Repeated date failures suggest clearer units, parsing rules, or validation.

Investigate before calling either fix trivial.

## 3. Choose the repair layer

Tool contracts, context assembly, prompts, model/effort, and training are possible levers.

Use the cheapest intervention that addresses the diagnosed mechanism. A permissions bug belongs in enforcement.

## 4. Fine-tuning

Stable task behavior, domain adaptation, formatting, or distillation can justify training.

It can improve learned capabilities, including reasoning, but needs suitable data and independent evaluation. Fresh facts often belong in retrieval.

Compare simpler fixes first.

## 5. Leave a regression case

Store minimal input, observations, expected outcomes/invariants, and configuration.

Retain a representative evaluation set so fixing one incident does not degrade common tasks.

## 6. Controlled experiments

Change one conceptual variable where possible. For interacting bundles, use ablations.

Record full configurations, repeated results, cost, and latency.

## Interview mental model

> Fix a demonstrated mechanism and keep a check that detects its return.
