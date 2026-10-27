# Generalization and regularization

## 1. Fit relationships that transfer

**Generalization** is useful performance beyond the training examples. **Underfitting** misses useful patterns; **overfitting** captures training-specific details that do not transfer.

A model can memorize a small set of messages without learning how a new customer expresses the same intent.

## 2. Distinguish capacity, bias, and variance

**Capacity** describes the patterns a model can express. **Bias** is systematic error in the average fitted prediction; **variance** is sensitivity to which training sample was observed.

These repeated-fit concepts are not exact quantities read from a single training/validation gap. The familiar additive bias-squared/variance/noise decomposition is specific to squared error, not classification accuracy.

## 3. Make a complicated fit pay a penalty

**Regularization** discourages unstable complexity. A coefficient-penalized objective is:

\[
L_{total}(w)=L_{data}(w)+\lambda R(w)
\]

\(w\) holds fitted weights; \(L_{data}\) scores predictions; \(R\) penalizes the fit; \(\lambda\ge0\) sets strength. L2 uses squared weights; L1 uses absolute values.

Too much restriction can erase useful rare-language or intent-specific evidence.

## 4. Mask hidden features during training

**Dropout** randomly removes selected activations during training. With inverted dropout and keep probability \(q\), retained activations are divided by \(q\); their expected value is preserved.

At \(q=0.8\), a retained value is multiplied by 1.25. Evaluation disables this random masking.

Dropping a hidden coordinate differs from deleting a word. Removing “not” from text can change the label.

## 5. Use validation to limit fitting

**Early stopping** retains a checkpoint chosen from validation performance rather than the final training step.

**Label smoothing** replaces a fully concentrated target with a softened one, such as [0.9, 0.05, 0.05] for three classes. It changes the learning target and confidence pressure; it is not a guarantee of calibrated probabilities.

Choose these settings using the intended deployment split.

## 6. Check competing explanations

Low training error and poor validation can reflect overfitting, a population change, or inconsistent preprocessing. Poor performance on both can reflect weak evidence, limited capacity, or failed optimization.

More representative data and better labels add information; penalties cannot supply evidence absent from the input.

## 7. Interview reasoning

**Question:** Should a model with perfect training accuracy automatically get stronger regularization?

**Answer:** Inspect validation behavior and pipeline validity first. If the fit is sample-sensitive, restrictions may help; if evaluation is shifted or features are wrong, diagnose that problem directly.
