## Testing and replay

Non-determinism is a reason to test differently, not a reason to skip testing. The three techniques that make agents testable are **mocked tools**, **trace replay**, and **property assertions over repeated runs**.

### 1. The test pyramid for agents

```text
        ╱ end-to-end, real tools ╲      slow, flaky, few - run before release
      ╱  replay against traces    ╲     medium - run on every prompt/model change
    ╱  unit tests with mocked tools ╲   fast, deterministic - run on every commit
```

The bottom layer is where most of the value is, and it is the layer teams skip because "you can't unit-test an LLM." You can test everything around it.

---

### 2. Unit tests with mocked tools

```python
def test_verifies_identity_before_refund():
    tools = MockTools(get_order={"id": "48812", "total": 240.00},
                      verify_identity={"status": "ok"})
    trace = run_agent("refund order 48812", tools)
    assert called_before(trace, "verify_identity", "issue_refund")
    assert tools.calls["issue_refund"][0]["amount"] == 240.00
```

These are fast and deterministic **in the parts that matter**: ordering, argument construction, error handling, and refusal behavior. Add a mock that returns an error, a timeout, and an empty result - the error paths are where agents actually break and where tests are cheapest.

---

### 3. Replay

```text
recorded production traces
        │
        ├─► same tools, NEW prompt/model
        │
        └─► diff: tool choices, arguments, final outputs, cost, steps
```

Replay answers the question you actually have before a change: *what would this have done differently?* It is the most practical model-upgrade tool there is, because it uses real inputs rather than a curated set.

Caveat: once the new run diverges, the recorded observations no longer match the new calls. Either mock by `(tool, args)` lookup with a fallback to live calls, or accept that replay validates the early steps most reliably.

---

### 4. Assert properties, not strings

```text
✗  assert output == "I've issued your refund of $240.00."
✓  assert refund_called_once_with(amount=240.00)
✓  assert "verify_identity" in called_tools
✓  assert no_tool_called_in(FORBIDDEN_TOOLS)
✓  assert run.cost_usd < 0.05 and run.steps <= 12
✓  assert every_cited_source in retrieved_sources
```

The negative assertions - nothing forbidden happened, nothing was sent, nothing was deleted - are the ones that catch the failures that actually hurt.

### Rule of thumb

> Assert what must be true and what must never happen. Never assert the exact wording.

---

### 5. Gate on pass rate

```python
results = [run_case(c) for _ in range(5)]
assert pass_rate(results) >= 0.95     # not "it passed once"
```

Running each case once turns a flaky change into a green build. Five runs and a threshold catches regressions that single runs hide - and it makes the cost of the suite explicit, which is a real constraint worth budgeting.

---

## What you should say in an interview

For "three assertions you'd put in CI for a refund agent":

> First, ordering: verify_identity must have been called and returned ok before issue_refund - that's a business rule with a real fraud consequence, and it's testable deterministically with mocked tools. Second, a negative assertion: no tool outside the allowed set was called, and issue_refund was called at most once with an amount that exactly matches the order total from the mocked observation, never a value that didn't appear in an observation. Third, budget and outcome consistency: the run stayed under its step and cost caps, and if the final message claims a refund was issued, a refund call exists in the trace - that catches premature completion before a user sees it. I'd run those with mocked tools on every commit, including mocks that return errors, timeouts, and empty results, since the error paths are where agents break. Separately I'd replay recorded production traces against any prompt or model change to diff tool choices and cost, and I'd run each eval case several times and gate on pass rate rather than a single green run, because one run on a non-deterministic system is an anecdote.

Next topic is **Deployment and versioning**.
