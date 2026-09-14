## Part VI — Practical ML Reasoning  
### Topic 4: Choosing an Architecture for a Problem

This is one of the most interview-relevant practical skills because the question is rarely:

> “Do you know what a Transformer is?”

It is more often:

> **“Given this problem, what model would you choose, and why?”**

The key principle is:

\[
\boxed{\text{Choose the architecture based on the structure of the data, the amount of data, and the deployment constraints}}
\]

Not:

> “Transformer is newer, so use a Transformer.”

---

## 1. Start with the data modality

Your first question should usually be:

> What kind of input am I dealing with?

A useful first-pass map is:

| Data | Natural starting point |
|---|---|
| Tabular | Logistic regression / tree-based models |
| Images | Convolutional Neural Network (CNN) / Vision Transformer |
| Text | Transformer |
| Sequential/time series | Transformer / Recurrent Neural Network (RNN) / specialized temporal models |
| Graphs | Graph Neural Network (GNN) |
| Very simple numeric features | Linear model / Multi-Layer Perceptron (MLP) |

This isn't a strict rule. It gives you a sensible baseline.

---

# 2. Always start with a baseline

Suppose you're asked:

> Predict whether a customer will churn from 30 structured features.

You could immediately build a Transformer.

But that would usually be poor reasoning.

Start with:

```text
Logistic regression
        ↓
Gradient-boosted trees
        ↓
MLP if necessary
```

Why?

Because simple models:

- train quickly
- are easier to debug
- establish a performance floor
- tell you whether complexity is actually necessary

So:

\[
\boxed{\text{simple baseline before complex architecture}}
\]

is a strong interview principle.

---

# 3. Tabular data

Suppose input looks like:

```text
age
income
country
account_age
transactions_30d
balance
...
```

For structured tabular data, tree-based models such as gradient boosting are often excellent starting points.

Why?

They naturally handle:

- nonlinear feature interactions
- heterogeneous feature scales
- threshold-style relationships
- relatively small or medium datasets

Example relationship:

```text
if account_age < 30 days
AND transactions > 20
AND balance < $100
→ high fraud probability
```

Trees can represent this naturally.

An MLP may work, but it often requires more tuning and data.

---

# 4. Image data

Images contain strong spatial structure.

Nearby pixels are strongly related:

```text
pixel pixel pixel
pixel pixel pixel
pixel pixel pixel
```

CNNs exploit this through:

\[
\boxed{\text{local connectivity + weight sharing}}
\]

So if the interview says:

> “You have 50,000 labeled X-ray images.”

A reasonable starting point might be:

```text
pretrained CNN / Vision Transformer
        ↓
fine-tune
```

rather than training a huge vision model from scratch.

The pretrained-model point is often more important than whether you choose CNN vs Vision Transformer.

---

# 5. Text

For text, Transformers are usually the default modern architecture because:

- token relationships may span long distances
- attention directly connects distant tokens
- pretrained models provide strong representations

But the architecture depends on the task.

If the task is:

> sentiment classification

you might choose an **encoder-style model**.

If the task is:

> generate an answer

you need a generative model, naturally a **decoder-only** or encoder-decoder architecture.

If the task is:

> translate source sequence → target sequence

an encoder-decoder model is structurally natural.

This is the architectural reasoning you learned in Part IV applied to a practical problem.

---

# 6. Sequential / time-series data

Suppose:

```text
CPU utilization every second
```

and you want to predict the next 10 minutes.

Your architecture depends heavily on the temporal dependency.

If only recent history matters:

```text
recent time window
   ↓
MLP / temporal convolution
```

may be enough.

If longer dependencies matter:

```text
hour 1 ───────────────────► hour 24
```

you might consider:

- recurrent models
- temporal CNNs
- Transformers

But there is an important practical point:

> Don't automatically use a sequence model merely because timestamps exist.

If you can construct useful aggregate features:

```text
mean last 5 minutes
max last hour
trend last 30 minutes
```

then a simpler tabular model may perform extremely well.

---

# 7. Graph-structured problems

Suppose the data naturally contains:

```text
users ── friends ── users
```

or:

```text
molecules:
atoms = nodes
bonds = edges
```

Then the relationship structure itself carries information.

A **Graph Neural Network (GNN)** may be appropriate because it propagates information along edges.

Mental model:

```text
neighbor
   │
   ▼
 node ◄── neighbor
   ▲
   │
neighbor
```

Each node builds a representation using information from neighboring nodes.

For interview purposes, the key insight is:

\[
\boxed{\text{architecture should reflect the structure in the data}}
\]

---

# 8. Dataset size changes the answer

Suppose you have:

\[
5,000
\]

labeled examples.

Training a huge deep model from scratch is probably a poor choice.

You might prefer:

```text
small dataset
    ↓
simple model
or
pretrained model + fine-tuning
```

Now suppose you have:

\[
500\text{ million}
\]

examples.

A larger model becomes much more reasonable.

So architecture selection depends on:

\[
\boxed{\text{model capacity relative to available data}}
\]

Too much capacity with too little data increases overfitting risk.

---

# 9. Pretraining can completely change architecture choice

Suppose you only have 10,000 text examples.

Training a Transformer from scratch:

```text
10K examples
    ↓
random Transformer
```

is likely weak.

But:

```text
pretrained Transformer
        ↓
10K examples
        ↓
fine-tune
```

may work extremely well.

So the question isn't only:

> How much labeled data do I have?

Also ask:

> Is there a good pretrained model for this modality/domain?

This is a major modern ML consideration.

---

# 10. Latency can rule out an architecture

Suppose:

```text
Model A:
accuracy = 96%
latency = 800 ms

Model B:
accuracy = 95%
latency = 20 ms
```

