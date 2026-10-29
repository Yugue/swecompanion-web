# 2.1 Collective Communication and Data Movement

## 1. Describe the result before the algorithm

A **collective** is an operation involving every member of a process group. It specifies how distributed inputs become distributed outputs. The implementation then chooses communication steps.

Let four ranks hold scalars 1, 2, 3, and 4. A sum reduction produces 10. Whether that result belongs to one rank, every rank, or one partition per rank distinguishes different operations.

## 2. The operation family

| Operation | Inputs | Outputs |
|---|---|---|
| Broadcast | One rank has a tensor | Every rank receives its copy |
| Reduce | Every rank has corresponding values | One rank receives their reduction |
| All-Reduce | Every rank has corresponding values | Every rank receives the reduction |
| All-Gather | Each rank has one partition | Every rank receives all partitions |
| Reduce-Scatter | Every rank has contributions for all partitions | Each receives one reduced partition |
| All-to-All | Each has data addressed to every peer | Each receives its addressed pieces |

A **reduction** combines corresponding values using an operation such as sum or maximum. Gathering concatenates distinct pieces; it does not add them.

## 3. Follow a small tensor

Suppose rank 0 has [1,2] and rank 1 has [3,4]:

```text
All-Reduce SUM →   rank 0 [4,6]    rank 1 [4,6]
All-Gather →      rank 0 [1,2,3,4] rank 1 [1,2,3,4]
Reduce-Scatter →  rank 0 [4]      rank 1 [6]
```

The Reduce-Scatter example assigns the first output element to rank 0 and the second to rank 1. Real implementations may support different layouts, but both the reduction and ownership must be specified.

## 4. All-Reduce can be decomposed

First Reduce-Scatter gives each rank its reduced output shard. All-Gather then replicates those shards. Their composition produces the All-Reduce result.

This relationship explains state sharding: if the optimizer needs only its assigned gradient shard, communication can stop after Reduce-Scatter instead of rebuilding a full gradient everywhere.

## 5. A ring trades rounds for bandwidth efficiency

In an ideal ring All-Reduce over p ranks and an M-byte tensor, a Reduce-Scatter phase and an All-Gather phase each require p−1 rounds. Each round moves M/p bytes per rank:

\[
V_{\text{sent,rank}}=2\frac{p-1}{p}M,\qquad
T_{\text{ring}}\approx2(p-1)\alpha+
2\frac{p-1}{p}\frac{M}{B}
\]

Alpha is per-round startup, and B is effective bandwidth for the simultaneous ring transfers. The byte count is **sent bytes per rank**, excluding receives and protocol overhead.

With p=4 and M=120 megabytes, each rank sends 180 megabytes over six rounds. As p grows, sent volume approaches 2M, but startup rounds continue growing.

## 6. Trees favor fewer communication stages

A tree reduction combines values up a hierarchy; a broadcast distributes the result back down. Balanced trees can use logarithmically many stages, helping when startup dominates.

There is no universal “tree cost” independent of implementation: chunking, pipelining, simultaneous links, and congestion change bandwidth use. Large messages often favor bandwidth-oriented algorithms; small messages often favor fewer stages.

## 7. Point-to-point and All-to-All

Point-to-point send/receive moves data between selected peers. Pipeline stages use it for neighboring dependencies.

All-to-All implements redistribution, such as routing tokens to experts. Payload sizes may be uneven; workers must agree on counts and layouts. One overloaded destination can dominate completion even when total bytes are modest.

## 8. A collective is not automatically an average

Assume an initialized group, a floating-point tensor g on the appropriate device, and torch.distributed imported as dist:

```python
dist.all_reduce(g, op=dist.ReduceOp.SUM)
g.div_(dist.get_world_size())
```

This computes a mean across ranks. It is a mean across samples only when each rank's gradient represents the same number or weight of samples. Framework wrappers may already divide; dividing again would be wrong.

## 9. Ordering and completion are correctness conditions

Collectives need compatible calls, shapes, types, and group ordering. Asynchronous communication also needs safe buffer lifetimes and consumer dependencies. A mathematical diagram without these conditions is incomplete.

**Technical takeaway:** choose a collective from the desired output ownership, then analyze its actual communication algorithm and execution dependencies.
