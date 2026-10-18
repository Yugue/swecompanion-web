## Parameters, hyperparameters, and capacity

## 1. Fitted parts and chosen settings

**Parameters** are values fitted from training data. **Hyperparameters** configure the model or learning procedure.

For a decision tree, training learns its questions and predictions; maximum depth limits how many questions it may ask.

## 2. Concrete examples

| Procedure | Fitted state | Chosen setting |
|---|---|---|
| Linear model | Coefficients and intercept | Penalty strength |
| Tree | Split thresholds and leaf predictions | Maximum depth |
| Nearest neighbors | Stored examples | Neighbor count |
| k-means | Group centers | Group count |

Stored training data can be fitted state even without a compact weight vector.

## 3. Capacity controls expressiveness

**Capacity** is the range of patterns a model can represent. A deeper tree can express more interacting conditions.

**Regularization** discourages unstable complexity through restrictions or penalties. More capacity can capture signal or sample-specific noise; validation distinguishes them.

A random seed changes randomness without necessarily changing capacity. Hyperparameter and capacity are different ideas.

## 4. Read a validation result

```text
depth 4:   training accuracy 0.88   validation 0.84
depth 20:  training accuracy 1.00   validation 0.79
```

Depth 4 transfers better in this comparison. Perfect training fit does not justify the larger setting.

## 5. Include preprocessing choices

Choosing median filling is configuration; the median computed from training rows is fitted state.

**Early stopping** chooses when to stop iterative fitting from validation performance. It is another data-informed choice. Repeated configuration searches can also fit validation noise, so reserve independent final evaluation.

## 6. Interview reasoning

**Question:** Is a scaler's mean a hyperparameter?

**Answer:** It is fitted state learned from training data. Choosing standardization instead of another transform is a configuration decision.
