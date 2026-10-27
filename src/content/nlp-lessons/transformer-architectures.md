# Encoder-only, decoder-only, and encoder-decoder architectures

## 1. Choose the information flow

A Transformer’s architecture determines which sequence each state reads and which attention paths are legal.

**Encoder-only**, **decoder-only**, and **encoder-decoder** designs reuse the building blocks while organizing context differently. A task name alone does not uniquely determine the architecture.

## 2. Contextualize an available input

An **encoder** commonly lets each valid position read both sides of a complete input. BERT is a representative encoder model.

This supports token and sentence representations for classification or extraction. If a training task asks the model to recover hidden text, that target must actually be hidden or corrupted under the objective.

## 3. Extend a prefix

A **decoder-only model** uses causal self-attention to predict successive tokens from a prefix. GPT-style models are representative examples.

During teacher-forced training, all position outputs can be computed in parallel with legal masks. During ordinary autoregressive generation, each newly chosen token becomes an input to the next step.

Causal does not mean training must compute every token sequentially.

## 4. Combine full source and causal target access

An **encoder-decoder Transformer** encodes the source, runs causal target self-attention, and uses cross-attention to source states. T5 is a representative example.

```nlp-visual
encoder-decoder
```

To predict “sleep,” the decoder may read the full French source and target prefix “cats,” but not the future target label “sleep.”

## 5. Compare the interfaces

| Design | Typical available context | Useful output interface |
|---|---|---|
| Encoder | Complete valid input | Token states or a pooled representation |
| Causal decoder | Available prefix | Next-token distribution |
| Encoder-decoder | Full source and target prefix | Conditional target sequence |

These are typical uses, not exclusive capabilities. Adaptation can attach other heads or reformulate a task as text generation.

## 6. Separate architecture from objective

A block diagram states possible computations. The pretraining objective determines which targets and corruptions teach those computations.

Choose by input availability, output structure, latency, training resources, and measured quality. Avoid selecting a model solely because its family name is associated with a popular task.

## 7. Interview reasoning

**Question:** Why can a translation encoder read the source’s final word while the decoder cannot read the target’s final word?

**Answer:** The complete source is supplied at prediction time. The completed target is the unknown output. The two sequences therefore have different availability rules.
