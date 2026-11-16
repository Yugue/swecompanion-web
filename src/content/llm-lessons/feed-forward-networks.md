# Feed-forward networks and SwiGLU

## 1. Separate token and feature operations

A **feed-forward network (FFN)** transforms each position’s features independently with shared weights. Attention supplies cross-position information.

## 2. Expand and return

A common FFN maps width d to a larger intermediate width h, applies a nonlinear activation, then maps back to d. Returning to the original width permits adding the transformed vector back to its input in a complete block.

For d=4 and h=12, the two bias-free matrices hold 4×12+12×4=96 parameters. The expansion width is not the number of sequence positions.

## 3. Introduce a gate

A **gate** multiplies feature branches coordinate by coordinate, amplifying, suppressing, or changing contributions. Both branches read the same token state.

## 4. Recognize SwiGLU

**SwiGLU** is one gated FFN variant. One bias-free column-vector convention is:

\[
\begin{aligned}
g&=\operatorname{SiLU}(W_gx)\\
u&=W_ux\\
\operatorname{FFN}(x)&=W_o(g\odot u)\\
\operatorname{SiLU}(a)&=a/(1+e^{-a})
\end{aligned}
\]

Learned matrices \(W_g\) and \(W_u\) expand token vector x; \(W_o\) returns it to model width. u holds features, g gates them, and ⊙ multiplies matching coordinates. SiLU smoothly transforms each scalar a; its output is not restricted to [0,1].

```llm-visual
gated-ffn
```

## 5. Judge the capacity and cost

A gated FFN usually has two input projections and one output projection. Compare intermediate widths as well as activation choices.

More width increases parameters and computation; it cannot recover information absent from the input.

> **Reason it through:** An FFN expands feature width while keeping token count fixed. Where does information from another position enter?
