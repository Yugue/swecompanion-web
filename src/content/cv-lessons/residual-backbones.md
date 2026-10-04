# 4.3 Residual backbones and hierarchical visual features

## 1. Learn a correction

A residual block computes:

\[
y=x+F(x)
\]

Example: x=[2,5], F(x)=[0.1,−0.2] → **y=[2.1,4.8]**.

If F is zero, the input passes through.

> Keep useful features; learn what needs changing.

This can make added depth easier to optimize.

## 2. The shortcut carries gradients

```text
x ────────── identity ──────────┐
 └→ learned branch → F(x) ─────┴→ add → y
```

For a scalar:

\[
\frac{dy}{dx}=1+F'(x)
\]

The “1” comes from the shortcut. It supports flow without guaranteeing stability.

Addition requires compatible shapes; concatenation is a different operation.

## 3. When shapes differ

Example:
- Input: [B,64,H,W].
- Branch: [B,128,H/2,W/2].

A 1 × 1 stride-two projection can align the shortcut. It is then no longer pure identity.

A bottleneck commonly uses:

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

```text
fine features ───────────┐
                         + → context-rich fine features
coarse features → resize┘
```

Lateral projections align channels; top-down upsampling brings coarse context to fine maps.

**Image pyramid:** resized raw images.

**Feature pyramid:** multiscale learned representations.

## 6. Depth, width, resolution

- Depth: more transformation stages.
- Width: more channels.
- Resolution: more spatial evidence.

Example: adding channels cannot necessarily recover a tiny object lost during resizing.

Compare quality and serving cost under matched conditions.

## 7. Residuals and normalization

Residuals change **information paths**. Normalization changes **feature statistics**.

They complement the same convolutions and receptive-field rules; neither replaces correct shapes or useful input evidence.

## 8. Interview reasoning

**Question:** Why can extra plain layers worsen training error?

**Answer:** Optimization can become harder. Residual paths offer an identity-like solution and direct gradient contribution, letting layers learn useful corrections.
