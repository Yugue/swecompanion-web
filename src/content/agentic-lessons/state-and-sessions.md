## State and session management

Durable **task state** lets a run resume, be inspected, and accept corrections.

## 1. Conversation versus task state

| Conversation | Task |
|---|---|
| Messages and observations | Goal, plan, statuses |
| What was said | What was completed |
| Model-facing history | Operational record |

Build context from current authoritative state.

## 2. Run record

```json
{
  "run_id": "r8812",
  "tenant": "acme",
  "status": "running",
  "completed": ["load_order"],
  "open": ["check_policy"],
  "steps_used": 1,
  "artifacts": [],
  "config_version": "v7"
}
```

Persist important boundaries, including pending operations.

## 3. Resume safely

```text
interrupted write → check external status
                     ├→ succeeded: record completion
                     ├→ failed: retry if safe
                     └→ unknown: reconcile/escalate
```

A missing response is not evidence of failure.

## 4. Inspect and correct

A human can invalidate a finding or update a constraint. The next context uses the new version.

Record who changed state and recheck affected dependencies.

## 5. Scope and concurrency

Enforce user/tenant access, retention, redaction, and deletion.

Use one owner per run or version-checked updates. Two workers advancing the same state can duplicate operations.

## 6. Explicit lifecycle

```text
queued → running → waiting_for_tool/human → running → completed
                 → paused / failed / cancelled
```

Record triggers, timestamps, and wake conditions. Reject illegal transitions.

## 7. Artifact references

Store large files and observations separately with controlled references and hashes.

Keep task metadata small enough for consistent transactional updates.

## Interview mental model

> Could another worker recover the run correctly if this process stopped now?

## Chapter 4 checkpoint

Trace a fact through retrieval, context, compaction, correction, and deletion. Identify source, scope, version, and exact values at every stage.
