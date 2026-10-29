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

Cross-entropy equals target entropy plus KL: H(p,q)=H(p)+D_KL(p∥q). The first term does not change when only q is trained.

This explains why fitting a target distribution can minimize cross-entropy or KL from that target. Swapping the KL direction changes the objective.

## 5. Use the right comparison

These quantities apply whenever one distribution should match another. For instance, a model can be encouraged to remain close to its starting predictions while it learns a new behavior. State which distribution supplies the averaging weights.

Low entropy alone cannot establish factual accuracy, and a low divergence only means agreement with the chosen reference. A flawed reference remains flawed.
