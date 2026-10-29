# Efficient adaptation with LoRA and QLoRA

## 1. Learn a smaller update

**Low-rank adaptation (LoRA)** freezes a pretrained weight matrix and learns a factored update beside it. **Rank** is the number of independent directions a matrix can represent; limiting update rank restricts its capacity.

The base model still runs during every forward pass.

## 2. Factor the update

\[
y=W_0x+\frac{\alpha}{r}BAx
\]
x has width d; frozen \(W_0\) has shape [h,d]; A is [r,d]; B is [h,r]; r is update rank; α controls scaling. Train r(d+h) update parameters rather than hd entries in \(W_0\).

## 3. Follow both branches

```genai-visual
lora
```

For d=h=100 and r=4, A and B contain 800 parameters, compared with 10,000 in the original matrix. This comparison excludes other layers and biases.

Raising rank adds capacity and storage; improvement depends on the task.

## 4. Select target layers

Adapters can be attached to attention projections, feed-forward projections, or both. Placement determines which transformations can change.

Initialize one factor to zero and the other nonzero to start with no change to the base output. Initializing both to zero stalls both factors’ gradients through BA. Save the adapter with its compatible base model and tokenizer.

## 5. Introduce QLoRA

**Quantization** represents values using a smaller set of numerical levels. **QLoRA** stores the frozen base at low precision, commonly four bits, and trains LoRA adapters through computations that dequantize weights as needed.

Adapter weights and arithmetic are not necessarily four-bit. Gradients must still propagate through frozen base operations to reach adapters in earlier layers. Freezing weights saves their gradient/optimizer state, not all activation memory.

## 6. Choose by measured benefit

Full fine-tuning provides broader update freedom; LoRA reduces trainable state; QLoRA additionally reduces base storage. Compare quality at an actual memory and time budget.

Merging an adapter into base weights can remove the extra branch at inference, subject to representation and quantization constraints.
