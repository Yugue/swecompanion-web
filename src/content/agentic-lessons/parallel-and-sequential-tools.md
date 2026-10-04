## Parallel and sequential calls

Run independent calls together; wait when arguments or effects depend on earlier results.

## 1. The latency win

Three independent 800 ms lookups take about 2.4 seconds sequentially or 0.8 seconds concurrently, excluding overhead.

```text
A ─┐
B ─┼→ combine
C ─┘
```

## 2. Independence

Parallelize known-argument reads when consistency allows.

```text
weather(SFO), weather(JFK) → independent
get_user(email) → get_orders(user_id) → dependent
```

Shared conflicting writes need ordering or a concurrency protocol.

## 3. Runtime obligations

Bind observations by call ID, preserve individual failures, and cap concurrency.

```python
async def execute_batch(calls):
    results = await asyncio.gather(
        *[execute(c) for c in calls], return_exceptions=True
    )
    return [observation(c.id, normalize(r))
            for c, r in zip(calls, results)]
```

A production executor also enforces timeouts and concurrency limits.

## 4. Reject invented dependencies

If the user ID has not been observed, a dependent order lookup cannot run correctly.

Clarify the dependency, combine a frequent server-side sequence, or reject unsupported arguments.

## 5. Token costs remain

Three observations still enter context. Parallel execution may reduce model turns and repeated prefixes, but it does not make result payloads free.

Keep returns compact.

## 6. Execute ready waves

```text
get_user → get_orders ─┐
search_tickets ────────┼→ summarize
```

Start **get_user** and **search_tickets** together. Start orders after the ID arrives. Summarize after required evidence is ready.

## What matters most

> Dependencies decide ordering; ready independent work decides concurrency.
