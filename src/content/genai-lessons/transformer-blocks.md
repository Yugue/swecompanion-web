# A complete Transformer block

## 1. Compose a reusable block

A **Transformer block** alternates cross-position mixing with per-position transformation, using residual additions and normalization to support repeated composition.

A **residual connection** adds a branch’s input to its transformed output.

## 2. Separate the two jobs

Attention mixes information between allowed positions. A **feed-forward network (FFN)** transforms each position separately using shared weights, often expanding width and projecting back.

Some FFNs use a **gate**: a second learned branch multiplied elementwise with features to control their contribution. Neither branch directly reads another position; attention supplies that cross-position information.

## 3. Normalize each position

**Layer normalization (LayerNorm)** standardizes one token’s feature coordinates:
\[
y_i=\gamma_i\frac{x_i-\mu}{\sqrt{\sigma^2+\epsilon}}+\beta_i
\]
Here x is one state's feature vector; μ and σ² summarize those features. Learned γ and β rescale and shift, with positive ε stabilizing the denominator.

It operates independently of other batch examples. With x=[1,3], gain one, offset zero, and negligible ε, the result is [−1,1].

## 4. Compare RMS normalization

**Root-mean-square normalization (RMSNorm)** divides by root-mean-square magnitude without subtracting the mean:
\[
y_i=\gamma_i\frac{x_i}{\sqrt{\frac1d\sum_{j=1}^{d}x_j^2+\epsilon}}
\]
For D features, RMS normalization uses their root-mean-square magnitude and learned gain γ. Unlike centering LayerNorm, it retains an overall offset.

## 5. Follow one convention

```genai-visual
transformer-block
```

This pre-normalized block computes u=x+Attention(Norm(x)), then y=u+FFN(Norm(u)). x, u, and y have the same shape.

Other models place normalization differently; do not assume one arrangement is universal.

## 6. Understand the bypass

The residual route lets a patch or text state survive while the branch adds a learned correction; addition requires matching shapes.

Residual additions still require compatible scales. They help optimization without guaranteeing stability at arbitrary depth or learning rate.

## 7. Connect blocks to predictions

Token embeddings enter the stack; final states pass through normalization and the output head as configured. A decoder’s output at each input position scores the next token.

Count both attention and FFN computation. In many configurations, focusing only on the attention matrix misses substantial parameter and compute costs.

A block preserves token count while changing feature states. For a multimodal sequence, this lets information move between positions, but the input representation and attention pattern determine whether useful cross-modality evidence is accessible.
