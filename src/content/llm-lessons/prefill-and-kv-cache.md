# Prefill, decoding, and the key–value cache

## 1. Separate the two inference phases

**Prefill** processes the available prompt to produce model states and initial predictions. The decode phase repeatedly processes newly selected tokens to continue the sequence.

A **key–value cache**, or **KV cache**, stores past attention keys and values so they need not be recomputed at every step.

## 2. Follow one additional token

```genai-visual
kv-cache
```

Prefill processes A, B, C and supplies logits from which D is selected. Processing D computes its projections, appends its key/value, and produces logits for the following token. Each relevant layer maintains its own cache.

Past queries need not be stored for this causal decoding procedure.

## 3. Understand why reuse is valid

Causality prevents earlier states from reading appended tokens. Their cached states stay valid under the same prefix, weights, and positional configuration.

## 4. Identify remaining computation

Each new token still traverses the layers and reads its prefix cache. Caching avoids recomputation, not the next-token dependency.

## 5. Measure different latencies

**Time to first token (TTFT)** includes queueing, prompt processing, and initial output work. **Inter-token latency** measures time between subsequent emitted tokens.

With roughly constant inter-token time d, an N-token output takes approximately TTFT+(N−1)d. TTFT=0.2 seconds, d=0.05, and N=5 give about 0.4 seconds. Queueing and variable step times can change this approximation.

## 6. Account for cache growth

Cache grows with concurrent sequences, retained positions, layers, and KV width. Generation can exhaust memory after a prompt initially fits.

> **Reason it through:** Appending a token leaves earlier causal states unchanged. Why does this permit caching but not parallel selection of all future tokens?
