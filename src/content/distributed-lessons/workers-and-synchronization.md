# 1.4 Processes, Workers, and Synchronization

## 1. A distributed program has several timelines

A **node** is a machine. A node may contain several accelerator devices. A **worker** is a participant in the computation, commonly implemented as one operating-system process per GPU.

Processes have separate address spaces. A tensor on one process is not automatically available to another, even on the same machine. Distribution requires explicit communication or a framework that performs it.

## 2. Rank identifies a participant

A **process group** is a defined set of communicating workers. Its **world size** is the number of members, and a **rank** identifies one member inside it. A local rank commonly identifies a process among workers on the same node.

| Object | Example | Meaning |
|---|---|---|
| Node | machine A | Physical host |
| Local device | GPU 2 | Device ordinal on that host |
| World rank | 6 of 8 | Worker identity in the world group |
| Subgroup rank | 1 of 2 | Identity within a smaller group |

World rank and local device ordinal are different concepts. Confusing them can place several processes on one device or select a nonexistent device.

## 3. Replicated versus partitioned work

In **single program, multiple data** execution, workers run similar code but operate on different data or tensor partitions. This does not mean all workers always perform identical arithmetic.

A data-parallel worker owns different examples and a model replica. A pipeline worker owns different layers. The code must establish which case applies before interpreting rank-dependent branches.

```text
node A                          node B
rank 0 → GPU 0                  rank 2 → GPU 0
rank 1 → GPU 1                  rank 3 → GPU 1
       └──────── world group ─────────┘
```

## 4. Synchronization is a dependency

If worker 1 needs a tensor produced by worker 0, it cannot correctly consume that tensor before production and transfer complete. A **happens-before** relationship expresses this ordering.

A **barrier** waits until every group member reaches a point. It can coordinate phase boundaries, but a barrier is not a substitute for the specific device-stream dependencies required to use a tensor safely.

An unnecessary barrier makes fast workers wait and can prevent useful overlap.

## 5. Blocking and asynchronous operations

A blocking interface waits for the completion condition defined by its API. An asynchronous interface returns a handle representing work that may still be in progress.

For GPU communication, host return, stream ordering, and physical device completion are distinct. A wait may establish a stream dependency rather than force every device operation to finish on the CPU's timeline.

The safe rule is to follow the communication API's completion contract before consuming results or reusing send buffers.

## 6. Matching calls matter

Workers participating in one collective must invoke compatible operations in the required order, with matching data types, tensor sizes, and group membership.

```text
rank 0: reduce(A) → gather(B)
rank 1: gather(B) → reduce(A)
         ↑ incompatible first operation: error or hang
```

A branch that runs communication only on the worker holding data can strand peers. Nonparticipating subgroups are valid; inconsistent participation inside the same subgroup is not.

## 7. Failure and slowness look similar locally

A worker waiting for a peer cannot immediately know whether that peer is computing slowly, blocked elsewhere, disconnected, or dead. Timeouts bound waiting but do not repair the computation.

A **straggler** is a participant that completes useful work later than its peers. A **deadlock** is a cycle of dependencies in which progress cannot occur. Their remedies differ.

## 8. State ownership makes correctness reviewable

For each tensor, record its producer, owner, consumers, and lifetime. For each communication step, record the group and completion dependency. This turns an opaque multi-process program into an explicit dataflow.

**Technical takeaway:** rank identity, state ownership, and matching dependencies are the minimum vocabulary for reasoning about any distributed ML mechanism.
