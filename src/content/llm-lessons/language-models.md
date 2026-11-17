# What a large language model learns

## 1. Start with prediction

A **language model** predicts probabilities over **tokens**, units of text. A **large language model (LLM)** uses a large **neural network**, a composition of learned transformations, for this task.

A **prompt** is its supplied input. An **autoregressive** model predicts one token from the preceding tokens, then repeats.

## 2. Factor a sentence

\[
p(x_1,\ldots,x_T)=\prod_{t=1}^{T}p(x_t\mid x_{<t})
\]

**Conditional probability** describes an outcome given information. T: sequence length; t: position; \(x_t\): current token; \(x_{<t}\): its prefix.

“red” with probability 0.4, then “car” given “red” with probability 0.5 → prefix probability **0.2**. A learned end token can stop generation.

## 3. Locate the knowledge

**Parameters** are learned stored values; **context** is input available now. Reading a document changes context, not parameters.

**Pretraining** learns from a **corpus**, a text collection. **Post-training** adapts behavior afterward, using demonstrations or feedback.

## 4. Picture the loop

```llm-visual
prediction-loop
```

The selected token becomes input to the next prediction. A plausible early mistake can therefore change every later step.

## 5. Recognize limits and choose a baseline

A **hallucination** presents an unsupported claim as fact. A fluent continuation is not a verified calculation or database lookup.

**Generalization** is useful performance on new examples. **Baseline** means a simple reference solution: try a parser for a fixed field.

Compare correctness, **latency** (elapsed request time), and cost. Use an LLM when language variation or flexible instructions justify it.

> **Reason it through:** A fluent answer states an incorrect total. What does next-token prediction optimize, and what additional check is needed?
