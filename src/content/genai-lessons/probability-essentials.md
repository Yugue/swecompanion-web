# Probability and conditional reasoning

## 1. Describe uncertainty

**Probability** assigns a number between zero and one to an event. Probabilities across mutually exclusive, exhaustive outcomes sum to one. A **random variable** maps uncertain outcomes to values.

A **categorical distribution** assigns probabilities to a finite set, such as the next possible word.

## 2. Condition on evidence

**Conditional probability** describes an event given known evidence:
\[
P(A\mid B)=\frac{P(A,B)}{P(B)}
\]
A and B are events; P(A,B) is their joint probability; P(B) must be positive. If 20 of 100 messages are urgent and 15 urgent messages mention “today,” then P(today given urgent)=15/20.

## 3. Factor a sequence

The **probability chain rule** writes a joint probability as conditional factors:
\[
P(x_1,\ldots,x_T)=\prod_{t=1}^{T}P(x_t\mid x_1,\ldots,x_{t-1})
\]
T is sequence length; \(x_t\) is its t-th element. A **prefix** is the earlier part of a sequence. The first factor has an empty prefix. Multiplying unconditional word frequencies additionally assumes independence, losing order and context.

## 4. Summarize outcomes

**Expectation** is a probability-weighted average. A reward of 2 with probability 0.25 and 0 otherwise has expectation 0.5.

**Variance** measures squared spread around the expectation. Equal expected rewards can hide very different risk. **Standard deviation** is the square root of variance.

## 5. Understand continuous noise

A **Gaussian distribution** is a continuous bell-shaped distribution. Its mean sets location and its variance sets spread. A standard Gaussian has mean zero and variance one.

For continuous variables, probability belongs to intervals; a density value is not the probability of one exact point.

## 6. Use logarithms

A **logarithm** turns multiplication into addition. Sequence log probability is the sum of conditional log probabilities, avoiding tiny floating-point products.

**Likelihood** fixes the observed data and compares parameter choices by the probability they assign to it. Maximizing log likelihood is equivalent to maximizing likelihood. Formulas here use natural logarithms.
