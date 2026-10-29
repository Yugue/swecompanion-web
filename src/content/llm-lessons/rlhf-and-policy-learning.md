# RLHF, reward models, and PPO

## 1. Build the feedback pipeline

**Reinforcement learning from human feedback (RLHF)** uses human judgments to construct rewards and improve a policy. A common pipeline starts with SFT, collects response comparisons, fits a **reward model**, and then optimizes the policy.

A **rubric** specifies judgment criteria. Preference for clear prose is different from verification of a numerical answer.

```genai-visual
rlhf-stages
```

## 2. Fit a comparison reward

For one prompt, let the preferred and rejected responses have reward scores r_w and r_l. A common comparison model predicts preference probability σ(r_w−r_l), where **sigmoid** is σ(a)=1/(1+e^(−a)).

A reward difference log 3 predicts probability 0.75. Train with negative log probability of the observed preference. Only score differences are identified by these pairwise labels; the scores are not probabilities of factual correctness.

## 3. Control policy drift

For a fixed prompt, a common objective maximizes:
\[
\mathbb E_{y\sim\pi_\theta}[r(x,y)]-\beta D_{KL}(\pi_\theta\Vert\pi_{ref})
\]
x is the prompt; y a sampled response; π_θ the trainable policy; r its reward; π_ref a reference policy; β a positive penalty strength. Expectation means the average over sampled responses, and typically prompts too.

The reference KL discourages drift. It cannot guarantee truth or prevent reward-model errors.

## 4. Explain PPO without a slogan

**Proximal policy optimization (PPO)** uses a clipped probability-ratio surrogate to limit the incentive for changing sampled actions too aggressively relative to the policy that collected them.

With old token probability 0.2 and new probability 0.3, the ratio is 1.5. For positive advantage and clip range 0.8–1.2, the clipped term stops rewarding increases past 1.2. This does not impose a hard bound on every actual update.

## 5. Identify reward hacking

**Reward hacking** improves measured reward by exploiting weaknesses of the scoring system. A policy may learn long polished answers that a reward model prefers even when they contain unsupported claims.

**Sycophancy** is agreement with the user despite contrary evidence. A preference dataset can encourage it if annotators reward agreement over correctness.

## 6. Evaluate outside the proxy

Track held-out human judgments, factual checks, appropriate refusals, answer length, and task success. Inspect new policy samples as training changes their distribution.

If reward increases while verified accuracy falls, examine the rubric and reward model before increasing optimization strength. More optimization of a flawed proxy can amplify the flaw.
