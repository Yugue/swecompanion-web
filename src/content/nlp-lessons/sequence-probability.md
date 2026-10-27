# Sequence probability, likelihood, and logarithms

## 1. Predict a sequence through smaller questions

A **language model** assigns probabilities to token sequences. An **autoregressive** model does so by predicting each token from the available prefix.

The probability chain rule states:

\[
P(x_{1:T})=\prod_{t=1}^{T}P(x_t\mid x_{<t})
\]

\(x_t\) is token \(t\); \(T\) the sequence length; \(x_{<t}\) its earlier tokens. The first factor has no earlier text, apart from any declared starting context.

## 2. Multiply one sequence

For “cats sleep” followed by an **end-of-sequence (EOS)** marker:

```text
P(cats)=0.4
P(sleep | cats)=0.5
P(EOS | cats sleep)=0.8
sequence probability = 0.4 × 0.5 × 0.8 = 0.16
```

EOS makes termination an event the model can predict. It is not the same as an artificial padding position.

## 3. Separate an identity from a model assumption

The chain rule itself loses no information. Replacing the entire prefix with its last two tokens is an additional assumption about useful context.

A **history** is the context used to predict the next token. N-gram models restrict it explicitly; neural models represent it through learned computations and context limits.

## 4. Understand likelihood

**Likelihood** treats observed data as fixed and asks how well different parameter settings account for it. Write model probabilities as \(P_\theta\), where \(\theta\) denotes fitted parameters.

Training by **maximum likelihood** chooses parameters giving the observed targets high probability. It need not assign high probability to every conceivable continuation.

## 5. Turn products into sums

\[
\log P_\theta(x_{1:T})=\sum_{t=1}^{T}\log P_\theta(x_t\mid x_{<t})
\]

Logs here are natural. Their monotonicity preserves likelihood ordering, while summation avoids multiplying many tiny numbers into numerical zero.

**Negative log-likelihood (NLL)** reverses the sign so training can minimize a cost. A target probability of 0.1 costs more than 0.9.

## 6. Respect the scoring convention

Raw sequence probability, average token log loss, and a length-adjusted decoding score answer different questions. Compare them only with the intended input, targets, termination rules, and units specified.

> A sequence score is a chain of conditional bets; inspect what each bet was allowed to see.

## 7. Interview reasoning

**Question:** Is the probability chain rule the same as assuming neighboring words are independent?

**Answer:** No. The full factorization conditions on the entire prefix. Independence or limited-context assumptions enter only when that conditional distribution is simplified.
