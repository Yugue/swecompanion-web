# 5.3 Offline RL: improvement under dataset constraints

## 1. No new trial can correct an unsupported guess

**Offline Reinforcement Learning (offline RL)** improves a policy from a fixed collection of trajectories without additional environment interaction during training.

The motivation is strong when data already exists and new trials are expensive. The difficulty is that a policy can select actions outside the dataset's coverage without being able to observe their consequences and correct itself.

## 2. Off-policy does not mean offline-safe

An online off-policy learner can visit an apparently valuable unfamiliar action, discover it is bad, and update. A fixed-data learner may repeatedly bootstrap from the same optimistic unsupported prediction.

```text
unseen action → arbitrary high predicted Q → selected in backup
     ↑                                      ↓
     └──────── policy favors unseen action ←─┘
```

A larger buffer helps only if it adds relevant support, quality, or diversity. Duplicating narrowly collected transitions does not supply counterfactual evidence.

## 3. The distribution shifts twice

The learned policy can choose actions unlike the behavior's actions at familiar states. Those actions can also drive it toward unfamiliar future states.

Bootstrapping propagates errors from unsupported successors back into supported parts of the dataset. Ordinary supervised train-validation loss on logged transitions can look good while the resulting policy performs poorly.

## 4. Constrain policy improvement near evidence

One response is to favor actions resembling demonstrated or behavior-supported actions. This can use explicit divergence penalties, behavior models, or limited policy improvement rules.

The tradeoff is caution versus improvement. A tight constraint may preserve a poor behavior policy. A loose one may allow exploitation of unsupported values. Behavior modeling can itself be inaccurate, especially for multimodal actions or hidden mixtures of collection policies.

## 5. Conservative value learning penalizes optimism

A simplified discrete-action **Conservative Q-Learning (CQL)** regularizer illustrates a second response:

\[
L_{\mathrm{CQL}}=L_{\mathrm{Bellman}}+
\beta\,\mathbb E_{s\sim\mathcal D}
\left[\log\sum_a e^{Q(s,a)}-
\mathbb E_{a\sim\mathcal D(\cdot\mid s)}Q(s,a)\right]
\]

D is the dataset, beta a positive penalty weight, and L Bellman the detached-target fitting loss. The log-sum-exp term pushes down broadly high action values relative to values of dataset actions; the second term counterbalances that pressure on observed actions.

This is a representative mechanism, not every CQL implementation. Continuous action spaces need approximations to action integration. Theoretical lower-bound results have assumptions; a practical conservative critic is not a deployment safety certificate.

## 6. A numerical unsupported-action example

At one state, logged actions all choose left. Suppose the learned Q estimates are left=3 and right=100, but right has no observations. A greedy backup selects right because of the estimate, not evidence.

A behavior constraint may reject right. A conservative value penalty may reduce its unsupported advantage. Neither proves whether right is actually good. They control how aggressively a policy can exploit uncertainty that the dataset cannot resolve.

## 7. What the dataset must preserve

| Field or property | Why it matters |
|---|---|
| Actions and relevant observations | Define supported decisions |
| Rewards and boundary semantics | Construct valid return targets |
| Successors and timestamps | Preserve temporal dynamics |
| Behavior versions and propensities when available | Understand collection and evaluation |
| Failures, interventions, and scenario coverage | Reveal limits and selection bias |

Logged rewards may themselves be proxies. An offline policy can exploit their mistakes just as an online one can. Changed sensors, action interfaces, or reward conventions can invalidate reuse.

## 8. Compare imitation, offline RL, and online learning

Behavior cloning copies observed actions without needing reward labels. Offline RL uses rewards and sequential structure to seek improvement within the evidence. Online RL can collect new evidence but pays interaction cost and risk.

Start with behavior cloning and a no-change baseline. Seek independent policy evaluation, uncertainty analysis, and limited controlled validation before trusting improvement predicted by the training critic.
