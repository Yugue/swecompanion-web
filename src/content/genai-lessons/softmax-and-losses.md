# Softmax, entropy, and learning objectives

## 1. Turn scores into probabilities

**Softmax** converts real-valued scores, called **logits**, into probabilities over a finite set of alternatives. Increasing one score relative to the others raises its probability.

Equal logits [0,0] produce probabilities [0.5,0.5]. Adding the same constant to all logits leaves the result unchanged.

## 2. Normalize the scores

\[
p_i=\frac{\exp(z_i)}{\sum_{j=1}^{V}\exp(z_j)}
\]
i and j index V alternatives; z is the logit vector; \(p_i\) is output probability. Subtracting the largest logit before exponentiation improves numerical stability without changing p.

## 3. Measure uncertainty

**Entropy** measures spread in a distribution:
\[
H(p)=-\sum_i p_i\log p_i
\]
For two classes, [0.5,0.5] has greater entropy than [0.99,0.01]. Low entropy means concentration, not correctness.

## 4. Penalize incorrect predictions

A **loss** is a scalar training penalty. **Cross-entropy** measures prediction cost under model probabilities q when outcomes follow p:
\[
H(p,q)=-\sum_i p_i\log q_i
\]
For one observed target y, this becomes −log \(q_y\). Giving the correct target probability 0.1 costs about 2.303; probability 0.9 costs about 0.105.

## 5. Compare distributions

**Kullback–Leibler (KL) divergence** measures directed mismatch:
\[
D_{KL}(p\Vert q)=\sum_i p_i\log\frac{p_i}{q_i}=H(p,q)-H(p)
\]
p is the reference distribution and q the comparison. Reversing them generally changes the result. Assigning zero q probability where p is positive makes this direction infinite.

## 6. Use a stable loss

**PyTorch** is a tensor and neural-network library. Its cross-entropy operation accepts scores directly:

```python
loss = torch.nn.functional.cross_entropy(logits, targets)
```
Here logits are raw class scores and targets are integer class IDs. This operation combines log-softmax and target selection; applying softmax first changes the intended input.
