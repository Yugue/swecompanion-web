## Prompt caching and reuse

Agent loops re-send a long, nearly identical prefix on every turn. Prompt caching lets the provider reuse the computed state for that prefix, cutting both cost and time to first token. It is the highest-leverage optimization available in an agent, and it dictates how you order your prompt.

### 1. How it works

```text
turn 1: [system][tools][docs][history₁]  ← prefix computed and cached
turn 2: [system][tools][docs][history₂]
         └────── identical ──────┘        ← reused
                                 └── only this is computed fresh
```

The cache keys on an **exact token prefix**. Matching stops at the first differing token, and everything after it is recomputed.

Typical effect: large discounts on cached input and a substantially lower time to first token. Since the prefix is most of an agent's input, the saving compounds across every step of every run.

---

### 2. Order the prompt stable-to-volatile

```text
┌─ system prompt            stable ─┐
├─ tool schemas             stable  │  cacheable
├─ static docs / examples   stable ─┘
├─ compacted history        changes on compaction
├─ recent steps             changes each turn
└─ current turn             changes each turn
```

### Rule of thumb

> One volatile token early in the prompt costs you the entire cache.

---

### 3. The cache-killers

| Pattern | Effect | Fix |
|---|---|---|
| `"Current time: 14:03:11"` in the system prompt | Invalidates every turn | Move to the end, or coarsen to the date |
| Session or request IDs near the top | Same | Move below the stable block |
| Reordering tool schemas per turn | Same | Fix the order |
| Dynamically retrieved tools in the prefix | Partial invalidation | Put the always-on set first, retrieved ones after |
| Per-user personalization at the top | No cross-request sharing | Keep the shared block first, user block after |

A near-zero hit rate with a long fixed system prompt almost always means one of the top two rows.

---

### 4. Cache lifetime

Cached prefixes expire after a short idle window, so caching helps most within an active run or a burst of related requests. Implications:

- A long-running agent loop is close to the ideal case - turns arrive seconds apart.
- Sporadic single requests may miss the cache entirely; don't model the savings as guaranteed.
- Keeping a session "warm" purely to hold a cache is rarely worth engineering around.

---

### 5. Cache above the model too

```text
retrieval cache:  identical query → cached results (bounded TTL)
tool cache:       deterministic, read-only calls → memoize within a run
step cache:       replaying a trace? reuse unchanged steps
```

The retrieval cache is often the biggest non-model win, because agents re-issue near-identical searches. Never cache anything user-specific without the user in the key, and never cache across tenants.

---

## What you should say in an interview

For "cache hit rate is near zero despite a long fixed system prompt":

> Something volatile is sitting early in the prompt. The cache matches on an exact token prefix and stops at the first difference, so a timestamp, a session id, or a request id in or near the system block invalidates everything after it on every call - and that's nearly always the cause. The others I'd check are tool schemas being serialized in a non-deterministic order, dynamically retrieved tools placed in the prefix rather than after the always-on set, and per-user personalization at the top, which prevents any sharing across requests. The fix is to order stable-to-volatile: system prompt, tool schemas, and static examples first, then compacted history, then the current turn, with anything time-dependent moved to the end or coarsened to a date. I'd also check cache lifetime - prefixes expire after a short idle period, so sporadic one-off requests legitimately miss, and I shouldn't model the savings as guaranteed outside an active loop. Above the model, I'd add a retrieval cache with a bounded TTL keyed per tenant, since agents re-issue near-identical searches constantly.

Next topic is **Tracing and observability**.
