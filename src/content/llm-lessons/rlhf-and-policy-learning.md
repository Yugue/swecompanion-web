# RLHF, reward models, and PPO

## 1. Build the feedback pipeline

**Reinforcement learning from human feedback (RLHF)** uses human judgments to train rewards and improve a policy. A common sequence is SFT → comparisons → **reward model** (a learned response scorer) → policy optimization.

A **rubric** specifies judgment criteria. Preferred writing style is not proof of correctness.

```genai-visual
rlhf-stages
```

## 2. Fit a comparison reward

For reward scores r_w (preferred) and r_l (rejected), predict preference with **sigmoid**, σ(r_w−r_l), where σ(a)=1/(1+e^(−a)).

Difference log 3 → probability 0.75. Minimize negative log observed-preference probability. These labels identify score differences, not factual-confidence probabilities.

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

Check held-out task success, factuality, refusals, length, and human preference. If reward rises while verified accuracy falls, inspect the rubric and newly sampled outputs.

> **Reason it through:** Learned reward rises while independently checked correctness falls. Which feedback assumptions would you inspect?
