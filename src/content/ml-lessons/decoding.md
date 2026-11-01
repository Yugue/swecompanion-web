# Decoding strategies

A language model supplies next-token probabilities. **Decoding** chooses tokens from them; changing this rule changes outputs without changing model weights.

## 1. Separate search from sampling

| Method | Decision | Main tradeoff |
|---|---|---|
| Greedy | Choose the highest-probability next token | Fast, but locally optimal choices can miss better sequences |
| Beam search | Retain several promising prefixes | More work; results depend on scoring and length handling |
| Sampling | Draw a token from a distribution | Variety, with a chance of weak choices |

If one branch has probability 0.6 followed by 0.1, its two-token probability is 0.06. Another branch with 0.4 followed by 0.9 has probability 0.36. Greedy takes the first branch; it does not maximize complete-sequence probability.

## 2. Reshape probabilities with temperature

For logits z and positive temperature T:

\[
p_i=\frac{\exp(z_i/T)}{\sum_j\exp(z_j/T)}
\]

Lower temperature sharpens relative preferences; higher temperature flattens them. With two logits [log 3,0], T=1 gives [0.75,0.25]; T=0.5 gives [0.9,0.1].

```dl-visual
temperature
```

Temperature zero is commonly a software convention for greedy decoding; it is not a valid denominator in this formula. Sharper probabilities do not establish factual correctness.

## 3. Restrict the candidate set

**Top-k** retains the k most probable tokens. **Top-p** retains the smallest descending-probability prefix whose cumulative probability reaches p. Renormalize before sampling.

For [0.6,0.25,0.1,0.05], top-p at 0.8 keeps the first two tokens, with total mass 0.85. Their renormalized probabilities are about [0.706,0.294].

Temperature reshapes scores; filtering removes candidates. Their order and implementation settings are part of the decoding configuration.

## 4. Evaluate the actual output contract

Stop at an end token or length limit. For constrained extraction, measure schema validity and exact correctness. For open-ended generation, also measure diversity and unsupported claims.

Beam search optimizes its sequence score, which need not match human usefulness. Sampling increases variation, which need not improve quality. Choose using representative outputs and the task's metric.
