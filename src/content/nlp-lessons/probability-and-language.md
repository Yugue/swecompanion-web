# Probability and conditional reasoning

## 1. Specify the event

A **probability** assigns a number from zero to one to an event under a defined population or process. A **distribution** assigns probabilities across possible outcomes.

“Spam probability 0.1” means an estimate of that event, not that one message is 10% spam.

## 2. Condition on evidence

**Conditional probability** restricts attention to cases where evidence is known:

\[
P(A\mid B)=\frac{P(A\cap B)}{P(B)}
\]

\(A\) and \(B\) are events; \(A\cap B\) means both occur. The formula requires \(P(B)>0\).

Among 100 messages containing “prize,” if 20 are spam, the observed spam fraction given that word is 0.2. That differs from the fraction of spam messages containing the word.

## 3. Reverse the conditioning with Bayes’ rule

\[
P(S\mid E)=\frac{P(E\mid S)P(S)}{P(E)}
\]

\(S\) is spam and \(E\) observed evidence. The **prior** \(P(S)\) is risk before that evidence; the **posterior** \(P(S\mid E)\) is risk after it.

The likelihood \(P(E\mid S)\) measures how compatible the evidence is with spam.

## 4. Work a base-rate example

Suppose spam prevalence is 1%, a phrase appears in 80% of spam, and in 5% of legitimate messages:

```text
spam with phrase:       0.01 × 0.80 = 0.0080
legitimate with phrase: 0.99 × 0.05 = 0.0495
posterior spam risk:    0.008 / 0.0575 ≈ 13.9%
```

Strong relative evidence does not erase a small prior. Most phrase-bearing messages remain legitimate in this population.

## 5. Describe averages and spread

A **random variable** assigns a numeric outcome to each case. Its **expectation** is the probability-weighted average; **variance** is expected squared deviation from that average.

For token length \(X\) equally likely to be 1 or 3:

\[
\mathbb E[X]=2,\qquad \operatorname{Var}(X)=\mathbb E[(X-2)^2]=1
\]

The expectation need not be a possible individual outcome. Continuous variables use densities and integrals instead of finite sums; density height itself is not a point probability.

## 6. Check what assumptions supply

**Independence** means knowing one variable does not change the other’s distribution. Words in a sentence generally are not independent. Later models make restricted independence assumptions to obtain tractable estimates.

Observed proportions also have sampling uncertainty, especially with few examples.

## 7. Interview reasoning

**Question:** If 80% of spam contains a phrase, is a message with that phrase 80% likely spam?

**Answer:** No. You also need the spam prior and how often legitimate messages contain it. Bayes’ rule combines those quantities.
