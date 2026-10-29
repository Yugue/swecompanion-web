# 6.5 Efficient inference and deployment tradeoffs

## 1. Profile the pipeline users experience

Measure decoding, resampling, features, model execution, search, waveform generation, transfer, and queueing under realistic durations and concurrency.

A benchmark of one warm neural-network call does not represent a mobile app, a long meeting, or hundreds of concurrent streams.

## 2. Distinguish the resource dimensions

| Quantity | What it tells you |
|---|---|
| Parameter size | Weight storage and part of load cost |
| Activation/state memory | Sequence and concurrency capacity |
| Latency | Delay for a defined result |
| Throughput | Work completed per time |
| Real-time factor | Processing time relative to audio duration |
| Energy | Device or serving consumption |

A small model can be slow on an unsupported operator; a fast model may require too much working memory.

## 3. Sequence length drives memory

Long input sequences increase convolution activations and attention work. Autoregressive output histories add cached state.

For H layers storing key and value tensors at T positions with total projection dimension D and b bytes per value:

\[
M_{\mathrm{KV}}\approx 2HTDb
\]

This counts key/value data for a conventional layout, excluding overhead and architectural sharing. Audio token rate and concurrent streams can make state more important than weights.

## 4. Quantization

**Quantization** represents values with fewer numeric levels, often reducing storage and enabling faster supported kernels. Post-training calibration estimates ranges; quantization-aware training simulates low precision during fitting.

Validate quiet speech, rare events, long streams, and generated-audio artifacts. Lower nominal precision does not guarantee lower latency without suitable hardware and operators.

Do not confuse model quantization with vector quantization of acoustic tokens in a codec.

## 5. Distillation and structural changes

**Distillation** trains a smaller student using teacher predictions or features. Combine teacher guidance with real labels when appropriate; teacher errors are not ground truth.

Reducing layers, hidden size, context, or output rate can save compute. Each changes a different source of capacity, timing, or representation quality, so compare on the relevant failure slices.

## 6. Batching and concurrency

Larger batches improve utilization but can add waiting. Duration bucketing reduces padding; dynamic batching should respect per-stream deadlines.

Never mix state across streams. Capacity planning should include model weights, per-stream state, active batch tensors, and worst plausible sequence lengths.

## 7. On-device versus server inference

On-device processing can reduce network delay, protect raw-audio locality, and work offline, but faces memory, battery, and thermal limits.

Server processing provides larger shared compute but adds transport, privacy, connection reliability, and queueing considerations. A hybrid cascade can filter simple cases locally and escalate with an explicit policy.

## 8. Release criteria

Compare accuracy and latency percentiles under representative load, including long recordings, cold start, interrupted streams, and hardware contention.

Version the model together with frontend, vocabulary, decoder, and thresholds. Use staged rollout and a tested rollback path; changing one component can invalidate calibration or cached state.
