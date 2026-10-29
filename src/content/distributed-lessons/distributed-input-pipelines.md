# 2.3 Distributed Input Pipelines and Evaluation

## 1. A fast model can wait for its next batch

An input pipeline reads records, decodes or transforms them, assembles batches, and transfers tensors to devices. These stages must supply every data-parallel worker at the required rate.

Multiple model-parallel workers may collaborate on the same examples. Assigning unique batches to all physical ranks would then feed incompatible inputs to pieces of one model.

## 2. Partition by logical data replica

A sampler chooses which examples a worker receives. A **data shard** is an assigned subset or stream partition.

For eight examples and two replicas, a shuffled global order could be [5,1,7,0,3,6,2,4]. Alternating assignments give rank 0 [5,7,3,2] and rank 1 [1,0,6,4]. The sets are disjoint and cover the dataset.

```text
records → shared shuffle rule → replica-specific indices
                                  ├→ replica 0 loader → batch
                                  └→ replica 1 loader → batch
```

The same epoch seed establishes a compatible global shuffle; replica-specific slicing creates different subsets.

## 3. Reshuffle without losing ownership

An **epoch** is a pass over a finite dataset. Reusing the same order each epoch can create unwanted correlations. A distributed sampler typically needs the epoch number to change its shuffle deterministically.

Assume dataset, rank, world_size, and epoch refer to the data-parallel group, with DistributedSampler imported:

```python
sampler = DistributedSampler(dataset, num_replicas=world_size, rank=rank)
sampler.set_epoch(epoch)
```

Data-loader workers inside a process may need separate random seeds for augmentations. Different random streams are useful; accidental duplicate record ownership is not.

## 4. Uneven lengths need an explicit policy

| Policy | Advantage | Cost or correctness concern |
|---|---|---|
| Drop a remainder | Equal step counts | Some data is omitted |
| Pad with repeated records | Equal shard lengths | Repeats change sample weighting |
| Process uneven shards | Preserve all original records | Communication participation must remain valid |
| Mask synthetic padding | Regular tensor shapes | Counts and losses must exclude padding |

Dataset-level padding, batch-level dropping, and token padding are different operations. Inspect their combined effect. A sampler that pads to equal lengths can duplicate examples even when a later loader drops incomplete batches.

## 5. Pipeline I/O, transformation, and transfers

Prefetching prepares future batches while the device computes the current batch. It needs sufficient CPU capacity, storage throughput, memory, and bounded queues.

If reading takes 40 milliseconds, transformation 10, transfer 5, and compute 20, a serialized step takes 75 milliseconds. An ideal pipelined steady state is bounded by its slowest stage, 40 milliseconds, provided stages have independent resources.

More loader workers eventually saturate storage or CPUs. Excessive prefetching consumes host memory and can make recovery bookkeeping harder.

## 6. Streaming data adds offsets

An unbounded stream may have no natural epoch. Ownership can follow partitions, record identifiers, or deterministic hashing. Resume state must identify consumed records or offsets, not merely a training step number.

Prefetched records may have been read but not incorporated into a completed update. Checkpoints need a policy for replaying or discarding them. Otherwise a restart can silently skip training data.

## 7. Aggregate metric ingredients

For mean loss, reduce the sum of valid losses and valid count, then divide globally:

\[
\overline L=\frac{\sum_r S_r}{\sum_r n_r}
\]

S_r is rank r's loss sum and n_r its valid count. The same principle applies to accuracy using correct predictions and total examples. Do not average rank means when counts differ.

For precision/recall, aggregate confusion counts. Ranking metrics such as area under the receiver operating characteristic curve generally require global ordering information or a deliberate approximation; local scalar averages are insufficient.

## 8. Evaluation must account for duplicates

A training sampler's repeated padding examples can bias evaluation. Use duplicate-free evaluation sharding, or retain record IDs and exclude repeats before aggregation. Disable training-specific random transformations unless they are intentionally part of the evaluation protocol.

**Technical takeaway:** data ownership, prefetch state, and metric denominators are part of the distributed algorithm's correctness.
