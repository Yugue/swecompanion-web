# 4.1 Hybrid Parallelism and Topology-Aware Placement

## 1. Several constraints can bind at once

Data parallelism increases concurrent examples but retains a model replica. State sharding reduces persistent redundancy. Tensor, pipeline, context, and expert parallelism divide different operations or ownership patterns.

A large workload may need several at once. **Hybrid parallelism** composes them while preserving the logical training computation and defining distinct communication groups.

## 2. Give each axis a precise meaning

For a simple rectangular arrangement with D data replicas, T tensor workers per stage, and P pipeline stages:

\[
N_{\text{devices}}=DTP
\]

Every complete model replica uses TP devices. Corresponding workers in different replicas form data-parallel groups.

State sharding can operate within the D data workers; it is not necessarily an extra independent multiplicative axis. Expert and context layouts also require explicit definitions rather than blindly multiplying every advertised degree.

## 3. Work through a 16-device mesh

Take D=2, T=4, P=2. Each data replica spans eight devices, and each pipeline stage spans four tensor workers.

```text
replica 0:  [stage 0: T0 T1 T2 T3] → [stage 1: T0 T1 T2 T3]
                ↕ corresponding data-parallel peers ↕
replica 1:  [stage 0: T0 T1 T2 T3] → [stage 1: T0 T1 T2 T3]
```

A tensor group holds one replica and stage fixed. A data group holds stage and tensor coordinate fixed. Pipeline communication connects the matching stage boundaries.

## 4. Count independent examples once

With four examples per local microbatch and eight accumulated microbatches, the previous layout processes:

\[
B_{\text{global}}=Dba=2\cdot4\cdot8=64
\]

Here b is per-replica microbatch size and a is the total microbatches accumulated per update. Multiplying by T or P would count collaborators on the same examples repeatedly.

Input data, masks, and random decisions must be shared or coordinated among model-parallel workers according to their role.

## 5. Map communication frequency to links

Tensor operations can communicate several times per layer; pipeline stages exchange boundary activations; data groups aggregate gradients or exchange parameter shards.

If a node has eight mutually well-connected GPUs, two four-device tensor groups can fit locally. Placing pipeline stages on separate nodes can keep frequent tensor exchange local while sending boundary activations across nodes.

That is one candidate placement, not a universal optimum. Boundary tensor sizes, data synchronization, expert routing, shared adapters, and load balance may favor a different mapping.

## 6. Hybrid state sharding has its own groups

A group can shard state within a node while equivalent shard positions are replicated across nodes. Local gathers use fast links, and cross-node synchronization exchanges the corresponding aggregate information.

This can reduce expensive repeated cross-node parameter gathering but retains more state than globally sharding across every device. The memory–network tradeoff must be computed for the actual group sizes.

A tensor-sharded parameter can also be state-sharded across its data group. Each layer of ownership must reconstruct exactly the layout its compute kernels expect.

## 7. Compose schedules without cycles

Pipeline sends, parameter prefetches, gradient reductions, and expert exchanges can compete for the same links or introduce cyclic waits.

Use a common order for overlapping process-group collectives where required. Identify which operations can launch early and which need completed gradients or activations. Extra streams do not remove those dependencies.

## 8. Choose a design by a constrained budget

Begin with a representative single-worker compute and memory ledger. Add the minimum partitioning needed to fit, estimate its communications, map it onto the actual topology, then measure.

Changing one degree affects other choices: more pipeline stages reduce per-stage parameters but add boundaries; more tensor workers shrink matrix shards but can worsen communication-to-compute ratio.

**Technical takeaway:** a hybrid design is an explicit mesh of tensor ownership, data replicas, communication groups, and schedules—not a list of parallelism features.
