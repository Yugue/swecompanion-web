# 1.1 The RL problem: interaction, feedback, and delayed consequences

## 1. Learn a decision, not just a prediction

A robot can take a short congested route or a longer clear one. Its choice changes both delivery time and where it can go next.

**Reinforcement learning (RL)** learns behavior from consequences. Actions affect future outcomes and the experience available for learning.

## 2. The interaction loop

An **agent** chooses actions using a **policy**, its action-selection rule. The **environment** responds with an **observation** (available information) and a **reward** (numerical task feedback).

```text
observation → agent / policy → action
     ↑                          ↓
     └──── reward + next observation ← environment
```

The environment may be a simulator, physical system, or software workflow. Learning can also use logged interactions when fresh trials are unavailable.

## 3. Decisions have delayed effects

Picking up a key earns nothing now but unlocks a later reward. **Credit assignment** asks which earlier decisions contributed to the outcome.

A **trajectory** records observations, actions, and rewards in order. An **episode** is one task attempt, from its initial condition to its end. Preserve sequence order to interpret delayed effects.

## 4. Feedback differs from a correct action label

| Learning setup | Feedback | Main decision issue |
|---|---|---|
| Supervised prediction | Target for a given input | Predict a label or quantity |
| Imitation | Demonstrated action | Reproduce demonstrated behavior |
| Bandit | Outcome of the chosen action | Choose well under uncertainty |
| Sequential RL | Rewards along a trajectory | Account for action-dependent futures |

A low reward does not label the correct action. Usually, only the chosen action’s outcome is observed.



## 5. Exploration changes the data

Trying an unknown corridor may reveal a shortcut or cause delay. **Exploration** seeks information; **exploitation** uses current knowledge.

The policy determines its training data. Fitting visited corridors well says little about corridors never tried.

## 6. Decide whether RL is justified

Use prediction when a prediction solves the task; use known-system optimization when the model and objective suffice. A **contextual bandit** chooses using current information without modeling action-dependent future decision states.

Use RL when actions change future opportunities and credible interactions or logged trajectories exist. Compare its collection and evaluation cost with a simple baseline.

## 7. Specify success before training

For the robot, measure deliveries, collisions, energy, and deadlines independently of training reward. Rewarding movement alone could teach circling.

**Sample efficiency** is improvement per unit of experience. **Compute efficiency** concerns resources spent processing it. Fast simulation does not imply few real-world trials.
