# 4.3 Residual backbones and hierarchical visual features

## 1. Learn a correction

A **residual block** is a network module that adds a learned correction F(x) to an input x through a **shortcut**, a path bypassing that learned branch:

\[
y=x+F(x)
\]

Example: x=[2,5], F(x)=[0.1,−0.2] → **y=[2.1,4.8]**.

If F is zero, the input passes through.

> Keep useful features; learn what needs changing.

This can make added depth easier to optimize.

## 2. The shortcut carries gradients

```cv-visual
residual
```

For a scalar:

\[
\frac{dy}{dx}=1+F'(x)
\]

The “1” comes from the shortcut. It supports flow without guaranteeing stability.

An **identity shortcut** passes x unchanged. Addition requires compatible shapes; **concatenation** instead joins arrays along an axis and changes that dimension.

## 3. When shapes differ

Example:
- Input: [B,64,H,W].
- Branch: [B,128,H/2,W/2].

A **projection shortcut** uses a learned transform to match dimensions. A 1 × 1 stride-two convolution can align the shortcut. It is then no longer pure identity.

A **bottleneck block** temporarily reduces channels to make the spatial convolution cheaper. It commonly uses:

**1 × 1 reduce channels → 3 × 3 spatial work → 1 × 1 restore channels.**

## 4. Backbone hierarchy

A **backbone** extracts features for a task head.

| Stage | Typical evidence |
|---|---|
| Early / fine | Edges, texture, precise location |
| Middle | Parts and larger local structure |
| Late / coarse | Broad context and task meaning |

Channels need not correspond to named concepts.

Classification can aggregate late features; localization often needs several stages.

## 5. Feature pyramids

A **Feature Pyramid Network (FPN)** combines backbone maps at several resolutions so fine maps also receive broad semantic context.

```text
fine features ───────────┐
                         + → context-rich fine features
coarse features → resize┘
```

**Lateral projections** transform each stage's channels to a compatible width. **Upsampling** increases a map's spatial resolution; the top-down path uses it to bring coarse context to fine maps.

**Image pyramid:** resized raw images.

**Feature pyramid:** multiscale learned representations.

## 6. Depth, width, resolution

- Depth: more transformation stages.
- Width: more channels.
- Resolution: more spatial evidence.

Example: adding channels cannot necessarily recover a tiny object lost during resizing.

Compare quality and serving cost under matched conditions.

## 7. Residuals and normalization

Residuals change **information paths**. **Feature normalization** recenters/rescales internal activations using selected statistics.

They complement the same convolutions and receptive-field rules; neither replaces correct shapes or useful input evidence.

## 8. Interview reasoning

**Question:** Why can extra plain layers worsen training error?

**Answer:** Optimization can become harder. Residual paths offer an identity-like solution and direct gradient contribution, letting layers learn useful corrections.
