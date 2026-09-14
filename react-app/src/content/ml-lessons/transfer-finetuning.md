## Part V — Modern Deep-Learning Fundamentals  
### Topic 3: Transfer Learning + Fine-Tuning

We just established:

```text
huge raw dataset
      ↓
pretraining
      ↓
general-purpose model
```

Now the question is:

> How do we reuse what the model learned for a new task without training everything from scratch?

That is **transfer learning**.

And one of the main ways to do it is **fine-tuning**.

\[
\boxed{\text{Transfer learning = reuse knowledge learned on one problem for another}}
\]

\[
\boxed{\text{Fine-tuning = continue training a pretrained model on new data/task}}
\]

---

## 1. The basic idea

Suppose we pretrain a Transformer on massive amounts of text.

It learns useful representations of:

```text
language
grammar
semantics
concepts
relationships
...
```

Now suppose we only have 50,000 labeled examples for sentiment analysis.

Instead of:

```text
random model
    ↓
50K examples
    ↓
learn language + sentiment from scratch
```

we do:

```text
large-scale pretraining
        ↓
pretrained model
        ↓
50K sentiment examples
        ↓
fine-tuning
        ↓
sentiment model
```

The second approach usually needs much less task-specific data.

---

# 2. Transfer learning is the broader concept

This distinction matters.

**Transfer learning** describes the overall idea:

> Knowledge learned from task/domain A helps with task/domain B.

**Fine-tuning** is one implementation:

> Start from pretrained weights and update them using the new task.

So:

\[
\boxed{\text{fine-tuning} \subset \text{transfer learning}}
\]

Not all transfer learning requires updating all model parameters.

---

# 3. Why does transfer work?

Because early/general representations are often reusable.

Imagine a vision model:

```text
pixels
  ↓
edges
  ↓
textures
  ↓
shapes
  ↓
objects
```

If it already learned edges and shapes from millions of images, a small medical-image dataset doesn't need to relearn what an edge is.

Similarly for language:

```text
tokens
  ↓
syntax
  ↓
semantics
  ↓
high-level contextual representations
```

A sentiment classifier can reuse that language knowledge.

The central idea is:

\[
\boxed{\text{reuse useful representations instead of relearning them}}
\]

---

# 4. Two major approaches

There are two classic approaches worth knowing.

### Feature extraction / frozen backbone

Keep the pretrained model fixed:

```text
input
  ↓
PRETRAINED MODEL
(weights frozen)
  ↓
representation
  ↓
new classifier
  ↓
prediction
```

Only train the new classifier.

For example:

\[
h_{\text{CLS}}\rightarrow W_{\text{classifier}}\rightarrow \text{label}
\]

This is cheap and reduces the risk of damaging pretrained knowledge.

---

### Fine-tuning

Allow some or all pretrained parameters to change:

```text
input
  ↓
PRETRAINED MODEL
(weights trainable)
  ↓
task output
  ↓
task loss
  ↓
backprop through model
```

Now the representation itself adapts to the new task.

This usually gives more flexibility and often higher task performance when enough appropriate data and compute are available.

---

# 5. Full fine-tuning

In **full fine-tuning**, essentially all parameters are updated.

Suppose:

\[
\theta_0
\]

are pretrained weights.

Fine-tuning starts from:

\[
\theta=\theta_0
\]

rather than random initialization.

Then ordinary gradient descent continues:

\[
\theta
\leftarrow
\theta-\eta\nabla_\theta L_{\text{task}}
\]

The optimization algorithm isn't fundamentally different.

The big difference is the **starting point**.

```text
training from scratch:

random weights ──────────────► useful solution


fine-tuning:

pretrained useful weights ──► task-specialized solution
```

Fine-tuning usually starts much closer to a good solution.

---

# 6. Example: BERT sentiment classifier

Suppose pretrained BERT gives:

```text
[CLS] This movie was excellent
  │
  ▼
Transformer
  │
  ▼
h_CLS
```

Attach a classifier:

```text
h_CLS
  ↓
Linear
  ↓
positive / negative
```

During full fine-tuning:

```text
classification loss
       │
       ▼
classifier weights update
       +
BERT weights update
```

So BERT's existing representations become slightly reorganized to better distinguish sentiment.

---

# 7. Fine-tuning a generative model

For decoder-only language models, you often don't need a separate classifier head.

Suppose we want a model specialized for SQL:

```text
User:
Find all users created yesterday.

Assistant:
SELECT ...
```

We can continue training the pretrained language model on high-quality examples of this behavior.

The same next-token machinery remains:

\[
\text{context}\rightarrow\text{desired continuation}
\]

But the training distribution changes.

So fine-tuning can change:

- domain knowledge
- output format
- style
- task behavior

