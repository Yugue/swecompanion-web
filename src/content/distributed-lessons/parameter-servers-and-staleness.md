# 2.5 Parameter Servers, Staleness, and Local Updates

## 1. Separate ownership from computation

A **parameter server** owns parameters and often their optimizer state. Workers fetch needed values, compute gradients, and send contributions back. Ownership may be spread across several server shards.

This is a different architecture from every worker owning a full updated replica. It can be useful for sparse access patterns or decoupled worker progress, but servers can become bottlenecks.

## 2. Trace the server path

```text
workers: fetch rows → compute loss → send row gradients
             ↑                           │
             └──── parameter shards ← apply update
                      + optimizer state
```

Server-side sharding determines where each parameter lives. Workers need a routing rule and a definition of which parameter version they read. Merely splitting a parameter table across machines does not define the consistency model.

## 3. Synchronous server updates

A synchronous server waits for the required contributions for a logical step, combines them with the correct weights, and applies one update. It can preserve the same objective as synchronous replicated training when reads and optimizer transitions are consistent.

Its costs include gather/scatter traffic through the owners, coordination, and waiting for stragglers. Adding server shards increases ownership capacity but may introduce cross-shard dependencies.

## 4. Asynchronous updates use older information

An asynchronous worker may compute using parameters from several updates ago:

\[
\theta_{t+1}=\theta_t-\eta_t g(\theta_{t-\tau})
\]

Theta_t is the server's current parameter vector, eta_t its learning rate, g the worker gradient, and tau the staleness measured in intervening updates. This schematic equation assumes a coherent older snapshot; real sparse reads can be even less uniform.

With scalar loss theta²/2, a worker reading theta=2 sends gradient 2. If the current value has become −1, applying that positive gradient moves further negative, even though the current gradient would be −1.

## 5. Bounded staleness limits drift

A bounded-staleness protocol restricts how far fast workers advance beyond slow workers. It trades some waiting for fresher gradients.

A bound on step difference is not automatically a bound on numerical error. Sensitivity depends on learning rate, curvature, data heterogeneity, and whether reads span multiple independently updated shards. Asynchronous step-count and learning-rate conventions must be explicit.

## 6. Sparse embedding tables change communication

An **embedding table** maps an ID to a learned vector. A batch may touch a tiny fraction of a huge table. Hashing IDs or partitioning row ranges assigns row owners.

Fetching only selected rows and returning their gradient contributions avoids exchanging the complete table every step. Repeated IDs can be combined locally before transfer. Popular IDs create hot shards, and adaptive optimizers still need persistent state for owned rows.

Sparse ownership is not the same as gathering every layer's full weights before dense computation.

## 7. Local SGD reduces synchronization frequency

In **local stochastic gradient descent**, replicas start from a shared model, perform H local optimizer steps on their own data, and periodically average model parameters.

For H=1 and ordinary SGD with equal weights and a common starting point, model averaging matches averaging gradients before one update. For H>1, later gradients are evaluated at different local parameters, so the trajectory differs.

Adam introduces additional state: averaging only weights does not define how local moments should be reconciled. A local-update algorithm must specify that policy.

## 8. Choose a consistency–communication tradeoff

| Approach | Main advantage | Main limitation |
|---|---|---|
| Synchronous replicas | Clear shared update semantics | Straggler and collective costs |
| Synchronous servers | Explicit centralized/sharded ownership | Owner hotspots and coordination |
| Asynchronous servers | Less global waiting | Stale or inconsistent reads |
| Local updates | Fewer synchronization rounds | Replica drift and changed optimization |

**Technical takeaway:** reducing synchronization changes which model a gradient describes; communication savings must be evaluated against optimization behavior and ownership bottlenecks.
