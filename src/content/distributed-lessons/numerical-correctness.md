# 5.1 Validating Distributed Numerical Correctness

## 1. Establish what should be equivalent

A reference comparison must use the same model, initial parameters, examples, loss weighting, optimizer state, precision policy, and optimizer-step boundary.

Compare a small distributed execution against a single-device implementation of the same global objective. A reference with a different batch-normalization behavior or different masking does not isolate distribution errors.

## 2. Validate in increasing scope

First compare one forward result. Then compare the scalar loss and its denominator, individual gradient tensors, one optimizer update, and several successive updates.

For partitioned tensors, reconstruct the logical tensor only in the small diagnostic case. Large production gathers can hide the original memory problem.

```text
same input + initial state
        ├→ single-device reference → loss → gradients → next state
        └→ distributed layout     → reconstruct small diagnostic tensors
                                      ↓ compare each boundary
```

A mismatch first appearing in backward suggests a different problem from a mismatch already present in forward.

## 3. Use tolerances with a meaning

Floating-point rounding and different reduction trees can change results. A common elementwise criterion is:

\[
|x-y|\leq\epsilon_{\text{abs}}+\epsilon_{\text{rel}}|y|
\]

Here y is the reference, x the tested value, and the epsilon values are absolute and relative tolerances. Absolute tolerance matters near zero; relative tolerance matters at larger magnitudes.

Choose tolerances for the dtype and computation. Do not keep widening them until a broken normalization passes.

## 4. Check weighting before blaming precision

Verify valid counts, masked-token sums, accumulation-window scaling, and whether the communication wrapper already averages. A consistent multiplicative gradient error often points to a missing or duplicate denominator.

Use asymmetric test data: different local counts and different local gradient values. Identical batches on every rank can hide incorrect weighting and accidental duplication.

For example, means 2 and 6 over counts 2 and 6 should aggregate to 5. A result of 4 is not a harmless rounding difference.

## 5. Clip the unique global gradient

**Global norm clipping** rescales all parameter gradients together if their Euclidean norm exceeds threshold c:

\[
G=\sqrt{\sum_j g_j^2},\qquad
g'_j=g_j\min\left(1,\frac{c}{G+\epsilon}\right)
\]

Index j runs over unique logical gradient elements, and epsilon avoids division by zero. Sharded workers can reduce local sums of squares across the appropriate ownership groups.

Replicated copies must not be counted repeatedly. For unique shards [3] and [4], G=5; clipping to 1 gives [0.6] and [0.8]. Independently clipping each shard to 1 would give global norm √2 instead.

Unscale mixed-precision gradients before norm computation and clipping.

## 6. Coordinate exceptional updates

If a nonfinite gradient requires skipping an update, every cooperating rank must follow a consistent decision. Otherwise parameters, optimizer moments, step counters, and learning-rate schedules can diverge.

Shared state may also drift if one rank restores a different optimizer checkpoint, misses a gradient contribution, or applies weight decay twice. Compare persistent state after the update, not only before it.

## 7. Randomness requires several scopes

Initialize replicated parameters consistently. Data replicas commonly use different augmentation/dropout streams, while tensor-parallel operations may need coordinated random masks compatible with their layouts.

Checkpoint both host and relevant device random-number states. Exact reproducibility can still depend on kernel determinism, hardware, process count, and reduction order.

A seed controls a random stream's starting point; it does not prove the same number and order of random draws occurred.

## 8. Make checks targeted and affordable

Use finite-difference gradients for a tiny differentiable example, reconstruction checks for partitioned tensors, and replica comparisons where equality is expected. Validate evaluation counts and checkpoint restoration with the same care.

**Technical takeaway:** numerical correctness is preservation of a defined objective and state transition within justified tolerances, not merely a finite loss that decreases.
