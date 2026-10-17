## Answering a Basics-of-ML interview question

A clear technical answer gives a definition, explains the mechanism with an example, and states the limits. Adapt its depth to the interviewer's question rather than listing every related concept.

## 1. Use a compact explanation structure

```text
define → explain the mechanism → work an example → state the tradeoff
```

Clarify an ambiguous task or constraint before committing to a design. For a straightforward definition question, answer it directly; a follow-up question should help the discussion rather than delay the explanation.

Avoid changing subjects while clarifying. If asked about a loss function, explain the loss before moving into metrics or threshold policies.

## 2. A complete example: log loss

> “Log loss measures how much probability a classifier assigns to the observed class. For a positive example, it is −log(p). Predicting 0.9 costs about 0.105; predicting 0.1 costs about 2.303. It therefore penalizes a confident wrong prediction strongly. Logistic regression minimizes this objective to fit probabilities. I would still check calibration on held-out data; the loss alone does not guarantee a correct probability model.”

This answer defines the concept, shows what it does numerically, connects it to fitting, and states a practical limit.

A useful next clarification is whether the interviewer wants the gradient, multiclass extension, or comparison with another loss.

## 3. For a design question, lead with the decision

For “build a fraud model,” establish:

1. The action: block, review, or rank cases for analysts.
2. The example: one transaction at a stated prediction time.
3. The label: confirmed fraud under a defined observation window.
4. The constraints: false-alarm cost, missed-fraud cost, latency, and review capacity.
5. The evaluation: deployment-matched split, current-system baseline, and decision-relevant metrics.

Then discuss features, a simple model, error analysis, serving, and monitoring. State assumptions when the prompt does not provide enough detail.

## 4. Make claims precise

| Weak claim | More useful statement |
|---|---|
| “Accuracy is bad.” | “At 0.1% prevalence, all-negative accuracy is 99.9% with zero recall.” |
| “More data fixes overfitting.” | “The learning curve is improving with sample size, so more representative data is worth testing.” |
| “This feature causes churn.” | “The model relies on this feature; causal impact needs separate evidence.” |
| “B is better by 0.4%.” | “B improves the paired estimate by 0.4 percentage points; here is its uncertainty and operating cost.” |

When uncertain, state the part you know, identify the assumption, and explain how you would verify it. Stop once the question is answered and let the follow-up guide the next level of detail.
