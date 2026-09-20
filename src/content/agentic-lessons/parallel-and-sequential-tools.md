## Parallel and sequential calls

Latency in an agent is dominated by round trips. Recognizing which calls are independent - and running those at the same time - is usually the largest wall-clock win available, and it is a planning decision, not an infrastructure one.

---

## 1. The win

```text
sequential:   ──call A──► ──call B──► ──call C──►     3 × (model + tool)
parallel:     ──call A──┐
              ──call B──┼─►                           1 × (model + slowest tool)
              ──call C──┘
```

### Core intuition

Three lookups at 800 ms each become one 800 ms step. Just as important: it is **one** model turn instead of three, so you also save two full context re-sends.

---

## 2. When a call is parallelizable

A set of calls can run concurrently only if:

1. no call's **arguments** depend on another's result, and
2. no two calls write to the same state.

```text
✓  get_weather("SFO"), get_weather("JFK"), get_weather("LHR")
✓  search_docs(q), search_tickets(q), search_code(q)

✗  get_user(email) then get_orders(user_id)      ← argument dependency
✗  update_row(1, x) and update_row(1, y)          ← write conflict
```

Reads fan out freely. Writes to shared state should be serialized even when they look independent, or you get lost updates that no trace will explain.

### Rule of thumb

> Fan out reads. Serialize writes. Never parallelize anything whose argument you don't already have.

---

## 3. What the runtime must do

```python
results = await asyncio.gather(*[execute(c) for c in calls],
                               return_exceptions=True)
for call, result in zip(calls, results):
    context.append(observation(call_id=call.id, content=normalize(result)))
```

Three requirements hide in those four lines:

- **Bind by call id.** Results arrive out of order; appending by completion order misattributes outputs.
- **Don't let one failure kill the batch.** Return the error as that call's observation and keep the rest.
- **Bound the fan-out.** A model that emits 60 parallel calls will happily exhaust a rate limit; cap concurrency in the runtime.

---

## 4. When the model gets it wrong

If the model emits three calls in one turn and the third needs the second's result, it has mis-planned - it produced a dependency it cannot satisfy, and will fill the missing argument with a guess.

Fixes, in order of preference:

1. **Tool design** - if two steps are always paired, merge them into one tool that does both server-side.
2. **Descriptions** - state the dependency: "requires the numeric user_id returned by get_user."
3. **Runtime check** - reject a batch containing a call whose argument was never observed, and return that as an error the model can act on.

Note that all three are structural. "Remember to call them in order" is not a fix.

**The cost side.** Parallel calls cut latency, not tokens: three observations still enter the context. If each returns 3,000 tokens, you saved seconds and spent the window. Pair fan-out with compact returns, or with a subagent that reads all three and returns a summary.

---

## What matters most

- **Fan out reads, serialize writes, and never parallelize a call whose arguments you do not already have.**
- **Parallelism collapses round trips *and* model turns:** three sequential lookups become one step, saving two full context re-sends as well as the wall-clock.
- **A call is parallelizable only if its arguments do not depend on another result** and no two calls touch the same state.
- **If the model emits a batch with an internal dependency it has mis-planned,** and the symptom is an invented argument. Fix it structurally - merge the paired tools, state the dependency in the description, or reject the batch at runtime.
- **Parallel calls cut latency, not tokens.** Three observations still enter the window, so pair fan-out with compact returns.

Next topic is **Code execution as a universal tool**.
