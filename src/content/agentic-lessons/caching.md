## Prompt caching and reuse

Caching reuses work when inputs and validity conditions permit it.

## 1. Prompt reuse

```text
turn 1: stable prefix + changing task
turn 2: reused prefix + new task content
```

Cache rules, lifetime, and pricing depend on the serving interface. Verify actual supported behavior.

## 2. Stable before volatile

Reusable policy, stable tool definitions, and static examples can precede changing history and the current request.

Keep relevant content and authority clear while optimizing reuse.

## 3. Cache misses

Early timestamps, request IDs, tool reordering, or changed personalization can reduce shared-prefix matches.

A late change may preserve an earlier matching prefix; one changed token does not necessarily destroy every cached block.

## 4. Lifetime

Idle time, routing, version changes, and configured retention can affect reuse.

Measure hits across realistic traffic. Do not assume every related request receives a discount.

## 5. Other caches

Cache validated retrieval results or suitable read-only computations when their dependencies remain valid.

Never replay a write merely because the previous arguments match.

## 6. Invalidation

Example policy key:

```text
tenant + access scope + policy version + query
```

An order lookup also needs state freshness. Define owner, TTL, and invalidation events.

Recheck current permissions before serving cached sensitive data.

## 7. Measure value

Track cached-token share, latency and cost saved, and stale-result incidents.

A high hit rate on a tiny prefix may save little.

## What matters most

> Reuse a photocopy only while its content, permissions, and version remain valid.
