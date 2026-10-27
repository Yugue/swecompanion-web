# Entropy, cross-entropy, and distribution mismatch

## 1. Measure uncertainty before observing the outcome

**Entropy** is the expected surprise of outcomes under a distribution. Let \(p_i\) be the probability of outcome \(i\):

\[
H(p)=-\sum_i p_i\log p_i
\]

With natural logarithms, the unit is a **nat**. A certain outcome has entropy zero; equally likely alternatives have greater entropy.

## 2. Score predictions against outcomes

**Cross-entropy** uses the actual outcome distribution \(p\) to score a predicted distribution \(q\):

\[
H(p,q)=-\sum_i p_i\log q_i
\]

\(q_i\) is the model probability assigned to outcome \(i\). More probability on outcomes that actually occur lowers this cost.

For one observed label, the target distribution puts all mass on that label, giving loss \(-\log q_{\text{label}}\).

## 3. Work a two-outcome example

Suppose outcomes are equally likely but the model predicts [0.9, 0.1]:

```text
true entropy:   −0.5 log(0.5) − 0.5 log(0.5) ≈ 0.693
cross-entropy:  −0.5 log(0.9) − 0.5 log(0.1) ≈ 1.204
```

The extra cost reflects an unjustified preference for one outcome.

## 4. Isolate the mismatch

**Kullback–Leibler (KL) divergence** measures the directed gap:

\[
D_{KL}(p\Vert q)=\sum_i p_i\log\frac{p_i}{q_i}=H(p,q)-H(p)
\]

For the example, it is about 0.511 nats. KL is nonnegative when defined, but generally differs if \(p\) and \(q\) are exchanged. It is not a symmetric geometric distance.

## 5. Handle impossible predictions

If an outcome has positive true probability but the model assigns it zero, its log loss is infinite. Zero-probability target terms use the limiting convention that zero times its log contributes zero.

Stable implementations compute log probabilities from scores directly. Arbitrary numerical clipping changes the evaluated score, so use a stated convention.

## 6. Distinguish confidence from correctness

Low **predictive entropy**, \(H(q)\), means the model concentrates its predictions. It does not show the concentration is justified.

A model assigning 0.01 to the outcome that occurs has loss about 4.605, even if it was very confident in another outcome. Probability magnitude and observed correctness must be evaluated together.

## 7. Interview reasoning

**Question:** Why minimize cross-entropy rather than the model’s own entropy?

**Answer:** Cross-entropy rewards probability on observed targets. Minimizing predictive entropy alone can make every answer confidently wrong without teaching which outcome is correct.
