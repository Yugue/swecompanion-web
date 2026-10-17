# 3.6 Generalization, capacity, and regularization

## 1. Learn a reusable rule

**Generalization** means useful performance on new examples from the intended setting.

Example: training defects always use a red belt. The model learns belt color and fails on a blue belt.

**Model capacity** is the range/complexity of relationships the model can represent. It affects what can be fit; parameter count alone does not explain what is learned.

## 2. Read both curves

**Underfitting** means failing to fit useful training structure. **Overfitting** means learning training-specific details that do not transfer. Learning curves track metrics over training to help distinguish them.

| Training | Validation | First hypothesis |
|---|---|---|
| Poor | Poor | Pipeline, optimization, or inadequate fit |
| Excellent | Poor | Overfit or mismatch |
| Improves | Worsens later | Checkpoint/generalization |
| Worse than validation | Better | Training augmentation/dropout |

These are clues, not diagnoses. Compare under the same evaluation conditions.

```cv-visual
learning-curves
```

## 3. Bias and variance

- **High bias:** restrictive assumptions miss real structure.
- **High variance:** learned behavior depends too much on the sample.

Example: fitting a curved relationship with one straight line versus memorizing every noisy point.

Large models can also generalize well; the classical tradeoff is intuition, not a universal rule.

## 4. Weight penalties

**Regularization** biases learning toward solutions expected to transfer better. An **L2 weight penalty** discourages large weights by adding their squared norm to the loss:

\[
L_{\mathrm{total}}=L_{\mathrm{data}}+\lambda\|\theta\|_2^2
\]

For weight 3 and lambda 0.1:
- Penalty: 0.9.
- Gradient contribution: 0.6.

Weight decay shrinks weights during updates. It can match L2 under ordinary SGD conventions; adaptive optimizers differ.

## 5. Dropout and label smoothing

**Dropout:** randomly remove activations during training.

At dropout 0.5, activation 4 becomes either 0 or 8; expected value remains 4. Ordinary evaluation disables it.

A **one-hot target** puts probability 1 on the true class and 0 elsewhere. **Label smoothing** mixes that target with a softer distribution, reducing certainty in training labels.

For two classes and epsilon 0.1 under uniform smoothing, [1,0] becomes **[0.95,0.05]**.

Both discourage brittle fitting; excessive strength harms learning.

## 6. Early stopping and data

**Early stopping** ends training or selects saved weights when validation performance stops improving. Choose the checkpoint using validation, not test data.

Representative independent examples add coverage. Repeated neighboring frames add less diversity. **Data augmentation** creates training variants through label-preserving transformations such as suitable crops or flips. It supplies intended variation, not new semantic cases.

## 7. Pick a targeted intervention

```text
cannot fit tiny clean set → wiring / objective / optimization
fits it, fails new data   → coverage / shortcuts / shift / overfit
```

Stronger dropout will not repair wrong targets or missing camera domains.

## 8. Interview reasoning

**Question:** Excellent training, poor validation—what changes?

**Answer:** Audit split, labels, and domain first. If overfitting is supported, compare valid augmentation, data, weight decay, early stopping, or reduced capacity.
