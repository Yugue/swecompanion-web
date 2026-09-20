## Summarization and compaction

Long runs eventually fill the window. Compaction replaces old turns with a summary, in place, so the run can continue. What you choose to keep **verbatim** is the entire design, because summarization is lossy exactly where agents are least able to tolerate loss.

### 1. When to compact

```text
context usage
   │                    ╭── compact here (≈70-80%)
   │              ╭─────╯
   │        ╭─────╯                   ✗ not here (100%) - no room to work
   └────────────────────────────► steps
```

Compact on a threshold, not on overflow. At 100% there is no headroom for the summarization call itself or for the next observation.

---

### 2. Structured summary, not prose

```json
{"goal": "reconcile March invoices for ACME",
 "constraints": ["exclude intercompany", "USD only", "user said: ignore credit notes"],
 "decisions": ["matched 41/48 invoices", "flagged INV-2291 as duplicate"],
 "artifacts": [{"path": "/scratch/matched.csv", "rows": 41}],
 "identifiers": {"account": "ACME-4417", "period": "2026-03"},
 "failed_attempts": ["search by PO number - field is empty in this tenant"],
 "open": ["7 unmatched invoices", "awaiting FX rate for 2026-03-31"]}
```

Prose summaries lose the things agents need most. A schema forces each category to survive.

---

### 3. What must survive verbatim

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

### 4. Compaction compounds

```text
full transcript → summary₁ → summary₂ → summary₃
                     ↑          ↑          ↑
                 loses 10%   loses 10%   of what's left
```

Each round summarizes a summary, and detail decays geometrically. Two mitigations:

1. **Compact from the original** where you still have it - keep the full transcript in your run store even though it is not in the window.
2. **Pin** the constraint block and identifiers so they are copied forward unchanged rather than re-summarized each time.

The classic bug - a user constraint stated at turn 2 that disappears by turn 40 - is exactly this decay, and pinning is the fix.

---

### 5. Externalize instead of summarizing

Often the better move is not to compress but to move:

```text
✗  summarize 30,000 tokens of analysis into 800 lossy tokens
✓  write it to /scratch/analysis.md; keep {path, 3-line abstract} in context
```

Nothing is lost, the window is freed, and the agent can re-read the file if a later step needs the detail. Prefer this whenever the content is an artifact rather than a conversation.

---

## What you should say in an interview

For "the agent forgets a constraint the user gave at turn 2 after compaction at turn 40":

> Two structural fixes. First, pin it: the summary should be a structured object with a constraints field that is copied forward verbatim, never re-summarized, so user statements and corrections survive every compaction round unchanged. Prose summaries lose exactly this, and because each compaction summarizes the previous summary, detail decays geometrically - by turn 40 a constraint mentioned once has been through several lossy passes. Second, compact from the original transcript rather than from the last summary; I keep the full run in the run store even though it isn't in the window, so each compaction is one lossy step rather than a chain of them. I'd also compact on a threshold around seventy or eighty percent rather than at overflow, so there's headroom for the summarization call itself, and prefer externalizing over summarizing where the content is an artifact - write it to a file and keep a path plus a short abstract, so nothing is lost at all.

Next topic is **State and session management**.
