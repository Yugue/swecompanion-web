# The Transformer block

## 1. Mix tokens, then transform features

A **Transformer block** combines attention across positions with a shared per-position neural network. Residual paths and normalization support the stacked computation.

Attention decides which available representations to mix; the per-position network transforms the resulting feature coordinates nonlinearly.

## 2. Follow a pre-normalized block

```nlp-visual
transformer-block
```

One common **pre-normalization** form is:

\[
u=x+\operatorname{Attn}(\operatorname{LN}(x)),\qquad
 y=u+\operatorname{FFN}(\operatorname{LN}(u))
\]

\(x\) is the input sequence, \(u\) an intermediate sequence, \(y\) the output; Attn is attention, LN layer normalization, and FFN the feed-forward network. All residual-added sequences have matching shapes.

## 3. Preserve an additive route

A **residual connection** adds an input to a learned transformation of it. The block can change useful features without rebuilding the entire representation from nothing.

The additive route also provides a direct gradient path. It helps train depth, but does not guarantee a useful fit or prevent every instability.

## 4. Normalize within a token vector

**Layer normalization** uses the mean and variance of one example’s feature coordinates, with learned scale and offset.

For coordinate \(j\):

\[
\operatorname{LN}(h)_j=\gamma_j\frac{h_j-\mu}{\sqrt{v+\epsilon}}+\beta_j
\]

\(h\) is a token vector; \(\mu,v\) its coordinate mean and variance; \(\gamma_j,\beta_j\) learned values; \(\epsilon>0\) numerical stabilization.

It is not averaging that token with unrelated examples or replacing every feature by a sentence mean.

## 5. Expand and recombine features

A **positionwise feed-forward network** is an MLP applied separately to each token using shared weights. It commonly expands width, applies a nonlinear activation, then projects back.

It does not directly read another token. Attention supplies cross-position interaction; successive blocks alternate these complementary operations.

## 6. Keep architecture conventions visible

Other blocks normalize after residual addition or use different activations and gating. Do not mix equations from one convention with an implementation of another.

Training can include dropout. Evaluation mode changes such stochastic behavior while preserving the learned parameter values.

## 7. Interview reasoning

**Question:** If the feed-forward network processes each position separately, how can it use information from distant words?

**Answer:** Its input already contains context mixed by attention. It transforms those contextual coordinates locally; later attention can then share the transformed features again.
