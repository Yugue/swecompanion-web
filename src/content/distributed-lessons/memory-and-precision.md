# 3.1 Training Memory Budgets and Numerical Precision

## 1. Model size is only the beginning

A billion parameters stored in two bytes each occupy 2 gigabytes, but training that model requires additional state and intermediates. The relevant quantity is the largest simultaneously live allocation during the step.

A run can fit its persistent state and still fail during a parameter gather, attention operation, communication bucket allocation, or optimizer update.

## 2. Build a memory ledger

Let P be parameter count; b_w, b_g, and b_o bytes per parameter for weights, gradients, and optimizer-related state; A activation bytes; T temporary/workspace bytes; and R allocator/runtime overhead:

\[
M_{\text{peak}}\approx P(b_w+b_g+b_o)+A+T+R
\]

This is an accounting template, not a universal constant. Some allocations overlap or alias; others appear only at particular times. Include a separate master weight in b_o only if it actually exists.

| State | Example purpose | Scaling driver |
|---|---|---|
| Weights and gradients | Model and update direction | Parameter count |
| Adam moments/master weights | Stable historical updates | Parameter count and optimizer |
| Activations | Backward inputs | Microbatch, sequence length, layer shapes |
| Workspace and communication | Kernels and tensor exchange | Operation and grouping |
| Allocator reserve | Reuse and fragmentation | Allocation history |

## 3. A concrete persistent-state budget

Consider a specific mixed-precision design: two-byte weights, two-byte gradients, four-byte master weights, and two four-byte Adam moment arrays. Its persistent total is 16 bytes per parameter.

At P=1 billion, this is 16 gigabytes in decimal units before activations and temporary memory. An implementation retaining four-byte gradients instead would use 18 bytes per parameter. Another retaining the canonical parameters directly in full precision may not need an additional independent master copy.

Always inspect the implementation's actual states rather than applying “16 bytes” blindly.

## 4. Floating point has range and resolution

**Floating point** represents values using a sign, exponent, and significand. The exponent controls range; significand bits control relative precision.

| Format | Storage | Relevant tradeoff |
|---|---|---|
| FP32: 32-bit floating point | 4 bytes | Larger precision and wide range |
| FP16: 16-bit floating point | 2 bytes | Narrower range; small gradients may underflow |
| BF16: brain floating point | 2 bytes | FP32-like exponent range, lower significand precision |

Lower precision changes rounding. Addition is not associative: different reduction orders can yield different answers even with the same mathematical sum.

## 5. Mixed precision chooses roles independently

**Mixed precision** uses different types for different roles. Matrix inputs may be low precision while accumulation uses a wider format; optimizer updates may retain higher-precision parameters or state.

Compute, stored gradients, communication reductions, and final outputs need not use the same type. A lower-precision reduction reduces network bytes but can accumulate more rounding error or overflow.

The memory ledger must include casting buffers that are live alongside the original tensors.

## 6. Loss scaling preserves small FP16 gradients

Multiply loss L by positive scale s before backward:

\[
\nabla_\theta(sL)=s\nabla_\theta L,\qquad
g=\frac{g_{\text{scaled}}}{s}
\]

The larger intermediate gradients can avoid underflow. Unscale before clipping and updating. Dynamic scaling detects nonfinite gradients, skips an unsafe update, and adjusts the scale.

All cooperating workers must agree on whether the update is skipped. BF16 often does not need loss scaling because of its wider exponent range, but wider range does not eliminate rounding error or every instability.

## 7. A short compute-precision example

Assume torch, model, x, y, and loss_fn exist, with BF16 support on Compute Unified Device Architecture (CUDA), NVIDIA’s GPU platform:

```python
with torch.autocast(device_type="cuda", dtype=torch.bfloat16):
    loss = loss_fn(model(x), y)
loss.backward()
```

Autocast selects eligible operation types; it does not prove every tensor is stored in BF16 or every reduction is safe. Distributed state precision is a separate policy.

## 8. Measure peak allocations over a complete step

Distinguish live allocated bytes from allocator-reserved bytes. Reserved memory may contain reusable blocks, so it cannot simply be added again to all allocated tensors as if both were independent.

Measure representative sequence lengths, accumulation boundaries, gathers, and optimizer steps. Leave headroom for variation and runtime buffers rather than targeting the exact device limit.

**Technical takeaway:** memory efficiency and numerical safety require an explicit tensor-lifetime ledger and a precision policy for every state role.
