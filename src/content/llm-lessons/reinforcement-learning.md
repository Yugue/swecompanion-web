# Reinforcement learning for language models

## 1. Define the interaction

**Reinforcement learning (RL)** improves a **policy**, a rule assigning probabilities to actions, using **rewards**, numerical feedback on outcomes. For a language model, the state can be the prompt and generated prefix; an action is the next token.

## 2. Follow the learning loop

```genai-visual
policy-loop
```

The model samples a continuation; feedback scores what happened; a training update changes the policy. Rewards can arrive only after a complete answer even though many token choices contributed to it.

## 3. Define return and advantage

A **return** is accumulated reward over a sampled continuation. A **value baseline** estimates expected return from a state. **Advantage** compares a sampled return with that baseline: return 1 and baseline 0.4 give +0.6, encouraging the sampled actions.

If the return is zero with the same 0.4 baseline, advantage is −0.4 instead. The comparison is state dependent; it is not simply “reward positive means every action was good.”

## 4. See the update direction

A basic policy-gradient estimate weights the gradient of sampled-action log probability by advantage. Positive advantage encourages those actions; negative advantage discourages them, averaged over samples.

The signal attributes outcome feedback to choices without requiring a correct target token at every position. Noisy or incomplete rewards can reinforce the wrong behavior.

## 5. Contrast supervised and reward learning

| Supervised fine-tuning | Reinforcement learning |
|---|---|
| Supplies a desired response | Scores sampled outcomes |
| Trains probability on demonstration tokens | Changes sampled-action probabilities using feedback |
| Depends on demonstration quality | Depends on exploration and reward quality |

**Exploration** means sampling behavior that can reveal better outcomes. A model that never tries a useful alternative cannot learn its advantage from outcome feedback alone.
