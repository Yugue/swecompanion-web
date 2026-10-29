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

In a causal decoder, earlier positions cannot read future tokens. Appending D therefore does not change the earlier states under the same model and positional convention.

Changing the prior prefix, model weights, or relevant formatting can invalidate reused states.

## 4. Identify remaining computation

Each new token still passes through model layers and reads the relevant cache. Caching removes repeated prefix projection work; it does not remove attention over previous positions or feed-forward computation.

Generation remains sequential because the identity of the next token is not yet known.

## 5. Measure different latencies

**Time to first token (TTFT)** includes queueing, prompt processing, and initial output work. **Inter-token latency** measures time between subsequent emitted tokens.

With roughly constant inter-token time d, an N-token output takes approximately TTFT+(N−1)d. TTFT=0.2 seconds, d=0.05, and N=5 give about 0.4 seconds. Queueing and variable step times can change this approximation.

## 6. Account for cache growth

Cache storage increases with active sequences, context length, layers, and key/value width. A request can exhaust memory during generation even if its prompt initially fits.

Compare caching benefits under the actual prompt/output distribution. A tiny example hides the costs of long contexts and concurrent users.
