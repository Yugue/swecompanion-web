# Efficient adaptation with LoRA and QLoRA

## 1. Learn a smaller update

**Low-rank adaptation (LoRA)** freezes a base matrix and learns a factored update. **Rank** counts independent matrix directions; restricting it limits update capacity.

The frozen base still runs.

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

Choose attention projections, FFNs, or both; placement controls what can change.

Initialize one factor to zero and the other nonzero. Both zero → both gradients through BA stall. Save adapters with their compatible base/tokenizer.

## 5. Introduce QLoRA

**Quantization** represents values using a smaller set of numerical levels. **QLoRA** stores the frozen base at low precision, commonly four bits, and trains LoRA adapters through computations that dequantize weights as needed.

Adapter weights and arithmetic are not necessarily four-bit. Gradients must still propagate through frozen base operations to reach adapters in earlier layers. Freezing weights saves their gradient/optimizer state, not all activation memory.

## 6. Choose by measured benefit

Full tuning offers broader updates; LoRA reduces trainable state; QLoRA also compresses base storage. Compare quality at a memory/time budget.

Adapters can sometimes merge into base weights, removing the extra inference branch; quantized representations need additional care.

> **Reason it through:** Both LoRA factors start at zero. Why does the initial backward pass fail to make either learn?
