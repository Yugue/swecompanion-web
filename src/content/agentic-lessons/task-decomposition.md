## Task decomposition and subagents

**A subagent is a second agent you hand one narrow job to, which reports back a short answer.**

The reason to use one is not that specialists are smarter - it is the same model either way. It is that the subagent reads all the messy material inside *its own* context window and returns a paragraph, so the main agent never has to carry that material around. Decomposition is a **context management** technique first.

---

## 1. The actual benefit

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

## 2. The handoff is where information dies

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

### Rule of thumb

`already_tried` is the field people omit, and it is what prevents three subagents from re-running the same failed search.

---

## 3. Returns must be compressed and typed

```text
✗  the subagent's whole transcript          → you've undone the isolation
✓  {"findings": [{"claim": "...", "source": "...", "confidence": "high"}],
     "gaps": ["couldn't verify 2025 revenue"],
     "cost": {"steps": 9, "tokens": 41000}}
```

### Core intuition

Carry **provenance** on every claim. Once findings are merged, a claim without a source cannot be checked, and that is exactly how a fabricated number ends up in a confident report.

---

## 4. Decompose along real seams

```text
✓  by data source       (each subagent owns one system)
✓  by independent item  (per competitor, per file, per region)
✓  by phase             (gather → analyze → write)

✗  by arbitrary split   ("you do the first half")
✗  by persona           ("you're the skeptic")
```

### Rule of thumb

If two subtasks need to negotiate with each other mid-flight, they were one task.

---

## 5. When it isn't worth it

- The task fits comfortably in one context - decomposition adds latency and coordination risk for nothing.
- Subtasks are sequentially dependent - you get the overhead without the parallelism.
- The work needs shared evolving state - the handoff cost exceeds the context saving.

### Common issue

Cost note: each subagent pays its own system prompt and tool schemas, so five subagents is far more than five times one call in total tokens. It wins anyway when the alternative is a parent that can't fit the work - but say the tradeoff out loud.

---

## Interview mental model

The point of a subagent is context, not expertise. Everything else follows from that:

```text
parent:  plan, delegate, merge          keeps a small window
child:   fresh context, narrow goal     absorbs the large read
         returns a compact result       parent never pays for it again
```

The handoff is where information dies, so make both directions explicit:

```text
down:  objective, the parent facts that bear on it, constraints,
       the return schema, and ALREADY TRIED
up:    structured findings with provenance, explicit gaps, cost
```

- **`already_tried` is the field people omit,** and it is what stops three subagents repeating the same failed search.
- **Never pass a raw transcript in either direction** - it undoes the isolation that motivated the split.
- **Decompose along real seams** - independent data sources, independent items, distinct phases. If two subtasks must negotiate mid-flight, they were one task.

That completes **Chapter 3 — Reasoning and planning**. Next topic is **Context engineering**.
