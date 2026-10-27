# Diagnosing training failures

## 1. Make a testable diagnosis

**Training diagnostics** use measured behavior to distinguish faults in data, optimization, representation, and model restrictions.

A flat metric is an observation, not a diagnosis. Compare against a valid baseline and inspect actual examples before choosing a larger model.

## 2. Verify the smallest complete computation

Check that examples and labels align, the class order is correct, shapes match the loss, and artificial positions are excluded appropriately.

For a token model, a shifted target or incorrect class axis can produce a perfectly executable program that learns the wrong task.

## 3. Try a suitable small-subset fit

A **small-subset overfit check** asks whether a sufficiently flexible model can learn a small consistent dataset.

Failure suggests inspecting frozen weights, missing updates, graph breaks, label mistakes, or excessive restrictions. A constrained model cannot memorize arbitrary outputs, and identical inputs with conflicting labels remain inseparable.

Passing this check confirms a capability of the pipeline, not generalization.

## 4. Distinguish three curves

| Curve | What varies | Question |
|---|---|---|
| Learning curve | Training-data size | Would more representative data help? |
| Iteration curve | Steps within a fit | Are later updates less transferable? |
| Validation curve | A selected setting | Which restriction fits this task? |

```nlp-visual
learning-curves
```

A limited-range plateau is evidence, not proof that more data could never help.

## 5. Match the experiment to the clue

| Observation | Next check |
|---|---|
| Loss never falls | Targets, gradients, rate, optimizer membership |
| Train improves; validation worsens | Overfitting, checkpoint choice, evaluation consistency |
| Only long inputs fail | Truncation, masks, context use |
| Some labels never predicted | Coverage, label encoding, objective, decision rule |

Use the same metric definition and preprocessing when comparing train and validation.

## 6. Change one plausible cause

An **ablation** removes or changes a component to test its contribution. Keep other important conditions comparable, and repeat fits when randomness can change the conclusion.

Useful experiments may improve data or features rather than architecture. Record both the gain and its costs; a lucky validation maximum is not an independent final estimate.

## 7. Interview reasoning

**Question:** The training loss falls, but accuracy stays flat. Is training broken?

**Answer:** Not necessarily. Probabilities may improve without changing class decisions. Inspect the loss, thresholded outputs, label distribution, and task metric before concluding that no learning occurred.
