# Selecting a generated sequence

## 1. Turn predictions into a sequence

**Decoding** is the procedure that selects output tokens from model probabilities. **Greedy decoding** chooses the highest-probability next token at every step.

It is a local decision rule. The best immediate token need not begin the best complete sequence.

## 2. Score a path

\[
\log P(y\mid x)=\sum_{t=1}^{T}\log P(y_t\mid x,y_{<t})
\]
x is the input context; y is a generated sequence of T tokens; \(y_{<t}\) is its generated prefix. Sequence probability multiplies conditional probabilities, so log probability adds their logarithms.

## 3. Compare two branches

```genai-visual
decoding-tree
```

In this toy, A has initial probability 0.6 and B 0.4. The chosen completion after A has probability 0.5, while the best completion after B has probability 0.9.

The complete paths score 0.30 and 0.36. Greedy commits to A too early.

## 4. Retain multiple candidates

**Beam search** keeps a fixed number of high-scoring partial sequences at each step and expands them. Beam width one resembles greedy search under the same scoring and stopping rules.

A finite beam can still prune the globally best continuation. Search quality depends on both model probabilities and scoring choices.

## 5. Handle length and termination

An end token permits the model to stop. A hard token limit can cut an answer mid-sentence. Raw log probability often favors shorter sequences because additional factors are at most one.

Length-normalized scores change the search objective; define that convention when comparing candidates.

## 6. Choose search for the task

Beam search can help constrained sequence tasks but may reduce variety in open-ended generation. Greedy decoding is inexpensive and repeatable under deterministic execution.

Neither guarantees correctness. Better search can expose a model’s preference for fluent, generic, or unsupported answers more consistently.
