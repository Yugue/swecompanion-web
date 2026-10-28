# Diagnosing training failures

## 1. Turn symptoms into experiments

**Training diagnostics** distinguish faults in data, optimization, representation, and model restrictions.

A flat metric is an observation. Inspect actual examples and a valid baseline before enlarging the model.

## 2. Check the smallest complete computation

Verify input/label alignment, class order, loss shape, and ignored positions.

A shifted token target can run successfully while teaching the wrong prediction.

## 3. Fit a small consistent subset

A **small-subset overfit check** tests whether a sufficiently flexible model can learn a tiny dataset.

Failure points toward frozen weights, missing updates, graph breaks, target mistakes, or excessive restrictions. Identical inputs with conflicting labels remain inseparable.

Passing confirms pipeline capability, not generalization.

## 4. Read the right curve

| Curve | Horizontal axis | Question |
|---|---|---|
| Learning | Training-set size | Would more data help? |
| Iteration | Training progress | When should fitting stop? |
| Validation | A model setting | Which setting transfers? |

```nlp-visual
learning-curves
```

The figure shows training progress: later fitting reduces training loss while validation loss rises.

## 5. Match clues to checks

| Symptom | Inspect |
|---|---|
| Loss never falls | Targets, gradients, optimizer, rate |
| Only long inputs fail | Truncation, masks, retained context |
| Rare labels disappear | Coverage, label mapping, loss weights, thresholds |
| Train improves; validation worsens | Checkpoint choice, overfitting, split consistency |

Compare the same metric and preparation on both sets.

## 6. Change one plausible cause

An **ablation** changes or removes a component to measure its contribution. Keep other conditions comparable; repeat fits when randomness matters.

Record quality and cost. A lucky validation maximum still needs independent final assessment.

## 7. Interview reasoning

**Question:** Loss falls but accuracy stays flat. Is training broken?

**Answer:** Probabilities can improve without crossing decision boundaries. Inspect scores, decisions, and labels before diagnosing failure.
