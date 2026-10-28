# Generalization and learning curves

## 1. Learn beyond the training examples

**Generalization** is performance on new examples from the intended use. **Overfitting** means fitting training-specific patterns that fail to transfer. **Underfitting** means failing to capture useful patterns even in training data.

**Distribution shift** occurs when deployment examples differ from the population represented by evaluation.

## 2. Assign data roles

| Split | Purpose |
|---|---|
| Training | Fit parameters |
| Validation | Choose settings and stopping point |
| Test | Assess fixed decisions |

A **hyperparameter** configures training or model structure rather than being fitted directly, such as learning rate or hidden width.

## 3. Read learning curves

A **learning curve** plots performance against training progress or data quantity.

```genai-visual
learning-curves
```

Training loss decreasing while validation loss rises suggests overfitting under this split. Both remaining high may indicate underfitting, failed optimization, or unsuitable targets.

## 4. Prevent leakage

**Data leakage** is access to information unavailable under the claimed deployment conditions. Near-duplicate documents across splits can make memorization look like generalization.

Group related examples and split by time when predicting future events. Do preprocessing fitting and example selection without consulting the final test set.

## 5. Choose regularization

**Regularization** discourages overly specialized solutions. Weight decay constrains parameter growth. **Dropout** randomly suppresses activations during training. **Early stopping** chooses a checkpoint before validation performance deteriorates.

Dropout is disabled during ordinary inference. Stronger regularization can worsen an already underfitting model.

## 6. Use evidence to intervene

A **baseline** is a simple reference evaluated under the same conditions. Compare its errors with the model’s, then inspect train/validation curves and examples before changing capacity.

A single average can hide rare failures. Track important groups and difficult cases under the same data contract.
