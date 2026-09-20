## Latency and token economics

Agent cost is not "price per token times length of answer." It is **steps multiplied by a growing context**, and that product is what any serious design answer works backwards from.

### 1. The cost model

\[
\text{cost} \;\approx\; \sum_{i=1}^{n}\Big(p_{\text{in}}\cdot c_i \;+\; p_{\text{out}}\cdot o_i\Big), \qquad c_i = \text{base} + \sum_{j<i}s_j
\]

Input tokens dominate, because the whole transcript is re-sent every turn. Concretely:

```text
20 steps, base 3k, observations ~1.5k each
  step 1  context  3.0k
  step 10 context 16.5k
  step 20 context 31.5k
  total input ≈ 345k tokens  ← for a "conversation" of 33k
```

### Rule of thumb

> Halving the step count saves more than halving the price per token.

---

### 2. The levers, in order of payoff

| Lever | Typical effect | How |
|---|---|---|
| Fewer steps | Largest | Better tools, merge paired calls, workflow-ize the predictable part |
| Smaller context per step | Large | Compact observations, retrieve less, externalize artifacts |
| Prompt caching | Large on long prefixes | Stable-first ordering; see the caching lesson |
| Cheaper model per step | Medium | Route by step kind: fast for extraction, reasoning for planning |
| Parallel calls | Latency only | Fan out independent reads |

Note the last row: parallelism buys wall-clock, not tokens.

---

### 3. Latency has a different shape from cost

```text
p50:  6 s   (8 steps)
p95: 34 s   (22 steps)
p99: 90 s   (cap, after retries)
```

Agent latency distributions are long-tailed because step count varies. Design to the tail: cap steps, time-box tools, and have a defined partial-result path. A product spec written against p50 will be wrong for the users who complain.

---

### 4. Perceived latency

```text
stream tokens            → first output in <1 s
show the current step    → "searching orders…" beats a spinner
return partial results   → answer the part you have, note what's pending
```

None of these reduce total time, and all of them change whether the product feels broken.

---

### 5. Designing backwards from a budget

```text
budget: $0.05 and 8 s per request
  → at ~$3/M input tokens, $0.05 ≈ 16k input tokens TOTAL
  → with quadratic growth that's roughly 5-6 steps at a 3k context
  ⇒ so: 4 tools max, step cap 6, compact observations (<600 tokens),
        cacheable prefix, fast model except one planning step,
        route simple queries to a non-agent path entirely
```

Working the arithmetic out loud like this is what distinguishes a design answer from a wish list.

---

## What you should say in an interview

For "$0.05 and 8 seconds per request":

> I'd turn the budget into token arithmetic first. At roughly three dollars per million input tokens, five cents is about sixteen thousand input tokens for the entire run - and because the transcript is re-sent every turn, input grows with the sum of prefixes, so that's something like five or six steps at a three-thousand-token context, not sixteen steps. That number then drives the design: a small tool set so schemas don't eat the prefix, a step cap around six, observations compacted to a few hundred tokens rather than raw payloads, and a stable-first prompt so prompt caching covers the system and tool blocks. I'd route by step kind, using a fast model for extraction and formatting and reserving a reasoning model for the one planning decision. For latency I'd parallelize independent reads, time-box every tool, and stream output so first token lands under a second. And I'd check what fraction of traffic needs the agent at all - if most requests are single-hop lookups, they should go down a non-agent path, which is usually the difference between meeting that budget and missing it.

Next topic is **Prompt caching and reuse**.
