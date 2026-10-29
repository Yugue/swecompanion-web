# 4.4 Stragglers, Load Imbalance, and Work Scheduling

## 1. Synchronous work waits for its slow path

A **straggler** finishes later than peers. It may be consistently overloaded or temporarily delayed by data access, host scheduling, hardware throttling, or shared network traffic.

In a simplified step with independent worker compute times t_r followed by a common synchronization:

\[
T_{\text{step}}\approx\max_r t_r+T_{\text{sync}}
\]

The maximum, not the average, determines completion. Overlapped implementations have more complex dependencies but retain the same basic slow-path issue.

## 2. Quantify wasted capacity

For worker times [10,10,10,30] milliseconds, all four reach the synchronization boundary only after 30 milliseconds. Useful compute occupies 60 of 120 worker-milliseconds, or 50% under this simple model.

Adding workers with no change to the overloaded task does not eliminate the 30-millisecond path. First identify whether the imbalance is in assigned work, execution speed, or shared-resource access.

## 3. Token count is not always work count

Attention cost depends on allowed token pairs, not merely the number of sequences. A padded batch processes shapes determined by its longest sequence unless the implementation avoids padding work.

For dense attention, sequences of lengths 100 and 200 expose roughly 10,000 and 40,000 score positions before masking optimizations. Assigning one sequence to each worker is not balanced work.

Expert routes, image resolutions, and sparse feature popularity introduce other sources of variable cost.

## 4. Bucketing and packing reduce waste

**Bucketing** groups similarly sized examples so a batch needs less padding. **Packing** puts multiple shorter sequences into one physical tensor.

```text
naive batch:   [short.....padding.....]
               [long................]
bucketed:      [short][short]   or   [long][long]
packed row:    [sequence A][sequence B][padding]
                              ↑ boundary mask matters
```

Packing independent sequences needs masks that prevent unintended cross-sequence attention and correct position/label handling. The same tensor length does not imply the same learning objective.

Bucketing can correlate examples or reduce random mixing, so randomize within the chosen policy.

## 5. Balance tasks without changing weights

Dynamic scheduling assigns work as workers become available. This can improve utilization, but synchronous gradient aggregation still requires a well-defined update window and valid example/token counts.

A faster worker processing more examples should contribute proportionally more to a sample-weighted objective. Averaging its local mean equally with a smaller batch would change the objective.

Dropping slow workers' gradients also changes which data contributes, potentially biasing the update if slowness correlates with example type.

## 6. Balance model partitions

Pipeline stages need similar measured times, not equal layer counts. Expert owners need manageable routed loads. Context partitions need comparable attention work under the mask.

Moving partitions can increase communication or memory at the destination. A locally balanced compute assignment can still overload one adapter or memory link, so assess the complete resource path.

For heterogeneous devices, allocation proportional to measured sustainable throughput is a starting point, subject to compatible tensor shapes and memory limits.

## 7. Separate persistent from transient imbalance

| Observation | Likely class | Useful response |
|---|---|---|
| Same stage always slow | Structural partition | Repartition or alter stage resources |
| Popular expert repeatedly overloaded | Routing skew | Balance routing/capacity or placement |
| Random loader delays | Input variability | Prefetch, improve storage, bound transforms |
| One device degrades over time | Hardware/environment | Inspect resource health and throttling |
| All ranks slow during transfers | Shared contention | Change placement or traffic schedule |

Speculative duplicate execution can help independent data-processing tasks, but duplicating stateful training updates requires deduplication and explicit semantics.

## 8. Judge tail behavior over a window

Report median and high-percentile step times as well as averages. A rare large stall can materially affect a long run, while tiny noisy differences may not justify scheduling complexity.

**Technical takeaway:** balance actual critical-path work while preserving the intended data distribution, update weights, and communication participation.
