## LLM-as-judge

For open-ended output there is no exact-match metric, so a model grades it. This scales, and it introduces a measurement instrument with its own biases. The interview answer that lands is: **validate the judge before you trust it.**

### 1. When to use one

```text
✓  no programmatic check exists (summaries, explanations, tone, helpfulness)
✓  you need to grade thousands of outputs
✗  a test, schema, or database lookup could answer it  ← use that instead
```

Reach for deterministic checks first. Teams routinely build an LLM judge for something a `assert` would have settled.

---

### 2. Absolute scoring vs. pairwise

```text
absolute:  "rate this answer 1-10"
           → scores cluster at 7-8, drift between runs, uncalibrated

pairwise:  "which better satisfies the rubric, A or B?"
           → more reliable, directly answers "did my change help?"
```

Pairwise with randomized order is the default. If you need a single number, use binary criteria - did it cite a source, did it answer the question asked, did it stay within policy - and count them.

### Rule of thumb

> Ask the judge a question it can be right or wrong about. "How good is this, out of ten?" isn't one.

---

### 3. Known biases

| Bias | Effect | Mitigation |
|---|---|---|
| Position | Prefers the first (or last) option | Randomize order; score both orders and average |
| Length | Longer reads as more thorough | Rubric explicitly says length is not a criterion |
| Self-preference | Prefers its own generations' style | Use a different model as judge |
| Style over substance | Fluent and wrong beats clumsy and right | Require the judge to cite the evidence for its verdict |
| Central tendency | Everything is a 7 | Binary criteria instead of scales |

---

### 4. Validate against humans

```text
1. label 100-200 examples by hand (two labellers, resolve disagreements)
2. run the judge on the same examples
3. report agreement (e.g. Cohen's κ) and where it disagrees
4. iterate on the RUBRIC, not on the examples
5. re-validate whenever the judge model or rubric changes
```

The number you quote is judge-human agreement. Without it, "our judge says quality improved 8%" is a claim about the judge.

---

### 5. Judging trajectories, not just outputs

For agents, a judge can also grade the path:

```text
"Given the goal and this trace, was every tool call necessary and grounded
 in a prior observation? List any step that was not, with its number."
```

Asking for **specific step numbers and evidence** makes the verdict checkable, which is the single biggest improvement you can make to any judge prompt.

---

## What you should say in an interview

For "how do you establish that your judge is trustworthy?":

> I treat it as an instrument that needs calibrating. I hand-label a couple of hundred representative examples, ideally with two labellers resolving disagreements, run the judge over the same set, and report agreement with the human labels - something like Cohen's kappa - along with where it systematically disagrees. That agreement number is what I'd quote, not the judge's own scores, because without it a claim like "quality improved eight percent" is a statement about the judge. When agreement is poor I iterate on the rubric rather than on the examples. Design-wise I'd use pairwise comparison with randomized order rather than a one-to-ten scale, since absolute scores cluster and drift and position bias is real; use a different model from the one that generated the output to avoid self-preference; state explicitly in the rubric that length isn't a criterion; and require the judge to cite the specific evidence or step number for its verdict, which makes the verdict checkable. And before any of it, I'd check whether a deterministic test could answer the question instead.

Next topic is **Characteristic failure modes**.
