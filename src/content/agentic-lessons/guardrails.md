## Guardrails and permissioning

Guardrails are **deterministic checks around a non-deterministic core**. The defining property is that they hold even if the model is fully adversarial, which means they live in code. Anything expressible only as a sentence in the prompt is a preference, not a guardrail.

### 1. Where they sit

```text
user input ──► [ input guardrails ] ──► agent loop ──► [ output guardrails ] ──► user
                                          │   ▲
                                          ▼   │
                                  [ tool guardrails ]
                                   authorize · validate · limit
```

Three placements, three jobs:

| Layer | Checks | Examples |
|---|---|---|
| Input | What enters the system | Size limits, PII detection, topic scoping |
| Tool | Every call before execution | Authorization, argument validation, rate and spend limits |
| Output | What leaves | Schema, citation validity, policy compliance, leakage |

The tool layer is the one that matters most, because that is where the world changes.

---

### 2. Least privilege, per tool and per run

```text
✗  one service account with broad access, shared by every tool
✓  read_orders   → read-only, scoped to session.user_id
   issue_refund  → write, ≤ $500, requires verify_identity in this session,
                   rate-limited 5/hour, idempotency key required
```

Scope credentials so that a compromised run has a small blast radius. The authorization decision uses the **session's** identity, never an identifier the model supplied.

### Rule of thumb

> Ask: if the model were replaced by an attacker, what could this run do? That set is your real permission surface.

---

### 3. Gate on irreversibility

```text
reversible, low impact   → just do it (log it)
reversible, high impact  → do it, notify, offer undo
irreversible, low impact → validate hard, then do it
irreversible, high impact→ human approval, or a staged change a human commits
```

Note the axis is **reversibility and blast radius**, not model confidence. Model confidence is poorly calibrated and is itself generated text - gating on it means an attacker or an unlucky sample can set the gate.

---

### 4. Budgets are guardrails too

```text
per run: max steps, max tokens, max wall-clock, max USD
per tool: max calls, max failures
per tenant: rate limits, daily spend cap
```

Without them a bug becomes a bill. Exhaustion should be a **defined outcome** - report partial results and gaps, escalate to a human - not an uncaught exception at step 47.

---

### 5. Output guardrails people forget

- **Schema and semantic validation** before the result is used.
- **Citation checking** - every cited source was actually retrieved.
- **Leakage checks** - system prompt text, other tenants' data, secrets.
- **Action-claim consistency** - if the answer says "I've refunded it," a refund call must exist in the trace.

That last one is cheap and catches premature completion before the user sees it.

---

### 6. Fail closed

When a guardrail can't evaluate - the validator is down, the policy service times out - block and escalate rather than proceeding. An agent that treats an unavailable check as a pass has no check.

---

## What matters most

- **A guardrail is deterministic code around a non-deterministic core.** Anything expressible only as a sentence in the prompt is a preference, not a guardrail.
- **Three placements:** input, tool, and output - and the tool layer matters most, because that is where the world changes.
- **Least privilege per tool and per run,** authorizing from the session identity. The useful test: if the model were replaced by an attacker, what could this run do?
- **Gate on reversibility and blast radius, never on model confidence** - confidence is generated text, poorly calibrated, and influenceable by the same input that caused the problem.
- **Budgets are guardrails too,** and exhaustion should be a defined outcome rather than an exception at step 47.
- **Do not forget output checks** - schema, citations, leakage, and action-claim consistency - and **fail closed** when a check cannot run.

Next topic is **Prompt injection and untrusted content**.
