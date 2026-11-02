# 5.5 Human feedback, reward models, and preference optimization

## 1. A useful response may lack an automatic reward

Humans may compare assistant responses more reliably than assign absolute quality scores. **RL from human feedback (RLHF)** learns a reward from judgments and optimizes a policy against it.

Changing the reward source does not remove coverage, proxy, or evaluation problems.

## 2. Map a language model into policy notation

A **language model** assigns probabilities to **tokens**, pieces of text, given preceding context. Sequence probabilities multiply token probabilities; sequence log probabilities add.

Prompt x supplies initial context; generated tokens y are actions. Context grows after each action. A completed-response reward can arrive at sequence end, including the end-token decision under the chosen convention.

## 3. Distinguish the three training roles

```text
demonstrations → supervised policy initialization
comparisons   → preference reward model
policy samples → reward scoring + regularization → policy update
```

**Supervised fine-tuning (SFT)** fits demonstrated responses. A **reward model** predicts preference quality. Policy optimization improves its reward-regularized objective using policy samples.

The critic predicts future training return; the reward model predicts preference quality. Equal output shapes do not make their targets interchangeable.

## 4. Learn a pairwise reward model

Fit a pairwise reward model:

\[
L_{\mathrm{RM}}(\psi)=-\mathbb E\log\sigma\left(r_\psi(x,y_w)-r_\psi(x,y_l)\right)
\]

ψ is reward-model weights; x prompt; yw preferred response; yl less preferred response; σ the sigmoid. The loss favors a higher score for yw.

Scores express relative preference under a model, not calibrated truth. Annotator disagreement, length, and selection bias can shape them.

## 5. Optimize reward while limiting drift

Optimize learned reward while penalizing drift from a reference policy:

\[
J(\theta)=\mathbb E_{x,\,y\sim\pi_\theta}
\left[r_\psi(x,y)-\beta\log\frac{\pi_\theta(y\mid x)}{\pi_{\mathrm{ref}}(y\mid x)}\right]
\]

θ is policy weights; β>0 regularization strength; πref reference policy. In expectation, the response log ratio is a KL penalty.

Reference KL anchors the training objective. PPO’s collection-policy ratio controls a local update; it serves a different role.

## 6. Direct preference optimization uses a different training route

**Direct preference optimization (DPO)** fits fixed preference pairs through relative policy likelihoods:

\[
z=\beta\left[\log\frac{\pi_\theta(y_w\mid x)}{\pi_{\mathrm{ref}}(y_w\mid x)}-
\log\frac{\pi_\theta(y_l\mid x)}{\pi_{\mathrm{ref}}(y_l\mid x)}\right],\qquad
L_{\mathrm{DPO}}=-\mathbb E\log\sigma(z)
\]

β is regularization scale; z compares preferred and rejected response log ratios against the reference. LDPO penalizes a small preferred-response margin.

Its reward-policy parameterization links preference fitting to KL-regularized optimization without a separate reward model or online rollouts during fitting. It still relies on preference assumptions and data; it is not ordinary imitation.

## 7. More reward can mean less quality

A policy can exploit reward-model preferences for verbosity, formatting, or persuasive wording while actual correctness worsens.

Use held-out judgments and task-grounded checks independent of reward scores. Reference regularization limits drift but does not prevent exploitation.

## 8. Choose the signal deliberately

| Available evidence | Suitable starting point |
|---|---|
| High-quality response demonstrations | Supervised initialization |
| Fixed comparisons, limited rollout budget | Direct preference fitting |
| A usable reward and new policy rollouts | Explicit reward-driven optimization |
| Objective executable success checks | Verified-outcome reward with coverage audits |

Choose a starting point from available evidence, then compare task quality and budget; the table is not a universal ranking.
