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

## What you should say in an interview

For "your agent can send email - list every control between the decision and the message leaving":

> Starting at the tool boundary: authorization using the session identity, not anything the model supplied, so the agent can only send as this user. Then argument validation - recipients checked against an allowlist or at minimum a domain policy, attachments checked by type and size, body scanned for secrets and for other tenants' data. Then rate and spend limits, per run and per tenant, so a loop can't send a thousand messages. Then the gate: sending is irreversible, so above some blast radius - external recipients, bulk sends - it requires human approval, and I'd gate on reversibility and reach rather than on the model's confidence, since confidence is generated text and an attacker could set it. Below that threshold I'd still use a staged send with a short cancellation window and a notification. Everything is logged with the full message and the approving identity. And the whole thing fails closed: if the allowlist service is unavailable, the send blocks and escalates rather than proceeding, because a check that passes when it can't run isn't a check.

Next topic is **Prompt injection and untrusted content**.
