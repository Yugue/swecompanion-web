## Part V — Modern Deep-Learning Fundamentals  
### Topic 5: Low-Rank Adaptation (LoRA) + Parameter-Efficient Fine-Tuning

Suppose you have a model with billions of parameters and want to fine-tune it for a new task.

Full fine-tuning means:

\[
\boxed{\text{update billions of parameters}}
\]

That is expensive because training must store gradients and optimizer states for all those weights.

**Parameter-Efficient Fine-Tuning (PEFT)** asks:

> Can we adapt the model while changing only a tiny fraction of its parameters?

One of the most important methods is **Low-Rank Adaptation (LoRA)**.

---

## 1. Core LoRA idea

Take one pretrained weight matrix:

\[
W\in\mathbb{R}^{d_{\text{out}}\times d_{\text{in}}}
\]

Normally, full fine-tuning would directly modify:

\[
W\rightarrow W+\Delta W
\]

and \(\Delta W\) could contain millions of independently learned values.

LoRA instead says:

> Freeze \(W\), and represent the update \(\Delta W\) as the product of two much smaller matrices.

\[
\boxed{
W' = W + BA
}
\]

where:

\[
A\in\mathbb{R}^{r\times d_{\text{in}}}
\]

\[
B\in\mathbb{R}^{d_{\text{out}}\times r}
\]

and:

\[
r\ll d
\]

The small value \(r\) is called the **rank**.

---

## 2. Mental picture

Instead of training this entire matrix:

```text
                W
        ┌─────────────────┐
        │                 │
        │ huge matrix     │
        │                 │
        │                 │
        └─────────────────┘

       everything trainable
```

LoRA does:

```text
               frozen W
        ┌─────────────────┐
        │                 │
        │ pretrained      │
        │ weights         │
        │                 │
        └─────────────────┘
                 +
                 │
       ┌─────────┴─────────┐
       │                   │
       ▼                   ▼
   small A              small B
       │                   │
       └────── B A ────────┘
                 │
                 ▼
          small learned update
```

Only \(A\) and \(B\) are trained.

The original model weights stay frozen.

---

## 3. Why does this save so many parameters?

Suppose:

\[
W:4096\times4096
\]

Full fine-tuning could update:

\[
4096^2
=
16{,}777{,}216
\]

parameters for that matrix.

Now choose LoRA rank:

\[
r=8
\]

Then:

\[
A:8\times4096
\]

and:

\[
B:4096\times8
\]

Total trainable parameters:

\[
8(4096)+4096(8)
=
65{,}536
\]

Compare:

\[
16.8\text{ million}
\]

versus:

\[
65.5\text{ thousand}
\]

That's roughly:

\[
\boxed{256\times\text{ fewer trainable parameters}}
\]

for this matrix.

---

## 4. Why should a low-rank update work?

This is the key intuition.

Suppose the pretrained model already knows:

- language
- syntax
- reasoning patterns
- broad concepts

Fine-tuning doesn't necessarily need to completely rewrite the model.

It may only need to make a relatively small adjustment to how those existing features are used.

So instead of allowing arbitrary:

\[
\Delta W
\]

LoRA assumes:

> The useful adaptation may live in a much lower-dimensional subspace.

In other words:

```text
Huge pretrained knowledge
        │
        ▼
already mostly useful
        │
        ▼
fine-tuning needs only
a small directional adjustment
```

The low-rank matrices constrain the update to that smaller space.

---

# 5. What does “rank” mean intuitively?

You don't need deep matrix-rank theory here.

If:

\[
\Delta W=BA
\]

and the intermediate dimension is:

\[
r=8
\]

then the update can only express changes through roughly 8 intermediate directions.

```text
input dimension: 4096
        │
        ▼
A
        │
        ▼
only 8 dimensions
        │
        ▼
B
        │
        ▼
output dimension: 4096
```

So LoRA creates a narrow bottleneck:

\[
4096\rightarrow8\rightarrow4096
\]

for the **weight update**.

Important:

> This is not adding an ordinary neural-network layer to the model's activations.

It is parameterizing the **change to an existing weight matrix**.

---

# 6. Forward pass

Suppose the original layer is:

\[
y=Wx
\]

With LoRA:

\[
y=Wx+BAx
\]

So:

```text
                 ┌──► W ───────┐
                 │             │
x ───────────────┤             + ──► y
                 │             ▲
                 └──► A ─► B ──┘
```

During training:

\[
W=\text{frozen}
\]

while:

\[
A,B=\text{trainable}
\]

Backpropagation updates only \(A\) and \(B\).

---

# 7. LoRA scaling

In practice, you'll often see:

\[
W'
=
W+
\frac{\alpha}{r}BA
\]

where:

- \(r\) = LoRA rank
- \(\alpha\) = scaling hyperparameter

The scaling controls how strongly the LoRA update affects the original layer.

For interview purposes, remembering:

\[
W'=W+BA
\]

is usually sufficient unless they ask implementation details.

---

# 8. Where is LoRA applied in a Transformer?

Transformers contain many linear projection matrices.

For attention:

