# 6.3 Model-Parallel Inference and Replica Placement

## 1. Define a complete executable replica

An inference replica may occupy one device or several cooperating devices. Distributing a replica helps fit weights and request state, and may improve some workloads' execution speed.

Creating additional independent replicas instead increases the number of requests processed concurrently. These are different uses of the same device budget.

## 2. Recalculate memory without training state

Inference usually removes parameter gradients, optimizer moments, and saved backward activations. It still needs weights, live forward activations, workspaces, communication buffers, and request-specific state such as KV caches.

A model that required sharding during training may fit inference on fewer devices. Conversely, many long-running requests can fill cache memory even when weights fit comfortably.

For a model with seven billion two-byte parameters, raw weights occupy 14 decimal gigabytes. This does not include any cache, workspace, or runtime overhead.

## 3. Tensor parallelism divides forward arithmetic

Tensor workers compute pieces of matrix multiplications and combine partial outputs according to 3.3. Inference removes backward communication, but forward reductions and layout conversions remain.

Small-batch decoding can expose collective startup costs on every layer and token iteration. Dividing arithmetic across twice as many devices may save less compute time than the additional communication requires.

If a partitioning change saves 1 millisecond of compute but adds 2 milliseconds of exposed communication, per-iteration latency worsens by 1 millisecond under that simple comparison.

## 4. Pipeline parallelism needs enough concurrent work

A request still passes through successive stages. Multiple requests or microbatches can occupy different stages concurrently, improving throughput when scheduling and state permit.

```text
request A: stage 0 → stage 1 → stage 2 → output
request B:           stage 0 → stage 1 → stage 2 → output
request C:                     stage 0 → stage 1 → stage 2
```

For autoregressive decoding, each request must obtain its next token before starting its next iteration. Pipeline fill, boundary transfers, and scheduling can therefore increase interactive latency even when aggregate throughput improves.

KV state belongs to the stages containing the corresponding attention layers.

## 5. Expert inference retains routing costs

Only selected experts execute for each token, but small decode batches can send few tokens to each owner. Expert matrices may then be underutilized while All-to-All startup and route imbalance remain significant.

Replicating popular experts can reduce hot spots but uses memory and requires a compatible routing policy. Partitioning experts across distant nodes can make network latency part of every generated token.

Choose placement from observed routes and service objectives, not active-parameter count alone.

## 6. Compare replica count with per-replica width

Suppose eight devices can form either four two-device replicas or one eight-device replica. The wider replica may offer more per-request capacity or lower compute time, but fewer independent scheduling slots.

| Design pressure | Likely direction to evaluate |
|---|---|
| Weights/cache do not fit | More partitioning or lower memory cost |
| High independent request demand | More replicas |
| Tight token latency | Smaller exposed communication path |
| Large compatible batches | Greater work amortization per replica |
| Fault isolation | Smaller complete failure groups |

Measure both latency and goodput under representative input/output lengths before choosing.

## 7. Cache layout follows parameter layout

Tensor workers may shard attention heads or replicate selected cache elements. Pipeline workers retain caches only for their layers. Expert-only layers have different state from attention layers.

Do not divide total cache by device count unless ownership actually permits it. Some parameters, normalization operations, caches, and buffers can remain replicated.

Loading or migrating one request requires a cache layout compatible with the destination replica.

## 8. Schedule and fail as a unit

A complete distributed replica needs every required stage/shard available. Routing to only its front worker while another shard is unhealthy can create stalled requests.

Replacement capacity should account for whole replicas and their initialization time. Share weights across independent requests where the runtime permits, but preserve per-request histories and deadlines.

**Technical takeaway:** inference placement must jointly fit weights and active request state while balancing per-request communication against the capacity offered by independent replicas.
