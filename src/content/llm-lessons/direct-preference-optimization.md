# Direct preference optimization

## 1. Optimize preferences directly

**Direct preference optimization (DPO)** trains a policy from preferred and rejected response pairs using a reference policy. It replaces the usual separate reward-model and reinforcement-learning stages with a direct pairwise objective.

This simpler training procedure still depends on the quality and coverage of its preference data.

## 2. Compare relative changes

For prompt x, preferred response \(y_w\), and rejected response \(y_l\):
\[
\begin{aligned}
u_w&=\log\frac{\pi_\theta(y_w\mid x)}{\pi_{ref}(y_w\mid x)}\\
u_l&=\log\frac{\pi_\theta(y_l\mid x)}{\pi_{ref}(y_l\mid x)}\\
\Delta&=u_w-u_l
\end{aligned}
\]
\(\pi_\theta\) is the trainable policy; \(\pi_{\mathrm{ref}}\) is fixed. The u terms measure changes relative to that reference. Sequence log probabilities sum scored response-token log probabilities; ordinary DPO does not average them by response length.

## 3. Apply the pairwise loss

\[
L_{DPO}=-\log\sigma(\beta\Delta)
\]
σ is the sigmoid introduced in RLHF. Positive β scales the margin and corresponds to the reference KL coefficient in the underlying derivation. Increasing Δ reduces loss. β changes the training signal; measure actual policy drift when tuning it.

## 4. Follow a numerical comparison

```genai-visual
dpo-ratios
```

Suppose the preferred response’s policy/reference probability ratio is 2 and the rejected response’s ratio is 0.5. Then Δ=log 4, so β=1 gives preference probability 0.8.

The objective concerns a relative difference. It need not increase the absolute probability of every preferred response.

## 5. Compare with RLHF

DPO typically trains on fixed comparison pairs and does not need policy sampling inside each training step. A standard RLHF loop samples from the changing policy and scores those outputs.

Fixed data is simpler but can miss new failure modes produced after adaptation.

## 6. Check the preference contract

Length, formatting, annotator bias, and mislabeled pairs can shape the update. Compare against the starting policy on independent tasks and inspect losses by response length.

Preference optimization teaches what wins the comparisons; it does not guarantee truth, reliable uncertainty estimates, or robust safety.
