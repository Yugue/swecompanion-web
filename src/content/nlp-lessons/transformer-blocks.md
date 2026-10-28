# The Transformer block

## 1. Mix tokens, transform features

A **Transformer block** combines attention with a **positionwise feed-forward network (FFN)**: an MLP applied separately at each token with shared weights.

A **residual connection** adds the input to its transformed result. **Layer normalization** (LN) recenters and rescales one token’s feature coordinates.

## 2. Follow a pre-normalized block

```nlp-visual
transformer-block
```

In **pre-normalization**, normalize before each learned branch:

\[
u=x+\operatorname{Attn}(\operatorname{LN}(x)),\qquad y=u+\operatorname{FFN}(\operatorname{LN}(u))
\]

x is input sequence; u intermediate; y output. Attn means attention, LN layer normalization, FFN feed-forward network. Added tensors have matching shapes.

## 3. Keep a residual route

The shortcut preserves an additive information and gradient path. The learned branch supplies a correction rather than rebuilding the representation.

## 4. Normalize one token’s features

For token vector h:

\[
\operatorname{LN}(h)_j=\gamma_j\frac{h_j-\mu}{\sqrt{v+\epsilon}}+\beta_j
\]

h is token vector; j coordinate; μ,v its coordinate mean/variance; γ,β learned scale/offset; ε>0 stabilization.

For h=[1,3], unit scales, zero offsets, and ignoring epsilon, output=[−1,1]. Other batch examples do not determine these statistics.

## 5. Recombine each position’s features

The FFN commonly expands width → applies activation → projects back.

It receives context already mixed by attention; it does not itself read neighboring positions.

## 6. Keep conventions consistent

Other variants normalize after additions or change activations and gating. Match equations, diagram, and implementation.

Dropout affects training/evaluation behavior, not the identity of learned weights.
