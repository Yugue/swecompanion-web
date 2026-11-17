# Sequence decoding and beam search

## 1. Choose a next token

**Decoding** selects output tokens. **Greedy decoding** takes the highest-probability next token at each step; that local choice need not start the best complete path.

## 2. Score a complete path

\[
\log P(y\mid x)=\sum_{t=1}^{T}\log P(y_t\mid x,y_{<t})
\]

x is the input; y a T-token candidate; y_<t its earlier tokens. A complete sequence includes stopping behavior, not merely its first plausible word.

```genai-visual
decoding-tree
```

The illustrated two-step paths score 0.30 and 0.36 even though greedy decoding initially chooses the first path.

## 3. Keep several partial sequences

**Beam search** retains a fixed number of high-scoring partial sequences at each step. It can prune the best complete sequence and may favor generic outputs.

A beam of width one behaves like greedy decoding under the same scoring and stopping rules. A wider beam spends more compute and memory but is not an exhaustive search.

## 4. Handle length and stopping

EOS permits a model to stop; a hard output limit can truncate an answer. Multiplying more factors bounded by one tends to lower a path's probability.

Length-normalized scoring can reduce short-output preference but changes the objective. State whether end tokens and length penalties are included before comparing candidate scores.

## 5. Match search to the task

Beam search suits tasks with useful sequence scores but can favor generic open-ended answers. Search improves its scoring objective, not necessarily factuality or usefulness.

> **Reason it through:** Why can a wider beam find a more probable sequence without finding a more useful answer?
