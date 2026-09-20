## From traces to improvements

**A production agent gets better through a loop, not through inspiration:** the recorded runs show what failed, each failure becomes a permanent test case, and every fix is checked against those cases.

The discipline is in choosing **what** to fix, and **which layer** to fix it in.

---

## 1. The loop

```text
production traces
      ↓  automated detectors + sampling
   failures
      ↓  cluster by cause, not by symptom
  ranked list (frequency × severity × cost)
      ↓  fix in the cheapest effective layer
    change
      ↓  validate on eval set, several runs per case
  regression case added permanently
```

---

## 2. Cluster, then prioritize

```text
✗  fix the loudest bug in this week's escalations
✓  group 10,000 traces by failure cause, rank by frequency × severity × cost

  e.g.  41%  retrieval returns nothing for identifier-style queries
        23%  refund tool rejects a date format the model keeps producing
        14%  loops on pending status
        ...
```

The top two here are one-line fixes - add hybrid search, accept and normalize more date formats - that remove most of the failure volume. Fixing one-off cases individually produces a system prompt that grows by a sentence a week and cannot be reasoned about.

### Rule of thumb

> Fix the cluster, not the case. And if a fix is a new sentence in the system prompt, ask which layer you're avoiding.

---

## 3. Escalate through the layers

```text
1. tool descriptions / return shapes   cheapest, often the real cause
2. context: retrieval, compaction      large effect, no model change
3. prompt rules + few-shot examples     effective, accumulates debt
4. model or thinking budget            costs money per request, forever
5. fine-tuning                          highest effort; needs stable data
```

### Common issue

Work down the list. Most teams start at 3 and skip 1 and 2 entirely, which is why their system prompts are enormous and their tools are still returning raw API payloads.

---

## 4. When fine-tuning is justified

| Good fit | Poor fit |
|---|---|
| Consistent format or style at scale | Adding knowledge (use retrieval) |
| Narrow, stable domain | A fast-changing task |
| Cost reduction: small model matched to a stable task | Reasoning ability |
| Tool-call formatting for a fixed toolset | A toolset that changes monthly |

### Rule of thumb

Fine-tuning freezes behavior, which is a benefit for stability and a cost every time requirements move. It is rarely the first answer in an interview, and naming the alternatives first is the signal.

---

## 5. Every fix leaves a test

```text
bug found → minimal reproducing case → added to eval suite → fix → suite green
                                              ↑
                                    stays there forever
```

### Core intuition

Without this step, the loop is a treadmill: the same failure returns three prompt revisions later and nobody notices it was seen before.

---

## Interview mental model

Improvement is a loop, and the discipline is choosing what to fix and where:

```text
traces → automated detectors → cluster failures by CAUSE, not symptom
       → rank by frequency × severity × cost
       → fix in the cheapest effective layer
       → validate on the eval set over repeated runs
       → the case stays in the suite forever
```

Escalate through the layers in order, because most teams start at step 3 and skip the first two:

```text
1. tool descriptions and return shapes   ← cheapest, often the real cause
2. context: retrieval, compaction
3. prompt rules and examples             ← accumulates debt
4. model or thinking budget              ← costs money per request, forever
5. fine-tuning                           ← needs stable data
```

- **Fix the cluster, not the case.** One-off prompt patches become a system prompt nobody can reason about.
- **If your fix is another sentence in the system prompt, ask which layer you are avoiding.**
- **Fine-tuning suits consistent formatting, a narrow stable domain, or cost reduction** - rarely reasoning, and never as a substitute for retrieval.

Next topic is **An agentic system design answer**.
