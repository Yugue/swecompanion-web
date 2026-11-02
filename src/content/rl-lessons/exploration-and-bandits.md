# 2.4 Exploration through the bandit lens

## 1. Learning has an opportunity cost

Trying an unknown route sacrifices reward now to improve later choices. A **multi-armed bandit** isolates this tradeoff: actions yield rewards without changing modeled future states.

A **contextual bandit** also observes information, such as location, before choosing.

## 2. Action values and estimation uncertainty

Two routes can have equal estimated means after two versus 200 trials, yet different uncertainty about those means.

Explore missing knowledge. Preferring irreducibly noisy outcomes merely because their rewards vary can waste trials.

## 3. Epsilon-greedy is a useful baseline

**Epsilon-greedy** chooses a maximizing estimate with probability 1−ε and a uniform action with probability ε. ε controls exploration.

With K actions and one greedy action: greedy probability=1−ε+ε/K. For K=4, ε=0.2: probabilities are 0.85 and 0.05 for each alternative.

Fast ε decay can leave actions unexplored. Optimistic initial values encourage trials only if later evidence corrects them.

## 4. Upper confidence bounds target uncertainty

An **upper confidence bound (UCB)** combines estimated reward with an uncertainty bonus:

\[
\operatorname{score}_t(a)=\bar R_t(a)+c\sqrt{\frac{\log t}{N_t(a)}}
\]

R̄ₜ(a) is action a’s mean; Nₜ(a) its trial count; t total trial index; c exploration scale. Try unobserved actions first. More observations reduce the bonus.

This score assumes stationary bounded-reward bandits. It is not automatically a calibrated interval for changing sequential data.

## 5. Thompson sampling samples plausible worlds

**Thompson sampling** samples plausible reward parameters from their posterior, then chooses the best sampled action. Uncertain actions can win despite a lower mean.

For binary rewards, a **Beta distribution** models uncertainty about success probability. A Beta(1,1) prior plus three successes and one failure gives Beta(4,2), mean 4/6=2/3.

UCB chooses optimistically; Thompson sampling randomizes using uncertainty. Epsilon-greedy’s uniform trials ignore this information.

## 6. Regret compares choices with an informed baseline

**Regret** measures reward lost relative to an informed benchmark:

\[
\mathcal R_T=T\mu^*-\mathbb E\left[\sum_{t=1}^{T}R_t\right]
\]

T is trial count, μ* the best stationary action mean, and Rₜ obtained reward. The comparison assumes this stationary bandit model.

Regret counts reward spent during learning; final-policy evaluation measures behavior after learning. They answer different questions.

## 7. Why sequential exploration is harder

```text
bandit: choose uncertain action → observe its reward
RL: choose action → reach another state → unlock later choices → maybe reward
```

Random actions may never assemble the sequence needed to unlock a door. Sequential exploration must also discover useful states, not just immediate action rewards.

Changing traffic violates stationary bandit assumptions. Recent-window estimates or explicit change models may be needed.
