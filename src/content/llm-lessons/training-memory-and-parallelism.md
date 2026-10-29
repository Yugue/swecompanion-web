# Training memory and numerical precision

## 1. Inventory the state

Training needs weights, **gradients**, **optimizer state** such as Adam's moving averages, and **activations**, intermediate values needed for backward computation.

**FP32** stores a floating-point value in four bytes. For one billion parameters with FP32 weights, gradients, and optimizer states, weights use 4 GB, gradients 4 GB, and two Adam moments 8 GB: 16 GB before activations and temporary buffers. GB here means 10⁹ bytes.

## 2. Use precision intentionally

**Mixed-precision training** uses different numerical formats for different operations or stored values. **BF16** and **FP16** are two-byte floating-point formats. BF16 has a wider exponent range but fewer precision bits than FP16, often reducing overflow risk at the cost of rounding precision.

Some recipes retain higher-precision master weights or reductions. Lower weight precision alone does not specify total training memory or numerical stability.

## 3. Protect small gradients

**Loss scaling** multiplies the loss before backward computation and divides gradients by the same factor before the optimizer update. This can keep small FP16 gradients from rounding to zero.

It does not repair an intrinsically unstable update. Unscale before gradient clipping; otherwise the clipping threshold refers to the artificially enlarged gradient.

## 4. Recompute activations

**Activation checkpointing** saves selected intermediate values and recomputes others during backward computation. It trades additional compute for lower activation memory.

Recomputed stochastic operations, such as dropout, must reproduce the intended randomness for consistent gradients. **Dropout** randomly removes selected activation contributions during training.

## 5. Diagnose the peak

Out-of-memory during model loading suggests weight placement. Failure only during backward suggests activations, gradients, or optimizer initialization. Failure on long batches suggests sequence-dependent state.

Measure peak allocated memory and communication time. A memory snapshot at loading time can miss the much larger backward peak.
