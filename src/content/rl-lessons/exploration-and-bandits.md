# 2.4 Exploration through the bandit lens

## 1. Learning has an opportunity cost

Two delivery routes have unknown mean travel rewards. Always selecting the current estimated best route may never discover a better one. Trying alternatives spends reward now to improve future choices.

A **multi-armed bandit** isolates this problem: choose an action, observe its reward, repeat. Actions do not change a sequential environment state in the modeled objective. A **contextual bandit** adds information such as location or time before the choice.

## 2. Action values and estimation uncertainty

Estimate each action's mean reward using its observed outcomes. A route sampled twice can have the same mean as one sampled 200 times but much greater uncertainty about that mean.

Distinguish randomness in rewards from uncertainty caused by missing observations, as in 1.2. Merely preferring high-variance outcomes can waste trials on irreducible noise.

## 3. Epsilon-greedy is a useful baseline

With probability 1−epsilon choose a maximizing estimated action; with probability epsilon sample an action uniformly. Epsilon is an exploration probability, not a learning rate.

For K actions and a unique greedy action, that action receives probability 1−epsilon+epsilon/K. With K=4 and epsilon=0.2, the greedy action is chosen with probability 0.85 and each other action with 0.05.

Decaying epsilon exploits more later, but decaying too rapidly can leave alternatives poorly measured. Optimistic initial values encourage early sampling only when updates can eventually correct that optimism.

## 4. Upper confidence bounds target uncertainty

A common **Upper Confidence Bound (UCB)** score for a stationary bounded-reward bandit is:

\[
\operatorname{score}_t(a)=\bar R_t(a)+c\sqrt{\frac{\log t}{N_t(a)}}
\]

R bar is the current sample mean, Nt(a) the number of trials of action a, t the total trial index, and c an exploration scale. Try unobserved actions before using the formula.

The bonus declines as an action is measured more often. Its interpretation relies on reward and sampling assumptions; a familiar formula is not automatically a calibrated confidence interval for arbitrary changing RL data.

## 5. Thompson sampling samples plausible worlds

**Thompson sampling** maintains uncertainty over unknown action-reward parameters, samples a plausible parameter for each action, and selects the best sampled action.

For binary rewards, a Beta prior combines with observed successes and failures to form a Beta posterior over each action's success probability. An uncertain action can win the sampled comparison even when its current posterior mean is lower.

A Beta distribution describes uncertainty about a probability between zero and one. Starting with a uniform Beta(1,1) prior, three successes and one failure produce Beta(4,2): add successes to the first parameter and failures to the second, giving posterior mean 4/(4+2)=2/3.

UCB acts optimistically; Thompson sampling randomizes according to uncertainty. Both exploit information that epsilon-greedy's uniform exploration ignores.

## 6. Regret compares choices with an informed baseline

\[
\mathcal R_T=T\mu^*-\mathbb E\left[\sum_{t=1}^{T}R_t\right]
\]

T is the number of trials, mu star the best stationary action mean, and R the obtained rewards. Regret measures reward lost relative to repeatedly choosing the best known-in-hindsight action under this bandit model.

Regret is not identical to final-policy evaluation: one concerns rewards spent during learning, while the other can focus on behavior after learning ends.

## 7. Why sequential exploration is harder

```text
bandit: choose uncertain action → observe its reward
RL: choose action → reach another state → unlock later choices → maybe reward
```

Random action noise may never produce a coherent sequence required to open a door. An action with low immediate reward may be essential for reaching informative states. Bandit confidence bonuses do not solve long-horizon exploration by themselves.

Changing traffic also breaks a stationary bandit assumption. Recent-window estimates or explicit nonstationarity models may be needed instead of averaging all historical outcomes equally.
