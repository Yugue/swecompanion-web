## LLM-as-judge

**When there is no single right answer to compare against, you can have a second model grade the first one's output.** That is all "LLM-as-judge" means.

It scales to thousands of examples, which is the appeal. It also makes your measuring instrument a language model with its own biases - so the answer that lands is: **validate the judge before you trust it.**

---

## 1. When to use one

```text
✓  no programmatic check exists (summaries, explanations, tone, helpfulness)
✓  you need to grade thousands of outputs
✗  a test, schema, or database lookup could answer it  ← use that instead
```

### Rule of thumb

Reach for deterministic checks first. Teams routinely build an LLM judge for something a `assert` would have settled.

---

## 2. Turn quality into a concrete rubric

A useful rubric describes observable criteria and failure conditions:

```text
criterion: groundedness
pass: every factual claim is supported by one of the supplied sources
fail: any claim introduces a fact absent from those sources
evidence required: quote the claim and source passage
```

Avoid overlapping criteria such as "helpful," "complete," and "high quality" unless each has a distinct definition. A judge cannot apply a standard that reviewers themselves cannot explain consistently.

---

## 3. Absolute scoring vs. pairwise

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

## 4. Known biases

| Bias | Effect | Mitigation |
|---|---|---|
| Position | Prefers the first (or last) option | Randomize order; score both orders and average |
| Length | Longer reads as more thorough | Rubric explicitly says length is not a criterion |
| Self-preference | Prefers its own generations' style | Use a different model as judge |
| Style over substance | Fluent and wrong beats clumsy and right | Require the judge to cite the evidence for its verdict |
| Central tendency | Everything is a 7 | Binary criteria instead of scales |

---

## 5. Validate against humans

```text
1. label 100-200 examples by hand (two labellers, resolve disagreements)
2. run the judge on the same examples
3. report agreement (e.g. Cohen's κ) and where it disagrees
4. iterate on the RUBRIC, not on the examples
5. re-validate whenever the judge model or rubric changes
```

### Core intuition

The number you quote is judge-human agreement. Without it, "our judge says quality improved 8%" is a claim about the judge.

---

## 6. Judging trajectories, not just outputs

For agents, a judge can also grade the path:

```text
"Given the goal and this trace, was every tool call necessary and grounded
 in a prior observation? List any step that was not, with its number."
```

### Rule of thumb

Asking for **specific step numbers and evidence** makes the verdict checkable, which is the single biggest improvement you can make to any judge prompt.

---

## 7. Monitor judge drift and disagreement

Pin the judge model and rubric version in every score. Re-run the human-labelled calibration set after either changes, and periodically sample production disagreements for review.

Use multiple judges only when their errors are meaningfully different; averaging several copies of the same biased judge produces a more stable bias, not truth.

---

## What matters most

- **Check first whether a deterministic test could answer it.** Teams routinely build a judge for something an assertion would settle.
- **Ask the judge a question it can be right or wrong about.** "Rate this 1-10" produces noise that looks like data; pairwise comparison with randomized order is the default.
- **Know the biases:** position, length, self-preference for its own style, and clustering toward the middle. Use a different model as judge and say in the rubric that length is not a criterion.
- **Validate against human labels and quote the agreement,** re-validating whenever the judge or rubric changes. Without that number, "quality improved 8%" is a claim about the judge.
- **Require the judge to cite the step number or evidence for its verdict** - the single biggest improvement you can make to any judge prompt.
- **Version and recalibrate the judge,** because a silent model or rubric change alters the measuring instrument itself.

Next topic is **Characteristic failure modes**.
