# Entropy, cross-entropy, and distribution mismatch

## 1. Measure expected surprise

**Entropy** measures uncertainty under a distribution:

\[
H(p)=-\sum_i p_i\log p_i
\]

\(p_i\) is outcome i’s probability. Natural logs give units called **nats**. A certain outcome has entropy zero.

## 2. Score another distribution’s predictions

**Cross-entropy** measures prediction cost when outcomes follow p but predictions use q:

\[
H(p,q)=-\sum_i p_i\log q_i
\]

\(q_i\) is predicted probability. Assigning more probability to observed outcomes lowers the cost.

For one observed class y, the target puts all mass on y, giving loss \(-\log q_y\).

## 3. Calculate a mismatch

Actual outcomes are equally likely; the model predicts [0.9,0.1]:

```text
entropy:       −0.5 log(0.5) − 0.5 log(0.5) ≈ 0.693
cross-entropy: −0.5 log(0.9) − 0.5 log(0.1) ≈ 1.204
```

The model pays extra for favoring one outcome without supporting evidence.

## 4. Isolate that extra cost

**Kullback–Leibler (KL) divergence** is a directed distribution mismatch:

\[
D_{KL}(p\Vert q)=\sum_i p_i\log\frac{p_i}{q_i}=H(p,q)-H(p)
\]

The example gives about 0.511 nats. KL is nonnegative when defined and generally changes when p and q are exchanged.

## 5. Handle zeros

A positive-probability outcome assigned q=0 incurs infinite log loss. Zero target mass contributes zero under the limiting convention.

Stable software computes log probabilities directly from scores. Clipping probabilities changes the reported score and needs a stated rule.

## 6. Separate confidence and correctness

**Predictive entropy**, H(q), measures how concentrated the model’s own predictions are.

A confident wrong prediction can have low entropy and high loss: assigning 0.01 to the actual outcome costs about 4.605 nats.

## 7. Interview reasoning

**Question:** Why not minimize predictive entropy instead of cross-entropy?

**Answer:** Concentration alone does not identify the correct answer. Cross-entropy rewards probability on observed targets; entropy minimization alone can reward confident mistakes.
