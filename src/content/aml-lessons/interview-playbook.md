## Answering a Basics-of-ML interview question

The graded skill in this interview is not how many definitions you can recite. It is **narrowing a vague prompt to one concept and explaining that concept clearly**. This lesson is the meta-skill that makes the other 45 useful.

### 1. What the format actually is

- 45-60 minutes, 3-5 knowledge questions in the domain you pre-selected,
- the prompts are deliberately broad ("tell me about overfitting", "how would you evaluate a model"),
- the interviewer is watching how you *navigate*, not whether you can list every option,
- if code appears at all, expect small implementations or pseudocode.

---

### 2. The four-step shape of a good answer

```text
1. DEFINE   one or two sentences, plain language
2. CLARIFY  ask a question that forces a direction
3. COMMIT   once they pick, stop surveying and go deep
4. TRADE    name the trade-off and when you would choose differently
```

Steps 2 and 3 are where candidates lose points - either by never asking, or by asking and then still listing everything.

---

### 3. A worked example

> **Interviewer**: "What is a loss function?"

**Define**: "It measures how far predictions are from the desired outcome and gives training a number to minimize."

**Clarify**: "Is there a task you'd like me to focus on - regression or classification?"

> "Classification."

**Clarify again**: "Then log loss is the usual training objective. Separately we judge the model with metrics like precision or recall - are missed positives or false alarms more expensive here?"

> "Let's focus on recall."

**Key concept found.** Stop surveying losses. Spend the rest of the answer on recall:

**Commit**: "Recall is: of the cases that really were positive, how many did we catch? If 100 patients have the disease and we flag 90, recall is 90%, and the 10 we missed are false negatives."

**Trade**: "It ignores false alarms, so on its own it is easy to game - flag everyone and recall is 100%. I would lead with recall when a miss is the expensive error, like cancer screening. Spam is the opposite: a spam email in the inbox is mild, a job offer in the spam folder is not, so precision leads there. If I need one number I would use F-beta, with beta set by the cost asymmetry."

That is a complete answer: definition, example with numbers, the failure mode, and the contrasting case.

---

### 4. Use concrete numbers

Vague: "accuracy is misleading when data is imbalanced."

Concrete: "With a 0.1% fraud rate, predicting 'never fraud' is 99.9% accurate and catches nothing - so I would report PR-AUC and recall at the review team's capacity instead."

The second version proves you have actually done this. Keep a couple of worked numbers ready: the imbalanced-accuracy example, a precision/recall pair, and a train-vs-validation gap.

---

### 5. Lead with the data

For almost any "how would you build X" prompt, the strongest opening is not a model:

```text
what decision does this feed?
what is one training row - unit, features, label?
when does the label become observable?
what does each kind of mistake cost?
→ only then: baseline, model, metric
```

Mentioning leakage, the label definition, and the baseline before naming an algorithm signals experience more than any model choice does.

---

### 6. Handling what you do not know

Say what you do know, mark the boundary, and reason from principles:

> "I have not worked with that directly. From first principles I would expect it to behave like a regularizer, because it restricts capacity - so I would check whether training error rises while validation improves."

That scores far better than bluffing, and much better than stopping at "I don't know."

---

### 7. Common failure modes

| Mistake | Fix |
|---|---|
| Listing ten related concepts | Pick one and go deep after clarifying |
| Jumping to a model before the framing | Start with the decision, the row, and the label |
| Quoting a metric with no baseline | Always pair the number with the trivial baseline |
| Reciting formulas without meaning | Say what it measures in one plain sentence first |
| Ignoring the interviewer's steer | Treat every follow-up as a signal about what they want |
| Claiming causality from importance | Say "the model relies on it", not "it causes it" |

---

### 8. A checklist you can carry in

- state the definition in one sentence a non-specialist could follow,
- ask one clarifying question, then commit,
- use a concrete example with numbers,
- name the trade-off and the opposite case,
- mention the baseline, and what you would check in the data,
- stop when the concept is covered - do not pad.

---

## What you should say in an interview

The opening of "Tell me about overfitting":

> Overfitting is when a model learns patterns specific to the training data - including its noise - so it performs much better on data it has seen than on new data. The signature is a large gap between training and validation performance. Would you like me to focus on how I diagnose it, or on how I would fix it in a particular model?

Then go where they point, with numbers, and stop when the concept is covered.

You have reached the end of this guide. Go back to any chapter and re-read the "what you should say in an interview" sections - together they are a compact script for the whole domain.