without changing the fundamental decoder architecture.

---

# 8. Why usually use a smaller learning rate?

This is an important practical point.

During pretraining, the model already contains useful parameters.

If we fine-tune using an enormous learning rate:

```text
good pretrained weights
        ↓
HUGE updates
        ↓
destroy useful representations
```

So fine-tuning commonly uses a substantially smaller learning rate than training from scratch.

Mental model:

> Don't rebuild the house; make careful adjustments.

This is one reason fine-tuning can be unstable if hyperparameters are poorly chosen.

---

# 9. Catastrophic forgetting

Suppose a pretrained model knows many things.

Then you aggressively fine-tune it on a very narrow dataset:

```text
general model
     ↓
thousands of examples
about one narrow domain
     ↓
model becomes extremely
specialized
```

It can lose performance on capabilities outside that domain.

This phenomenon is called **catastrophic forgetting**.

More generally:

\[
\boxed{\text{learning new behavior can overwrite useful old behavior}}
\]

Possible mitigations include careful learning rates, mixing broader data with task-specific data, freezing parameters, or using parameter-efficient adaptation methods.

That last approach leads directly to Low-Rank Adaptation (LoRA), which we'll cover soon.

---

# 10. Domain adaptation vs task adaptation

These are useful distinctions.

Suppose a general model was pretrained on broad text.

### Domain adaptation

Continue training on:

```text
medical papers
```

The task may still be language modeling, but the **data domain** changes.

---

### Task adaptation

Train it for:

```text
medical diagnosis classification
```

Now the **task objective** changes.

You can also do both:

```text
general model
     ↓
medical-domain adaptation
     ↓
medical classification fine-tuning
```

---

# 11. When freezing can be preferable

You don't always want full fine-tuning.

Imagine a huge model with billions of parameters and a tiny downstream dataset.

Full fine-tuning may be:

- expensive
- memory-heavy
- prone to overfitting
- unnecessary

Freezing the backbone and training a small head can be attractive.

Conceptually:

```text
             frozen
               ↓
input → pretrained model → representation
                              ↓
                         trainable head
```

This uses the model primarily as a **feature extractor**.

---

# 12. Fine-tuning versus pretraining

This distinction should be extremely clear:

| | Pretraining | Fine-tuning |
|---|---|---|
| Starting weights | Usually random / prior checkpoint | Pretrained |
| Dataset | Very large, broad | Smaller, specialized |
| Goal | General capabilities | Task/domain specialization |
| Cost | Usually very high | Usually much lower |
| Learning rate | Training-dependent | Often smaller |
| Output | Base/general model | Specialized model |

The conceptual pipeline is:

```text
random parameters
      │
      ▼
 PRETRAINING
      │
      ▼
general model
      │
      ▼
 FINE-TUNING
      │
      ▼
specialized model
```

---

# 13. Transfer learning can work even without fine-tuning

This is worth knowing because modern models changed the picture.

A sufficiently capable pretrained model can sometimes solve a task using only a prompt:

```text
Classify the following review as
positive or negative:

"This movie was fantastic."
```

No weights change.

That's not traditional fine-tuning.

The pretrained model is applying capabilities it already learned.

So you can think of modern adaptation options as roughly:

```text
No weight updates
      ↓
prompting

Small number of weight updates
      ↓
parameter-efficient fine-tuning

All weights update
      ↓
full fine-tuning
```

We'll study the middle category when we cover LoRA.

---

# 14. Minimal PyTorch example

Freeze a pretrained backbone:

```python
for p in model.parameters(): p.requires_grad = False
```

Full fine-tuning is essentially the opposite:

```python
for p in model.parameters(): p.requires_grad = True
```

Then optimize normally on the downstream loss.

---

## Interview answer

If asked:

> What is transfer learning and fine-tuning?

A strong answer is:

> Transfer learning means reusing representations or knowledge learned from one dataset or task for another. Fine-tuning is a common transfer-learning approach where we initialize from pretrained weights and continue training on a smaller task- or domain-specific dataset. We can either freeze most of the pretrained model and train a small task-specific head, or update some or all pretrained parameters. Fine-tuning usually uses conservative learning rates because we want to adapt useful pretrained representations rather than relearn them from scratch.

The key hierarchy is:

\[
\boxed{
\text{Pretraining}
\rightarrow
\text{general representations}
\rightarrow
\text{Transfer learning}
\rightarrow
\text{specialization}
}
\]

and:

\[
\boxed{
\text{Fine-tuning is one way to perform transfer learning.}
}
\]

**Next topic: Instruction tuning** — how a pretrained language model goes from being primarily a next-token predictor to reliably following natural-language instructions such as “summarize this,” “write Python,” or “explain this concept.”
