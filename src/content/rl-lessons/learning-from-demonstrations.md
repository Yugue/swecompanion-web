# 5.2 Learning from demonstrations and correcting imitation failures

## 1. A demonstrated action is a different signal from a reward

**Imitation learning** uses demonstrated actions as supervision. A doorway demonstration tells the learner what an expert did at each observation.

Demonstrations can avoid expensive random exploration, but do not necessarily explain optimality or recovery from mistakes.

## 2. Behavior cloning is supervised policy fitting

**Behavior cloning (BC)** fits a policy to expert actions:

\[
L_{\mathrm{BC}}(\theta)=-\mathbb E_{(o,a)\sim\mathcal D_{\mathrm{expert}}}
[\log\pi_\theta(a\mid o)]
\]

θ is policy weights; o observation; a demonstrated action; Dexpert demonstrations. Continuous deterministic policies may instead regress action vectors.

Match sensor and action interfaces. An expert using hidden state can choose actions the learner cannot infer from its own observation.

## 3. Why small action errors can compound

A small steering error moves the learner off the expert path. Unfamiliar observations cause further errors: behavior changes its own input distribution.

```text
expert path → demonstration observations → low supervised validation error
learner error → unfamiliar observation → larger error → further deviation
```

Random frame splits can hide this failure when nearby frames leak across training and validation.

## 4. Average actions can be invalid behavior

Experts passing opposite sides of an obstacle demonstrate two valid actions. Squared-error fitting can average them into a collision.

A **multimodal** policy represents distinct action alternatives. It does not repair missing recovery states; distinguish ambiguous inputs, valid alternatives, and poor coverage.

## 5. Dataset aggregation changes the supervision distribution

**Dataset Aggregation (DAgger)** runs the learner, requests expert labels at learner-visited states, adds them to training data, and refits.

The new labels correct the learner where it actually goes. Treating its own actions as expert targets would reinforce mistakes.

Expert access and controlled collection have costs. Early collection may mix expert and learner control.

## 6. Compare available training signals

| Signal | What it supplies | Typical limitation |
|---|---|---|
| Demonstrated actions | Direct local action targets | Missing recovery states or suboptimal behavior |
| Expert corrections | Labels on learner-visited states | Expert access and intervention cost |
| Environment rewards | Long-term objective feedback | Exploration and credit assignment |
| Preferences | Relative quality judgments | Incomplete ranking signal |

Demonstration initialization followed by reward-driven fine-tuning can improve beyond the expert, but may forget useful behavior or exploit reward errors.

## 7. Evaluate behavior, not just action accuracy

Split by episodes, demonstrators, or scenarios. Measure **closed-loop** success—behavior under its own actions—and recovery after perturbations.

Check timestamps, sensor delay, and action conventions before treating labels as noise. Preserve the meaning of failures and expert interventions.
