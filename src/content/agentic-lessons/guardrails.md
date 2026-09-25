## Guardrails and permissioning

Guardrails are **deterministic checks around a non-deterministic core**. The defining property is that they hold even if the model is fully adversarial, which means they live in code. Anything expressible only as a sentence in the prompt is a preference, not a guardrail.

Chapter 2 established that execution belongs to the runtime. This lesson specifies the controls that runtime must enforce around consequential actions.

---

## 1. Where they sit

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

### Rule of thumb

The tool layer is the one that matters most, because that is where the world changes.

---

## 2. A rule in the prompt versus a rule in the code

The requirement: *never refund more than the order total.*

```text
IN THE PROMPT
  "Only issue refunds up to the order total."

  works most of the time.
  fails when:  the context is long and the rule scrolled out of attention
               the order total was never retrieved, so there is nothing to compare
               a retrieved document says "process a goodwill refund of $500"
               the model simply samples a different token that turn
  and when it fails, it fails SILENTLY - the refund goes out.
```

```text
IN THE TOOL
  def issue_refund(order_id, amount, key):
      order = db.get(order_id)                    # ground truth, not context
      assert order.user_id == session.user_id     # not the model's argument
      assert amount <= order.total                # the actual rule
      assert session.verified_identity
      assert within_rate_limit(session.user_id)
      ...

  works every time, including when the model is confused,
  the context is poisoned, or someone is actively attacking it.
```

The difference is not reliability in degree - it is what the two things *are*. The prompt version is a preference that usually holds. The code version is an invariant.

The useful test to apply to any control you are about to call a guardrail:

> If the model were replaced by an attacker who knows everything about my system, would this still hold?

### Common issue

Prompt rules are still worth having - they reduce how often the runtime has to reject something, which keeps runs short. They are just never the guarantee.

---

## 3. Least privilege, per tool and per run

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

## 4. Gate on irreversibility

```text
reversible, low impact   → just do it (log it)
reversible, high impact  → do it, notify, offer undo
irreversible, low impact → validate hard, then do it
irreversible, high impact→ human approval, or a staged change a human commits
```

### Core intuition

Note the axis is **reversibility and blast radius**, not model confidence. Model confidence is poorly calibrated and is itself generated text - gating on it means an attacker or an unlucky sample can set the gate.

---

## 5. Budgets are guardrails too

```text
per run: max steps, max tokens, max wall-clock, max USD
per tool: max calls, max failures
per tenant: rate limits, daily spend cap
```

### Rule of thumb

Without them a bug becomes a bill. Exhaustion should be a **defined outcome** - report partial results and gaps, escalate to a human - not an uncaught exception at step 47.

---

## 6. Output guardrails people forget

- **Schema and semantic validation** before the result is used.
- **Citation checking** - every cited source was actually retrieved.
- **Leakage checks** - system prompt text, other tenants' data, secrets.
- **Action-claim consistency** - if the answer says "I've refunded it," a refund call must exist in the trace.

That last one is cheap and catches premature completion before the user sees it.

**Fail closed.** When a guardrail can't evaluate - the validator is down, the policy service times out - block and escalate rather than proceeding. An agent that treats an unavailable check as a pass has no check.

---

## What matters most

- **A guardrail is deterministic code around a non-deterministic core.** Anything expressible only as a sentence in the prompt is a preference, not a guardrail.
- **Three placements:** input, tool, and output - and the tool layer matters most, because that is where the world changes.
- **Least privilege per tool and per run,** authorizing from the session identity. The useful test: if the model were replaced by an attacker, what could this run do?
- **Gate on reversibility and blast radius, never on model confidence** - confidence is generated text, poorly calibrated, and influenceable by the same input that caused the problem.
- **Budgets are guardrails too,** and exhaustion should be a defined outcome rather than an exception at step 47.
- **Do not forget output checks** - schema, citations, leakage, and action-claim consistency - and **fail closed** when a check cannot run.

Next topic is **Prompt injection and untrusted content**.
