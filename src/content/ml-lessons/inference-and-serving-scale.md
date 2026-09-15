## Inference architecture and scaling serving

How a model is served, and how that serving path scales, is an architecture decision that ripples backward into everything else - what features are even possible to use, what latency budget the model has to fit inside, and how the system behaves under load.

### Batch, online, and the middle ground

- **Batch inference** precomputes predictions on a schedule (hourly, nightly) and stores them for lookup. Cheap, simple, and easy to reason about - but the predictions are only as fresh as the last batch run, and can't react to something that just happened.
- **Online (real-time) inference** computes a prediction at request time, in response to a live event. It can use the freshest possible input, but every dependency in that path - feature lookups, the model itself, any downstream call - now sits inside a hard latency budget.
- **Streaming inference** sits between the two: a continuous pipeline processes events as they arrive and updates state or predictions incrementally, rather than either a full batch job or a single request/response call.

Most real systems mix these. A common and important pattern:

\[
\text{precompute expensive representations in batch} \;+\; \text{cheap operation online}
\]

**Example - recommendations:** user and item embeddings are expensive to compute (they might involve a large neural network over rich history) but change slowly, so they're computed in batch and cached. At request time, the online path does a cheap operation - a dot product between the user embedding and candidate item embeddings, or a small ranking model over a short candidate list - which easily fits a tight latency budget.

### Scaling training

Training scale is usually addressed with:

- **Data parallelism** - split a large training set across multiple GPUs/TPUs, each holding a full copy of the model and processing a different shard of data, synchronizing gradients between steps.
- **Model parallelism** - split the model itself across devices, used when a single model is too large to fit in one device's memory (common for very large neural networks).
- **Pipeline parallelism** - split the model into stages across devices, overlapping computation of different micro-batches across stages.

The interview-relevant point isn't the mechanics of each technique, it's recognizing *when* each is needed: data parallelism when the bottleneck is dataset size, model/pipeline parallelism when the bottleneck is model size relative to a single device's memory.

### Scaling serving

Serving scale looks more like traditional distributed-systems scaling, with a few ML-specific additions:

- **Horizontal replicas behind a load balancer** - the standard pattern, same as scaling any stateless service.
- **Caching** - hot predictions (frequently-requested users or items) or intermediate representations (embeddings) can be cached to avoid recomputation, the same caching instincts from traditional system design applied to ML artifacts specifically.
- **Batching requests** at the inference server (grouping several incoming requests into one forward pass) trades a small amount of added latency per request for much higher throughput per GPU/CPU - valuable when the serving bottleneck is compute, not network.

### Levers that don't require retraining a different model

When a model is too slow or too large for its latency or cost budget, several serving-side levers can help without starting the modeling process over:

- **Quantization** - reducing numeric precision (e.g. 32-bit floats to 8-bit integers) shrinks the model and speeds up inference, usually with a small, often acceptable accuracy cost.
- **Distillation** - training a smaller "student" model to mimic a larger "teacher" model's outputs, aiming to preserve most of the accuracy at a fraction of the inference cost.
- **Caching and precomputation** - as above, moving as much work as possible out of the request-time path.

### A worked example

**Prompt:** design the serving path for a recommendation system that must return results in under 100ms for 10,000 requests per second.

- **Precomputed (batch, cached):** user embeddings, item embeddings, and a candidate set per user (e.g. the top few hundred items a lightweight retrieval step thinks are relevant), refreshed on an hourly or daily cadence.
- **Computed at request time:** a fast re-ranking step over the small precomputed candidate set - a lightweight model or even a dot-product scoring - kept intentionally cheap because it's the only part of the path inside the hard 100ms budget.
- **Scaling:** the re-ranking service is horizontally replicated behind a load balancer; embeddings and candidate sets are read from a low-latency key-value store (not recomputed per request); request batching at the inference server improves GPU utilization if the re-ranker is itself a neural network.

The pattern to reproduce in an interview: identify what's expensive but slow-changing (push it to batch), identify what must be fresh (keep it online but make it as cheap as possible), and only then talk about horizontal scaling and caching for whatever remains in the request-time path.
