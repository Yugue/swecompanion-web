# 6.3 Training systems: environments, experience, and resource budgets

## 1. Separate interaction from learning

An RL system usually has collectors running environments, storage for experience, a learner updating parameters, and evaluators running frozen policies. Their rates need not match.

```text
versioned policy → collectors → experience storage → learner → new policy
                          ↓                         ↓
                  environment telemetry      frozen-policy evaluator
```

The architecture determines which policy generated each transition, how old it is, and whether the chosen update can use it.

## 2. Count resources in the right units

Record environment transitions, complete episodes, learner updates, sampled batch items, wall-clock time, memory, and compute separately.

If 1,000 transitions support 100 updates of batch size 256, the learner draws 25,600 transition samples, averaging 25.6 draws per new transition. That is data reuse, not 25,600 new interactions. High reuse can improve sample efficiency or overfit a narrow buffer.

Environment steps can also differ in duration and cost. A millisecond simulator step and a physical trial are not interchangeable budget units.

## 3. Vectorized environments improve collection throughput

Several environments can advance concurrently, supplying less locally correlated experience and better hardware utilization. The number of environments and rollout length jointly determine recent batch size.

For an on-policy update, policy versions should stay consistent with the algorithm's rollout assumptions. Asynchronous collectors can lag behind the learner; stale log probabilities must be the actual collection probabilities, not recomputed under the latest parameters.

Off-policy replay tolerates broader historical behavior, but arbitrary staleness can still worsen distribution shift and useful coverage.

## 4. A transition needs a precise schema

| Item | Essential meaning |
|---|---|
| Observation and action | The information and choice actually used |
| Reward | Correct objective version and time alignment |
| Successor | Actual resulting observation before reset |
| Terminated and truncated | Task end versus collection boundary |
| Policy version and log probability when needed | Identify behavior and compute ratios |
| Episode and sequence identity | Reconstruct valid temporal context |

A recurrent learner also needs sequence context and memory reset information. A changing preprocessing transform needs versioning or consistent reconstruction from stored raw evidence.

## 5. Automatic resets can silently corrupt learning

A vectorized environment may reset one finished instance while others continue. The returned observation can be the first frame of the next episode rather than the predecessor transition's final observation.

Preserve final observations before reset. At external truncation, use the final state for a valid continuation estimate. Stop GAE or trace recursion at the boundary so it never incorporates another episode's rewards.

Test genuine success, genuine failure, collection truncation, and partial batch resets as separate cases.

## 6. Budget replay memory before collecting

For a simple buffer storing current and next 64-dimensional float32 observations, each pair uses 512 bytes. Add a four-byte action, four-byte reward, and two one-byte boundary flags: roughly 522 bytes per transition.

One million transitions then need about 522 MB in decimal units before metadata, indexing, alignment, priorities, or object overhead. Image observations can be much larger; shared frame storage and compact data types reduce duplication.

Training additionally stores parameters, optimizer statistics, activations, and temporary batches. Replay size is only part of the memory budget.

## 7. Reproducibility requires more than one seed

Seed the environment, policy sampling, replay sampling, and numerical libraries where supported. Record configuration, software versions, reward code, simulator version, and reset distributions.

A seed is a recipe for one stochastic run under specified execution conditions, not proof of deterministic behavior across hardware or parallel scheduling. Independent training seeds are still required to assess robustness of the training procedure.

## 8. Simulator quality is task-specific

A fast simulator enables experimentation, but a mismatch in friction, delays, reset conditions, or observation noise can dominate algorithm differences. Validate task-relevant dynamics rather than judging simulator fidelity by visual realism.

Track training versus inference modes and preprocessing consistently. A policy must receive the same feature conventions and action scaling when evaluated or deployed as when its behavior was trained.
