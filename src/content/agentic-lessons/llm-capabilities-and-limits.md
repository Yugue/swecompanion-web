## What the underlying model gives you

Agent scaffolding cannot create ability that the base model does not have. It can only **redistribute** the model's existing ability across more steps. Knowing exactly which limits are structural - and therefore not fixable by prompting - is what stops you from spending a week on the wrong layer.

### 1. What you can rely on

- Instruction following, including multi-part formatting rules.
- Broad prior knowledge up to the training cutoff.
- Plausible decomposition of tasks that resemble things people have written about.
- Schema adherence, especially with constrained decoding.

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

Before adding steps, reflection, or subagents, run the diagnostic:

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

## What you should say in an interview

For "your agent hallucinates order IDs when retrieval returns nothing":

> I wouldn't fix that in the prompt. The model's objective is to produce a likely continuation, and when the context doesn't contain an order ID, an ID-shaped string is the likely continuation - a stricter instruction lowers the rate but can't remove it. The systems fix has three parts: the retrieval tool should return an explicit "no results" observation rather than an empty string, so the model has something concrete to act on; the order tool should reject IDs it can't resolve instead of proceeding; and any irreversible step should validate its arguments against the record before executing. I'd also keep the general test in mind - per-step reliability compounds, so at ten steps the difference between 95% and 99% per step is the difference between 60% and 90% end to end, which is why I measure agents end to end rather than from per-call benchmarks.

Next topic is **System prompts and instruction hierarchy**.
