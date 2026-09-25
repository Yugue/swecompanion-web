## Testing and replay

Non-determinism is a reason to test differently, not a reason to skip testing. The three techniques that make agents testable are **mocked tools**, **trace replay**, and **property assertions over repeated runs**.

The evaluation lessons define what quality means. This lesson focuses on when those checks run and how recorded trajectories become repeatable regression tests.

---

## 1. The test pyramid for agents

```text
        ╱ end-to-end, real tools ╲      slow, flaky, few - run before release
      ╱  replay against traces    ╲     medium - run on every prompt/model change
    ╱  unit tests with mocked tools ╲   fast, deterministic - run on every commit
```

### Common issue

The bottom layer is where most of the value is, and it is the layer teams skip because "you can't unit-test an LLM." You can test everything around it.

---

## 2. Unit tests with mocked tools

```python
def test_verifies_identity_before_refund():
    tools = MockTools(get_order={"id": "48812", "total": 240.00},
                      verify_identity={"status": "ok"})
    trace = run_agent("refund order 48812", tools)
    assert called_before(trace, "verify_identity", "issue_refund")
    assert tools.calls["issue_refund"][0]["amount"] == 240.00
```

### Rule of thumb

These are fast and deterministic **in the parts that matter**: ordering, argument construction, error handling, and refusal behavior. Add a mock that returns an error, a timeout, and an empty result - the error paths are where agents actually break and where tests are cheapest.

---

## 3. Replay

```text
recorded production traces
        │
        ├─► same tools, NEW prompt/model
        │
        └─► diff: tool choices, arguments, final outputs, cost, steps
```

Replay answers the question you actually have before a change: *what would this have done differently?* It is the most practical model-upgrade tool there is, because it uses real inputs rather than a curated set.

### Common issue

Caveat: once the new run diverges, the recorded observations no longer match the new calls. Either mock by `(tool, args)` lookup with a fallback to live calls, or accept that replay validates the early steps most reliably.

---

## 4. Assert properties, not strings

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

## 5. Gate on pass rate

```python
results = [run_case(c) for _ in range(5)]
assert pass_rate(results) >= 0.95     # not "it passed once"
```

### Core intuition

Running each case once turns a flaky change into a green build. Five runs and a threshold catches regressions that single runs hide - and it makes the cost of the suite explicit, which is a real constraint worth budgeting.

---

## Interview mental model

Non-determinism changes how you test, not whether you test:

```text
unit,  mocked tools       every commit   ordering, arguments, refusals, error paths
replay recorded traces    every change   diff tool choices, arguments, cost, steps
end-to-end, real tools    pre-release    slow, flaky, few
```

- **Assert properties, not strings.** The negative assertions - nothing forbidden ran, nothing was sent, nothing was deleted - catch the failures that actually hurt.
- **Mock the error paths too** - timeouts, empty results, rejections - since that is where agents break and where tests are cheapest.
- **Replay is the best model-upgrade tool** because it uses real inputs rather than a curated set.
- **Gate on pass rate over repeated runs,** or one green run lets a flaky change ship.

Next topic is **Deployment and versioning**.
