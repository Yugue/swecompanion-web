# Direct preference optimization

## 1. Optimize preferences directly

**Direct preference optimization (DPO)** fits preferred/rejected pairs against a reference policy, replacing separate reward-model fitting and a sampled RL update loop.

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

DPO usually trains on fixed pairs; an RLHF loop samples from the changing policy. Fixed data is simpler but can miss newly generated failure modes.

## 6. Check the preference contract

Inspect label errors, length effects, and annotator bias. Validate actual correctness and reference drift independently of preference loss.

> **Reason it through:** Both response/reference ratios increase by the same factor. Does the DPO comparison margin improve? Why?
