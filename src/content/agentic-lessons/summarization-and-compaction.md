## Summarization and compaction

**Compaction** replaces older active history with a smaller representation while retaining durable originals.

## 1. Compact before overflow

Trigger using predicted next-turn size, response reserve, and expected observations.

A percentage threshold is a tunable policy, not a universal safe value.

## 2. Structured summary

```json
{
  "goal": "Refund damaged March orders",
  "constraints": ["March only"],
  "completed": ["48812: confirmation RF-9921"],
  "open": ["48814: policy check"],
  "artifacts": ["refund-report.json"]
}
```

Separate verified facts, assumptions, and unresolved questions.

## 3. Lost details create repeated work

“Some refunds succeeded” does not identify which ones.

Exact order IDs and confirmations let the next step preserve completed work and avoid duplicate actions.

## 4. Preserve exact fields

Keep identifiers, amounts, dates, user constraints, corrections, approvals, and unresolved failures exact.

Summarize old narrative; retain links to original evidence.

## 5. Repeated compression

```text
original → summary → summary of summary → accumulating omissions
```

Regenerate from authoritative state/original records when possible. Copy pinned fields rather than paraphrasing them each time.

## 6. Externalize artifacts

Store a large analysis or dataset, then keep its reference and short abstract in context.

Ensure the file remains accessible and versioned. Moving a payload preserves detail; summarizing it may not.

## 7. Validate the transition

Check constraints, open/completed tasks, artifact references, approvals, and budget.

Keep the original record. If checks fail, rebuild from it rather than compressing the faulty summary again.

## What matters most

> Pack away old paperwork while keeping the current checklist and exact receipts.
