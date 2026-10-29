# Tool calling and verified execution

## 1. Add an external operation

A **tool** is an external function the application makes available, such as search, a calculator, or a database lookup. **Tool calling** generates a structured request naming a function and its arguments.

The **executor** is application code that validates and performs the operation. Generated text alone cannot confer permission.

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

Measure tool selection, argument correctness, authorization handling, execution success, and final answer support separately. Limit calls and handle missing or ambiguous results.

A model can invoke the right tool and still misstate its output. Final-task correctness requires checking the evidence returned and how it was used.