If your requirement is:

\[
<50\text{ ms}
\]

Model A is simply infeasible.

Architecture selection is therefore sometimes:

\[
\max \text{ quality}
\]

subject to:

\[
\text{latency}<L
\]

\[
\text{memory}<M
\]

\[
\text{cost}<C
\]

The model with highest accuracy may not even be a valid candidate.

---

# 11. Training constraints matter too

Imagine:

> We have one GPU and need a model tomorrow.

That may eliminate:

```text
train a 7B Transformer from scratch
```

even if theoretically it could work.

You may instead choose:

```text
pretrained smaller model
        ↓
LoRA
```

Architecture selection is constrained by:

- compute
- memory
- training time
- inference cost
- engineering complexity

---

# 12. Interpretability can matter

Suppose you're building a system where humans need to inspect decision logic.

A small decision tree or linear model might be preferable to a huge neural network if performance is comparable.

For a linear classifier:

\[
y=w^Tx
\]

you can often inspect which features influence the result.

For a huge Transformer, explaining an individual prediction is much harder.

So model choice can include:

\[
\boxed{\text{accuracy vs interpretability}}
\]

---

# 13. A strong architecture-selection workflow

When an interviewer gives you a new problem, reason in roughly this order:

```text
What is the task?
      ↓
What is the data modality / structure?
      ↓
How much data do we have?
      ↓
Is pretrained modeling available?
      ↓
What simple baseline should we establish?
      ↓
What architecture matches the data?
      ↓
What are latency / memory / cost constraints?
      ↓
Train + validate
      ↓
error analysis
      ↓
increase complexity only when justified
```

This is much stronger than naming an architecture immediately.

---

# 14. Example: sentiment classification

Question:

> You have 100,000 labeled product reviews. Predict positive vs negative.

A good reasoning process:

```text
Text input
   ↓
classification, not generation
   ↓
pretrained encoder Transformer available
   ↓
fine-tune encoder + classification head
```

But establish a baseline such as:

```text
TF-IDF + logistic regression
```

Why?

If baseline:

\[
94\%
\]

and Transformer:

\[
94.2\%
\]

the additional complexity may not be justified.

---

# 15. Example: image classifier on mobile

Problem:

> Identify food from photos, entirely on-device.

You might initially think:

```text
huge Vision Transformer
```

but constraints matter.

Suppose:

\[
\text{latency}<30\text{ ms}
\]

\[
\text{RAM}<500\text{ MB}
\]

Then you might choose a small efficient CNN or compact vision model.

Architecture decision:

\[
\boxed{\text{task + deployment environment}}
\]

not accuracy alone.

---

# 16. Example: recommendation system

Suppose you have:

```text
user ID
item ID
interaction history
item metadata
```

One powerful concept is learning embeddings:

```text
user → embedding

item → embedding
```

then scoring compatibility:

\[
score(u,i)
\]

For more sophisticated systems, sequential Transformers may model interaction history.

But again, don't immediately start there.

A reasonable progression might be:

```text
popularity baseline
       ↓
matrix factorization
       ↓
embedding model
       ↓
sequential / Transformer model
```

Each step should justify its complexity with validation gains.

---

# 17. Example: fraud detection

Suppose:

```text
amount
merchant
country
account age
transaction velocity
...
```

Mostly tabular.

A strong starting point:

\[
\boxed{\text{gradient-boosted trees}}
\]

not necessarily a deep Transformer.

Why?

Because tree models are extremely strong on structured tabular features.

If temporal transaction history becomes critical, you could add a sequence model later.

---

# 18. Architecture vs feature engineering

Architecture is not always the solution.

Suppose fraud model performance is poor because it lacks:

```text
transactions in last hour
distance from previous transaction
number of countries used today
```

Switching from XGBoost to a Transformer may not fix the missing information.

A simpler model with better features can outperform a complex model with poor inputs.

So always ask:

\[
\boxed{\text{Does the input contain enough information to solve the task?}}
\]

before blaming the architecture.

---

# 19. One important interview trap

Interviewer:

> “We have images. What architecture would you use?”

Weak answer:

> “CNN.”

Better answer:

> “I'd first establish the dataset size, whether there is a suitable pretrained vision backbone, the required accuracy and latency, and whether this is classification, detection, or segmentation. For ordinary image classification I'd likely start from a pretrained CNN or Vision Transformer and fine-tune it, while keeping a simpler baseline for comparison.”

The second answer demonstrates reasoning instead of memorization.

---

## Minimal Python examples

Tabular baseline:

```python
model = LogisticRegression()
```

Image:

```python
model = torchvision.models.resnet50(weights="DEFAULT")
```

Text:

```python
model = pretrained_transformer
```

The code is trivial.

The important skill is knowing **why that starting point makes sense**.

---

## Interview answer

If asked:

> How do you choose a model architecture for a new problem?

A strong answer is:

> I start from the task and structure of the data, establish a simple baseline, and then choose an architecture whose inductive bias matches the modality—for example trees for structured tabular data, convolutional or vision models for images, Transformers for language, or graph models for relational data. I also consider dataset size, availability of pretrained models, latency, memory, training cost, and interpretability requirements. I increase model complexity only when validation results and error analysis show that it is justified.

The key mental model is:

\[
\boxed{
\text{Data structure}
+
\text{available data}
+
\text{constraints}
\rightarrow
\text{architecture}
}
\]

not:

\[
\boxed{\text{newest model} \rightarrow \text{use it everywhere}}
\]

**Next topic: Training vs inference tradeoffs** — why the optimal way to train a model can be very different from the optimal way to serve it, including batching, precision, memory, throughput, and latency.
