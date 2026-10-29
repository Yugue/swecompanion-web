# 5.2 Learning from demonstrations and correcting imitation failures

## 1. A demonstrated action is a different signal from a reward

If an expert drives a robot through a doorway, the training record can directly identify the action taken in each observed situation. **Imitation learning** uses this behavior as supervision.

A demonstration can be valuable when random exploration is expensive or unlikely to reach success. It describes what the demonstrator did, not necessarily why it was optimal or how to recover from every possible error.

## 2. Behavior cloning is supervised policy fitting

\[
L_{\mathrm{BC}}(\theta)=-\mathbb E_{(o,a)\sim\mathcal D_{\mathrm{expert}}}
[\log\pi_\theta(a\mid o)]
\]

**Behavior cloning (BC)** fits policy parameters theta to demonstrated action a given available observation o. D expert is the demonstration dataset. A continuous deterministic policy may instead regress to demonstrated action vectors.

Training needs consistent observation and action interfaces. An expert with access to hidden state can produce actions the deployed learner cannot infer from its own observations.

## 3. Why small action errors can compound

At deployment, the learner's own actions determine later observations. A small steering error moves the robot off the demonstrated path. Its next observation can then be unfamiliar, causing another error and further deviation.

```text
expert path → demonstration observations → low supervised validation error
learner error → unfamiliar observation → larger error → further deviation
```

The issue is **distribution shift caused by the learner's behavior**. A random train-validation split of demonstration frames can understate it, especially when nearby frames from one trajectory appear in both sets.

## 4. Average actions can be invalid behavior

Two experts may pass an obstacle on opposite sides. A squared-error predictor can average those valid actions into a collision course.

A suitable stochastic or multimodal action model can preserve alternatives, but it does not solve missing recovery states or poor demonstration quality. First establish whether multimodality, observation ambiguity, or dataset coverage explains the failure.

## 5. Dataset aggregation changes the supervision distribution

**Dataset Aggregation (DAgger)** iteratively runs the learner, asks an expert what action should be taken at visited states, adds those labeled states to the dataset, and refits the policy.

The important change is obtaining expert labels where the learner actually goes. Simply labeling its own actions as correct would reinforce its errors rather than provide the intended supervision.

Early data collection may mix expert and learner control. The availability, cost, and safe execution of expert labeling are practical assumptions, not free resources.

## 6. Compare available training signals

| Signal | What it supplies | Typical limitation |
|---|---|---|
| Demonstrated actions | Direct local action targets | Missing recovery states or suboptimal behavior |
| Expert corrections | Labels on learner-visited states | Expert access and intervention cost |
| Environment rewards | Long-term objective feedback | Exploration and credit assignment |
| Preferences | Relative quality judgments | Incomplete ranking signal |

A common practical strategy is demonstration initialization followed by reward-driven fine-tuning. Fine-tuning may improve beyond the demonstrator but can also forget competent behavior or exploit a misspecified reward.

## 7. Evaluate behavior, not just action accuracy

Split by episodes, demonstrators, scenarios, or other units that prevent closely related frames from leaking across evaluation. Measure closed-loop task success and recovery from perturbed conditions.

Audit action conventions, sensor delays, and timestamps. An apparently noisy demonstrator might actually reflect a misalignment between observation and action labels. Include failures and interventions when they provide useful recovery evidence, with their meaning preserved.
