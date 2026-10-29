# 5.2 Multi-Node Execution and Failure Diagnosis

## 1. Several setup layers must agree

Multi-node training requires processes to start, discover peers, select devices, create communication groups, and execute a compatible program. Success at one layer does not prove the next works.

A **rendezvous** establishes worker membership and coordination information. It does not guarantee that the chosen network interfaces can carry all later traffic.

## 2. Map processes to resources

For each process, record node identity, world rank, local rank, assigned device, and process-group memberships. Check that assignments do not unintentionally oversubscribe a device.

The environment must provide compatible libraries, model configuration, tensor layouts, and access to required data. Different workers can execute legitimate role-specific code, but their shared communication contracts must match.

```text
launch processes → rendezvous → assign devices/groups
                                      ↓
                               verify transfers
                                      ↓
                           execute coordinated steps
```

## 3. Understand the failure domain

A hardware device failure affects its process; a node failure can remove several ranks. A synchronous communication group may then become unable to complete any further update.

For model-parallel execution, losing one partition prevents the remaining partitions from producing a complete model result. Surviving devices do not automatically form a valid smaller replica.

A supervisor should treat the affected group as a coordinated job rather than allowing isolated ranks to continue arbitrary updates.

## 4. Distinguish setup failure from runtime failure

| Symptom | First evidence to inspect |
|---|---|
| Workers never join | Addresses, membership, connectivity, startup logs |
| Multiple ranks use one GPU | Local device mapping |
| First collective fails | Backend, interfaces, dtype, shapes, group configuration |
| Later collective hangs | Divergent control flow or a prior worker failure |
| Only large transfers fail | Memory pressure, transport limits, network path |
| Gradual slowdown | Contention, input stalls, throttling, imbalance |

These are starting points. Preserve the earliest exception; later timeouts on other ranks are often consequences rather than independent root causes.

## 5. Collective mismatch can look like network failure

One rank can enter All-Gather while another enters All-Reduce, use a different tensor size, or skip a branch entirely. Every process may remain alive while no valid progress is possible.

Log a bounded sequence of step numbers, group identities, operation types, and shapes around the suspected region. Check whether a rank ran out of data or encountered an earlier exception before blaming the network.

## 6. GPU failures may surface later

Because execution is asynchronous, a host-side error report can appear after the operation that caused it. Temporarily adding targeted completion checks can localize the first failing operation.

Do not add unconditional barriers everywhere: they can obscure the original ordering issue, create new hangs when a rank has already failed, and remove the overlap under investigation.

## 7. Timeouts bound waiting, not correctness

A timeout should allow normal slow operation while terminating an unrecoverable wait. Increasing it can help a legitimate long initialization, but cannot repair a missing participant.

After a communication failure, the backend or device state may be unusable. A common robust policy is to terminate and restart the affected worker group from a committed checkpoint, subject to the framework's recovery contract.

Preemption notices can permit a graceful checkpoint, but termination may arrive too quickly or remove a required rank; periodic durable checkpoints remain necessary.

## 8. Diagnose with the smallest faithful setup

First verify communication on the same topology and representative message sizes. Then run one small model step, followed by representative data and memory pressure.

Keep logs attributable to rank and step. Avoid dumping full tensors; counts, shapes, bounded samples, and state fingerprints usually provide better evidence.

**Technical takeaway:** identify the first violated setup, communication, or execution contract; downstream waiting is often a symptom of a failure elsewhere.
