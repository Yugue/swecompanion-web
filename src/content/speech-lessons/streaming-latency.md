# 6.4 Streaming, causality, endpointing, and latency

## 1. Define the latency clock

Streaming consumes audio incrementally and produces useful outputs before the recording ends. State when timing begins: microphone capture, frame arrival, speech onset, or utterance end.

A system can have high throughput and still delay first output. A model can emit incrementally while relying on an unacceptable amount of future context.

## 2. Account for every source of waiting

A simplified critical-path budget is:

\[
L\approx L_{\mathrm{capture}}+L_{\mathrm{frontend}}+
L_{\mathrm{lookahead}}+L_{\mathrm{queue}}+
L_{\mathrm{compute}}+L_{\mathrm{network}}+
L_{\mathrm{decision}}
\]

Terms describe acquisition, framing, model future context, queueing, execution, transport, and commitment/endpoint delay. Some overlap in real pipelines; avoid double-counting when measuring.

Report first-result, stable-result, and final-result delay separately when the product distinguishes them.

## 3. Causality must hold across the pipeline

A causal model uses only available past and current inputs. Centered feature windows, whole-utterance normalization, bidirectional recurrence, symmetric convolution, or unrestricted attention can all introduce future dependence.

```text
arrived audio ──────────│ future audio
                       │
causal output:   past →│
lookahead:       past →│← bounded future → delayed output
```

Trace context through every layer, not just the attention mask.

## 4. Chunking trades overhead for delay

Larger chunks amortize overhead and improve hardware utilization but require more waiting. Overlap can preserve boundary context while repeating computation.

Maintain the correct feature tail, convolution state, recurrent state, or cached attention state. Test chunked output against an appropriate reference using identical preprocessing.

## 5. Partial transcripts can change

A recognizer may revise the last words after hearing more audio. Distinguish speculative display from committed output.

A stability policy can reduce visible flicker while adding delay. Measure revision rate, stable-prefix lag, and correctness at the actual display policy rather than evaluating only final transcripts.

## 6. Endpointing decides when to stop listening

Voice activity helps, but silence is not always turn completion. Long thinking pauses, background speakers, and trailing quiet words complicate decisions.

Aggressive endpointing reduces response delay but truncates speech; conservative endpointing preserves content but makes interactions sluggish. Tune with real conversational pauses and error costs.

## 7. Keep up with incoming audio

**Real-Time Factor (RTF)** is compute time divided by audio duration for a stated workload and hardware. RTF below one means processing faster than audio duration on average.

An average below one does not prevent queue growth during bursts or tail-latency spikes. Concurrent streams, cold starts, network jitter, and shared hardware need separate measurement.

## 8. Interactive cancellation

On interruption, stop playback, cancel obsolete work where possible, clear or update stream state, and preserve the intended conversation boundary.

A stale generated response arriving later must not be played merely because its request eventually completed. Associate outputs with stream and turn identifiers.
