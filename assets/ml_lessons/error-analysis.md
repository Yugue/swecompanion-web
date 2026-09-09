## Part VI — Practical ML Reasoning  
### Topic 3: Error Analysis

Once a model is underperforming, the wrong approach is usually:

> “Let me randomly change the architecture or hyperparameters.”

A much stronger approach is:

\[
\boxed{\text{Inspect the model's mistakes and determine what kind of problem you actually have.}}
\]

That is **error analysis**.

The goal is not merely to count errors. It is to answer:

> **Why is the model wrong, and which intervention would eliminate the largest useful class of errors?**

---

## 1. Start from the errors, not from guesses

Suppose your classifier has 90% validation accuracy.

That tells you:

\[
10\%
\]

of examples are wrong.

But it does **not** tell you why.

Those errors could come from very different causes:

```text
100 wrong predictions
        │
        ├── 35% ambiguous examples
        ├── 25% missing training coverage
        ├── 20% mislabeled data
        ├── 15% model limitation
        └──  5% preprocessing bugs
```

Each category requires a completely different fix.

So error analysis converts:

\[
\boxed{\text{"The model is bad"}}
\]

into:

\[
\boxed{\text{"The model fails mainly on these specific cases."}}
\]

---

# 2. Manually inspect examples

For many problems, one of the highest-value things you can do is simply inspect:

\[
50\text{–}200
\]

incorrect predictions.

Suppose you're building a dog-vs-cat classifier and examine 100 errors:

```text
30 → blurry images
25 → animals partially hidden
20 → incorrect labels
15 → unusual camera angles
10 → actual model mistakes
```

Now the path forward is much clearer.

Without error analysis, you might have spent weeks building a bigger model when the biggest issue was actually bad labels.

---

# 3. Categorize the errors

Create categories that describe the failure modes.

For a text classifier:

| Error category | Count |
|---|---:|
| Sarcasm | 25 |
| Negation | 18 |
| Long inputs | 17 |
| Domain-specific language | 15 |
| Label ambiguity | 14 |
| Other | 11 |

Now you can ask:

> Which category is large enough and fixable enough to matter?

This is more actionable than a single aggregate metric.

---

# 4. Prioritize by potential impact

Suppose:

```text
Sarcasm errors       = 25%
Long-text errors     = 20%
Typo errors          = 2%
```

You probably shouldn't spend your first week optimizing typo handling.

A useful way to reason is:

\[
\text{potential gain}
\approx
\text{fraction of errors in category}
\times
\text{fraction you can realistically fix}
\]

For example:

```text
Sarcasm:
25% of errors × maybe 40% fixable
≈ 10% of current errors removable

Label corruption:
20% × 90% fixable
≈ 18% removable
```

The second intervention may be much more valuable.

---

# 5. Separate data problems from model problems

This is one of the most important distinctions.

Imagine the model fails on:

> blurry images of dogs.

Possible explanations:

### Data problem

Training data contains almost no blurry dogs.

```text
production:
lots of blurry images

training:
mostly sharp images
```

A larger model may not solve this well.

You probably need:

\[
\boxed{\text{better / more representative training data}}
\]

---

### Model problem

Training contains plenty of blurry dogs, but the model still cannot learn them.

Then you might investigate:

- model capacity
- architecture
- optimization
- input resolution

The fix depends on the cause.

---

# 6. Check the labels

Sometimes the model is “wrong” because the dataset is wrong.

Suppose:

```text
Text:
"This movie was terrible."

Dataset label:
positive

Model:
negative
```

The model may actually be right.

If you inspect errors and discover:

\[
15\%
\]

of them are labeling mistakes, improving the model won't fix those examples.

You need to improve the dataset.

This is why manual error analysis can outperform another round of hyperparameter tuning.

---

# 7. Ambiguous examples

Some examples do not have a clean correct answer.

Suppose sentiment is:

> “The movie was ridiculous, but somehow I loved it.”

Is that:

- positive?
- negative?
- mixed?

If humans disagree heavily, there may be an **irreducible ambiguity** in the task.

That can establish a rough ceiling on achievable performance.

A useful diagnostic is:

> How well do humans agree with each other?

If annotators only agree 92% of the time, expecting 99.99% model accuracy may be unrealistic.

---

# 8. Slice analysis

Don't only inspect the overall metric.

Break performance down into meaningful slices.

Suppose overall:

\[
Accuracy=94\%
\]

but:

| Input type | Accuracy |
|---|---:|
| Short text | 97% |
| Medium text | 95% |
| Long text | 73% |

Now you've found a clear failure mode:

\[
\boxed{\text{long sequences}}
\]

You might investigate:

- truncation
- context length
- long-range dependencies
- training distribution

Averages can hide these problems.

---

# 9. Confusion matrices

For multiclass classification, a **confusion matrix** can tell you which classes the model confuses.

Suppose:

```text
Actual cat → often predicted dog
Actual dog → often predicted cat

Actual airplane → almost always correct
```

The useful question is not simply:

> “How many mistakes?”

but:

> “Which classes are being mistaken for which other classes?”

If `"wolf"` is frequently predicted as `"dog"`, the model may need more examples distinguishing those two categories.

---

# 10. False positives vs false negatives

In binary classification, don't treat all errors equally.

For fraud detection:

### False positive

```text
legitimate transaction
        ↓
model says fraud
```

### False negative

```text
fraudulent transaction
        ↓
model says legitimate
```

Their product costs may be very different.

genui{"learning_viz":{"type_id":"CLASSIFICATION_THRESHOLD"}}

Sometimes the solution isn't retraining the model at all.

It may simply be changing the classification threshold.

That's another reason error analysis should happen before changing the architecture.

---

# 11. Error analysis for generative models

The same principle applies to Large Language Models (LLMs), but categories look different.

Suppose a question-answering model fails 100 times:

```text
30 → hallucinated facts
25 → failed instruction following
20 → missing context
15 → reasoning mistakes
10 → bad output formatting
```

Those categories suggest very different interventions.

For example:

```text
missing knowledge
→ retrieval / better training data

instruction failure
→ instruction tuning

formatting failure
→ structured decoding / fine-tuning

context missing
→ retrieval or input pipeline

reasoning failure
→ model/training changes
```

Again:

\[
\boxed{\text{different error → different fix}}
\]

---

# 12. Compare models on the same examples

Suppose Model B improves accuracy over Model A:

\[
90\%\rightarrow92\%
\]

Don't stop there.

Ask:

> Which errors did B actually fix?

Maybe:

```text
Model A failures:
sarcasm
long text
negation

Model B failures:
sarcasm
long text
```

B fixed negation.

That's useful information.

But perhaps B also introduced new errors:

```text
A correct, B wrong
```

Comparing examples directly helps you understand what changed rather than only seeing the net metric.

---

# 13. Look at high-confidence mistakes

A particularly useful slice is:

> predictions where the model is very confident but wrong.

Suppose:

\[
P(\text{dog})=0.99
\]

but the image is clearly a cat.

That may indicate:

- systematic dataset bias
- mislabeled training data
- shortcut learning
- out-of-distribution examples

Low-confidence mistakes are often less surprising.

High-confidence mistakes can reveal deeper systematic issues.

---

# 14. Shortcut learning

Suppose you're training:

> wolf vs dog.

Almost all wolf pictures contain snow.

The model may learn:

\[
\text{snow}\rightarrow\text{wolf}
\]

rather than actually recognizing wolves.

Then it fails on:

```text
dog standing in snow → predicted wolf
```

Error analysis exposes the shortcut.

This is important because neural networks learn whatever predictive signals exist—not necessarily the features humans intended.

So always ask:

> What feature might the model actually be using?

---

# 15. Distribution shift can reveal itself through errors

Imagine validation data works well:

\[
95\%
\]

but production drops to:

\[
78\%
\]

Inspect production errors and discover:

```text
training data:
mostly professional photos

production:
mostly low-light phone photos
```

Now the issue isn't necessarily model capacity.

It's:

\[
\boxed{\text{training/deployment distribution mismatch}}
\]

Error analysis helps diagnose that quickly.

---

# 16. The iterative loop

Practical ML development often looks like:

```text
train model
    ↓
evaluate
    ↓
inspect errors
    ↓
categorize failures
    ↓
identify biggest actionable category
    ↓
change data/model/system
    ↓
retrain
    ↓
repeat
```

This is much more disciplined than:

```text
try Transformer
↓
try bigger Transformer
↓
increase learning rate
↓
add dropout
↓
hope
```

---

# 17. Example interview problem

Suppose the interviewer says:

> “Your image classifier gets 90% accuracy. How would you improve it?”

A weak answer is:

> “Use a larger neural network.”

A strong answer is:

> “First I'd inspect a representative sample of validation errors and categorize them. I'd determine whether errors come from labeling problems, insufficient coverage of certain input slices, distribution shift, ambiguous examples, or actual model limitations. I'd quantify each failure category and prioritize the largest actionable source of error. Only then would I decide whether the right intervention is more or better data, augmentation, preprocessing changes, a different architecture, or training changes.”

That demonstrates mature ML reasoning.

---

## Minimal Python intuition

For example, collect wrong predictions:

```python
errors = [(x, y, pred) for x, y, pred in zip(X, y_true, y_pred) if y != pred]
```

But most of the value comes afterward:

> **look at them and understand why they're wrong.**

---

## Interview takeaway

A concise answer is:

> Error analysis is the systematic examination and categorization of model failures to identify the dominant causes of error. Instead of blindly tuning the model, I inspect incorrect predictions, analyze important data slices, check labels and ambiguity, distinguish data problems from modeling problems, and prioritize fixes based on how many errors they can realistically eliminate.

The mental model is:

\[
\boxed{
\text{Metric tells you how much you're wrong}
}
\]

\[
\boxed{
\text{Error analysis tells you why you're wrong}
}
\]

and ultimately:

\[
\boxed{
\text{Understand the errors before choosing the fix.}
}
\]

**Next topic: Choosing an architecture for a problem** — given a new ML task, how do you reason from the structure of the data and product requirements to CNN, Transformer, MLP, tree-based model, or another architecture?
