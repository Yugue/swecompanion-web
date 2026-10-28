# Distillation and synthetic training data

## 1. Transfer behavior to a student

**Distillation** trains a student model using signals from a teacher model. The student is often smaller, aiming to preserve useful behavior with lower serving cost.

**Synthetic data** is generated rather than directly observed or independently annotated. It may support distillation or ordinary training.

## 2. Choose a teaching signal

**Sequence distillation** trains on teacher-generated responses. **Distribution distillation** trains against teacher probabilities over alternatives, when those probabilities are available.

If a teacher assigns [0.6,0.3,0.1], its second choice is more plausible than its third. Training only on the sampled first choice discards that relative information.

## 3. Match softened distributions

\[
L_{distill}=\tau^2D_{KL}\left(p_T^{(\tau)}\Vert p_S^{(\tau)}\right)
\]
\(p_T\) and \(p_S\) are teacher and student softmax distributions formed from logits divided by temperature τ. Larger τ softens them. The displayed scaling convention compensates for temperature-dependent gradient magnitude.

This is a distribution-level objective; text-only teacher access needs a different signal.

## 4. Build and filter examples

Sample prompts from intended use, generate candidate answers, and verify quality. Include rare tasks and failure cases rather than only questions the teacher finds easy.

A filter that rewards verbosity can train a verbose student even when correctness is unchanged.

## 5. Avoid error amplification

Teachers can hallucinate, reproduce biases, or produce many near-duplicate examples. Repeatedly training on unfiltered generated data can reduce coverage and propagate errors.

Keep independent evaluation and useful real data. Agreement between teacher and student is not independent evidence of truth.

## 6. Measure compression value

Compare task quality, latency, memory, and cost at matched output budgets. A smaller student may require longer outputs or more retries, reducing nominal savings.

Distillation transfers selected behavior, not every teacher capability. Test the student directly on real, held-out requests.
