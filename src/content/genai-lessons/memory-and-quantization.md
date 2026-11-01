# Memory estimates and inference quantization

## 1. Estimate before choosing hardware

**Inference memory** includes model weights, cached sequence state, temporary activations, and runtime overhead. Quantizing weights reduces only one part of that total.

A weight-only estimate is a useful lower bound, not the complete deployment requirement.

## 2. Estimate weights

N stored weights at b bytes each require approximately Nb bytes. This lower bound excludes media activations and decoder caches.

Four-bit storage ideally uses half a byte per parameter, but scales, metadata, and unsupported layers add storage.

## 3. Estimate the KV cache

\[
M_{KV}\approx 2LBTH_{kv}d_hb
\]
For cache storage, L counts layers, B requests, T positions, Hkv key/value heads, dₕ coordinates, and b bytes. The factor two includes both keys and values.

The stated 32-layer, 4096-position example occupies 512 MiB. Add any retained visual state separately rather than treating that number as total multimodal memory.

## 4. Understand numerical levels

A simple symmetric quantizer uses integer levels from −Q to Q:
\[
\begin{aligned}
q&=\operatorname{clip}(\operatorname{round}(x/s),-Q,Q)\\
\hat x&=sq
\end{aligned}
\]
x maps to stored integer q using scale s and bound Q; x̂=sq reconstructs it. The figure shows both rounding and outlier clipping.

```genai-visual
quantization
```

A zero point can shift the represented range in other schemes. Weights, activations, and caches can be quantized separately.

## 5. Calibrate and validate

**Quantization calibration** selects numerical ranges from representative data. Include relevant media and prompts, not only easy text inputs, before judging output fidelity.

Lower precision can reduce memory without improving latency if hardware kernels or conversion overhead are unfavorable.

## 6. Include real overhead

Reserve memory for workspace, fragmentation, batching, and runtime allocations. Report decimal GB or binary GiB consistently; one MiB equals 2²⁰ bytes.

Benchmark full generation at target resolution and concurrency. Temporary high-resolution states can dominate even after weight storage is reduced.

A large image decoder can exhaust memory through high-resolution activations even when compressed weights fit. Estimate the active representation sizes and temporary buffers as well as parameter storage.
