# 3.2 Deep Q-Networks: replay and stable targets

## 1. Keep the control backup, change the representation

A **Deep Q-Network (DQN)** predicts discrete-action values. B observations and A actions produce a [B,A] output.

It commonly collects epsilon-greedy experience and fits Q-learning targets. Neural approximation makes stabilization necessary.

## 2. Store transitions in replay

Replay stores observation, action, reward, successor, and boundary flags. Random mini-batches reduce adjacent-transition correlation and reuse experience.

More updates do not create more evidence. Buffer coverage, capacity, sampling, and updates per interaction determine what gets fitted.

## 3. Separate online and target networks

```text
current observation → online network → selected Q value → loss
stored successor    → target network → max next Q     → fixed target
```

The **online network** learns; a **target network** supplies slowly changing continuation values. Copy online weights periodically or update targets by slow averaging.

Too-fast target changes weaken stabilization; too-slow changes leave stale predictions.

## 4. The learning objective

Fit the stored action’s prediction to a detached target:

\[
y_i=r_i+\gamma(1-d_i)\max_{a'}Q_{\bar\theta}(s_i',a'),\qquad
L(\theta)=\frac1B\sum_{i=1}^B\left[Q_\theta(s_i,a_i)-y_i\right]^2
\]

i indexes B batch items; rᵢ is reward; γ discount; dᵢ=1 at genuine termination. θ is online weights; θ̄ target weights; a′ ranges over next actions.

A **Huber loss** is quadratic near zero residual and approximately linear for large residuals, reducing sensitivity to extremes. Do not fit every action output to one stored-action target.

## 5. A tiny target computation

Assume torch, networks, and correctly shaped tensors exist:

```python
with torch.no_grad():
    continuation = target_net(next_states).max(dim=1).values
    targets = rewards + gamma * (~terminated).float() * continuation
chosen_q = online_net(states).gather(1, actions[:, None]).squeeze(1)
loss = (chosen_q - targets).square().mean()
```

Keep targets and chosen_q both [B]. Mixing [B] and [B,1] can broadcast into an unintended [B,B] loss.

## 6. Boundaries are part of the target

Reward 1, γ=0.9, and maximum successor value 5 give target 5.5 for continuation and 1 for genuine termination.

For external truncation, use the final observation before reset. A correct mask with the wrong successor still creates the wrong target.

## 7. What DQN fits well and poorly

| Situation | Fit |
|---|---|
| Modest discrete action set | Natural action-value vector and maximization |
| Expensive interactions with reusable data | Replay can improve sample efficiency |
| Continuous high-dimensional actions | Exact maximization becomes difficult |
| Very sparse long-horizon rewards | Ordinary random exploration may be inadequate |

Pixels can use a **convolutional encoder**, which shares local filters across positions. Vector observations can use a small fully connected network; DQN does not require images.

## 8. Training signals to inspect

Compare realized return with Q-values, replay age, action counts, and episode lengths. Growing values with flat reward suggest unsupported targets.

Collect varied replay before aggressive fitting. A target-copy loss spike and persistent value divergence require different responses.
