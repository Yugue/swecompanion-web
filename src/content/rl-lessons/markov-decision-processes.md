# 1.4 Markov Decision Processes and the information available to an agent

## 1. A compact description of a sequential task

A **Markov Decision Process (MDP)** specifies states, actions, transition probabilities, rewards, and a decision objective. A grid robot may move, slip, and earn a destination reward.

The task can have an MDP description even when the agent does not know its probabilities.

## 2. State and action spaces

A **state** contains information sufficient to predict relevant next outcomes given an action. For a locked door, location alone omits whether the robot has its key.

An **action space** lists allowed choices: discrete moves or continuous torques. An **action mask** excludes unavailable choices; it should reflect the actual interface.

## 3. Transitions and rewards

A transition model assigns probabilities to successor states and rewards:

\[
p(s',r\mid s,a)=\Pr(S_{t+1}=s',R_{t+1}=r\mid S_t=s,A_t=a)
\]

At time t, random state Sₜ and action Aₜ produce Sₜ₊₁ and reward Rₜ₊₁. Lowercase s,a,s′,r denote particular outcomes. Joint p allows reward and successor to be correlated.

A known probability model enables expected backups. A simulator supplies samples, which is less information than an enumerated probability table.

## 4. What the Markov property claims

The **Markov property** says current state and action make earlier history unnecessary for predicting the next outcome:

\[
\Pr(S_{t+1},R_{t+1}\mid S_0,A_0,\ldots,S_t,A_t)
=\Pr(S_{t+1},R_{t+1}\mid S_t,A_t)
\]

This is a representation assumption. If battery level affects motion, omitting it can violate the property; irrelevant history adds cost without predictive benefit.

## 5. Observation is what the agent actually receives

An **observation** is the measurement received by the agent. One camera frame may omit velocity or an occluded obstacle.

```text
underlying state → observation sensor → policy → action
       └────────── environment transition ←──────┘
```

Train the actor on information available at deployment. Hidden simulator variables can otherwise create misleading evaluation results.

## 6. Initial conditions and time

The **initial-state distribution** determines where episodes begin. Easy resets can exaggerate reliability.

A genuine deadline may require remaining time in the state: one step left can demand a different action from 100 steps left.

**Stationary dynamics** keep the same transition rule over time. Changing equipment or traffic can violate this assumption.

## 7. Formulate before selecting an algorithm

| Modeling decision | Consequence of getting it wrong |
|---|---|
| Omit velocity or an important resource | Incompatible outcomes share one input |
| Reward an easy proxy | Policy can optimize the wrong behavior |
| Ignore an action constraint | Learned behavior may be infeasible |
| Use unrealistic resets | Evaluation exaggerates reliability |

Check the state, sensors, rewards, and action interface before comparing algorithms.
