# Entropy, cross-entropy, and KL divergence

## 1. Measure uncertainty

**Entropy** is average uncertainty under a probability distribution:

\[
H(p)=-\sum_i p_i\log p_i
\]

i indexes token choices; p_i is their probability; log is natural logarithm. Zero-probability terms contribute zero. For [0.5,0.5], entropy is log 2; for [1,0], it is zero.

Concentration measures certainty about a choice, not truth.

## 2. Compare with a target

For target distribution p and predicted distribution q, **cross-entropy** is:

\[
H(p,q)=-\sum_i p_i\log q_i
\]

A hard target puts all mass on one observed token and recovers negative log target probability. A soft target can put mass on several plausible choices.

## 3. Isolate mismatch

**KL divergence** measures distribution mismatch:

\[
D_{KL}(p\Vert q)=\sum_i p_i\log\frac{p_i}{q_i}
\]

It is nonnegative, directional, and zero when the distributions agree. If p_i>0 but q_i=0, it is infinite.

For p=[1,0] and q=[0.5,0.5], KL is log 2. Reversing them gives infinity because the now-target distribution assigns mass where the prediction assigns zero.

## 4. Connect the quantities

Cross-entropy = target entropy + KL: H(p,q)=H(p)+D_KL(p∥q). When only q changes, H(p) is constant.

Minimizing cross-entropy therefore minimizes this KL direction. Reversing the direction changes the objective.

## 5. Use the right comparison

Use KL when fitting one distribution to another or constraining changes from a reference. State which distribution supplies the averaging weights.

Low entropy means concentration, not correctness. Low KL means agreement, not that the reference is right.

> **Reason it through:** A sharply peaked model agrees with a wrong reference. What do entropy and KL fail to establish?
