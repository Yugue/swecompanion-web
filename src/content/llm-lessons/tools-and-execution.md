# Tool calling and verified execution

## 1. Add an external operation

A **tool** is an available external function. **Tool calling** proposes its name and arguments; an **executor** validates and performs the operation.

## 2. Follow the interaction

The application supplies tool definitions; the model proposes a call; the executor checks it; the tool returns a result; the model uses that result to continue.

A calculator can verify 17×23=391. It does not verify that those numbers belong to the correct invoice. Validate both arguments and result interpretation.

## 3. Separate structural and authority checks

| Gate | Example |
|---|---|
| Schema | amount is numeric |
| Domain rule | amount is positive |
| Authorization | requester may access this account |
| Confirmation policy | required approval exists for this operation |

**Authorization** checks whether the requester may perform a particular operation on a resource. Enforce it outside the model.

## 4. Cross the trust boundary

```genai-visual
trust-boundary
```

A **trust boundary** separates inputs with different authority. A page or tool result can contain malicious instructions. **Prompt injection** attempts to redirect behavior through supplied content. Treat retrieved text as data and apply access controls independently of generated recommendations.

## 5. Make retries safe

**Idempotency** means repeating an operation has the same intended effect as doing it once. A request ID can prevent a retried payment from being applied twice.

**Timeouts** bound waiting time; a timeout does not prove a remote write failed. Before retrying, inspect the operation’s recorded status when possible.

## 6. Evaluate the whole loop

Check tool choice, arguments, authorization, execution status, and final interpretation separately. “Completed” in generated prose does not establish execution.

> **Reason it through:** A write times out after dispatch. What evidence and retry property would prevent duplicating the action?
