# 4.4 Continuous control with off-policy actor–critics

## 1. Avoid an expensive maximization at every decision

A robot chooses a vector of continuous motor torques. A discrete value method cannot enumerate every possible vector to find its maximum.

**Deep Deterministic Policy Gradient (DDPG)** learns an actor mu(s) that proposes a continuous action and a critic Q(s,a) that evaluates it. The actor approximates the action-maximization step through gradient learning.

## 2. Learn a critic from replay

\[
y=r+\gamma(1-d)Q_{\bar\phi}(s',\mu_{\bar\theta}(s'))
\]

Theta denotes actor parameters, phi critic parameters, and bars slowly updated target parameters. D indicates genuine termination. Fit Q phi(s,a) to the detached target y using replayed transitions.

Unlike discrete Q-learning, the next action comes from the target actor. Replay can contain earlier exploratory behavior; the target describes the chosen continuation policy.

## 3. Differentiate the critic through the actor

\[
\nabla_\theta J_{\mathrm{actor}}
=\mathbb E_{s\sim\mathcal D}
\left[\nabla_a Q_\phi(s,a)\big|_{a=\mu_\theta(s)}
\nabla_\theta\mu_\theta(s)\right]
\]

D is the replay-state distribution. The chain rule asks how changing the action changes predicted value, then how actor parameters change that action. The environment remains outside the differentiated computation.

This is a replay-state actor surrogate. Do not silently identify every replay-state gradient with the exact start-state performance gradient under a different visitation distribution.

## 4. What gets gradients in an actor update

```text
replay state → actor parameters → proposed action → critic function → value
                 ↑                                  │
                 └──── derivative through action ────┘
```

A minimizing actor loss is minus mean Q(s,mu(s)). Hold critic parameters fixed for this optimizer step while preserving its derivative with respect to action. Detaching the proposed action would break the actor's learning path.

A deterministic actor needs an explicit exploration mechanism during collection, often added action noise and initial random actions. Clip or transform commands to valid actuator bounds.

## 5. Why the actor can exploit the critic

A critic is least reliable for actions poorly represented in replay. The actor searches its predictions and can discover spuriously high values, producing a feedback loop of bad actions and optimistic targets.

**Twin Delayed DDPG (TD3)** addresses this with three linked mechanisms: smaller-of-two target critics, slower actor updates, and smoothed target actions. These are responses to approximation error, not a guarantee of safe control.

## 6. The TD3 target

\[
\widetilde a'=\operatorname{clip}\left(\mu_{\bar\theta}(s')+
\operatorname{clip}(\xi,-c,c),a_{\min},a_{\max}\right),\qquad
\xi\sim\mathcal N(0,\sigma^2I)
\]

\[
y=r+\gamma(1-d)\min_{j\in\{1,2\}}Q_{\bar\phi_j}(s',\widetilde a')
\]

Xi is Gaussian target noise, c limits that noise, and action bounds limit the final action. Both critics fit this target. Smoothing discourages sharp unsupported value peaks near the actor's proposed action.

Target noise is different from exploration noise: it changes the learning target rather than directly collecting new behavior.

## 7. Delayed updates and target averaging

TD3 performs actor and target updates less frequently than critic updates so the actor is less likely to exploit a poorly fitted critic. Its actor commonly maximizes the first critic, while the target uses the minimum of two.

A target averaging convention is theta bar ← (1−tau) theta bar + tau theta, with small positive tau. Some codebases parameterize the retained old weight instead; check the equation before comparing named hyperparameters.

## 8. Numerical target and tradeoffs

Let the smoothed successor action have target critic values 8 and 5, reward=1, gamma=0.9, and no termination. TD3's target is 1+0.9×5=5.5, whereas using the larger estimate would give 8.2.

| Mechanism | Intended effect | Limitation |
|---|---|---|
| Twin target minimum | Reduce optimistic targets | Can introduce underestimation |
| Delayed actor updates | Improve critic before exploiting it | More critic work per policy update |
| Target smoothing | Reduce exploitation of narrow peaks | Sensitive to action scale and bounds |
