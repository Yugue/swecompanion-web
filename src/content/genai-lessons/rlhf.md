# Learning from human feedback

## 1. Learn what people prefer

**Reinforcement learning from human feedback (RLHF)** uses human feedback to construct a reward signal and improve a policy. A common language-model pipeline starts from supervised fine-tuning, learns a preference reward model, then optimizes the policy.

A **rubric** states how responses should be judged. Feedback represents that rubric and a particular annotator population, rather than a universal ordering of answers.

## 2. Collect comparisons

For one prompt, annotators compare candidate responses under explicit criteria. A **reward model** learns a scalar score predicting these preferences.

Writing quality, correctness, and safety may disagree. Preserve ambiguous judgments rather than treating every preference as objective truth.

## 3. Fit relative rewards

\[
P(y_w\succ y_l\mid x)=\sigma(r_\phi(x,y_w)-r_\phi(x,y_l))
\]
x is the prompt; \(y_w\) the preferred response; \(y_l\) the rejected response; \(r_\phi\) the reward model with parameters φ; σ(a)=1/(1+e^(−a)) is the sigmoid function. Larger reward differences predict stronger preference.

## 4. Optimize the policy

```genai-visual
rlhf-stages
```

Generate responses with the current policy, score them, estimate advantages, and update while controlling drift. The reward model can remain fixed while the policy changes, creating new opportunities to exploit its errors.

## 5. Understand PPO’s restraint

**Proximal policy optimization (PPO)** limits incentives for large changes relative to the policy that collected the samples:
\[
\begin{aligned}
c(\rho)&=\operatorname{clip}(\rho,1-\epsilon,1+\epsilon)\\
L_{clip}&=\min(\rho A,c(\rho)A)
\end{aligned}
\]
ρ is new/old action probability; A the advantage; ε the clip range. Maximize the average surrogate. With ρ=1.5, A=2, ε=0.2, the two terms are 3 and 2.4, so use 2.4.

Clipping removes further incentive from this term; it does not impose a hard bound on every update. A reference KL penalty is a separate control.

## 6. Evaluate beyond the reward

Check human preferences, factuality, refusals, diversity, and held-out tasks. Watch for verbosity and **sycophancy**, agreement with the user that overrides contrary evidence. A narrow judge also invites overoptimization.

More reward-model training does not solve an incomplete rubric. Audit the comparisons and the policy’s newly sampled outputs.
