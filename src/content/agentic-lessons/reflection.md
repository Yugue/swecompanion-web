## Reflection and self-critique

Reflection means the agent examines its own output and revises it. It is genuinely useful and routinely oversold. The distinguishing question: **does the critic know something the actor didn't?** If not, you are mostly paying for agreement.

### 1. The two kinds

```text
ungrounded:   "Review your answer. Are you confident?"
              → same model, same context, no new information
              → usually says yes; sometimes changes a correct answer to a wrong one

grounded:     draft → run the tests → critique(draft, test output) → revise
              → the critic has evidence that did not exist when the draft was written
              → reliably improves
```

The difference is not prompt wording. It is whether new information entered the loop.

### Rule of thumb

> Reflection works exactly as well as the evidence you give the critic.

---

### 2. Sources of grounding, cheapest first

| Signal | Cost | Catches |
|---|---|---|
| Schema / type check | ~0 | Malformed or impossible output |
| Compiler, linter | ~0 | Syntax, unused variables, obvious errors |
| Unit tests | Low | Behavioral mistakes |
| A second retrieval | Medium | Unsupported claims |
| A different model as critic | Medium | Blind spots correlated with the first model |
| Human review | High | Everything, at a price |

Start at the top. Most teams add an LLM critic before they add a linter, which is backwards.

---

### 3. The actor-critic split

```text
actor:   full context, wrote the draft
critic:  the draft + the criteria + NEW evidence, not the actor's reasoning
```

Withholding the actor's reasoning from the critic matters - a critic that reads "I chose X because Y" tends to evaluate the argument rather than the artifact. Give it the artifact, the requirements, and the test output.

---

### 4. Bound it

```python
for attempt in range(MAX_REFLECTIONS):      # 1 or 2, not 5
    issues = critic(draft, evidence)
    if not issues: break
    draft = revise(draft, issues)
```

Two failure modes make the cap non-negotiable:

- **Oscillation** - the critic objects to A, the revision introduces B, the next critique restores A.
- **Polishing** - an acceptable answer is rewritten repeatedly for diminishing returns while the budget drains.

Empirically the first reflection round captures most of the gain; the third is usually noise.

---

### 5. What it does not fix

Reflection cannot supply missing knowledge. If the agent doesn't know the refund window is 30 days, no amount of self-critique will discover it - only retrieval will. Diagnose first: is this a **knowledge** gap (retrieve), a **computation** gap (code tool), or a **care** gap (reflection)?

---

## What you should say in an interview

For "design a reflection step that would have caught a real bug":

> I'd ground it in something the actor didn't have. For a code-writing agent: the actor produces a patch, the runtime runs the test suite and the linter, and a critic prompt receives the patch, the original requirement, and the failing test output - not the actor's reasoning, because a critic that reads the justification tends to grade the argument instead of the artifact. That critic reliably catches real bugs, because the test output is new information rather than the same model's opinion. Asking the actor "are you sure?" wouldn't have caught it; the same context that produced the error usually rates it as fine. I'd cap it at one or two rounds, since the first round captures most of the gain and further rounds tend to oscillate or polish an already-acceptable answer while the budget drains. And I'd be clear about what reflection can't do: if the agent is missing a fact, the fix is retrieval, not self-critique.

Next topic is **Sampling and search over actions**.
