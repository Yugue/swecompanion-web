# Sequence probability, likelihood, and logarithms

## 1. Predict text one conditional at a time

A **language model** assigns probabilities to token sequences. A **token** is a unit processed by the model, such as a word or text piece.

An **autoregressive model** predicts each token from its available prefix.

## 2. Factor a sequence

The probability chain rule gives:

\[
P(x_{1:T})=\prod_{t=1}^{T}P(x_t\mid x_{<t})
\]

\(x_t\): token t; \(T\): sequence length; \(x_{<t}\): earlier tokens. The first factor uses any declared starting context.

This is an identity, not an independence assumption.

## 3. Include termination

An **end-of-sequence (EOS)** marker makes stopping a predicted event:

```text
P(cats)=0.4
P(sleep | cats)=0.5
P(EOS | cats sleep)=0.8
complete probability = 0.4 × 0.5 × 0.8 = 0.16
```

This marks a real ending, rather than a storage-only position.

## 4. Limit history deliberately

A **history** is the context used for prediction. Replacing the full prefix with its last two tokens is an additional modeling assumption.

Short histories share counts more easily but discard longer relationships.

## 5. Fit likelihood in log space

**Likelihood** compares parameter settings against fixed observed data. **Maximum likelihood** chooses parameters assigning those observations high probability.

\[
\log P_\theta(x_{1:T})=\sum_t\log P_\theta(x_t\mid x_{<t})
\]

\(\theta\) denotes parameters. Natural logarithms preserve probability ordering and replace tiny products with sums.

**Negative log-likelihood (NLL)** negates this score for minimization.

## 6. Specify the score

Total sequence probability, average token loss, and length-adjusted search scores answer different questions. Declare targets, boundaries, and termination before comparing them.

## 7. Interview reasoning

**Question:** Does the chain rule assume adjacent words are independent?

**Answer:** No. Its full conditionals use the entire prefix. Restricted context is a separate approximation made by a model.
