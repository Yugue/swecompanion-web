# Fine-tuning and parameter-efficient adaptation

## 1. Adapt a pretrained model

**Fine-tuning** continues training on relevant task or domain examples. Choose which parameters to update from data and resource constraints.

## 2. Compare update scope

| Strategy | Updated | Tradeoff |
|---|---|---|
| Frozen features | New head | Cheap; fixed representation |
| Partial tuning | Selected modules | Some adaptation |
| Full tuning | Most/all weights | Flexible; more training state |

The optimizer must include the intended trainable parameters.

## 3. Learn a low-rank branch

**Low-rank adaptation (LoRA)** freezes a base matrix and learns two smaller factors:

\[
y=W_0x+sB(Ax)
\]

x is input; W₀ frozen [dout,din]; A [r,din]; B [dout,r]; s scale; y output.

**Rank** counts independent matrix directions. BA has rank at most r, restricting the update.

```nlp-visual
lora
```

## 4. Count trainable values

Full tuning: dout×din weights. LoRA branch: r(din+dout), ignoring biases.

| Matrix and rank | Adapter | Full |
|---|---|---|
| 4×4, r=1 | 8 | 16 |
| 1,024×1,024, r=8 | 16,384 | 1,048,576 |

Base weights and forward activations remain. Total memory savings do not equal the trainable-parameter ratio.

## 5. Initialize and validate

A common initialization makes the branch initially zero: initialize one factor appropriately and the other to zero.

Compare with a frozen baseline. Small labelled sets can still overfit; choose update scope, rate, and rank on validation data.

## 6. Preserve needed capabilities

Check target slices, retained tasks, training cost, and serving resources. A narrow update restricts capacity; it does not guarantee that only useful behavior changes.
