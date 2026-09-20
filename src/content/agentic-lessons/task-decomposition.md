## Task decomposition and subagents

Splitting a task into subtasks with their own contexts is primarily a **context management** technique. Understanding that - rather than "specialists are better at their specialty" - is what makes the answer sound experienced.

### 1. The actual benefit

```text
single agent:     reads 40 documents → all 40 sit in the context → window gone by step 12

with subagents:   subagent A reads 12 docs → returns 400 tokens ┐
                  subagent B reads 15 docs → returns 400 tokens ├─► parent: 1.2k tokens
                  subagent C reads 13 docs → returns 400 tokens ┘
```

The parent never pays for the 40 documents. Total tokens across the system went **up**; tokens in the parent's window went sharply **down**, and that is what was scarce.

The secondary benefit is parallelism: independent subtasks run concurrently.

### Rule of thumb

> Decompose to protect the parent's context, not to create job titles.

---

### 2. The handoff is where information dies

```text
parent ──► brief ──► subagent ──► findings ──► parent
             ↑                        ↑
        must be self-contained    must be structured
```

A subagent cannot ask a clarifying question of a context it never saw. So the brief must carry:

```json
{"objective": "one sentence, unambiguous",
 "context": "the facts from the parent that bear on this",
 "constraints": ["date range", "sources allowed", "budget"],
 "deliverable": "schema of what to return",
 "already_tried": ["queries that returned nothing"]}
```

`already_tried` is the field people omit, and it is what prevents three subagents from re-running the same failed search.

---

### 3. Returns must be compressed and typed

```text
✗  the subagent's whole transcript          → you've undone the isolation
✓  {"findings": [{"claim": "...", "source": "...", "confidence": "high"}],
     "gaps": ["couldn't verify 2025 revenue"],
     "cost": {"steps": 9, "tokens": 41000}}
```

Carry **provenance** on every claim. Once findings are merged, a claim without a source cannot be checked, and that is exactly how a fabricated number ends up in a confident report.

---

### 4. Decompose along real seams

```text
✓  by data source       (each subagent owns one system)
✓  by independent item  (per competitor, per file, per region)
✓  by phase             (gather → analyze → write)

✗  by arbitrary split   ("you do the first half")
✗  by persona           ("you're the skeptic")
```

If two subtasks need to negotiate with each other mid-flight, they were one task.

---

### 5. When it isn't worth it

- The task fits comfortably in one context - decomposition adds latency and coordination risk for nothing.
- Subtasks are sequentially dependent - you get the overhead without the parallelism.
- The work needs shared evolving state - the handoff cost exceeds the context saving.

Cost note: each subagent pays its own system prompt and tool schemas, so five subagents is far more than five times one call in total tokens. It wins anyway when the alternative is a parent that can't fit the work - but say the tradeoff out loud.

---

## What you should say in an interview

For "what must cross the parent/subagent boundary, and what must not?":

> Going down, the brief has to be self-contained, because the subagent can't ask a clarifying question of a context it never saw: a one-sentence objective, the specific facts from the parent that bear on it, the constraints including a budget, the schema of what to return, and what's already been tried - that last one is what stops three subagents re-running the same failed search. Coming up, structured findings with provenance on every claim, plus explicit gaps and the cost consumed. What must not cross is the raw transcript in either direction: sending the parent's whole history down defeats the point, and returning the child's whole history up undoes the context isolation I decomposed for. I'd also keep the boundary as a privilege boundary where relevant - a subagent reading untrusted content shouldn't be holding credentials or the overall plan.

That completes **Chapter 3 — Reasoning and planning**. Next topic is **Context engineering**.
