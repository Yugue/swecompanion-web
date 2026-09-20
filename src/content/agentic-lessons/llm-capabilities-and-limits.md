## What the underlying model gives you

Agent scaffolding cannot create ability that the base model does not have. It can only **redistribute** the model's existing ability across more steps. Knowing exactly which limits are structural - and therefore not fixable by prompting - is what stops you from spending a week on the wrong layer.

### 1. What you can rely on

- Instruction following, including multi-part formatting rules.
- Broad prior knowledge up to the training cutoff.
- Plausible decomposition of tasks that resemble things people have written about.
- Sticking to a required output format, especially with constrained decoding - a sampling trick covered two lessons from now.

### 2. What is structurally missing

| Limit | Why it exists | What actually fixes it |
|---|---|---|
| No memory between calls | Each call is stateless; only the context exists | Persist state yourself and re-send it |
| Knowledge cutoff | Weights are frozen at training time | Retrieval, or a tool that reads live data |
| No ground truth | The model predicts likely text, not true text | Tools that return authoritative values |
| Unreliable arithmetic | Digits are tokens, not numbers | A code or calculator tool |
| Confident gap-filling | Under-specification is resolved by plausibility | Constrain the input, verify the output |

The last row is the one that produces agent incidents. When a tool returns nothing and the prompt requires an order ID, the model does not stop - it produces the most plausible-looking order ID.

---

### 3. The plausibility failure, drawn

```text
retrieval → [ ] empty
                │
                ↓
     model must emit get_order(id=?)
                │
                ↓
     most likely continuation: "ORD-10023"
                │
                ↓
     schema-valid, well-formatted, invented
```

Nothing in the model's objective distinguishes "the right ID" from "an ID-shaped string." The fix is never a sterner prompt. It is:

1. an explicit empty-result observation the model is told to act on,
2. a tool that rejects unknown IDs instead of failing silently,
3. an output check before anything irreversible happens.

### Rule of thumb

> If a failure would still be possible with a perfectly obedient model, it is a systems bug, not a prompting bug.

---

### 4. The capability ceiling test

Before adding steps, a self-review pass, or subagents - helper agents with their own context, covered in Chapter 3 - run the diagnostic:

```text
can a single well-prompted call, given the right context, do this?
       │                                   │
      yes                                  no
       │                                   │
scaffolding will help              scaffolding will not help
(you have an orchestration          (you need a better model,
 problem)                            a tool, or a smaller task)
```

Agent frameworks are very good at hiding the second case behind twelve retries.

---

### 5. Where model choice actually shows up

Agents amplify small per-step differences. If each step succeeds with probability \(p\), a 10-step task succeeds at roughly:

\[
p^{10}
\]

So 95% per step gives about 60% end to end, and 99% per step gives about 90%. Two models a few points apart on a benchmark can be far apart as agents - which is why agent quality must be measured end to end, not from per-call benchmarks.

---

## What matters most

- **Scaffolding redistributes the base model's ability; it cannot create it.** Before adding steps or subagents, ask whether one well-prompted call with the right context could do the task.
- **Some limits are structural and no prompt fixes them:** no memory between calls, a frozen knowledge cutoff, no ground truth about the live world, and unreliable arithmetic.
- **Confident gap-filling is the one that causes incidents.** When the context lacks an order ID, an ID-shaped string is the likely continuation - so the fix is an explicit empty result, a tool that rejects unknown IDs, and validation before anything irreversible.
- **The test for where to fix something:** if the failure would still be possible with a perfectly obedient model, it is a systems bug, not a prompting bug.
- **Per-step reliability compounds.** At ten steps, 95% per step is about 60% end to end and 99% is about 90% - which is why agents must be measured end to end.

Next topic is **The context window as working memory**.
