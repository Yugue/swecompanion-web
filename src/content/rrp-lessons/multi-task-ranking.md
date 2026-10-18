## Multiple objectives

## 1. Predict several outcomes, choose one policy

**Multi-task learning** trains several predictions using shared or partly shared representations. **Multi-objective selection** combines outcomes or constraints to choose actions.

Sharing training and choosing a product tradeoff are separate decisions.

## 2. Give each output a target

A **head** is a model component predicting one task, such as clicking, watch duration, or hiding.

```rrp-visual
multi-task-heads
```

Define units, conditioning, and outcome windows for every head.

## 3. Convert conditional watch into per-display value

If watch is zero without a click:

\[
E[watch\mid x]=P(click\mid x)E[watch\mid click,x]
\]

\(x\): context; \(P\): probability; \(E\): expected value. The second expectation is watch duration among clicked impressions.

Probability 0.20 × conditional 60 seconds = **12 expected seconds per impression**. The identity requires consistent event definitions and windows.

## 4. Do not invent conditional labels

An unclicked impression supplies no observed “watch given click” outcome.

A **loss mask** excludes examples without an available label for that task. It prevents fictitious labels but does not automatically remove selection bias among clicked items.

Alternatively, deliberately model unconditional watch per impression.

## 5. Separate the two weight sets

| Weights | Control |
|---|---|
| Training | How task losses update shared parameters |
| Serving | How predicted outcomes influence selection |

Combining seconds and complaint probabilities requires an explicit utility conversion.

## 6. Check sharing and constraints

Shared representations can help sparse tasks or create competition for capacity. Compare each head against a suitable single-task reference.

A **guardrail** is a predefined acceptable limit, such as complaint rate. Hard eligibility cannot be traded away by another task's score.

## 7. Interview reasoning

**Question:** Why not use serving utility weights as training loss weights automatically?

**Answer:** Loss scale and parameter learning differ from the units and tradeoffs of selecting items. Tune and validate those roles separately.
