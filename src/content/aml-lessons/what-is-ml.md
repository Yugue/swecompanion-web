## What machine learning is

Everyone can define machine learning. The version that scores well in an interview is the one that explains **when it is the right tool**, because that is the judgement the interviewer is actually testing.

### 1. Rules written by a human vs. rules inferred from data

Traditional software:

```text
human writes rules → program applies them to data → output
```

Machine learning:

```text
data + outcomes → algorithm infers rules → model applies them to new data
```

Formally, you are looking for a function:

\[
f: x \rightarrow \hat y
\]

that behaves well on inputs you have **never seen**.

That last clause is the entire subject. Fitting the data you already have is easy - a lookup table does it perfectly.

---

### 2. What the model actually produces

A trained model gives you a number, not a decision.

```text
model(x) = 0.83      ← a score
threshold = 0.6      ← a business choice
action    = "review this transaction"
```

Interviewers like this distinction because candidates skip it. The model is only one part; the threshold and the action are separate decisions that belong to the product, not to the optimizer.

---

### 3. When ML is the right tool

ML earns its complexity when:

- the rules exist but nobody can write them down (is this photo a cat?),
- the rules are too many to maintain (thousands of fraud patterns),
- the rules change on their own (spam, pricing, user taste),
- and being occasionally wrong is acceptable.

### Rule of thumb

> If you can write the rule in one sentence and it stays true next quarter, write the rule.

A rule is cheaper to run, trivially explainable, and it never drifts.

---

### 4. What ML costs you

This is the half that candidates forget:

| You gain | You pay with |
|---|---|
| Rules you could not write by hand | A dependency on data you must keep collecting |
| Adaptation to new patterns | Silent failure when the world shifts |
| Scale across millions of cases | Hard-to-explain individual decisions |
| Accuracy on messy inputs | An ongoing retraining and monitoring cost |

A deployed model is a **living system**. It decays when the world changes, and unlike a broken service, it does not page anyone when it does.

---

### 5. The three ingredients

Any ML solution needs all three, and the missing one is usually data:

\[
\text{data} + \text{objective} + \text{model family}
\]

- **Data**: representative examples, with outcomes you can observe.
- **Objective**: a loss to minimize, plus a metric that reflects the real cost of a mistake.
- **Model family**: the set of functions you are willing to search over (linear, trees, neural).

If you cannot state the objective in one sentence, the project is not ready for a model.

---

### 6. A worked example

"Should we use ML to flag transactions over $10,000 from accounts less than a day old?"

No. That sentence *is* the rule. It is auditable, instant, and free.

Now change the question: "flag transactions that look unlike this user's normal behavior." The word *normal* is different per user, changes over time, and nobody can enumerate it. That is a model.

### Rule of thumb

> The value of ML is the gap between the model and the best simple rule you could write instead.

Always know what that rule scores. See the **baselines** lesson for how to measure it.

---

## What you should say in an interview

A strong 30-second answer:

> Machine learning fits a function from examples instead of having a human state the rules. It makes sense when the rules are unknown, too numerous, or keep changing, and when being occasionally wrong is tolerable. The cost is that the model inherits whatever is in the data, and it degrades silently when the world moves - so it comes with monitoring and retraining, not just training.

Then ask which part they want: the framing, the model, or the evaluation.

Next topic is **Supervised, unsupervised, and self-supervised learning**.
