# Generalization and regularization

## 1. Learn patterns that transfer

**Generalization** is performance beyond training examples. **Underfitting** misses useful patterns; **overfitting** captures training-specific details that fail to transfer.

Memorizing known messages need not help a new customer expressing the same intent.

## 2. Separate capacity, bias, and variance

**Capacity** is the set of patterns a model can express.

**Bias** is systematic error in an average fitted prediction. **Variance** measures sensitivity to the observed training sample.

These are repeated-fit concepts, not exact readings from one training/validation gap. The additive bias²/variance/noise decomposition specifically applies to squared error.

## 3. Penalize unstable complexity

\[
L_{total}(w)=L_{data}(w)+\lambda R(w)
\]

w contains fitted weights; L_data scores predictions; R is a chosen penalty; \(\lambda\ge0\) sets its strength.

Larger lambda restricts the fit more. Excessive restriction can erase useful rare-intent evidence.

## 4. Drop hidden features during training

**Dropout** randomly removes selected activations. With inverted dropout and keep probability q, retained values are divided by q to preserve their expectation.

q=0.8 gives retained values a multiplier 1.25. Evaluation disables the random masking.

Dropping a hidden feature differs from deleting “not,” which can change the label.

## 5. Control fitting with validation

**Early stopping** selects a checkpoint using validation performance.

**Label smoothing** softens training targets, such as [0.9,0.05,0.05] instead of [1,0,0]. It changes the learning signal and confidence pressure.

## 6. Diagnose competing causes

| Observation | Possible causes |
|---|---|
| Poor train and validation | Weak features, limited capacity, failed optimization |
| Good train; poor validation | Overfitting, population change, inconsistent preparation |

Representative data supplies information that a penalty cannot create.
