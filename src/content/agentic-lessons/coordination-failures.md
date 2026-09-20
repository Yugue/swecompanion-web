## How multi-agent systems fail

Single-agent failures are usually loud: a loop, an error, a step cap. Multi-agent failures are quiet. The system produces a fluent, confident deliverable assembled from work that never actually fit together.

### 1. The five characteristic failures

```text
1. duplication     overlapping briefs → three workers do the same search
2. gaps            no brief owned subtask X → nobody did it, nobody noticed
3. amplification   w1's wrong finding becomes w2's premise, then the report's fact
4. contradiction   w1: "$49"  w3: "$59"  → merge picks one silently
5. blowup          slowest worker sets latency; every worker pays full overhead
```

Failures 2, 3 and 4 are invisible in the output. That is what makes them the dangerous ones.

---

### 2. Error amplification, drawn

```text
  w1: "ACME has 400 employees"   (misread a 2019 page, no source recorded)
        │
        ▼
  w2: uses 400 to compute revenue per employee
        │
        ▼
  orchestrator: writes "ACME's revenue per employee is $310k"
        │
        ▼
  report: fluent, specific, wrong, and nobody can trace the 400
```

The fix is structural, not motivational: **provenance on every claim**, carried through the merge.

```json
{"claim": "ACME has 400 employees",
 "source": "https://...", "as_of": "2019-06", "agent": "w1",
 "confidence": "low"}
```

With `as_of` and `source` present, the merge step can reject or flag it. Without them, no reviewer downstream can either.

### Rule of thumb

> A claim without a source should not survive a merge.

---

### 3. Ownership prevents duplication and gaps

```text
subtask 1 → owner w1   (exclusive)
subtask 2 → owner w2   (exclusive)
subtask 3 → owner w3   (exclusive)
             ↑ orchestrator asserts coverage: every plan step has exactly one owner
```

Make the orchestrator check the partition explicitly before dispatch: every plan step assigned once, no step unassigned. This is a cheap deterministic check that removes two of the five failure modes.

---

### 4. The merge step is where quality is won or lost

```text
merge:
  1. drop or flag unsourced claims
  2. detect contradictions on the same key → surface both, with sources
  3. list gaps explicitly in the output
  4. verify the deliverable answers the original goal, not the subtasks
```

Point 4 catches a specific and common failure: every subtask succeeded and the deliverable does not answer the question that was asked.

---

### 5. Budgets must be global

```text
per-worker cap: 10 steps each × 6 workers = 60 steps, with no global stop
```

Caps that exist only per worker do not bound the system. Enforce a run-level step, token, dollar, and wall-clock budget in the orchestrator, and make exhaustion a defined outcome - report what is known plus the gaps - rather than an exception.

---

## What you should say in an interview

For "the system returns a fluent report with a fabricated statistic":

> Most likely error amplification through the merge. One worker produced a number without recording where it came from - misread, stale page, or invented after an empty search - a second worker used it as an input to a calculation, and the orchestrator concatenated the results into fluent prose. Nothing in that chain ever asked "what's the source?" So the fix is structural: every finding is a typed record with a claim, a source URL, an as-of date, the agent that produced it, and a confidence, and the merge step drops or flags anything unsourced rather than pasting it in. The merge also has to detect contradictions on the same key and surface both with sources instead of silently picking one, and state gaps explicitly so absence doesn't read as a finding. Upstream I'd make the retrieval tool return an explicit "no results" observation, since empty results are where invention starts, and I'd have the orchestrator assert that every plan step has exactly one owner before dispatch, which removes duplicated and orphaned work at the same time.

That completes **Chapter 5 — Multi-agent systems**. Next topic is **Evaluating agents**.
