# 5.5 Human feedback, reward models, and preference optimization

## 1. A useful response may lack an automatic reward

For an assistant response, correctness, helpfulness, and style can be difficult to encode in one hand-written function. Humans can sometimes compare two responses more reliably than assign absolute scores.

**Reinforcement Learning from Human Feedback (RLHF)** can learn a reward signal from such judgments and optimize a policy using it. It changes the source of reward, not the need for careful objectives, data coverage, and evaluation.

## 2. Map a language model into policy notation

A **language model (LM)** assigns probabilities to tokens conditioned on prior context. For prompt x and response tokens y, the sequence probability is a product of conditional token probabilities, so its log probability is a sum.

The prompt distribution supplies initial conditions. The generated tokens are actions; the context grows as generation proceeds. A sequence-end reward can score the completed response, including the end-of-sequence decision under the chosen convention.

The RL mechanisms do not require a detailed Transformer architecture derivation to understand this mapping.

## 3. Distinguish the three training roles

```text
demonstrations → supervised policy initialization
comparisons   → preference reward model
policy samples → reward scoring + regularization → policy update
```

**Supervised Fine-Tuning (SFT)** fits demonstrated responses. A reward model learns relative quality from comparisons. Policy optimization generates or uses policy experience to improve the reward-regularized objective.

A critic, if used, estimates the policy's future training return. That is a different job from a reward model estimating preference quality. The two should not be conflated merely because both output scalars.

## 4. Learn a pairwise reward model

\[
L_{\mathrm{RM}}(\psi)=-\mathbb E\log\sigma\left(r_\psi(x,y_w)-r_\psi(x,y_l)\right)
\]

Psi denotes reward-model parameters, y w a preferred response, y l a less-preferred one, and sigma the sigmoid function. The model assigns a higher score difference to the preferred member.

This comparison loss identifies relative scores under a modeling assumption; it does not make scores calibrated truth probabilities. Annotator disagreement, response-length correlations, and dataset selection can shape the learned proxy.

## 5. Optimize reward while limiting drift

\[
J(\theta)=\mathbb E_{x,\,y\sim\pi_\theta}
\left[r_\psi(x,y)-\beta\log\frac{\pi_\theta(y\mid x)}{\pi_{\mathrm{ref}}(y\mid x)}\right]
\]

Theta denotes policy parameters, beta a positive regularization weight, and pi ref a reference policy. In expectation, the log ratio is a KL penalty on response distributions under the specified prompt distribution.

This KL discourages large drift from a reference. It is conceptually different from PPO's update-to-collection-policy ratio; one anchors the training objective and the other controls a local optimization surrogate.

## 6. Direct preference optimization uses a different training route

**Direct Preference Optimization (DPO)** trains on fixed preference pairs using a relative policy likelihood loss. Define:

\[
z=\beta\left[\log\frac{\pi_\theta(y_w\mid x)}{\pi_{\mathrm{ref}}(y_w\mid x)}-
\log\frac{\pi_\theta(y_l\mid x)}{\pi_{\mathrm{ref}}(y_l\mid x)}\right],\qquad
L_{\mathrm{DPO}}=-\mathbb E\log\sigma(z)
\]

Under its reward-policy parameterization, preference fitting can optimize an objective related to KL-regularized reward optimization without separately training an explicit reward model or running an online rollout loop during that fitting step.

DPO remains dependent on the preference dataset and modeling assumptions. It should not be described as ordinary supervised imitation or as identical to online PPO-based RLHF.

## 7. More reward can mean less quality

As the policy changes, it can find responses unlike those used to train the reward model. Superficial verbosity, formatting, or persuasive wording may receive higher predicted reward without improving correctness.

Keep held-out human judgments, task-grounded checks, and failure categories separate from the training reward. Reference regularization can reduce drift but does not prove that a learned reward cannot be exploited.

## 8. Choose the signal deliberately

| Available evidence | Suitable starting point |
|---|---|
| High-quality response demonstrations | Supervised initialization |
| Fixed comparisons, limited rollout budget | Direct preference fitting |
| A usable reward and new policy rollouts | Explicit reward-driven optimization |
| Objective executable success checks | Verified-outcome reward with coverage audits |

These are starting points, not universal rankings. Evaluate the actual deployment task and budget.
