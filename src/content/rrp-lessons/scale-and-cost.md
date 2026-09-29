## Scale and cost

**These are among the most expensive systems a company runs,** and the cost drivers are specific enough to name precisely.

The **serving path** is the online sequence from request through retrieval, ranking, and response. This lesson performs the capacity arithmetic across its requests, candidates, embeddings, indexes, feature reads, and retraining jobs.

---

## 1. Where the money actually goes

```text
embedding tables      100M users × 128 floats  ≈  50GB
                      + 10M items, + creators, + categories
                      → usually >95% of all model parameters

scoring               candidates × requests × model cost
                      500 × 10,000/sec = 5,000,000 scores per second

feature serving       a lookup per candidate per feature
approximate-nearest-neighbor (ANN) index   memory-resident, rebuilt regularly
training              distributed, with sharded embedding tables
```

### Core intuition

The network is almost never the problem. **The embedding tables and the number of scores are.**

---

## 2. The scoring equation

\[
\text{cost} \;\propto\; \text{candidates per request} \times \text{requests} \times \text{cost per score}
\]

Three levers, and the first is usually the cheapest to pull:

```text
fewer candidates     500 → 300 is a 40% saving, and a recall loss you can measure
fewer requests       cache, precompute for heavy users, batch where possible
cheaper per score    smaller model, quantization, distillation, early exit
```

### Rule of thumb

> Cutting candidates is the bluntest and most effective cost lever. Measure the recall it costs, and decide deliberately.

---

## 3. Shrinking embedding tables

```text
hashing            map ids into a fixed number of buckets
                   → fixed memory; collisions merge unrelated ids

frequency pruning  keep vectors only for ids above a count threshold,
                   everything else shares a bucket
                   → most ids are rare, so this saves a lot

quantization       store 8-bit integers instead of 32-bit floats
                   → 4x smaller, small accuracy loss

smaller dimension  128 → 64
                   → linear saving, measurable quality loss
```

### Rule of thumb

Frequency pruning usually gives the best ratio, because id distributions have enormous tails: most users and items appear a handful of times and cannot support a well-fitted vector anyway.

---

## 4. Memory includes more than the stored vectors

Ten million 128-dimensional float32 item vectors require `10,000,000 × 128 × 4 ≈ 5.12 GB` before index metadata. Replicas, caches, temporary rebuild copies, and training optimizer state add to that footprint.

Estimate peak memory while old and new indexes coexist, not just steady-state storage. A build that fits on disk can still fail during a rolling update.

---

## 5. Precompute versus serve live

```text
heavy users     compute their whole slate offline → serve a lookup
                (a small number of users generate most of the requests)

hot contexts    cache popularity lists per country/device/surface

long tail       serve live - too many combinations to precompute
```

### Intuition

Because usage distributions are so concentrated, precomputing for the head often removes most of the live traffic. This is a standard and underused answer to a scaling question.

---

## 6. Provision for peaks, not theoretical saturation

The CPU-core estimate above assumes perfect utilization and no other work. Add headroom for traffic bursts, failures, queueing, feature access, and uneven shard load.

Measure throughput and tail latency with realistic batch sizes and hot-item distributions. Keep quality, latency, and infrastructure spend on the same comparison so a saving does not silently buy an unacceptable recommendation loss.

---

## 7. The cost conversation in an interview

Be able to do rough arithmetic out loud:

```text
10,000 requests/sec × 500 candidates = 5M scores/sec
at 100 μs of central-processing-unit (CPU) time per score → 500 CPU-seconds per second → ~500 cores just for ranking
                             ↓
cut candidates to 250   →  250 cores
cache 40% of requests   →  150 cores
```

Doing that in the room is worth more than naming another architecture. It also shows where the funnel's shape came from: the candidate count is an economic decision as much as a quality one.

---

## What matters most

- **Embedding tables dominate model size,** typically over 95% of parameters - the network is rarely the problem.
- **Cost is candidates × requests × cost per score,** and cutting candidates is the bluntest effective lever.
- **Frequency pruning beats other table-shrinking tricks,** because most ids are too rare to support a fitted vector.
- **Precompute for the heavy head of the distribution,** which removes much of the live traffic.
- **Do the arithmetic out loud in an interview** - the funnel's shape is an economic decision.

---

## Chapter 6 checkpoint

Work backwards from traffic, catalogue size, latency, availability, and cost targets. State per-stage budgets, feature freshness, caches, fallbacks, index refresh, logging, retraining trigger, exploration allocation, and the arithmetic behind the bottleneck.

That completes **Chapter 6 — Production systems**. Next topic is **Connecting the model to the business**.
