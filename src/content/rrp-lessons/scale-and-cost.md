## Scale and cost

**Capacity planning** estimates storage and computation from the work the system must perform. Separate raw arithmetic from measured hardware throughput and operational headroom.

## 1. Count scores and CPU work

\[
\text{scores/second}=\text{requests/second}\times\text{candidates/request}
\]

At 10,000 requests per second and 500 candidates, ranking requires five million scores per second.

If each score uses 100 microseconds of CPU time, that is 500 CPU-seconds per second—about 500 fully utilized cores for scoring alone. This assumes the per-score CPU estimate applies at the actual batch size; accelerator batching and communication can change the model.

Cutting candidates to 250 halves this component's work. Caching 40% of the remaining requests would reduce it to about 150 CPU-seconds per second. Neither change guarantees the same quality or freshness.

## 2. Count peak memory, not just vector bytes

Ten million items × 128 coordinates × four bytes per float32 value = 5.12 GB in decimal units, about 4.77 GiB.

Add index metadata, IDs, model tables, caches, replicas, and temporary copies during refresh. Training may also need gradients and optimizer state.

Keeping both old and new indexes for a switch can increase peak memory substantially. A model that fits on disk can still exceed memory during construction or rollout.

## 3. Choose a cost lever with its quality cost

| Lever | Work reduced | Tradeoff to measure |
|---|---|---|
| Smaller candidate pool | Features and scoring | Lost useful candidates |
| Cached or precomputed results | Repeated request computation | Staleness and reduced responsiveness |
| Smaller vectors or model | Storage and score work | Representation quality |
| Quantization | Bytes and sometimes arithmetic | Changed score or search accuracy |
| Hashing or rare-ID sharing | Embedding table entries | Collisions or lost entity detail |

**Quantization** reduces numeric precision. **Distillation** trains a cheaper model to reproduce useful behavior from another model. Both require actual quality and speed measurements.

## 4. Profile the deployed workload

Feature fetches, hot shards, network traffic, queueing, and index maintenance can dominate a system whose arithmetic model looks cheap.

Measure throughput and tail latency with realistic candidate batches, popularity distributions, cache misses, and failures. Include retraining and rebuild costs, then leave headroom for peaks and recovery.

> **Mental image:** multiply demand by work per decision, then account for where that work really runs. A throughput estimate is a budget, not a benchmark.
