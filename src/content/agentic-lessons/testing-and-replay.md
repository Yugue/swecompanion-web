## Testing and replay

Test deterministic runtime behavior, stochastic decisions, and real integrations at appropriate levels.

## 1. Test layers

```text
many runtime/unit checks
    ↓
mocked-tool decision and trajectory evaluations
    ↓
selected safe real-system checks
```

Mocks control the environment; model outputs can still vary.

## 2. Mocked error paths

Test empty lookups, timeouts, denied access, partial results, and duplicate requests.

For refunds, check verified identity, eligibility, amount, and exactly-once logical execution.

## 3. Replay limits

Recorded observations can evaluate a new decision at a known state.

Once new calls diverge, old observations may no longer apply. Use argument-aware mocks, a simulator, or safe integration fixtures. Mark unsupported replay paths explicitly.

## 4. Assert behavior

```text
correct order/amount
no forbidden operation
no duplicated effect
claims match verified results
budget respected
```

Exact wording is appropriate only when wording itself is the contract.

## 5. Repeated-run gates

Five runs provide a small, coarse estimate: rates are 0%, 20%, 40%, 60%, 80%, or 100%.

Choose repetitions using variability, desired precision, and budget. Report uncertainty and important slices.

## 6. Real-system checks

Use safe accounts to detect credential, permission, API, and runtime differences that mocks omit.

Shadow mode can compare proposals without executing external effects.

## Interview mental model

> Test the mechanics directly, the decisions repeatedly, and the integration against controlled reality.
