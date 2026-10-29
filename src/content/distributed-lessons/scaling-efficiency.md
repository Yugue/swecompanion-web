# 4.2 Scaling Efficiency, Time to Quality, and Cost

## 1. Define the work held constant

**Strong scaling** asks how quickly a fixed workload runs on more resources. **Weak scaling** grows workload with resource count, commonly holding local batch size fixed.

These answer different questions. Doubling workers and global batch size can double examples per second without halving time for a fixed-quality training task.

## 2. Speedup and efficiency need a baseline

For fixed work taking T_1 on one worker and T_p on p workers:

\[
S(p)=\frac{T_1}{T_p},\qquad E(p)=\frac{S(p)}p
\]

S is speedup and E parallel efficiency. A one-second step reduced to 0.2 seconds on eight workers has speedup 5 and efficiency 62.5%.

If the model cannot run on one worker, use a stated feasible baseline q: relative efficiency is (T_q/T_p)/(p/q). Do not invent an unmeasurable single-device time.

## 3. Amdahl's law exposes serial work

If fraction f of fixed work remains serial and the rest divides perfectly:

\[
S(p)\leq\frac{1}{f+(1-f)/p}
\]

With f=0.05 and p=8, the bound is about 5.93, or 74.1% efficiency. Infinite workers cannot exceed speedup 20 under that model.

Real distributed systems add communication, synchronization, and load imbalance, so their scaling can be worse. Cache effects or changed algorithms can also invalidate a direct application of the simple model.

## 4. Build a step-time budget

A practical decomposition is:

\[
T_{\text{step}}\approx T_{\text{compute}}+
T_{\text{communication,exposed}}+
T_{\text{input,exposed}}+T_{\text{other}}
\]

Exposed time is the portion not hidden behind independent work. Adding total compute and total communication durations from overlapping timelines double-counts their intersection.

A device-memory roofline compares arithmetic intensity with compute and memory capability. Network scaling has an analogous issue: as local compute shrinks, unchanged or latency-dominated communication becomes a larger fraction of the step.

## 5. Workload size changes useful scale

Large matrix operations amortize launches and communication better than tiny shards. Strong scaling eventually makes each worker's useful computation too small.

For replicated data parallelism with fixed global batch size, local batch size shrinks as p grows, while a full gradient still needs aggregation. Memory sharding may enable a larger model but introduce additional parameter traffic.

The useful device count therefore depends on batch size, model shape, sequence length, precision, and topology.

## 6. Throughput is not convergence

If an update processes B examples in T_step seconds:

\[
Q=\frac{B}{T_{\text{step}}},\qquad
T_{\text{quality}}=K\,T_{\text{step}}
\]

Q is throughput, and K is the updates required to reach a defined target quality. K can change with global batch size, optimizer settings, or asynchronous execution.

Compare complete learning curves using a held-out metric and a consistent target. A run that processes more tokens but never reaches the quality target is not a training speedup for that objective.

## 7. Account for resources and interruptions

Accelerator-hours equal device count times elapsed hours. Eight devices for 10 hours consume 80 accelerator-hours; 32 for six hours consume 192.

If accelerators differ in price or capability, raw device-hours are insufficient; use actual cost or an explicit normalized resource measure. Include checkpoint time, failed work, initialization, and data preparation when they materially affect end-to-end cost.

## 8. Use controlled comparisons

| Comparison | Hold stable | Report changes explicitly |
|---|---|---|
| Strong scaling | Total useful work | Local batch and communication |
| Weak scaling | Work per replica | Global batch and quality behavior |
| Memory strategy | Model and objective | Precision, recomputation, peak memory |
| Training value | Target quality | Time, cost, failure overhead |

**Technical takeaway:** scale for a clearly defined objective—fixed work, target quality, latency, or cost—and report the tradeoffs that the chosen metric hides.
