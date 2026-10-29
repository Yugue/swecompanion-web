# 2.4 Global Batch Size, Accumulation, and Convergence

## 1. Count examples per optimizer update

More concurrent workers often increases the amount of data used in each update. This changes the gradient estimator and the number of updates per data pass.

**Gradient accumulation** sums gradients from several microbatches before updating parameters. It increases effective batch size without storing all their activation graphs simultaneously.

## 2. The batch-size equation has a scope

For p independent data replicas, local microbatch size b, and a accumulation steps:

\[
B_{\text{global}}=pba
\]

B_global counts examples per optimizer update under equal full batches. Tensor, pipeline, or context workers collaborating on those same examples do not multiply it again.

With four replicas, eight examples per microbatch, and two accumulation steps, the global batch is 64. On 16 devices arranged as four replicas of a four-device model, it is still 64.

## 3. Normalize the whole update

When all microbatches have the same valid count, divide each mean loss by a before backward. A wrapper that averages across p data replicas then produces the desired global mean.

For unequal counts, first determine the total valid count N across the accumulation window and replicas. If the wrapper averages gradients, scale each local loss sum by p/N before backward.

For example, a local window with batches of 2 and 6 examples should not weight their means equally. Accumulation is additive, but its denominator must represent the intended objective.

## 4. Accumulate without unnecessary reductions

Assume model is a distributed data-parallel wrapper, microbatches contains exactly a equal-sized batches, and optimizer gradients were cleared:

```python
for i, (x, y) in enumerate(microbatches):
    with (model.no_sync() if i < a - 1 else nullcontext()):
        (loss_fn(model(x), y) / a).backward()
optimizer.step()
```

Here nullcontext is imported from contextlib. The forward and backward both belong inside the no_sync context for nonfinal microbatches. A final synchronized backward incorporates accumulated gradients; all ranks must follow a compatible schedule.

Clipping, optimizer updates, and schedule advancement normally occur once per completed accumulation window.

## 5. Accumulation is not universally a bigger batch

Parameters remain fixed across the microbatches of one update. That preserves the gradient sum for independent examples, but batch normalization observes separate microbatches, and randomness may differ.

Activation memory is approximately a microbatch cost, not the sum across the window, when each backward frees its graph. Parameter gradients stay live until the update. Retaining graphs unnecessarily defeats much of the memory benefit.

## 6. Larger batches reduce some gradient noise

Variance measures expected squared deviation from the mean. If individual example gradients are independent with variance sigma², their mean has variance:

\[
\operatorname{Var}(g_B)=\frac{\sigma^2}{B}
\]

B is batch size; variance here can be read componentwise. Correlated examples reduce the effective averaging benefit.

Lower noise is not automatically better optimization. At large batches, extra examples can yield diminishing progress per unit of compute, and fixed epochs provide fewer optimizer updates.

## 7. Learning-rate scaling is a hypothesis

Linear learning-rate scaling increases eta in proportion to batch size in settings where that approximately preserves useful progress. Warmup can stabilize the transition.

It is a heuristic, not a theorem for arbitrary models, optimizers, batch sizes, or data. Changing gradient normalization also changes effective step size; distinguish that bug from a deliberate schedule adjustment.

## 8. Measure quality over time and cost

| Measurement | What it reveals | What it can hide |
|---|---|---|
| Examples/second | Data processing rate | More updates needed |
| Updates/second | Optimizer cadence | Different batch sizes |
| Time to target quality | Useful wall-clock progress | Resource count |
| Accelerator-hours to target | Resource consumption | Latency preference |

Suppose one setup reaches a target in 10 hours on eight devices, and another in 6 hours on 32. The second is faster but uses 192 rather than 80 accelerator-hours.

**Technical takeaway:** batch size, update frequency, normalization, and learning rate must be reasoned about together when scaling training.
