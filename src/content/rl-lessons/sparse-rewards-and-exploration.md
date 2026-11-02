# 6.2 Difficult exploration and long-horizon tasks

## 1. An update cannot exploit success it never observes

A maze may reward only a rare correct sequence. Zero-reward failures offer little evidence about which early actions enable success.

Separate **discovery** of informative experience from **credit assignment** after discovery. Better values primarily help the second.

## 2. Coherent behavior beats independent action noise

Ten specific independent binary choices succeed randomly with probability 1/1024. More network width does not itself improve that chance.

Persistent goals, demonstrations, skills, or easier initial tasks can produce coherent exploration. Measure success discovery per interaction.

## 3. Intrinsic rewards encourage information or novelty

An **intrinsic reward** comes from learner-defined novelty, prediction error, or uncertainty rather than task success. It can encourage visits or informative trials.

The **noisy television** failure rewards endlessly unpredictable but useless observations. Prediction-error bonuses can chase irreducible randomness.

Log intrinsic and task rewards separately: novelty progress may hide stagnant task success.

## 4. Curricula change what is learnable now

A **curriculum** starts with easier goals, shorter distances, or accessible resets, then increases difficulty. It supplies useful experience before the hardest task is reachable.

Keep final evaluation fixed. Rising scores on easier evaluations do not establish transfer to the intended task.

## 5. Goal conditioning shares learning across objectives

A **goal-conditioned policy** receives a goal g along with state s. Its value predicts return toward that goal:

\[
Q(s,a,g)=\mathbb E[G_t\mid s,a,g]
\]

Q is action value, a initial action, and Gₜ goal-specific return. Define achievement rewards explicitly. Shared goal learning still needs suitable representations and coverage.

## 6. Hindsight replay relabels achieved goals

**Hindsight experience replay (HER)** replaces an attempted goal with one actually achieved later and recomputes rewards.

```text
attempt goal A → trajectory ends near goal B
        ↓
keep observed transitions + replace goal with B + recompute rewards
        ↓
learn how those actions achieved B
```

Trying x=5 but reaching x=3 can teach reaching x=3. Preserve physical transitions; change the goal and matching rewards.

## 7. Relabeling has assumptions

Relabeling must preserve dynamics and allow correct reward/terminal recomputation. A goal that changes which doors exist can invalidate the original transitions.

Use a replay-compatible control method. Selecting goals from realized futures can bias stochastic tasks; ordinary HER is not universally unbiased.

## 8. Temporally extended actions shorten decision horizons

**Temporal abstraction** chooses a multi-step skill, such as navigate-to-door, before returning control to the higher-level policy.

For duration k, sum k discounted rewards and continue with γᵏ. One discount step for every variable-duration skill would change the objective.

| Mechanism | Supplies | Main risk |
|---|---|---|
| Intrinsic reward | Additional exploration signal | Optimize novelty rather than success |
| Curriculum | Reachable learning problems | Fail to transfer to full difficulty |
| HER | Reusable goal-labeled transitions | Invalid counterfactual assumptions |
| Skills | Coherent longer behavior | Restrict behavior to an inadequate skill set |
