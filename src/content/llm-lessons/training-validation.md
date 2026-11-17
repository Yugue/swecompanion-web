# Validation, loss curves, and training failures

## 1. Interpret a loss curve

A **learning curve** tracks a metric during training. **Overfitting** fits training-specific patterns at the expense of unseen examples.

A widening train/validation gap is a clue, not a unique diagnosis; changed preprocessing or population can also create it.

## 2. Keep comparisons controlled

Use the same tokenizer, loss mask, context length, and averaging policy. A new model evaluated with shorter prefixes or additional scored prompt tokens is not a clean comparison.

Separate training steps, token exposures, and elapsed time on plots. One update may contain a different number of valid tokens after a pipeline change.

## 3. Read characteristic failures

| Observation | Check first |
|---|---|
| Flat loss from the start | Targets, gradients, parameter updates |
| Sudden near-zero loss | Future leakage or copying the input target |
| Non-finite loss | Numerical overflow, learning rate, extreme batches |
| Better average, worse code | Data mixture and per-domain losses |

A **non-finite** value is infinity or not-a-number. Trace the first invalid operation instead of inspecting only the final loss.

## 4. Fit a tiny batch

Repeatedly fit a small verified batch. Failure points toward targets, masks, frozen parameters, or optimizer wiring; success establishes learnability of those examples, not generalization.

## 5. Avoid development leakage

Repeated validation-driven choices can overfit development decisions. Keep the final test untouched.

Record data/configuration versions and a **seed**, which initializes pseudorandom choices. A seed does not guarantee identical execution on every system.

## 6. Check outputs as well as loss

Use fixed generation probes for repetition, truncation, and task following.

An **ablation** changes one component under controlled conditions to estimate its contribution. Keep token-loss evaluation separate from these output checks.

> **Reason it through:** A wider train/validation gap appears after preprocessing changes. What should you verify before adding regularization?
