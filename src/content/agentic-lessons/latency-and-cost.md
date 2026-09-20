## Latency and token economics

**An agent's bill is not "price per word of the answer". It is the number of steps multiplied by how much text it re-reads at every step.**

Because the model remembers nothing between calls, each step re-sends the whole conversation so far. Ten steps therefore costs a good deal more than ten times one step, and every serious design answer works backwards from that.

---

## 1. The cost model

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

## 2. Where the money actually goes

A 12-step run, costed out. Base prompt is 3k tokens (system plus tool schemas), each observation adds about 1.5k:

```text
step    context in    output    cost this step
  1        3,000        120        $0.011
  2        4,620        110        $0.016
  3        6,230        140        $0.021
  6       11,100        130        $0.035
  9       15,900        120        $0.050
 12       20,700        150        $0.064
                                  ───────
                     total input 142,000 tokens    ≈ $0.43
                     total output   1,500 tokens   ≈ $0.02
```

Two things jump out.

**Input is 95% of the bill.** Output is almost a rounding error, which is why "make the answer shorter" saves nothing.

**The last step costs six times the first.** Nothing about step 12 is harder - it simply carries eleven prior steps with it.

Now compare three changes against that baseline:

```text
baseline                          12 steps, 1.5k observations    $0.43
compact observations to 400       12 steps, 0.4k observations    $0.16   (−63%)
cut to 7 steps                     7 steps, 1.5k observations    $0.17   (−60%)
both                               7 steps, 0.4k observations    $0.08   (−81%)
```

### Core intuition

Halving the step count saves far more than halving the price per token would, because each step you remove also removes its contribution to every later step's context.

---

## 3. The levers, in order of payoff

| Lever | Typical effect | How |
|---|---|---|
| Fewer steps | Largest | Better tools, merge paired calls, workflow-ize the predictable part |
| Smaller context per step | Large | Compact observations, retrieve less, externalize artifacts |
| Prompt caching | Large on long prefixes | Stable-first ordering; see the caching lesson |
| Cheaper model per step | Medium | Route by step kind: fast for extraction, reasoning for planning |
| Parallel calls | Latency only | Fan out independent reads |

Note the last row: parallelism buys wall-clock, not tokens.

---

## 4. Latency has a different shape from cost

```text
p50:  6 s   (8 steps)
p95: 34 s   (22 steps)
p99: 90 s   (cap, after retries)
```

### Common issue

Agent latency distributions are long-tailed because step count varies. Design to the tail: cap steps, time-box tools, and have a defined partial-result path. A product spec written against p50 will be wrong for the users who complain.

---

## 5. Perceived latency

```text
stream tokens            → first output in <1 s
show the current step    → "searching orders…" beats a spinner
return partial results   → answer the part you have, note what's pending
```

### Rule of thumb

None of these reduce total time, and all of them change whether the product feels broken.

---

## 6. Designing backwards from a budget

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

## Interview mental model

Turn the budget into token arithmetic before designing anything:

```text
$0.05 at ~$3 per million input tokens  ≈ 16k input tokens for the WHOLE run
because input grows with the sum of prefixes → that is ~5-6 steps at 3k context,
                                               not 16 steps
```

That number then drives every choice: a small tool set, a step cap near six, observations compacted to a few hundred tokens, a cacheable prefix, and a fast model everywhere except the one planning step.

- **The levers in order:** fewer steps, smaller context per step, prompt caching, a cheaper model per step, then parallelism - which buys wall-clock, not tokens.
- **Latency is long-tailed** because step count varies, so design to p95 and p99 with caps, time-boxed tools, and a partial-result path.
- **Streaming changes whether the product feels broken** without changing total time.
- **Check what fraction of traffic needs the agent at all** - routing simple requests off the agent path is often the difference between meeting the budget and missing it.

Next topic is **Prompt caching and reuse**.
