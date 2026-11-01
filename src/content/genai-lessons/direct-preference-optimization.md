# Direct preference optimization

## 1. Optimize preferences directly

**Direct preference optimization (DPO)** learns from preferred/rejected outputs relative to a reference policy, using a direct comparison objective.

This simpler training procedure still depends on the quality and coverage of its preference data.

## 2. Compare relative changes

For prompt x and responses \(y_w\) and \(y_l\), define:
\[
\Delta=\log\frac{\pi_\theta(y_w\mid x)}{\pi_{ref}(y_w\mid x)}-\log\frac{\pi_\theta(y_l\mid x)}{\pi_{ref}(y_l\mid x)}
\]
\(\pi_\theta\) is the trainable policy and \(\pi_{\mathrm{ref}}\) the fixed reference. Sequence log probabilities sum token log probabilities under the chosen response masking convention.

## 3. Apply the pairwise loss

\[
L_{DPO}=-\log\sigma(\beta\Delta)
\]
σ is sigmoid. Positive β scales the pairwise margin and corresponds to the KL regularization coefficient in the underlying reward-optimization derivation. Increasing Δ reduces loss. Measure actual reference drift when tuning β; it is not a decoding temperature.

## 4. Follow a numerical comparison

```genai-visual
dpo-ratios
```

For ratios 2 and 0.5, δ=log(4); at β=1 the equation gives 0.8. This is a comparison probability, not an answer-correctness estimate.

The objective concerns a relative difference. It need not increase the absolute probability of every preferred response.

## 5. Compare with RLHF

Fixed-pair training lacks the same fresh policy-generated interaction as an online reward-driven loop. Evaluate which evidence the update actually receives.

Fixed data is simpler but can miss new failure modes produced after adaptation.

## 6. Check the preference contract

For multimodal comparisons, ensure annotators see the same conditioning media. Otherwise preference labels may encode input differences rather than response quality.

Preference optimization teaches what wins the comparisons; it does not guarantee truth, calibrated uncertainty, or robust safety.

For image-conditioned answers, both compared responses should share the same image and request. Otherwise the preference can reflect different input difficulty rather than which response better satisfies one condition.
