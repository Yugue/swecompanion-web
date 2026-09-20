## From traces to improvements

A production agent improves through a loop, not through inspiration: traces reveal failures, failures become eval cases, fixes are validated against those cases, and the cases stay forever. The discipline is in choosing **what** to fix and **which layer** to fix it in.

### 1. The loop

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

### 2. Cluster, then prioritize

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

### 3. Escalate through the layers

```text
1. tool descriptions / return shapes   cheapest, often the real cause
2. context: retrieval, compaction      large effect, no model change
3. prompt rules + few-shot examples     effective, accumulates debt
4. model or thinking budget            costs money per request, forever
5. fine-tuning                          highest effort; needs stable data
```

Work down the list. Most teams start at 3 and skip 1 and 2 entirely, which is why their system prompts are enormous and their tools are still returning raw API payloads.

---

### 4. When fine-tuning is justified

| Good fit | Poor fit |
|---|---|
| Consistent format or style at scale | Adding knowledge (use retrieval) |
| Narrow, stable domain | A fast-changing task |
| Cost reduction: small model matched to a stable task | Reasoning ability |
| Tool-call formatting for a fixed toolset | A toolset that changes monthly |

Fine-tuning freezes behavior, which is a benefit for stability and a cost every time requirements move. It is rarely the first answer in an interview, and naming the alternatives first is the signal.

---

### 5. Every fix leaves a test

```text
bug found → minimal reproducing case → added to eval suite → fix → suite green
                                              ↑
                                    stays there forever
```

Without this step, the loop is a treadmill: the same failure returns three prompt revisions later and nobody notices it was seen before.

---

## What you should say in an interview

For "10,000 traces and one engineer - what do you fix first?":

> I'd cluster before I read. Run automated detectors over all of them - repeated tool arguments, arguments that don't trace to any observation, ignored errors, budget exhaustion, claimed actions with no matching call - then group the failures by cause rather than symptom and rank by frequency times severity times cost. That usually collapses ten thousand traces into five or six causes, and the top two are often mundane: retrieval missing identifier-style queries because there's no keyword search, or a tool rejecting a date format the model keeps producing. Then I'd fix in the cheapest effective layer, working up from tool descriptions and return shapes, then context and retrieval, then prompt rules, and only then a stronger model or fine-tuning. If my proposed fix is another sentence in the system prompt, that's usually a sign I'm avoiding a tool or context fix. Every fix gets a minimal reproducing case added to the eval suite permanently, and I'd validate with several runs per case rather than one, so the same failure can't quietly return two revisions later.

Next topic is **An agentic system design answer**.
