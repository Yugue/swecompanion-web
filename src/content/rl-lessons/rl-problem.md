# 1.1 The RL problem: interaction, feedback, and delayed consequences

## 1. Learn a decision, not just a prediction

A warehouse robot can take a short route through congestion or a longer clear route. A predictor might estimate travel time. A decision-maker must choose a route, observe the result, and account for how its movement affects later decisions.

**Reinforcement Learning (RL)** learns behavior from consequences. Its central difficulty is that an action changes both future outcomes and the evidence available for learning.

## 2. The interaction loop

An **agent** chooses actions. An **environment** responds with observations and rewards. A **policy** is the rule the agent uses to choose an action. A **reward** is a numerical feedback signal supplied by the task.

```text
observation → agent / policy → action
     ↑                          ↓
     └──── reward + next observation ← environment
```

The environment can be a simulator, a physical process, or a software workflow. Learning is possible from previously logged interactions too; fresh exploration is not always permitted.

## 3. Decisions have delayed effects

Picking up a key gives no immediate reward but makes a later door passable. Optimizing only the next reward would miss its value.

**Credit assignment** asks which earlier decisions contributed to an outcome. Delayed feedback makes this difficult because many actions, random events, and other decisions occurred before success or failure became visible.

A **trajectory** records an interaction sequence: observation, action, reward, next observation, and so on. Order matters; shuffling individual decisions can destroy the information needed to understand their consequences.

## 4. Feedback differs from a correct action label

| Learning setup | Feedback | Main decision issue |
|---|---|---|
| Supervised prediction | Target for a given input | Predict a label or quantity |
| Imitation | Demonstrated action | Reproduce demonstrated behavior |
| Bandit | Outcome of the chosen action | Choose well under uncertainty |
| Sequential RL | Rewards along a trajectory | Account for action-dependent futures |

In RL, a low reward does not identify the correct action. The agent must compare possibilities from incomplete evidence. An unchosen action's outcome is usually unobserved.

## 5. Exploration changes the data

The robot cannot learn about a never-visited corridor from its own experience. Trying it may provide useful information but can cause delay or failure.

**Exploration** seeks information; **exploitation** uses current knowledge. Because the policy determines what gets observed, improvements and mistakes can reinforce their own data distribution. A model can therefore fit its collected data well and still make poor decisions elsewhere.

## 6. Decide whether RL is justified

Use a fixed rule or ordinary optimization when the objective and system are already known well enough. Use supervised prediction when an accurate prediction directly solves the task. A **contextual bandit** fits decisions whose context matters but whose chosen action does not change later decision states in the problem being optimized.

RL becomes useful when actions materially affect future opportunities, feedback is incomplete, and a credible source of interaction or logged trajectories exists. It also introduces evaluation and collection costs that a simpler baseline may avoid.

## 7. Specify success before training

For the robot, define completed deliveries, collision rate, energy, and deadlines. A training reward such as forward movement may help learning but is only a proxy for those outcomes.

**Sample efficiency** measures useful improvement per unit of experience. **Compute efficiency** concerns resources used to process that experience. Fast simulated learning can still require an unacceptable number of real interactions.
