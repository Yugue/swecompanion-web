# Efficient adaptation with LoRA and QLoRA

## 1. Learn a smaller update

**Low-rank adaptation (LoRA)** learns a small factored change to frozen weights. **Rank** limits the number of independent update directions.

The base model still runs during every forward pass.

## 2. Factor the update

\[
y=W_0x+\frac{\alpha}{r}BAx
\]
x has d coordinates and W₀ is [h,d]. A=[r,d] and B=[h,r] give r(d+h) trained entries; α scales their product relative to rank.

## 3. Follow both branches

```genai-visual
lora
```

With d=h=100 and r=4, the factors store 800 entries. The base's 10,000 entries remain required for computing the adapted output.

Raising rank adds capacity and storage; improvement depends on the task.

## 4. Select target layers

Adapters can be attached to attention projections, feed-forward projections, or both. Placement determines which transformations can change.

One zero factor preserves the base output initially; two zero factors block both learning paths. Package each adapter with its exact compatible base configuration.

## 5. Introduce QLoRA

**Quantization** uses a restricted set of numerical levels. **QLoRA** combines low-precision frozen-base storage with trained low-rank updates, dequantizing for the required computations.

Adapter weights and arithmetic are not necessarily four-bit. Base storage savings do not remove activation or adapter optimizer memory.

## 6. Choose by measured benefit

Budget frozen weights, trained factors, optimizer state, and activations separately. A small visual-style adapter does not imply a tiny training footprint.

Merging an adapter into base weights can remove the extra branch at inference, subject to representation and quantization constraints.

An adapter can specialize one compatible base model for a visual style or output behavior. Its small saved file is an update recipe, not a standalone generator; deployment must retain the correct base and configuration.
