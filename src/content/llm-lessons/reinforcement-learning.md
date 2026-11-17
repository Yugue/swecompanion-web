# Reinforcement learning for language models

## 1. Define the interaction

**Reinforcement learning (RL)** improves a **policy**, a rule assigning probabilities to actions, using **rewards**, numerical feedback on outcomes. For a language model, the state can be the prompt and generated prefix; an action is the next token.

## 2. Follow the learning loop

```genai-visual
policy-loop
```

Sample a continuation → score its outcome → update the policy. A delayed reward must influence the earlier token choices that produced it.

## 3. Define return and advantage

A **return** is accumulated reward over a sampled continuation. A **value baseline** estimates expected return from a state. **Advantage** compares a sampled return with that baseline: return 1 and baseline 0.4 give +0.6, encouraging the sampled actions.

If the return is zero with the same 0.4 baseline, advantage is −0.4 instead. The comparison is state dependent; it is not simply “reward positive means every action was good.”

## 4. See the update direction

A policy-gradient estimate weights sampled-action log-probability gradients by advantage. Positive advantage encourages those choices; negative advantage discourages them, averaged over samples.

This supplies feedback without a correct target token at every step. Bad rewards can reinforce bad behavior.

## 5. Contrast supervised and reward learning

| Supervised fine-tuning | Reinforcement learning |
|---|---|
| Supplies a desired response | Scores sampled outcomes |
| Trains probability on demonstration tokens | Changes sampled-action probabilities using feedback |
| Depends on demonstration quality | Depends on exploration and reward quality |

**Exploration** means sampling behavior that can reveal better outcomes. A model that never tries a useful alternative cannot learn its advantage from outcome feedback alone.

> **Reason it through:** A response earns positive reward but less than its baseline. What update direction does its advantage suggest?
