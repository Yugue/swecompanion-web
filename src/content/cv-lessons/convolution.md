# 4.1 Convolution and learned feature maps

## 1. Reuse a local detector

Convolution applies the **same learned stencil** across an image.

Example: kernel [−1,0,1] gives 8 on [2,2,10] and zero on [2,2,2].

> Learn a local pattern once, then look for it everywhere.

Neural-network “convolution” typically uses cross-correlation.

## 2. Space and channels

For output channel o:

\[
Y_o(i,j)=b_o+\sum_{c,u,v}W_{o,c,u,v}X_c(i+u,j+v)
\]

X: inputs, W: learned weights, b: bias; c indexes channels, u/v the local window.

One RGB output channel combines all three color channels.

## 3. Feature maps

```text
[B,3,H,W] → shared filters → [B,32,H',W']
```

The 32 channels are **32 learned measurements**, not separate images.

Early layers measure local appearance; later layers combine it. Activations between layers make the hierarchy nonlinear.

## 4. Equivariance versus invariance

- **Equivariance:** move the object → response moves.
- **Invariance:** move the object → final answer stays.

Detection needs locations to move with objects. Classification often aggregates spatial features.

Stride, padding, and borders complicate exact equivariance.

## 5. Parameters and computation

With bias, a K × K layer has:

\[
K^2C_{\mathrm{in}}C_{\mathrm{out}}+C_{\mathrm{out}}
\]

Example: 3 × 3, three input channels, 32 outputs → **896 parameters**.

Work per image is approximately \(H_oW_oK^2C_{\mathrm{in}}C_{\mathrm{out}}\).

Double H/W → roughly 4× spatial work, unchanged parameter count.

## 6. Grouped and separable variants

| Operation | Mixing |
|---|---|
| Standard | Space and all channels |
| Grouped | Space and channels within groups |
| Depthwise | Space separately per channel |
| Pointwise 1 × 1 | Channels at one location |

Depthwise + pointwise, multiplier one, uses \(K^2C_{\mathrm{in}}+C_{\mathrm{in}}C_{\mathrm{out}}\) weights without biases.

For 3 × 3, 32 → 64 channels: **2,336** versus **18,432** standard weights.

It also restricts the transformation; hardware latency may not follow operation counts.

## 7. Minimal example

```python
layer = torch.nn.Conv2d(3, 32, kernel_size=3, padding=1)
features = torch.relu(layer(x))
```

At stride one, this padding preserves H/W.

## 8. Interview reasoning

**Question:** Why use convolution instead of a dense image layer?

**Answer:** Local shared weights reduce parameters and encode spatial structure. Resolution still controls activation cost; cheaper variants trade mixing flexibility for efficiency.
