# 6.6 End-to-end algorithm selection, deployment, and monitoring

## 1. Start with the decision and its consequences

For a delivery robot, identify delayed consequences, energy costs, deadlines, and mandatory limits.

Compare RL with a travel-time predictor plus conventional planner. A baseline makes added value and cost measurable.

## 2. Specify the information and action interface

Specify observations, memory, allowed actions, timing, and resets. Route selection and continuous torque control need different interfaces.

Include or infer relevant velocity, battery, and pending commands. Preserve time-to-deadline when it changes decisions.

## 3. Choose the experience source

Known dynamics support planning; simulation supports interaction; demonstrations initialize behavior; fixed logs require offline assumptions.

Budget interactions and resets before choosing a method. Millions of required physical trials may rule out an otherwise attractive approach.

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

Use these candidates as experiments, not universal rankings. Actor–critics can be on- or off-policy; learned models can complement policies and values.

## 5. Define rewards and independent success measures

Report completion, energy, collisions, and abandonment separately. Check shaping boundaries and high-reward failure loops.

Enforce hard action limits in the interface. Compare learned and baseline behavior using the same outcomes and budgets.

## 6. Train with diagnostic milestones

Solve a tiny deterministic task, then a small representative scenario, then broader variations. Verify targets and gradients before scaling collection.

For continuous control, test SAC when replay matters or BC when demonstrations are strong. Logs alone need an offline-capable approach, not an unchanged online SAC setup.

## 7. Evaluate before expanding exposure

Use held-out scenarios, independent training runs, disturbances, and deployable sensors. Compare success, poor-outcome tails, costs, and latency with the baseline.

Test remaining simulation gaps in controlled stages. Set acceptance criteria before results arrive.

## 8. Package the whole policy contract

Version weights, preprocessing, observation schema, action scale, memory/reset rules, and environment assumptions together. Weights alone omit the operational policy.

Measure target-hardware latency and memory. Define fallback behavior for invalid observations, outputs, exhausted budgets, or deteriorating outcomes.

## 9. Monitor outcomes and close the loop

```text
define task → specify interface → choose data and baseline → select method
     ↓
train → evaluate independently → diagnose → stage deployment → monitor
                                  ↑                         ↓
                                  └──── new evidence ────────┘
```

Monitor completion, violations, input changes, actions hitting their limits, interventions, and latency. Q-values and reward-model scores remain internal diagnostics.

Keep records linking experience to its collection settings. Changes to rewards, tools, sensors, or dynamics require renewed evaluation.
