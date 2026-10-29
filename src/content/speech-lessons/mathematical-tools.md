# 2.1 Mathematical tools and probabilistic prediction

## 1. Turn an audio problem into quantities

A **scalar** is one number; a vector is an ordered list; a matrix has two axes; a tensor generalizes this to any number of axes. An audio frame can be a vector of F features, and a recording a T × F matrix.

State axis meanings before calculating: the same numeric shape can represent time, channels, or classes with different semantics.

## 2. Dot products and learned projections

For vectors a and b of length d, their dot product is the sum of pairwise products. A matrix applies several such weighted combinations:

\[
a^\top b=\sum_{i=1}^{d}a_i b_i,\qquad y=Wx+b_0
\]

W has shape output-dimension × input-dimension; b0 is a bias vector. Each row of W selects a weighted mixture of input features.

A model can therefore turn 80 filterbank values into 256 learned features per frame without changing the frame count.

## 3. Magnitude and similarity

The Euclidean norm measures length; cosine similarity compares directions:

\[
\|a\|_2=\sqrt{\sum_i a_i^2},\qquad
\cos(a,b)=\frac{a^\top b}{\|a\|_2\|b\|_2}
\]

Nonzero vectors are required. Scaling a vector changes its norm but not its cosine direction. Similarity is useful for speaker embeddings, but a similarity score is not automatically a calibrated probability of identity.

## 4. Conditional probability, likelihood, and inference

P(y|x) means the probability of output y given input x. For recognition, x is audio and y a token sequence.

The **likelihood** views observed data as evidence for model parameters. A **prior** represents beliefs before observing evidence; a **posterior** updates them. Bayes' rule is:

\[
P(y\mid x)=\frac{P(x\mid y)P(y)}{P(x)}
\]

The denominator normalizes across y. This explains why acoustic evidence and a language prior can contribute differently, without requiring every recognizer to implement this factorization explicitly.

## 5. Products become sums of log probabilities

Independent events multiply; conditional sequence factors also multiply by the probability chain rule. Logarithms turn products into sums and avoid underflow.

If a model assigns the observed label probability 0.8, its negative log-likelihood is about 0.223; at 0.1 it is about 2.303. Minimizing this loss rewards probability assigned to the correct observation.

Never replace a sum over alternative alignments with a product: alternatives and jointly required events combine differently.

## 6. Expectations and variability

An **expectation** is a probability-weighted average. Variance is expected squared distance from the mean. A dataset average estimates an expectation under its sampling distribution.

A development set dominated by clean near-field audio estimates that mixture's performance; it does not automatically estimate distant-microphone performance. Dependence between clips from one speaker reduces the effective amount of independent evidence.

## 7. Derivatives describe local sensitivity

A derivative measures how a small input change affects an output. A gradient collects derivatives with respect to many parameters.

For loss L = (w x − y)², dL/dw = 2(wx − y)x. The **chain rule** multiplies sensitivities through composed operations, enabling neural-network training.

```text
parameter change → prediction change → loss change
                       chain these sensitivities backward
```
