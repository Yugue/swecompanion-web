# Inference quantization and calibration

## 1. Define the approximation

Quantization, introduced with QLoRA, represents values using a smaller set of numerical levels. At inference, weights, activations, and cached keys/values can be compressed separately.

The represented values and actual arithmetic format need not match. A kernel may unpack low-bit weights into a wider format for computation.

## 2. Map values to levels

A simple symmetric quantizer uses integer levels from −Q to Q:
\[
\begin{aligned}
q&=\operatorname{clip}(\operatorname{round}(x/s),-Q,Q)\\
\hat x&=sq
\end{aligned}
\]
x is an original value, s>0 a scale, q its stored integer, and x̂ its reconstruction. With s=0.5 and Q=2, 0.3 becomes 0.5; an outlier 3 clips to 1.

```genai-visual
quantization
```

A **zero point** is an integer offset used by an affine quantizer to represent real zero. Weights, activations, and caches can be quantized separately; weight-only compression does not shrink the KV cache.

## 3. Estimate storage savings

Seven billion two-byte weights occupy about 14 decimal GB. Ideal four-bit weight storage uses half a byte each, or 3.5 GB, before scales, metadata, and higher-precision layers.

This is a storage estimate, not a guarantee of fourfold speedup. Packing, unpacking, and hardware support affect execution.

## 4. Calibrate and validate

**Quantization calibration** uses representative inputs to choose numerical ranges or settings without ordinary full training. This differs from calibrating confidence in answer correctness. Test rare inputs, long contexts, structured output, and task-critical calculations afterward.

Lower precision can reduce memory without improving latency if hardware kernels or conversion overhead are unfavorable.

## 5. Choose a precision scope

Weight-only quantization targets model storage and weight traffic. Activation quantization affects intermediate computation; KV quantization targets the state that grows with concurrency and length.

Compare long-context correctness, structured outputs, rare inputs, and latency at the intended workload. More compression can save memory while moving errors into the task-critical cases.
