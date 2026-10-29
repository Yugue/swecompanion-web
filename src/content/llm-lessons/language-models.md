# What a large language model learns

## 1. Start with prediction

A **language model** assigns probabilities to sequences of text units called **tokens**. A **large language model (LLM)** uses a **neural network**—a composition of learned transformations—to predict text at scale; there is no universal parameter threshold defining “large.”

A **prompt** is the input supplied to condition a generation.

An **autoregressive** model generates one token at a time, using earlier tokens as context. This guide focuses on that common design.

## 2. Factor a sentence

\[
p(x_1,\ldots,x_T)=\prod_{t=1}^{T}p(x_t\mid x_{<t})
\]
**Conditional probability** is the probability of an outcome given specified information. Here, T is sequence length; t is a position; \(x_t\) is its token; \(x_{<t}\) contains earlier tokens. This probability chain rule does not assume words are independent.

If “red” has probability 0.4 and “car” given “red” has probability 0.5, their two-token prefix has probability 0.2. An end-of-sequence token can terminate a full output.

## 3. Locate the knowledge

**Parameters** are learned numerical values stored in the model. **Context** is the input available during a prediction. Reading a new document changes context, not parameters.

**Pretraining** learns broad patterns from a large **corpus**, or collection of text. **Post-training** adapts behavior afterward, often using demonstrations or preferences. A chat assistant is a trained model plus conversation formatting and a surrounding application.

## 4. Picture the loop

```llm-visual
prediction-loop
```

The selected token becomes input to the next prediction. A plausible early mistake can therefore change every later step.

## 5. Recognize limits and choose a baseline

A **hallucination** is generated content presented as factual without adequate support. Training text includes contradictions, outdated claims, and guesses; predicting its patterns is not the same as checking a fact.

**Generalization** means useful behavior on new examples. A model can generalize a format while failing a calculation inside that format.

A **baseline** is a simple reference solution. For extracting one known field, start with a parser or small classifier if it solves the task. LLMs help when inputs vary, instructions matter, or multiple language operations must be composed.

Measure correctness, **latency** (elapsed time per request), and complete request cost before choosing a larger model. Parameter count alone does not establish fitness for a task.
