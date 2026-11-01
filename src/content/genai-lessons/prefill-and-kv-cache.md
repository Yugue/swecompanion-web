# Prefill, decoding, and the key–value cache

## 1. Separate the two inference phases

**Prefill** processes the available prompt to produce model states and initial predictions. **Decoding** repeatedly processes newly selected tokens to continue the sequence.

A **key–value cache**, or **KV cache**, retains previous decoder keys and values. It is distinct from reusable image-encoder features.

## 2. Follow one additional token

```genai-visual
kv-cache
```

In the figure, prompt A B C selects D. Processing D then appends its decoder state and scores the following position.

Past queries need not be stored for this causal decoding procedure.

## 3. Understand why reuse is valid

Prefix-state reuse relies on causal access and unchanged computation. An encoder reading an entire changing input does not automatically satisfy that premise.

Changing the prior prefix, model weights, or relevant formatting can invalidate reused states.

## 4. Identify remaining computation

A cached decoder still computes each new state and reads retained history. It does not skip the model's remaining layers or all prefix interaction.

Generation remains sequential because the identity of the next token is not yet known.

## 5. Measure different latencies

**Time to first token (TTFT)** measures initial waiting and prompt work; **inter-token latency** measures subsequent output spacing, when outputs arrive token by token.

For five emitted tokens, four intervals follow the first: 0.2+4×0.05=0.4 seconds under the figure's simplified constant-spacing assumptions.

## 6. Account for cache growth

Decoder cache demand grows with retained positions and concurrent requests. Encoded images and other media state may add separate memory requirements.

Compare short chat, long-document, and media-conditioned workloads separately. Similar text output lengths can conceal very different prompt-processing costs.

A visual encoder's cached image representation and a text decoder's key/value cache serve different computations. Reusing one does not imply the other is valid; identify exactly which state a serving system retains.
