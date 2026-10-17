## Diagnosing overfitting and underfitting

**Underfitting** means the fitted model fails to capture useful patterns. **Overfitting** means it captures training-specific details that do not transfer to new examples.

Train and validation performance provide clues; they do not identify the cause by themselves.

## 1. Start with comparable errors

| Training error | Validation error | Investigate |
|---|---|---|
| High | High | Weak features, limited capacity, excessive regularization, failed fitting, or noise |
| Low | Much higher | Overfitting, dataset shift, pipeline mismatch, or unreliable evaluation |
| Low | Low | A successful fit, or an overly easy or leaky evaluation |

“High” is relative to a baseline, the task, and the error costs. A 55% accuracy model on a balanced task may contain little signal; it does not automatically prove a bug.

Compute metrics using the same definitions and preprocessing. Avoid comparing training accuracy with validation log loss.

## 2. Separate three kinds of curves

**Learning curves** vary training-set size while keeping the evaluation protocol comparable.

If validation keeps improving as data grows, more representative data may help. If both curves plateau at poor performance, investigate features, model restrictions, optimization, and noise. A plateau over a limited range is evidence, not proof that more data can never help.

A **validation curve** varies one hyperparameter. For example, validation accuracy might peak at tree depth 8 even while training accuracy continues increasing.

An **iteration curve** tracks training steps for one fit. Falling training loss with rising validation loss suggests that later steps are fitting less transferable detail. Early stopping retains a checkpoint chosen from validation performance.

```aml-visual
learning-curves
```

## 3. Rule out competing explanations

Before increasing regularization, check:

- Does validation represent the deployment population and time period?
- Are features computed identically across splits?
- Are labels aligned with rows and fully observed?
- Does the result vary greatly across suitable resamples?
- Are apparent errors actually label problems?

Group leakage often inflates validation scores; a shifted validation population can instead make them worse. Both undermine a simplistic gap diagnosis.

## 4. Make a targeted next experiment

For an overly restricted fit, try better features, adequate training, or more useful capacity. For sample sensitivity, try regularization, averaging, or more representative data.

A flexible model fitted to a small subset is a useful pipeline check: can it fit that subset well? Failure suggests inspecting capacity, regularization, duplicate inputs with conflicting targets, labels, and code. A constrained linear model is not expected to memorize arbitrary labels, even with only 100 rows.

> **Mental image:** use curves as diagnostic readings. Test the suspected cause before prescribing the fix.
