## Characteristic failure modes

Name failures by their observable pattern, then choose a detector and repair.

## 1. Looping

```text
status → pending → status → pending → ...
```

Bound polling, use backoff, and define when to return pending. Repetition detection must allow legitimate refreshes.

## 2. Invented tools or arguments

Reject unknown tools. Validate critical IDs against trusted input/evidence and authorized records.

An ID-shaped string is not proof of an existing order.

## 3. Cascades

```text
stale rate → wrong calculation → incorrect report
```

Carry provenance and freshness. Verify important inputs before calculations or actions.

## 4. Completion and drift

“I updated it” requires a confirmed update, not just a requested call.

Keep the goal and constraints pinned. Check whether the final artifact answers the original request.

## 5. Exhaustion

Repeated retries can consume both steps and growing context.

Cap retries and global resources. Return verified partial work and remaining gaps.

## 6. Detector suite

Track repeated calls, invalid tools, unsupported IDs, ignored errors, unconfirmed writes, and exceeded budgets.

Flags prioritize investigation; they do not catch every silent error.

## 7. Stale state

A correct decision can become invalid after inventory, approval, or file state changes.

Use freshness checks, revalidation before consequential actions, and version-checked updates.

## 8. Partial success

Compare requested items with per-item outcomes.

Report succeeded, failed, unknown, and retryable items separately. Do not replay completed effects.

## Interview mental model

> Detect the symptom, validate the evidence, and fix the earliest failing mechanism.
