# 4.4 Normalization, initialization, and gradient stability

## 1. Keep signals at useful scales

Many layers can shrink or amplify signals.

- Initialization sets starting scales.
- Normalization adjusts feature statistics.
- Residual paths support information flow.
- Clipping limits oversized gradients.

These solve related but different problems.

## 2. The normalization equation

\[
\hat x=\frac{x-\mu}{\sqrt{\sigma^2+\epsilon}},\qquad
y=\gamma\hat x+\beta
\]

Mu/variance describe selected axes; epsilon stabilizes division; gamma/beta are learned scale/shift.

Example: x=6,mean=4,std≈2 → normalized value ≈1.

Always specify **which values share statistics**.

## 3. Compare methods

| Method | Statistics |
|---|---|
| BatchNorm2d | Per channel over batch and spatial positions |
| GroupNorm | Per example, within channel groups and space |
| LayerNorm | Per example over specified trailing axes |

For [B,N,D] tokens, LayerNorm over D normalizes each token.

GroupNorm avoids dependence on batch peers. Batch size one still offers spatial samples for BatchNorm, but they can be correlated.

## 4. Training versus inference

BatchNorm normally updates running statistics during training and uses them during evaluation.

Example: the same image can behave differently in training when its batch peers change.

Freezing gradients does not freeze statistics. eval() changes module behavior; inference_mode() controls gradient recording.

## 5. Initialization

Identical zero hidden weights make units learn identically. Random weights break symmetry.

- Xavier-style: useful for many symmetric activations.
- He/Kaiming-style: accounts for ReLU-like behavior.
- Zero biases are often acceptable.

> Aim to preserve scale as signals pass through depth.

## 6. Vanishing, exploding, clipping

Repeated small derivatives shrink gradients; large derivatives amplify them.

\[
g_{\mathrm{clip}}=g\min\left(1,\frac{c}{\|g\|_2}\right)
\]

Example: gradient [3,4] has norm 5. Clip to 1 → **[0.6,0.8]**.

Clipping limits explosions, not vanishing gradients.

## 7. Practical operations

```python
norm = torch.nn.GroupNorm(num_groups=8, num_channels=64)
total_norm = torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
```

Clip after backward, before step; unscale mixed-precision gradients first.

Inspect inputs, activations, and gradient norms. Constant clipping suggests a deeper issue.

## 8. Interview reasoning

**Question:** Why GroupNorm with tiny segmentation batches?

**Answer:** Its per-example statistics avoid small-batch peer dependence and running-statistic mismatch. Compare actual quality and cost; input standardization remains a separate contract.
