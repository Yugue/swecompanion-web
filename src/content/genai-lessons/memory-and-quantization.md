# Memory estimates and inference quantization

## 1. Estimate before choosing hardware

**Inference memory** includes model weights, cached sequence state, temporary activations, and runtime overhead. Quantizing weights reduces only one part of that total.

A weight-only estimate is a useful lower bound, not the complete deployment requirement.

## 2. Estimate weights

For N parameters and b bytes per stored parameter, weight storage is approximately Nb. Seven billion parameters at two bytes each occupy about 14 GB in decimal units before overhead.

Four-bit storage ideally uses half a byte per parameter, but scales, metadata, and unsupported layers add storage.

## 3. Estimate the KV cache

\[
M_{KV}\approx 2LBTH_{kv}d_hb
\]
L is layer count; B active sequence count; T cached positions per sequence; \(H_{kv}\) key/value head count; \(d_h\) head width; b bytes per value. Two counts keys and values.

With L=32, B=1, T=4096, \(H_{kv}\)=8, \(d_h\)=128, b=2, the estimate is 512 MiB. Unequal sequence lengths require summing their actual lengths.

## 4. Understand numerical levels

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

A zero point can shift the represented range in other schemes. Weights, activations, and caches can be quantized separately.

## 5. Calibrate and validate

**Quantization calibration** uses representative inputs to choose numerical ranges or settings without ordinary full training. This differs from calibrating confidence in answer correctness. Test rare inputs, long contexts, structured output, and task-critical calculations afterward.

Lower precision can reduce memory without improving latency if hardware kernels or conversion overhead are unfavorable.

## 6. Include real overhead

Reserve memory for workspace, fragmentation, batching, and runtime allocations. Report decimal GB or binary GiB consistently; one MiB equals 2²⁰ bytes.

Measure peak usage with representative requests. A model that barely fits its weights can still be impossible to serve reliably.
