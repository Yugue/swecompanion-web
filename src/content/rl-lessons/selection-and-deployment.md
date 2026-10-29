# 6.6 End-to-end algorithm selection, deployment, and monitoring

## 1. Start with the decision and its consequences

Suppose a warehouse robot must deliver parcels before deadlines while limiting energy and collisions. Clarify what decisions can change, which outcomes are delayed, and what constraints are mandatory.

A supervised travel-time predictor plus a conventional planner might already solve the problem. Establishing that baseline makes the benefit and cost of RL measurable.

## 2. Specify the information and action interface

Define deployable observations, history requirements, valid actions, action timing, and resets. A continuous torque controller has different requirements from a discrete choice among predefined routes.

Separate task state from sensor observation. If battery charge, velocity, or a pending command affects outcomes, include or infer it. Preserve time-to-deadline when it changes the best action.

## 3. Choose the experience source

Known dynamics support planning. A cheap simulator supports controlled online exploration. Demonstrations can initialize useful behavior. Fixed logs require offline learning and evaluation assumptions.

Quantify interaction costs and reset access before selecting an algorithm. A method that needs millions of trials is a poor first choice when only a few physical trials are feasible.

## 4. Select a family from constraints

| Situation | Useful starting point | Main question to verify |
|---|---|---|
| No meaningful sequential effect | Supervised rule, optimization, or bandit | Is full RL adding value? |
| Small known MDP | Dynamic programming | Are model and state space tractable? |
| Modest discrete actions with replay | DQN or Double DQN | Is exploration and coverage adequate? |
| Fresh parallel rollouts, mixed action types | PPO | Is the interaction budget acceptable? |
| Continuous actions, costly interaction | SAC or TD3 | Are critic estimates supported? |
| Good demonstrations | Behavior cloning, then carefully assessed improvement | Are recovery states covered? |
| Fixed logs only | Offline-constrained or conservative learning | Is improvement identifiable? |
| Reliable model and planning budget | Model-based planning | Does model error grow over the horizon? |

This table gives candidates to test, not a universal ranking. Algorithm families overlap: an actor–critic can be on-policy or off-policy, and models can be combined with learned values or policies.

## 5. Define rewards and independent success measures

Use task completion and timing as primary outcomes. If shaping is added, check its boundary conditions and search for loops. Keep completion, energy, collision rate, and abandonment visible separately.

Hard actuator limits should be enforced by the action interface. An expected penalty does not guarantee per-action feasibility. Compare any learned policy with the baseline on the same success and resource criteria.

## 6. Train with diagnostic milestones

First solve a tiny deterministic environment, then a representative small scenario, then broader randomized training conditions. Verify targets and gradient paths before scaling up collection.

For the continuous robot example, SAC is a reasonable experiment if simulation is cheap and data reuse matters. Behavior cloning may provide a stronger starting point when demonstrations are available. With logs alone, do not assume an ordinary online SAC implementation is an adequate offline solution.

## 7. Evaluate before expanding exposure

Use held-out scenarios, multiple training seeds, disturbances, and deployment-matched observations. Compare success, lower-tail outcomes, costs, and latency against the baseline.

When simulation differs from reality, identify which dynamics uncertainties remain and test them in controlled stages. Set concrete rollout gates in advance so selection does not drift toward whichever metric improved.

## 8. Package the whole policy contract

Version the weights, preprocessing, observation schema, action scaling, memory/reset behavior, and environment assumptions together. A compatible model file alone is insufficient.

Measure inference latency and memory on the actual target hardware. Define a fallback controller or stopping behavior for invalid observations, out-of-range outputs, budget exhaustion, or monitored deterioration.

## 9. Monitor outcomes and close the loop

```text
define task → specify interface → choose data and baseline → select method
     ↓
train → evaluate independently → diagnose → stage deployment → monitor
                                  ↑                         ↓
                                  └──── new evidence ────────┘
```

Track real completion, constraint violations, input shifts, action saturation, intervention rates, and latency. Learned Q-values and reward-model scores are internal diagnostics, not independent success evidence.

Preserve data lineage when retraining. Changes to reward definitions, tools, sensors, or environment dynamics require renewed evaluation because they change the effective decision problem.
