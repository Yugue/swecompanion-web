# Evaluating language models

## 1. Score actual held-out targets

At each position, supply only permitted context and inspect the probability of the observed next token.

This measures predictive fit. Product usefulness needs task-specific assessment too.

## 2. Average negative log-likelihood

\[
L=-\frac1N\sum_{t=1}^{N}\log P_\theta(x_t\mid x_{<t})
\]

\(N\): scored targets; \(x_t\): observed token; \(x_{<t}\): permitted prefix; \(\theta\): parameters. Natural logs are used.

Higher observed-token probability lowers L. Exclude padding and state whether EOS is counted.

## 3. Convert to perplexity

**Perplexity** is exponential average token NLL:

\[
\operatorname{PPL}=e^L
\]

Target probabilities [0.5,0.25] give L≈1.040 and PPL=√8≈2.828.

A uniform predictor over K alternatives has perplexity K. This motivates “effective choices,” without requiring equally likely alternatives at every position.

## 4. Keep units comparable

| Change | Why comparison changes |
|---|---|
| Tokenizer | Different prediction units and target count |
| Context access | Different evidence per prediction |
| EOS/boundaries | Different scored events |

A masked model’s **pseudo-likelihood** uses conditionals with other tokens visible. It is not ordinary causal sequence likelihood.

Common byte/character-normalized comparisons require their own consistent definition.

## 5. Inspect score slices

Break loss down by language, rare names, length, and domain. An average can hide regressions.

Check for training contamination in held-out passages; memorized text does not test performance on new text.

## 6. Evaluate downstream behavior

Lower perplexity does not establish faithful summaries, correct facts, or appropriate refusal to answer.

A likely continuation can remain unsupported by the supplied document.

## 7. Interview reasoning

**Question:** Is perplexity 8 better than 10 under different tokenizers?

**Answer:** That conclusion is unsupported. Align scoring units, evidence, and targets, then evaluate the intended task.
