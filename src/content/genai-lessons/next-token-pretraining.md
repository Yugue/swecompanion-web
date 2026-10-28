# Pretraining through next-token prediction

## 1. Create a learning signal from text

**Next-token pretraining** learns to predict each token from the preceding input prefix. It is **self-supervised**: training targets are constructed from the text rather than separately annotated by people.

The model learns a distribution over continuations, not an explicit rule that every continuation must be factual.

## 2. Shift targets by one

For text “cats sleep END,” inputs can be [START,cats,sleep] and targets [cats,sleep,END]. START and END are boundary tokens.

**Teacher forcing** supplies actual earlier tokens during training. **Exposure bias** is the mismatch when generation instead encounters the model’s own, potentially mistaken prefixes; one error can alter later predictions.

```genai-visual
teacher-forcing
```

## 3. Average the prediction costs

\[
L=-\frac{1}{N}\sum_{t\in S}\log p_\theta(x_t\mid x_{<t})
\]
θ denotes parameters; \(x_t\) the target token; \(x_{<t}\) its prefix; S the supervised positions; N their count. Increasing a target’s probability reduces its loss contribution.

## 4. Train many positions together

Causal masking allows all shifted training targets to be evaluated in one parallel forward pass. Generation remains sequential because the next input depends on the token just selected.

```python
logits = model(tokens[:, :-1])
targets = tokens[:, 1:]
loss = torch.nn.functional.cross_entropy(
    logits.reshape(-1, logits.size(-1)), targets.reshape(-1))
```
This assumes the model applies causal attention; padding targets also need exclusion.

## 5. Preserve the intended task

Mask padding out of the loss. For packed independent documents, block unintended cross-document attention. Never give a position direct access to its own future target.

Loss reductions across batches should count supervised tokens consistently, especially with variable lengths.

## 6. Compare other pretraining objectives

**Masked-language modeling** predicts hidden tokens using visible context on both sides. **Sequence denoising** reconstructs clean text from a corrupted version.

| Objective | Available input | Target |
|---|---|---|
| Causal prediction | Earlier tokens | Next token |
| Masked prediction | Visible tokens around a gap | Hidden token |
| Sequence denoising | Corrupted source and clean target prefix | Next clean target token |

These create different learning problems. An encoder trained on hidden-token recovery is not automatically a left-to-right generator.

## 7. Recognize objective mismatch

Predicting plausible text is not identical to answering a user correctly or following instructions. Post-training changes behavior; retrieval supplies current evidence.

Check both held-out token loss and target-task evaluations. Improvement on one does not guarantee improvement on the other.
