# Output heads, probabilities, and losses

## 1. Match scores to answers

An output head produces **logits**: unrestricted real-valued scores. They become probabilities through a transformation suited to the target.

Choose exclusive classes, coexisting labels, or numeric outputs before choosing a loss.

## 2. Normalize competing classes

**Softmax** converts logits into probabilities summing to one:

\[
p_k=\frac{e^{z_k}}{\sum_j e^{z_j}}
\]

\(z_k\): class k’s logit; j: candidate classes; \(p_k\): class probability. Raising one relative logit raises its probability.

[log 3,0] gives [0.75,0.25]. Adding the same constant to all logits changes nothing.

## 3. Allow coexisting labels

Use sigmoid per label when a message can be both urgent and about billing. These probabilities need not sum to one.

Separate sigmoid outputs parameterize the decisions; they do not prove the real labels are independent.

## 4. Choose the cost

| Output | Training cost |
|---|---|
| Exclusive class y | Cross-entropy: −log p_y |
| Multiple binary labels | Binary cross-entropy per label |
| Numeric target y | Squared error: (prediction−y)² |

**Regression** predicts numeric values. A **one-hot target** has one entry equal to one and others zero.

## 5. Use logits directly

For token logits [B,T,C] and integer targets [B,T]:

```python
loss = torch.nn.functional.cross_entropy(
    logits.reshape(-1, C), targets.reshape(-1), ignore_index=-100
)
```

B is batch size, T positions, C classes. Target −100 marks ignored positions. The operation performs stable log normalization; do not softmax first.

## 6. Preserve pairing and weighting

Flattening batch and position axes is valid when logits and labels stay aligned and averaging is preserved. Mixing the class axis with positions changes the computation.

Use stable binary-logit loss for sigmoid heads. Validate thresholds separately from fitting probabilities.
