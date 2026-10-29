# A complete Transformer block

## 1. Compose a reusable block

A **Transformer block** combines attention, a positionwise feed-forward network, residual additions, and normalization. Stacking blocks repeatedly mixes information across positions and transforms each position’s features.

A **residual connection** adds a branch’s input to its transformed output.

## 2. Normalize each position

**Layer normalization (LayerNorm)** standardizes one token’s feature coordinates:
\[
y_i=\gamma_i\frac{x_i-\mu}{\sqrt{\sigma^2+\epsilon}}+\beta_i
\]
x is that token’s feature vector; μ and σ² its feature mean and variance; γ and β learned gain and offset; ε a positive stabilizer; i indexes features.

The mean measures feature offset; variance measures average squared distance from that mean. Normalization operates independently of other batch examples. With x=[1,3], gain one, offset zero, and negligible ε, the result is [−1,1].

## 3. Compare RMS normalization

**Root-mean-square normalization (RMSNorm)** divides by root-mean-square magnitude without subtracting the mean:
\[
y_i=\gamma_i\frac{x_i}{\sqrt{\frac1d\sum_{j=1}^{d}x_j^2+\epsilon}}
\]
d is feature width; j indexes coordinates; γ is learned gain. For [1,3], unit gain and negligible ε give approximately [0.447,1.342]. Layer normalization and RMS normalization therefore preserve different information about feature offset.

## 4. Follow one convention

```genai-visual
transformer-block
```

This pre-normalized block computes u=x+Attention(Norm(x)), then y=u+FFN(Norm(u)). x, u, and y have the same shape.

Other models place normalization differently; do not assume one arrangement is universal.

## 5. Understand the bypass

A residual path gives signals and gradients an identity route around a transformation. The branch can learn a correction while preserving useful existing features.

Residual additions still require compatible scales. They help optimization without guaranteeing stability at arbitrary depth or learning rate.

## 6. Connect blocks to predictions

```llm-visual
decoder-pipeline
```

The block stack preserves token count and hidden width. Its final vocabulary projection changes each position's width from d to vocabulary size V; softmax normalizes those V scores.

During generation, the final prompt position predicts the next token. Earlier positions are also scored during training; their states do not each predict a separate future answer.
