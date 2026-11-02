# 5.3 Offline RL: improvement under dataset constraints

## 1. No new trial can correct an unsupported guess

**Offline RL** improves a policy from fixed trajectories, with no new environment collection during training.

Unsupported action predictions cannot be corrected by trying them. Existing data must justify the proposed improvement.

## 2. Off-policy does not mean offline-safe

Online off-policy learning can discover that an unfamiliar high-Q action is bad. Offline learning may repeatedly bootstrap its unsupported optimism.

```text
unseen action → arbitrary high predicted Q → selected in backup
     ↑                                      ↓
     └──────── policy favors unseen action ←─┘
```

A larger buffer helps only by adding relevant coverage or quality. Duplicated narrow data supplies no new action-outcome evidence.

## 3. The distribution shifts twice

A policy can choose unfamiliar actions at familiar states, then reach unfamiliar successor states.

Bootstrapping spreads these errors into supported predictions. Low held-out loss on logged transitions can coexist with poor deployed behavior.

## 4. Constrain policy improvement near evidence

A **behavior constraint** limits policy movement toward unsupported actions, using behavior models, divergence penalties, or restricted improvement rules.

Tight constraints may preserve poor behavior; loose constraints allow extrapolation errors. Behavior models can also miss multimodal or mixed collection policies.

## 5. Conservative value learning penalizes optimism

**Conservative Q-learning (CQL)** penalizes broadly optimistic values relative to dataset actions. One discrete-action form is:

\[
L_{\mathrm{CQL}}=L_{\mathrm{Bellman}}+
\beta\,\mathbb E_{s\sim\mathcal D}
\left[\log\sum_a e^{Q(s,a)}-
\mathbb E_{a\sim\mathcal D(\cdot\mid s)}Q(s,a)\right]
\]

D is data; β>0 penalty strength; LBellman detached-target fitting loss. Log-sum-exp presses high action values downward; subtracting observed-action values counterbalances this pressure on data-supported actions.

Continuous variants approximate action integration. This illustrates the mechanism; lower-bound guarantees need assumptions and do not certify deployment safety.

## 6. A numerical unsupported-action example

All logged actions choose left. Learned Q(left)=3 and Q(right)=100 make greedy control prefer an unobserved right action.

A behavior constraint can reject right; a conservative penalty can reduce its advantage. Neither establishes right’s true outcome.

## 7. What the dataset must preserve

| Field or property | Why it matters |
|---|---|
| Actions and relevant observations | Define supported decisions |
| Rewards and boundary semantics | Construct valid return targets |
| Successors and timestamps | Preserve temporal dynamics |
| Behavior versions and propensities when available | Understand collection and evaluation |
| Failures, interventions, and scenario coverage | Reveal limits and selection bias |

Changing sensors, reward definitions, or action interfaces can invalidate data reuse. Offline learning can exploit a logged reward proxy just as online learning can.

## 8. Compare imitation, offline RL, and online learning

BC copies actions without rewards. Offline RL uses rewards and sequential structure for evidence-constrained improvement. Online RL can gather missing evidence at collection cost.

Compare with BC and unchanged behavior. Seek independent evaluation and controlled validation rather than trusting the training critic.
