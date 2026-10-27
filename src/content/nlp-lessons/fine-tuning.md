# Fine-tuning and parameter-efficient adaptation

## 1. Adapt parameters to the required task

**Fine-tuning** continues training a pretrained model on relevant task or domain examples. A **frozen** parameter remains fixed during that process.

The choice is which computation to adapt, with how much evidence and update capacity—not whether the model name sounds specialized.

## 2. Compare update scopes

| Strategy | Updated components | Main tradeoff |
|---|---|---|
| Frozen features | New head | Cheap but limited representation adaptation |
| Partial tuning | Selected layers or modules | Intermediate flexibility and cost |
| Full tuning | Most or all base weights | Broad adaptation; more training state |

The optimizer must contain the intended trainable parameters. A frozen feature model can still supply useful inputs to a separately trained head.

## 3. Factor a learned update

**Low-rank adaptation (LoRA)** freezes a base matrix and learns an update through two smaller matrices:

\[
y=W_0x+sB(Ax)
\]

\(x\) is input; \(W_0\) a frozen [dout,din] matrix; \(A\) is [r,din]; \(B\) is [dout,r]; \(r\) the adapter rank; \(s\) a scale; \(y\) output.

```nlp-visual
lora
```

The update \(BA\) has rank at most \(r\), restricting the changes that one adapter can express.

## 4. Count what becomes trainable

Full matrix tuning uses \(d_{out}d_{in}\) weights; this LoRA branch uses \(r(d_{in}+d_{out})\), ignoring biases.

For a 4-by-4 matrix at rank 1, that is 8 versus 16 values. At width 1,024 and rank 8, it is 16,384 versus 1,048,576.

Fewer trainable parameters reduce gradient and optimizer-state storage, but base weights and forward activations remain. Total training memory does not fall by the same parameter-count ratio.

## 5. Preserve a stable starting behavior

A common initialization makes the adapter’s initial output zero while allowing it to learn, for example by zeroing one factor and initializing the other appropriately.

Use suitable learning rates and validation. New labels, formatting conventions, and domain distributions can require different adaptation, and small datasets can still overfit an adapter.

## 6. Choose from measured evidence

Compare the frozen baseline with increasingly flexible updates. Inspect important task slices, training cost, and the resources needed to serve the chosen model.

A lower rank is a restriction, not a guarantee that only “useful” information changes. Retaining broad capabilities requires its own evaluation.

## 7. Interview reasoning

**Question:** Does freezing base weights remove the need to backpropagate through them?

**Answer:** Not necessarily. Gradients may still need to pass through fixed computations to reach earlier trainable modules. Freezing suppresses their parameter updates, not every upstream derivative.
