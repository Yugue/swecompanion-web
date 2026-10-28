# Probability and conditional reasoning

## 1. Name the event

A **probability** assigns an event a value from zero to one. A **distribution** assigns probabilities across possible outcomes.

Spam probability 0.1 estimates an event; it does not mean a message is partly spam.

## 2. Condition on evidence

**Conditional probability** considers cases where evidence is known:

\[
P(A\mid B)=\frac{P(A\cap B)}{P(B)}
\]

\(A,B\) are events; \(\cap\) means both occur; require \(P(B)>0\).

If 20 of 100 “prize” messages are spam, the observed spam fraction given that word is 0.2. Reversing the conditioning changes the question.

## 3. Reverse with Bayes’ rule

\[
P(S\mid E)=\frac{P(E\mid S)P(S)}{P(E)}
\]

\(S\): spam; \(E\): evidence. The **prior** P(S) precedes the evidence; the **posterior** P(S|E) incorporates it. The **likelihood** P(E|S) measures evidence frequency under spam.

## 4. Keep the base rate

Spam is 1% of traffic. A phrase occurs in 80% of spam and 5% of legitimate messages:

```text
spam + phrase:   0.01 × 0.80 = 0.0080
legit + phrase:  0.99 × 0.05 = 0.0495
P(spam | phrase) = 0.008 / 0.0575 ≈ 13.9%
```

Strong evidence can coexist with a low posterior when the prior is small.

## 5. Describe average and spread

A **random variable** assigns numeric outcomes. **Expectation** is their probability-weighted average; **variance** is expected squared deviation from that average.

For equally likely word lengths X=1 or X=3 characters:

\[
\mathbb E[X]=2,\qquad \operatorname{Var}(X)=\mathbb E[(X-2)^2]=1
\]

## 6. State independence assumptions

**Independence** means knowing one variable leaves the other’s distribution unchanged. Sentence words generally violate it.

Finite observed frequencies also have sampling uncertainty.

## 7. Interview reasoning

**Question:** Does “80% of spam contains this phrase” imply 80% spam risk when the phrase appears?

**Answer:** No. Combine that likelihood with spam prevalence and the phrase’s frequency in legitimate messages.
