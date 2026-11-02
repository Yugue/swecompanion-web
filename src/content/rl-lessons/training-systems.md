# 6.3 Training systems: environments, experience, and resource budgets

## 1. Separate interaction from learning

Collectors run environments; storage retains experience; a learner updates parameters; evaluators test frozen policies. These components can run at different rates.

```text
versioned policy → collectors → experience storage → learner → new policy
                          ↓                         ↓
                  environment telemetry      frozen-policy evaluator
```

Track which policy generated each transition and its age. The update must tolerate the resulting data distribution.

## 2. Count resources in the right units

Count environment transitions, episodes, updates, batch items, wall-clock time, memory, and compute separately.

100 updates of batch size 256 over 1,000 new transitions draw 25,600 samples: 25.6 uses per new transition, not 25,600 interactions.

Reuse may improve sample efficiency or overfit. Simulator steps and physical trials also differ in duration and cost.

## 3. Vectorized environments improve collection throughput

**Vectorized environments** advance several independent instances concurrently. Environment count times rollout length determines a recent rollout batch’s size.

Asynchronous collectors may lag. Store actual collection log probabilities rather than recomputing them with the latest policy.

Historical replay permits broader policy ages, but stale data can still weaken relevant coverage.

## 4. A transition needs a precise schema

| Item | Essential meaning |
|---|---|
| Observation and action | The information and choice actually used |
| Reward | Correct objective version and time alignment |
| Successor | Actual resulting observation before reset |
| Terminated and truncated | Task end versus collection boundary |
| Policy version and log probability when needed | Identify behavior and compute ratios |
| Episode and sequence identity | Reconstruct valid temporal context |

A **transition schema** defines the fields and meaning of each stored interaction.

Recurrent learning also needs valid sequence context and reset information. Version preprocessing or preserve enough raw data to reconstruct it consistently.

## 5. Automatic resets can silently corrupt learning

Automatic reset can return a new episode’s first observation in place of the old episode’s final one. Different vectorized instances can reset separately.

Preserve final observations for bootstrap targets. Stop GAE/traces at boundaries before they mix episode rewards.

Check success, failure, truncation, and partial batch reset separately.

## 6. Budget replay memory before collecting

Two 64-coordinate float32 observations need 512 bytes. Add action 4, reward 4, and boundary flags 2: about 522 bytes per transition.

One million transitions need about 522 MB before metadata, priorities, alignment, and indexing. Image buffers may share frames to avoid duplication.

Parameters, optimizer statistics, activations, and temporary batches consume additional training memory.

## 7. Reproducibility requires more than one seed

Seed environments, policy/replay sampling, and numerical libraries. Record software, configuration, reward/simulator versions, and resets.

A seed describes one run; hardware and parallel scheduling can still differ. Independent training runs assess procedural reliability.

## 8. Simulator quality is task-specific

Validate control-relevant friction, delays, resets, and sensor noise. Attractive simulator graphics do not establish useful dynamics accuracy.

Match training/deployment features, action scales, and inference modes. These conventions are part of the policy.
