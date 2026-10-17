## Deep ranking models

A **neural ranker** uses learned representations and neural computation to score candidates. It can combine large categorical inputs, dense measurements, text, images, and histories.

Its complexity needs a demonstrated benefit over a suitable simple baseline.

## 1. Convert sparse categories into vectors

An **embedding table** maps category IDs to short learned vectors. A **multilayer perceptron (MLP)** is a sequence of learned weighted transformations and nonlinear activations.

```text
IDs → embedding lookups ─┐
                        ├→ combined features → MLP → score or outcome heads
numeric / content inputs┘
```

A table for 100 million IDs with 64 float32 coordinates requires 25.6 GB in decimal units before other model parameters, replication, and training state.

Unknown and rare IDs need fallback representations, regularization, or feature-based alternatives. A larger table does not create reliable evidence for each rare entity.

## 2. Three ways to model interactions

| Approach | Mechanism | What to compare |
|---|---|---|
| Ordinary MLP | Learns nonlinear combinations through hidden layers | Useful capacity versus fitting and serving cost |
| Wide-and-deep | Combines a linear crossed-feature branch with a neural branch | Whether explicit repeated patterns add value |
| Cross network | Constructs feature interactions through designed cross layers | Added interaction structure versus extra work |

A **cross layer** explicitly combines input coordinates to represent interactions. Its exact form determines which combinations and ranks are possible. A second-order factorization machine offers another structured baseline.

These designs need not be stacked into every model. Compare one architectural hypothesis at a time.

## 3. Candidate-specific attention changes the cost

**Attention** forms a weighted combination of input representations. A candidate-conditioned history module uses the candidate to choose which past actions receive more weight.

A cooking candidate can emphasize cooking history; a car candidate can emphasize car reviews. This permits different summaries for different candidates, but requires additional work per candidate.

A request-only history summary can instead be computed once and reused. The tradeoff is computation reuse versus candidate-specific expressiveness.

## 4. Evaluate the full serving path

Use an appropriate linear, tree, or simpler neural baseline with the same evaluation data. Compare ranking quality, calibration if consumed, cold slices, memory, throughput, and end-to-end latency.

Trees can use engineered crosses or pretrained vectors; neural models are not automatically required whenever IDs appear. Choose by evidence, representation needs, and operating constraints.

Batch scoring can reduce overhead. Feature retrieval and embedding access may dominate computation, so profile them alongside the network rather than assuming a smaller MLP solves the bottleneck.
