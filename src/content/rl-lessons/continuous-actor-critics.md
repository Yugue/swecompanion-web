# 4.4 Continuous control with off-policy actor–critics

## 1. Avoid an expensive maximization at every decision

Motor torques are continuous: enumerating every action is impossible. **Deep Deterministic Policy Gradient (DDPG)** learns actor μ(s) to propose actions and critic Q(s,a) to evaluate them.

The actor learns an approximate maximizer of the critic rather than searching all actions at decision time.

## 2. Learn a critic from replay

The target actor supplies the next action for critic fitting:

\[
y=r+\gamma(1-d)Q_{\bar\phi}(s',\mu_{\bar\theta}(s'))
\]

r is reward; γ discount; d genuine termination. θ is actor weights, φ critic weights, and bars mark slow targets. Fit Qφ(s,a) to detached y using replay.

Collection may use earlier exploratory policies; the target specifies the desired continuation.

## 3. Differentiate the critic through the actor

The actor follows the critic’s derivative through its action:

\[
\nabla_\theta J_{\mathrm{actor}}
=\mathbb E_{s\sim\mathcal D}
\left[\nabla_a Q_\phi(s,a)\big|_{a=\mu_\theta(s)}
\nabla_\theta\mu_\theta(s)\right]
\]

D is replay-state distribution. ∇ₐQ gives value’s sensitivity to action; ∇θμ gives action’s sensitivity to actor weights. The environment is outside this derivative.

This replay-state surrogate is not automatically the exact start-state gradient under a different visitation distribution.

## 4. What gets gradients in an actor update

```text
replay state → actor parameters → proposed action → critic function → value
                 ↑                                  │
                 └──── derivative through action ────┘
```

Minimize −mean Q(s,μ(s)). Hold critic weights fixed for this step while retaining its derivative with respect to action. Detaching the proposed action breaks actor learning.

A deterministic actor needs collection exploration, often initial random actions and later action noise. Enforce valid actuator bounds.

## 5. Why the actor can exploit the critic

The actor can exploit spuriously high critic predictions in poorly covered action regions, reinforcing bad actions and optimistic targets.

**Twin Delayed DDPG (TD3)** adds twin target critics, delayed actor updates, and target-action smoothing to reduce approximation-error feedback.

## 6. The TD3 target

TD3 perturbs the target action, then evaluates the smaller target critic:

\[
\widetilde a'=\operatorname{clip}\left(\mu_{\bar\theta}(s')+
\operatorname{clip}(\xi,-c,c),a_{\min},a_{\max}\right),\qquad
\xi\sim\mathcal N(0,\sigma^2I)
\]

\[
y=r+\gamma(1-d)\min_{j\in\{1,2\}}Q_{\bar\phi_j}(s',\widetilde a')
\]

ξ is Gaussian target noise with scale σ; c clips noise; amin,amax bound actions; j indexes two target critics. Both critics fit y. Smoothing discourages narrow unsupported peaks.

Target noise changes the learning target; exploration noise changes collected actions. They serve different purposes.

## 7. Delayed updates and target averaging

Update the actor and targets less often than critics so values improve before the actor exploits them. The actor commonly maximizes critic one; targets use both critics’ minimum.

Slow averaging uses θ̄←(1−τ)θ̄+τθ for small positive τ. Some implementations name the retained old-weight coefficient instead; compare equations.

## 8. Numerical target and tradeoffs

Successor critics [8,5], reward 1, and γ=0.9 give TD3 target 5.5. Using the larger critic would give 8.2.

| Mechanism | Intended effect | Limitation |
|---|---|---|
| Twin target minimum | Reduce optimistic targets | Can introduce underestimation |
| Delayed actor updates | Improve critic before exploiting it | More critic work per policy update |
| Target smoothing | Reduce exploitation of narrow peaks | Sensitive to action scale and bounds |
