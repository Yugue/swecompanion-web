# 3.2 Deep Q-Networks: replay and stable targets

## 1. Keep the control backup, change the representation

A **Deep Q-Network (DQN)** predicts a vector of action values from an observation. With B inputs and A discrete actions, its output typically has shape B × A.

The policy often uses epsilon-greedy action selection. Learning still uses the Q-learning target from 2.6; the new challenge is making neural fitting stable enough to use that target.

## 2. Store transitions in replay

A **replay buffer** stores state, action, reward, successor, and boundary information. Random mini-batches break up the short-range correlation of adjacent interactions and reuse expensive experience.

Replay does not create independent environmental evidence. A million updates on one thousand transitions remain limited by those transitions' coverage. Capacity, sampling, and the ratio of updates to collected transitions affect both resource use and the distribution being fitted.

## 3. Separate online and target networks

```text
current observation → online network → selected Q value → loss
stored successor    → target network → max next Q     → fixed target
```

The **online network** is optimized. A **target network** is periodically copied from it, or updated slowly by an explicit averaging rule. Holding target parameters fixed for some updates reduces the moving-target feedback from 3.1.

A target network that changes too slowly can provide stale estimates. Changing too rapidly weakens the stabilizing separation.

## 4. The learning objective

\[
y_i=r_i+\gamma(1-d_i)\max_{a'}Q_{\bar\theta}(s_i',a'),\qquad
L(\theta)=\frac1B\sum_{i=1}^B\left[Q_\theta(s_i,a_i)-y_i\right]^2
\]

I indexes batch examples; B is batch size; d is one for genuine task termination and zero otherwise. Theta bar denotes target parameters. The target is fixed with respect to the gradient used to update theta.

The loss fits the value of the action actually stored, not all action outputs to the same target. A Huber loss is a common alternative: quadratic for small residuals and approximately linear for large ones, reducing sensitivity to extreme errors.

## 5. A tiny target computation

Assume torch, both networks, and correctly shaped batch tensors exist:

```python
with torch.no_grad():
    continuation = target_net(next_states).max(dim=1).values
    targets = rewards + gamma * (~terminated).float() * continuation
chosen_q = online_net(states).gather(1, actions[:, None]).squeeze(1)
loss = (chosen_q - targets).square().mean()
```

Use an explicit action index for each batch row. Do not accidentally broadcast a B-vector against a B × 1 tensor into a B × B loss.

## 6. Boundaries are part of the target

For reward 1, gamma=0.9, and maximum successor estimate 5, the target is 5.5 for a continuing transition and 1 for genuine termination.

An external time limit normally preserves a continuation value. If an environment automatically resets, the next observation may belong to a new episode; recover the stored final observation for the preceding transition. A correct mask with the wrong successor still creates an incorrect target.

## 7. What DQN fits well and poorly

| Situation | Fit |
|---|---|
| Modest discrete action set | Natural action-value vector and maximization |
| Expensive interactions with reusable data | Replay can improve sample efficiency |
| Continuous high-dimensional actions | Exact maximization becomes difficult |
| Very sparse long-horizon rewards | Ordinary random exploration may be inadequate |

Pixels can be encoded by a convolutional feature extractor, which shares local filters across image positions. DQN does not require pixels; simpler vector inputs can use a small fully connected network.

## 8. Training signals to inspect

Compare realized returns with predicted Q-values, replay ages, action frequencies, and episode lengths. Spiking loss after a target copy may be explainable; steadily growing values with flat reward suggest a deeper problem.

Warm up replay with enough varied experience to form useful batches. Tune exploration and learning jointly: aggressive fitting of a tiny early dataset can amplify arbitrary initial estimates.
