# Inference quantization and calibration

## 1. Define the approximation

Quantization maps values to finite numerical levels. Weights, activations, and KV state can use different formats.

Storage and arithmetic precision can differ: kernels may unpack low-bit weights into wider values.

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

**Quantization calibration** chooses numerical ranges/settings from representative inputs. It is separate from answer-confidence calibration.

Test long contexts, rare inputs, calculations, and structured outputs. Conversion overhead or unsuitable kernels can erase latency gains.

## 5. Choose a precision scope

Weight compression targets the shared model footprint; activation compression targets intermediate computation; KV compression targets growing request state.

Compare quality and latency at actual concurrency, not bit count alone.

> **Reason it through:** Weight storage falls fourfold but latency worsens. What execution overhead or workload factor could explain it?
