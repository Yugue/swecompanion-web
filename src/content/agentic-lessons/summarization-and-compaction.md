## Summarization and compaction

Long runs eventually fill the window. Compaction replaces old turns with a summary, in place, so the run can continue. What you choose to keep **verbatim** is the entire design, because summarization is lossy exactly where agents are least able to tolerate loss.

---

## 1. When to compact

```text
context usage
   │                    ╭── compact here (≈70-80%)
   │              ╭─────╯
   │        ╭─────╯                   ✗ not here (100%) - no room to work
   └────────────────────────────► steps
```

### Rule of thumb

Compact on a threshold, not on overflow. At 100% there is no headroom for the summarization call itself or for the next observation.

---

## 2. Structured summary, not prose

```json
{"goal": "reconcile March invoices for ACME",
 "constraints": ["exclude intercompany", "USD only", "user said: ignore credit notes"],
 "decisions": ["matched 41/48 invoices", "flagged INV-2291 as duplicate"],
 "artifacts": [{"path": "/scratch/matched.csv", "rows": 41}],
 "identifiers": {"account": "ACME-4417", "period": "2026-03"},
 "failed_attempts": ["search by PO number - field is empty in this tenant"],
 "open": ["7 unmatched invoices", "awaiting FX rate for 2026-03-31"]}
```

### Core intuition

Prose summaries lose the things agents need most. A schema forces each category to survive.

---

## 3. What a bad compaction destroys

Turn 40, the window is full. Here is the same history compacted two ways:

```text
PROSE SUMMARY (what an unprompted "summarize this" produces)
  "The user asked about refunding several orders. We looked up their
   account and checked the refund policy. Some orders were eligible.
   We processed what we could and there were a few issues."

  → every identifier gone
  → the user's constraint ("only the ones from March") gone
  → which orders succeeded? unrecoverable
  → the agent will now re-run lookups it already did
```

```text
STRUCTURED SUMMARY
  {goal: "refund the damaged items from the March order batch",
   constraints: ["user said: ONLY orders from March, not April"],
   decisions: ["48812 refunded $240 (conf RF-9921)",
               "48813 refused: final sale"],
   identifiers: {account: "u_8812", period: "2026-03"},
   failed_attempts: ["search by PO number - field empty in this tenant"],
   open: ["48814 still pending, awaiting policy check"]}
```

### Rule of thumb

The second is shorter and keeps everything that cannot be recovered. The rule underneath it: **summarize the narrative, never the identifiers.**

---

## 4. What must survive verbatim

```text
✓  identifiers: order IDs, file paths, account numbers, URLs
✓  exact values: amounts, dates, thresholds
✓  user constraints and corrections, in the user's words
✓  failed approaches (or the agent retries them)

✗  old reasoning text
✗  raw tool payloads already distilled into findings
✗  duplicate retrievals
```

### Rule of thumb

> Summarize the narrative. Never summarize an identifier.

---

## 5. Compaction compounds

```text
full transcript → summary₁ → summary₂ → summary₃
                     ↑          ↑          ↑
                 loses 10%   loses 10%   of what's left
```

Each round summarizes a summary, and detail decays geometrically. Two mitigations:

1. **Compact from the original** where you still have it - keep the full transcript in your run store even though it is not in the window.
2. **Pin** the constraint block and identifiers so they are copied forward unchanged rather than re-summarized each time.

### Common issue

The classic bug - a user constraint stated at turn 2 that disappears by turn 40 - is exactly this decay, and pinning is the fix.

---

## 6. Externalize instead of summarizing

Often the better move is not to compress but to move:

```text
✗  summarize 30,000 tokens of analysis into 800 lossy tokens
✓  write it to /scratch/analysis.md; keep {path, 3-line abstract} in context
```

### Intuition

Nothing is lost, the window is freed, and the agent can re-read the file if a later step needs the detail. Prefer this whenever the content is an artifact rather than a conversation.

---

## What matters most

- **Compact on a threshold, around 70-80%,** not at overflow - you need headroom for the summarization call itself and the next observation.
- **Summarize the narrative; never summarize an identifier.** Order IDs, file paths, exact amounts, dates, and the user's own words must survive verbatim.
- **Use a structured summary, not prose:** goal, constraints, decisions, artifacts, failed attempts, open questions. Prose loses exactly what agents need most.
- **Compaction compounds,** so pin the constraint block and compact from the original transcript rather than from the last summary.
- **Externalizing usually beats compressing.** Write the artifact to a file and keep a path plus a three-line abstract - nothing is lost at all.

Next topic is **State and session management**.
