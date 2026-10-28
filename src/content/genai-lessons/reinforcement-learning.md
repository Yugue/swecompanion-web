# Reinforcement learning foundations

## 1. Learn from outcomes

**Reinforcement learning (RL)** adjusts an action-selection rule using rewards from outcomes. A **policy** gives probabilities of actions given the current state. A **reward** is a numerical feedback signal.

For language generation, a state can be the prompt plus generated prefix, and an action the next token.

## 2. Follow an episode

An **episode** is a sequence of actions ending in an outcome. Its **return** aggregates rewards. A code-generation episode might receive reward one if tests pass and zero otherwise.

The reward evaluates the chosen behavior under a particular checker; it is not automatically a complete measure of usefulness.

## 3. Increase rewarded behavior

\[
J(\theta)=\mathbb{E}_{y\sim\pi_\theta(\cdot\mid x)}[R(x,y)]
\]
θ are policy parameters; x is a prompt; y a sampled response; \(\pi_\theta\) its probability distribution; R its reward. Maximizing J favors responses with higher expected reward under sampled prompts.

## 4. Assign credit

**Policy-gradient methods** change sampled actions’ log probabilities using outcome feedback. An **advantage** estimates how much better a sampled return is than a baseline for that state, reducing noise in the update.

```genai-visual
policy-loop
```

With terminal reward 1 and baseline 0.4, advantage is +0.6: encourage the sampled choices. Reward 0 gives −0.4: discourage them. One terminal score still leaves uncertainty about which token decisions mattered.

## 5. Constrain model drift

A **reference policy** is a fixed model used to measure change. A KL penalty can discourage the updated policy from drifting too far from it.

A stronger penalty preserves earlier behavior more aggressively but can restrict improvement on the reward objective.

## 6. Inspect the reward itself

**Reward hacking** means exploiting a reward rule without achieving the intended goal. Rewarding long answers can produce repetition; rewarding test passage can encourage checker-specific shortcuts.

Use independent evaluations and inspect high-reward failures. An improved training reward is evidence about the reward, not proof of general reasoning.
