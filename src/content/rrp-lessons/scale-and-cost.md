## Scale and cost

## 1. Multiply demand by work

**Capacity planning** estimates the resources needed for expected demand. Begin with counts, then benchmark the deployed workload.

## 2. Count scores

\[
S=Q C
\]

\(Q\): requests per second; \(C\): candidates scored per request; \(S\): scores per second.

At 10,000 requests/second and 500 candidates, \(S\) is **five million scores/second**.

## 3. Convert CPU work carefully

At 100 microseconds of CPU time per score, scoring consumes **500 CPU-seconds per second**—about 500 fully occupied cores, before headroom.

This is CPU work, not request wall-clock latency. Actual batching, accelerators, and communication can change measured cost.

Halving candidates and caching 40% of remaining requests reduces this example to **150 CPU-seconds/second**, with quality and freshness tradeoffs.

## 4. Budget peak memory

Ten million vectors × 128 coordinates × four bytes = **5.12 GB**, about **4.77 GiB**.

GB uses billions of bytes; GiB uses powers of 1,024. Add index metadata, replicas, caches, and training state.

Coexisting old and new indexes can make rollout memory exceed steady-state memory.

## 5. Choose a measured cost lever

| Lever | Cost reduced | Risk |
|---|---|---|
| Smaller pool | Feature and scoring work | Lost useful candidates |
| Caching | Repeated computation | Staleness |
| Smaller vectors/model | Memory and computation | Reduced capacity |
| Quantization | Numeric storage precision | Changed scores/search |
| Shared or hashed IDs | Table entries | Lost distinctions or collisions |

**Hashing** maps IDs into a fixed set of slots; distinct IDs can collide. **Distillation** trains a cheaper model from another model's behavior.

## 6. Benchmark the bottleneck

Measure throughput and tail latency with realistic batches, popular-item concentration, cache misses, and failures.

Feature access, queueing, and index maintenance may dominate raw arithmetic. Reserve headroom for peaks and recovery.

## 7. Interview reasoning

**Question:** Does fitting vector bytes in memory prove the deployment fits?

**Answer:** No. Include index structures, replicas, temporary build copies, and old/new coexistence, then measure peak usage.
