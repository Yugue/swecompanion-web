# Feed-forward networks and SwiGLU

## 1. Separate token and feature operations

A **feed-forward network (FFN)** transforms each position independently using weights shared across positions. Attention supplies cross-position information; the FFN recombines features already present in each state.

Computing many positions together in a matrix does not imply that the FFN reads one token's coordinates from another.

## 2. Expand and return

A common FFN maps width d to a larger intermediate width h, applies a nonlinear activation, then maps back to d. Returning to the original width permits adding the transformed vector back to its input in a complete block.

For d=4 and h=12, the two bias-free matrices hold 4×12+12×4=96 parameters. The expansion width is not the number of sequence positions.

## 3. Introduce a gate

A **gate** multiplies two feature branches element by element. One branch can amplify, suppress, or change the sign of contributions from the other.

Both branches read the same token state. The learned transformation can differ across inputs even though the weights are shared.

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

A gated FFN usually has two input projections and one output projection. Comparing it with a two-matrix FFN requires accounting for intermediate width as well as activation choice.

More intermediate features increase computation and parameter memory. Choose width using measured quality and resource budgets; a wider FFN cannot recover information excluded from the input.
