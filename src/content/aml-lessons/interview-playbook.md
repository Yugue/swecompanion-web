## Answering a Basics-of-ML interview question

## 1. Reuse the explanation pattern

Consolidate the earlier lessons:

```text
define → explain the mechanism → work an example → state the tradeoff
```

Answer the named concept first. Clarify only the ambiguity that affects the answer, then let follow-up questions guide depth.

## 2. Frame one fraud case

Suppose analysts can review 100 transactions daily. State the prediction time, available inputs, fraud-label window, review budget, and error costs.

Choose whether the output supports ranking, risk estimation, or automatic decisions. They need different evidence.

## 3. Build a credible comparison

Use the split that matches deployment and reconstruct historically available inputs. Compare existing rules with a simple fitted model.

If rules find 24 frauds and the model finds 37 in the same 100-review budget, the useful improvement is 13 additional detections. Assess uncertainty and relevant slices before claiming a dependable gain.

## 4. Explain one mechanism numerically

For a positive case, log loss is \(-\log p\), where \(p\) is its predicted positive probability.

Probabilities 0.9 and 0.1 cost approximately 0.105 and 2.303. This explains the penalty for a confident mistake. Check held-out calibration if probabilities estimate monetary risk.

## 5. Defend the next action

| Evidence | Reasoned next step |
|---|---|
| Missing histories explain costly errors | Test an available history feature |
| Training fit improves, validation worsens | Check overfitting and pipeline consistency |
| Offline quality improves but features are too slow | Revisit the full serving path |
| Live probabilities lose frequency meaning | Investigate drift and calibration |

These apply earlier mechanisms; adding model names does not strengthen the argument.

## 6. Interview reasoning

**Question:** The candidate beats rules offline. What remains before broad deployment?

**Answer:** Confirm independent evaluation, important slices, costs, and complete serving behavior. Roll out with a supported fallback and monitoring; measure the policy's effect where appropriate.