\[
W_Q,\;W_K,\;W_V,\;W_O
\]

and the Feed-Forward Network (FFN) also contains large linear matrices.

LoRA can be attached to some or all of these.

For example:

```text
X
│
├── WQ + LoRA ──► Q
├── WK        ──► K
├── WV + LoRA ──► V
└── ...
```

Historically, applying LoRA to Query and Value projections was common, although modern implementations may target more linear layers depending on the task and model.

The important idea isn't which exact matrices are always chosen.

It's:

\[
\boxed{\text{freeze base Transformer + train small adapters}}
\]

---

# 9. Why is LoRA much cheaper to train?

Full fine-tuning requires training state for essentially every parameter.

For each trainable parameter, optimizers such as Adam may need:

```text
parameter
gradient
first-moment estimate
second-moment estimate
```

So a 10-billion-parameter model requires enormous training memory.

With LoRA:

```text
10B base parameters
      │
      └── frozen

perhaps tens/hundreds of millions
or fewer LoRA parameters
      │
      └── trainable
```

Gradient and optimizer-state memory for the adaptation is dramatically reduced.

Important nuance:

> You still need the base model for the forward/backward computation.

So LoRA does **not** make the underlying model tiny.

It primarily reduces the number of trainable parameters and associated training memory.

---

# 10. Multiple tasks become convenient

Suppose you have one base model:

```text
                 Base model
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
    SQL LoRA     Medical LoRA   Coding LoRA
```

You don't need three complete copies of all model weights.

You can store:

```text
one huge base model
+
small LoRA adapter A
+
small LoRA adapter B
+
small LoRA adapter C
```

Then load the appropriate adapter.

This can be a major operational advantage.

---

# 11. LoRA can also be merged

Because:

\[
W'=W+BA
\]

after training, you can mathematically combine the update with \(W\):

\[
W_{\text{merged}}=W+BA
\]

Then inference can simply use:

\[
W_{\text{merged}}x
\]

rather than computing two paths.

So LoRA doesn't necessarily add permanent inference latency if the adapter can be merged into the base weights.

---

# 12. Full fine-tuning vs LoRA

| | Full fine-tuning | LoRA |
|---|---|---|
| Base weights | Updated | Frozen |
| New trainable params | Essentially whole model | Small low-rank matrices |
| Training memory | High | Much lower |
| Adapter storage | Entire model checkpoint | Small adapter |
| Flexibility | Maximum | Constrained update |
| Typical use | Enough compute / maximum adaptation | Efficient specialization |

LoRA trades some flexibility for enormous efficiency.

That doesn't mean LoRA is always worse. For many adaptation tasks, low-rank updates can be sufficient.

---

# 13. LoRA vs frozen feature extraction

These are different.

With a completely frozen backbone:

```text
pretrained model
      │
      ▼
representation
      │
      ▼
new classifier
```

the internal Transformer does not change at all.

With LoRA:

```text
pretrained Transformer
       +
small changes throughout
selected layers
```

So LoRA can adapt internal representations while still keeping the original weights frozen.

That's much more expressive than simply training a final classifier.

---

# 14. Parameter-efficient fine-tuning is broader than LoRA

LoRA is one member of the broader **Parameter-Efficient Fine-Tuning (PEFT)** family.

The general goal is:

\[
\boxed{
\text{adapt a large model while training only a small number of parameters}
}
\]

Other techniques exist, such as adapters and prompt/prefix tuning.

For this interview, LoRA is by far the most important one to understand conceptually.

---

# 15. One common confusion

LoRA does **not** mean:

> Compress the entire pretrained weight matrix \(W\) into two smaller matrices.

We keep:

\[
W
\]

exactly as the pretrained model learned it.

Only the **update** is low rank:

\[
\boxed{\Delta W=BA}
\]

So:

```text
W                  = full pretrained knowledge
BA                 = small task-specific change
W + BA             = adapted model
```

That distinction is very important.

---

## Minimal code mental model

Conceptually:

```python
output = x @ W.T + x @ A.T @ B.T
```

where:

```text
W   frozen
A,B trainable
```

That's essentially LoRA.

---

## Interview answer

If asked:

> What is LoRA and why is it useful?

A strong answer is:

> Low-Rank Adaptation is a parameter-efficient fine-tuning technique where the pretrained model weights are frozen and the weight update for selected linear layers is represented as the product of two small low-rank matrices. Instead of learning an arbitrary full update \(\Delta W\), LoRA learns \(\Delta W=BA\), where the rank \(r\) is much smaller than the model dimension. This dramatically reduces trainable parameters, optimizer-state memory, and adapter storage while still allowing the model's internal representations to adapt to a downstream task.

The one equation to remember is:

\[
\boxed{
W_{\text{adapted}}
=
W_{\text{pretrained}}
+
BA
}
\]

and the mental model:

\[
\boxed{
\text{Keep the model; learn a small correction.}
}
\]

**Next topic: Decoding strategies — greedy decoding, beam search, temperature, top-k, and top-p sampling.** This is where we move from training to the question: once a model gives us next-token probabilities, **how do we actually choose the next token?**
