## Scale and cost

**These are among the most expensive systems a company runs,** and the cost drivers are specific enough to name precisely.

### 1. Where the money actually goes

```text
embedding tables      100M users × 128 floats  ≈  50GB
                      + 10M items, + creators, + categories
                      → usually >95% of all model parameters

scoring               candidates × requests × model cost
                      500 × 10,000/sec = 5,000,000 scores per second

feature serving       a lookup per candidate per feature
ANN index             memory-resident, rebuilt regularly
training              distributed, with sharded embedding tables
```

The network is almost never the problem. **The embedding tables and the number of scores are.**

---

### 2. The scoring equation

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

### 3. Shrinking embedding tables

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

Frequency pruning usually gives the best ratio, because id distributions have enormous tails: most users and items appear a handful of times and cannot support a well-fitted vector anyway.

---

### 4. Precompute versus serve live

```text
heavy users     compute their whole slate offline → serve a lookup
                (a small number of users generate most of the requests)

hot contexts    cache popularity lists per country/device/surface

long tail       serve live - too many combinations to precompute
```

Because usage distributions are so concentrated, precomputing for the head often removes most of the live traffic. This is a standard and underused answer to a scaling question.

---

### 5. The cost conversation in an interview

Be able to do rough arithmetic out loud:

```text
10,000 requests/sec × 500 candidates = 5M scores/sec
at 100 μs of CPU per score → 500 CPU-seconds per second → ~500 cores just for ranking
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

That completes **Chapter 6 — Production systems**. Next topic is **Connecting the model to the business**.
