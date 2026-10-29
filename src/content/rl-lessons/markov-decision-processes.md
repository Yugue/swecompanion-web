# 1.4 Markov Decision Processes and the information available to an agent

## 1. A compact description of a sequential task

A gridworld robot occupies a cell, chooses a movement, sometimes slips, and receives reward for reaching a destination. A **Markov Decision Process (MDP)** describes that decision problem using a state space, action space, transition rule, reward rule, and objective.

The model describes the task. The agent need not know the model's probabilities in order to learn from experience.

## 2. State and action spaces

A **state** summarizes the information needed to predict relevant future outcomes. In a simple grid, it may be location. If a door needs a key, location alone is insufficient: possession of the key changes what happens next.

Actions may be discrete, such as north or south, or continuous, such as motor torque. Available actions can depend on the state. An action mask must reflect actual availability rather than hide merely undesirable choices without justification.

## 3. Transitions and rewards

\[
p(s',r\mid s,a)=\Pr(S_{t+1}=s',R_{t+1}=r\mid S_t=s,A_t=a)
\]

Capital letters denote random variables; lowercase letters denote particular outcomes. At time t, state s and action a produce a successor s prime and a reward r at time t+1.

Using a joint distribution allows reward and next state to be correlated. A simpler model can specify a next-state distribution and an expected reward for each transition. A known model enables planning; a simulator that returns samples is different from a table of every probability.

## 4. What the Markov property claims

\[
\Pr(S_{t+1},R_{t+1}\mid S_0,A_0,\ldots,S_t,A_t)
=\Pr(S_{t+1},R_{t+1}\mid S_t,A_t)
\]

Conditioned on the current state and action, earlier history supplies no additional predictive information. This is an assumption about the representation and task, not a claim that the physical world has no memory.

If battery level affects movement, omitting it can violate the assumption. Adding irrelevant history can make learning expensive without improving predictive information.

## 5. Observation is what the agent actually receives

An **observation** is the available measurement; it need not equal the underlying state. A camera sees an object in one position but may not reveal its velocity or an occluded obstacle.

```text
underlying state → observation sensor → policy → action
       └────────── environment transition ←──────┘
```

Distinguish simulator state from deployable observations. Training a policy on hidden variables unavailable at deployment creates an information mismatch. Later memory-based methods address incomplete observations.

## 6. Initial conditions and time

The initial-state distribution specifies where episodes begin. A policy that succeeds only from an easy reset distribution may fail from ordinary operating conditions.

If there is a genuine finite deadline, remaining time can be part of the state: the same location may require a different action with one step remaining than with 100. Without time, a time-limited task can appear nonstationary to a stationary policy.

**Stationary dynamics** use the same transition rule over time. Changing equipment, opponents, or traffic can violate that assumption even with a useful state representation.

## 7. Formulate before selecting an algorithm

| Modeling decision | Consequence of getting it wrong |
|---|---|
| Omit velocity or an important resource | Incompatible outcomes share one input |
| Reward an easy proxy | Policy can optimize the wrong behavior |
| Ignore an action constraint | Learned behavior may be infeasible |
| Use unrealistic resets | Evaluation exaggerates reliability |

State design, sensor access, and the action interface often matter more than choosing among closely related algorithms.
