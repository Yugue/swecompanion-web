# Validation, loss curves, and training failures

## 1. Interpret a loss curve

A **learning curve** tracks a metric as training progresses. Training loss measures fit to optimization examples; validation loss measures fit to held-out examples under the chosen scoring rules.

**Overfitting** occurs when fitting training-specific patterns harms performance on new examples. A widening gap is evidence to investigate, not a unique diagnosis.

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

Train repeatedly on a small, verified example set. If it cannot be fit, inspect label shifting, frozen parameters, masking, and the optimizer.

Success establishes that this path can learn these examples. It says little about generalization, multilingual balance, or long-context reliability.

## 5. Avoid development leakage

Repeatedly choosing settings on a validation set can overfit development choices to it. Keep a final test untouched until decisions are fixed.

Log data version, model configuration, optimizer settings, and random seed. A **seed** initializes pseudorandom choices; fixing it improves reproducibility without guaranteeing identical execution across every system.

## 6. Check outputs as well as loss

Use a stable set of generation prompts to inspect repetition, truncation, and task following. These probes complement token loss rather than replacing a held-out evaluation.

When a change fails, isolate one component at a time. An **ablation** removes or changes one component to estimate its contribution under controlled conditions.
