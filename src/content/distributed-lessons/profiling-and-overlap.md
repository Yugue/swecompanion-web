# 4.3 Profiling and Communication–Computation Overlap

## 1. Optimize the critical path

A profile records when work executes, waits, and transfers data. The **critical path** is the dependency chain that determines when the step can finish.

A long operation is not necessarily the best optimization target if it is already hidden behind other work. Conversely, a short late operation can determine the entire completion time.

## 2. Measure representative steady state

Warm up kernels, memory allocation, and any compilation before collecting a short representative window. Include ordinary input fetching, forward, backward, synchronization, and optimizer behavior.

Record each rank's timing or summarize the slowest rank. Rank 0's host timer alone may miss another worker's stall. Distinguish device execution, host submission, network exchange, and explicit waiting.

## 3. Read a timeline as a dependency graph

```text
time →
compute: [backward layer 3][backward layer 2][backward layer 1]
network:                  [bucket A reduce][bucket B reduce][tail]
                                                           ↑ exposed
```

The first reduction can overlap later backward computation because its gradients are already complete. The final reduction tail has no remaining independent backward work to hide behind.

Compare the last required communication completion with the optimizer's earliest legal start.

## 4. Count only useful overlap

For compute duration C, communication duration N, and their actual overlap O:

\[
T=C+N-O,\qquad 0\leq O\leq\min(C,N)
\]

This simple model assumes those are the only two categories and their durations are measured under the same execution conditions.

For C=20 milliseconds, N=12, O=8, elapsed time is 24 milliseconds. Perfect overlap would give 20, not 8. Co-running communication can slow compute by consuming memory bandwidth, so isolated timings are not always valid inputs.

## 5. Gradient buckets trade latency against readiness

Small buckets become ready earlier but issue more messages and may underuse network bandwidth. Large buckets amortize startup but delay the first reduction.

The order parameters become ready also matters. A bucket containing one late gradient may delay many early gradients. Dynamic unused parameters can complicate readiness tracking and collective order.

Tune from the timeline rather than assuming the smallest bucket gives the greatest overlap.

## 6. Parameter prefetch moves the stall

Sharded training can gather the next layer while computing the current one. Successful prefetch must start early enough, respect update and buffer dependencies, and finish before the next layer consumes the weights.

Deeper lookahead keeps more full parameters live. If capacity is tight, prefetch can trigger allocation stalls or out-of-memory failure, negating its speed benefit.

Multiple collectives on separate streams can still serialize through a shared communicator or physical link. Independent streams are an opportunity, not a bandwidth guarantee.

## 7. Capture an execution trace

Assume profile and ProfilerActivity are imported from torch.profiler and train_step executes representative work:

```python
with profile(activities=[ProfilerActivity.CPU, ProfilerActivity.CUDA]) as prof:
    train_step()
prof.export_chrome_trace("trace.json")
```

A profile adds overhead. Use detailed tracing to form a hypothesis, then validate improvement with a lighter end-to-end benchmark.

## 8. Diagnose the shape of idle time

| Trace pattern | Plausible cause | Next comparison |
|---|---|---|
| All devices idle before forward | Input/host scheduling | Loader and host trace |
| Some ranks reach collectives early | Work imbalance | Per-rank compute and input times |
| Long communication tail | Late buckets or insufficient bandwidth | Bucket readiness and message size |
| Gaps before sharded layers | Gather/prefetch dependency | Group size and lookahead |
| Slower compute during overlap | Shared-resource contention | Co-run versus isolated timing |

These are hypotheses, not proofs; several causes can produce similar traces.

## 9. Keep one controlled change

Change one meaningful parameter, preserve the workload and precision, and measure step time, memory, and quality-relevant semantics. Repeat only when variance or a new observation justifies it.

**Technical takeaway:** effective overlap removes exposed dependencies without exceeding memory or shared-resource budgets; a trace should explain why the end-to-end step improves.
