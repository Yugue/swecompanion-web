# 5.3 Consistent Checkpoints and Fault Recovery

## 1. Recovery restores a state transition boundary

A durable **checkpoint** contains enough state to continue training after interruption. Saving weights alone supports inference or a fresh optimization run, but usually does not reproduce continued training.

A consistent checkpoint represents one logical point in the computation. Combining parameters from step 100 with optimizer moments from step 99 is not that state.

## 2. Capture the complete resumable state

| State | Why it matters |
|---|---|
| Parameters and model buffers | Learned function and persistent statistics |
| Optimizer buffers and step | Next update depends on history |
| Learning-rate scheduler | Preserve update schedule |
| Mixed-precision scaler | Preserve scale and skipped-update behavior |
| Host/device random-number states | Continue intended random streams |
| Data position, sampler state, valid counts | Avoid unintended omission or replay |
| Layout and model configuration | Interpret stored tensors and ownership |

Record the completed optimizer-step number. Saving at an update boundary often avoids needing partially accumulated gradients and incomplete pipeline microbatches.

## 3. Freeze one logical snapshot

A blocking checkpoint waits for relevant work and copies or writes a stable state. An asynchronous checkpoint stages an immutable snapshot, then writes it while training continues.

The snapshot must stop aliasing tensors that later updates modify. Asynchronous writing without snapshot isolation can serialize a mixture of steps. Staging itself consumes memory and time even when storage writes overlap training.

## 4. Sharded saves avoid a central memory spike

Each owner writes its assigned parameter and optimizer shards, with metadata describing logical tensor names, shapes, offsets, and types. This avoids gathering the entire model on one rank.

```text
consistent step k
    ├→ rank 0 shard → durable storage ─┐
    ├→ rank 1 shard → durable storage ─┤
    └→ rank 2 shard → durable storage ─┤
                            all required writes succeed
                                      ↓
                            publish committed manifest
```

A manifest identifies one complete generation. Publication must use the storage system's actual atomicity/commit guarantees; object storage need not provide filesystem-style atomic directory renames.

## 5. Never load an incomplete generation

Write under a new generation ID, verify required objects and integrity metadata, then publish the commit record. On restart, choose a fully committed compatible generation.

Do not overwrite the only known-good checkpoint in place. A failed rank or interrupted upload can leave partial files; their existence alone does not prove a usable checkpoint.

## 6. Checkpoint frequency trades writing against lost work

Let C be checkpoint overhead seconds, I the interval of useful training seconds, and lambda the job failure rate per second. For infrequent independent failures and small overhead:

\[
f_{\text{overhead}}\approx\frac{C}{I}+\frac{\lambda I}{2}
\]

The first term is writing overhead; the second approximates expected rework because a failure loses about half an interval. Minimizing this model gives:

\[
I^*\approx\sqrt{\frac{2C}{\lambda}}
\]

With C=10 seconds and mean time between job failures 1/lambda=3600 seconds, I* is about 268 seconds. Restart time, correlated failures, staging contention, and uneven steps require a richer model.

## 7. Resume data as well as tensors

A loader may have prefetched records beyond the last completed update. Restore the consumed position, not blindly the furthest read offset.

Exact replay may require deterministic sample identifiers, augmentation seeds, and accumulation boundaries. If the system intentionally permits replay after recovery, make that behavior explicit and measure its effect.

## 8. Elastic resizing changes layouts and batches

**Elastic recovery** restarts with a different number of workers. A layout-aware loader can read stored logical tensors into new shards, provided the new parallelization is supported.

Update data ownership and communication groups together. Changing the number of data replicas changes global batch size unless local batch or accumulation is adjusted. New random-stream and reduction layouts can prevent bitwise-identical continuation even when the restored logical state is correct.

## 9. Verify recovery by doing it

For a small deterministic case, save at an update boundary, continue for several steps, reload into a fresh process group, and compare the continuation. Also test interruption during a save and rejection of incomplete generations.

**Technical takeaway:** reliable recovery needs a consistent snapshot, durable all-shard commitment, and an explicit policy for data progress and changed worker layouts.
