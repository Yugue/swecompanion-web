# Training memory and numerical precision

## 1. Inventory the state

Training needs weights, **gradients**, **optimizer state** such as Adam's moving averages, and **activations**, intermediate values needed for backward computation.

**FP32** stores a floating-point value in four bytes. For one billion parameters with FP32 weights, gradients, and optimizer states, weights use 4 GB, gradients 4 GB, and two Adam moments 8 GB: 16 GB before activations and temporary buffers. GB here means 10⁹ bytes.

## 2. Use precision intentionally

**Mixed-precision training** uses different formats for different state or operations. **BF16** and **FP16** use two bytes each; BF16 trades precision bits for a wider exponent range.

Higher-precision master weights or reductions can add memory. Weight precision alone does not describe the complete training recipe.

## 3. Protect small gradients

**Loss scaling** multiplies the loss before backward computation and divides gradients by the same factor before the optimizer update. This can keep small FP16 gradients from rounding to zero.

It does not repair an intrinsically unstable update. Unscale before gradient clipping; otherwise the clipping threshold refers to the artificially enlarged gradient.

## 4. Recompute activations

**Activation checkpointing** saves selected intermediate values and recomputes others during backward computation. It trades additional compute for lower activation memory.

Recomputed stochastic operations, such as dropout, must reproduce the intended randomness for consistent gradients. **Dropout** randomly removes selected activation contributions during training.

## 5. Diagnose the peak

Loading failures suggest weight placement; backward failures suggest saved activations, gradients, or buffers. Measure the complete step’s peak, especially for long batches.

> **Reason it through:** A job fits its weights but fails during backward. What would activation checkpointing save, and what would it cost?
