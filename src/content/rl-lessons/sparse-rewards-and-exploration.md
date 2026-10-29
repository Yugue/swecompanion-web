# 6.2 Difficult exploration and long-horizon tasks

## 1. An update cannot exploit success it never observes

In a long maze, the only reward may occur after a rare correct sequence. A replay buffer full of zero-reward failures contains little direct evidence of which early decisions lead to success.

Sparse feedback creates two related problems: discovering informative experience and assigning credit after discovering it. Better value estimation addresses the second more directly than the first.

## 2. Coherent behavior beats independent action noise

If success requires ten specific binary choices, a uniformly random sequence has probability 1/1024 under that simplified setup. Adding more network capacity does not increase that chance by itself.

An exploration strategy may need persistent goals, useful skills, demonstrations, or a progression of solvable tasks. Compare success discovery per interaction, not only how quickly loss falls after successful examples enter the buffer.

## 3. Intrinsic rewards encourage information or novelty

An **intrinsic reward** comes from the learner's own novelty, prediction, or uncertainty measure rather than the external task outcome. Examples include bonuses for rarely visited representations or disagreement among predictive models.

The **noisy television** failure illustrates a hazard: unpredictable observations may remain surprising forever without revealing controllable useful knowledge. A prediction-error bonus can chase irreducible randomness.

Keep intrinsic and task rewards separately logged. A learner that improves only the intrinsic proxy may become an excellent novelty seeker and a poor task solver.

## 4. Curricula change what is learnable now

A **curriculum** begins with accessible initial conditions, shorter distances, or easier goals, then increases difficulty as competence grows. This can produce useful trajectories before the hardest task is reachable.

The final evaluation distribution must stay fixed and representative. If both training and evaluation become easier, a rising curve says little about progress on the intended task. Check whether the policy learns transferable behavior or exploits shortcuts in easy variants.

## 5. Goal conditioning shares learning across objectives

A goal-conditioned policy receives a goal g as well as the state, and a goal-conditioned value predicts return for that goal.

\[
Q(s,a,g)=\mathbb E[G_t\mid s,a,g]
\]

This supports training on many goals with one function. The reward function must specify how achievement is measured. A policy can generalize across goals only if its representation and experience support the relevant relationships.

## 6. Hindsight replay relabels achieved goals

**Hindsight Experience Replay (HER)** reuses a failed attempt by substituting a goal actually achieved later in that trajectory and recomputing rewards.

```text
attempt goal A → trajectory ends near goal B
        ↓
keep observed transitions + replace goal with B + recompute rewards
        ↓
learn how those actions achieved B
```

If a robot tried to move an object to x=5 but reached x=3, the trajectory can teach a goal-conditioned learner about reaching x=3. The physical transition is retained; only the counterfactual objective is changed.

## 7. Relabeling has assumptions

Changing the goal must preserve the validity of the observed dynamics, and rewards and terminal labels must be recomputable correctly. If a goal changes the environment itself, such as enabling a different door, naive relabeling may create impossible transitions.

The control method must support the replayed behavior. In stochastic environments, choosing goals from realized future outcomes can also introduce selection bias; ordinary HER is not a universal unbiased estimator for arbitrary stochastic tasks.

## 8. Temporally extended actions shorten decision horizons

A reusable skill such as navigate-to-door executes several primitive actions before returning control. This is a simple form of **temporal abstraction**.

For a skill lasting k primitive steps, a compatible backup sums its k discounted rewards and uses gamma to the k for continuation. Treating every variable-duration skill as one primitive discount step changes the objective.

| Mechanism | Supplies | Main risk |
|---|---|---|
| Intrinsic reward | Additional exploration signal | Optimize novelty rather than success |
| Curriculum | Reachable learning problems | Fail to transfer to full difficulty |
| HER | Reusable goal-labeled transitions | Invalid counterfactual assumptions |
| Skills | Coherent longer behavior | Restrict behavior to an inadequate skill set |
