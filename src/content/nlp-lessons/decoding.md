# Decoding and stopping decisions

## 1. Turn probabilities into a sequence

**Decoding** chooses an output using a model’s next-token distributions. The fitted distribution and the policy used to produce a sequence are separate.

A model can produce different outputs under greedy choice, search, or sampling without any parameter update.

## 2. See why local choice can fail globally

**Greedy decoding** selects the highest-probability next token at each step.

```nlp-visual
decoding-tree
```

The example gives first tokens A and B probabilities 0.6 and 0.4. Ending after A has conditional probability 0.5; ending after B has 0.9. Complete probabilities are 0.30 and 0.36.

Greedy takes A, although B followed by EOS is the better complete sequence. Other continuations are split so EOS is the local best second token on both branches.

## 3. Retain alternative prefixes

**Beam search** keeps a limited set of high-scoring partial sequences, expands them, and prunes again. Width two retains B in this example.

Finite beam search can still discard a prefix that would lead to a better final sequence. It is not a general guarantee of global optimality or better task quality.

Length penalties and stopping rules can change the search objective away from raw sequence probability.

## 4. Adjust sampling sharpness

**Temperature sampling** rescales logits before softmax:

\[
p_i(T)=\frac{\exp(z_i/T)}{\sum_j\exp(z_j/T)}
\]

\(z_i\) is token \(i\)'s logit; \(T>0\) temperature. Smaller \(T\) concentrates mass; larger \(T\) spreads it.

Scores [log 3, 0] give [0.75,0.25] at temperature 1 and [0.9,0.1] at 0.5. This changes sampling, not the model’s factual knowledge.

## 5. Restrict the sampling set

**Top-k sampling** keeps the k highest-probability tokens. **Top-p**, or nucleus sampling, keeps a smallest leading set whose cumulative mass reaches a chosen threshold, then renormalizes.

For probabilities [0.5,0.3,0.2] and threshold 0.7, the first two remain; renormalized probabilities are [0.625,0.375]. Tie rules and the order of temperature/truncation operations must be specified.

## 6. Define termination and evaluate the result

EOS is a learned stopping event. A maximum output length imposes an external cap that can cut an answer mid-sentence.

Repetition penalties, constrained vocabularies, and stop strings also alter behavior. Choose a policy using task quality, required format, diversity, faithfulness, and cost. A lower temperature is not a substitute for evaluating correctness.

## 7. Interview reasoning

**Question:** Why can widening a beam worsen a translation metric?

**Answer:** Search more closely optimizes its chosen model score, which may disagree with reference quality or the desired length. Better search under a mismatched score need not improve the task.
