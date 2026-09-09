# Probability / Statistics Essentials

For deep learning, probability and statistics help you understand **uncertainty, data distributions, losses, and model outputs**.

## 1. Random variable

A random variable is a variable whose value is uncertain.

Example:

\[
X \in \{0,1\}
\]

where:
- `1` = spam
- `0` = not spam

```python
x = torch.bernoulli(torch.tensor(0.7))
```

---

## 2. Probability distribution

A probability distribution tells us how likely different outcomes are.

For classification:

\[
P(y=k|x)
\]

Example:

\[
P(\text{cat})=0.7,\quad P(\text{dog})=0.2,\quad P(\text{bird})=0.1
\]

```python
probs = torch.tensor([0.7, 0.2, 0.1])
```

A neural network often outputs or represents a probability distribution over classes.

---

# 3. Expectation

Expectation is the **average value you'd expect over many samples**.

\[
E[X]=\sum_x xP(x)
\]

For continuous variables:

\[
E[X]=\int x\,p(x)\,dx
\]

```python
expected = (values * probs).sum()
```

In ML, many objectives are really expected losses:

\[
E[L(X,Y)]
\]

We approximate this using training samples.

---

# 4. Mean

The sample mean is:

\[
\bar{x}=\frac{1}{N}\sum_i x_i
\]

```python
mean = x.mean()
```

It estimates the expected value of a distribution.

Mean appears everywhere:
- normalization
- metrics
- losses
- batch statistics

---

# 5. Variance

Variance measures how spread out values are around the mean.

\[
Var(X)=E[(X-\mu)^2]
\]

Large variance means values are widely spread.

```python
variance = x.var()
```

This matters in:
- initialization
- normalization
- bias/variance
- gradient stability

---

# 6. Standard deviation

Standard deviation is:

\[
\sigma=\sqrt{Var(X)}
\]

It is easier to interpret because it has the same units as \(X\).

```python
std = x.std()
```

BatchNorm uses mean and variance directly.

---

# 7. Bernoulli distribution

A Bernoulli variable has two outcomes:

\[
X\in\{0,1\}
\]

with:

\[
P(X=1)=p
\]

Typical use:
- binary classification
- dropout masks

```python
mask = torch.bernoulli(torch.full((10,), 0.5))
```

---

# 8. Categorical distribution

Used when there are multiple discrete classes.

Example:

\[
P(y)=[0.1,0.7,0.2]
\]

```python
sample = torch.multinomial(probs, 1)
```

This is the natural distribution for multiclass classification.

---

# 9. Gaussian / Normal distribution

The normal distribution is:

\[
X\sim\mathcal{N}(\mu,\sigma^2)
\]

where:
- \(\mu\) = mean
- \(\sigma^2\) = variance

```python
x = torch.randn(1000)
```

Why it matters:
- weight initialization
- noise modeling
- latent-variable models
- statistical assumptions

---

# 10. Conditional probability

Conditional probability means:

> probability of \(A\), given that \(B\) is known.

\[
P(A|B)
\]

In ML, we often model:

\[
P(y|x)
\]

Example:

> probability of spam given the email contents.

```python
p_y_given_x = model(x).softmax(dim=-1)
```

This is a central idea in supervised learning.

---

# 11. Joint probability

Joint probability means two things happening together:

\[
P(X,Y)
\]

It can be factored as:

\[
P(X,Y)=P(Y|X)P(X)
\]

```python
p_xy = p_y_given_x * p_x
```

This identity becomes important in generative modeling.

---

# 12. Bayes' theorem

\[
P(Y|X)
=
\frac{P(X|Y)P(Y)}
{P(X)}
\]

Interpretation:

> Update what you believe about \(Y\) after observing \(X\).

```python
posterior = likelihood * prior / evidence
```

Know the intuition. You don't need advanced Bayesian statistics for this interview.

---

# 13. Likelihood

Likelihood asks:

> Given model parameters, how likely is the observed data?

Suppose:

\[
P(y|x;\theta)
\]

Then likelihood over a dataset is:

\[
\prod_i P(y_i|x_i;\theta)
\]

Training often chooses parameters that maximize this likelihood.

```python
likelihood = probs[targets].prod()
```

---

# 14. Log-likelihood

Products of many probabilities become tiny, so we take logs:

\[
\log \prod_i p_i
=
\sum_i \log p_i
\]

```python
log_likelihood = torch.log(probs[targets]).sum()
```

This is easier numerically and mathematically.

---

# 15. Maximum likelihood estimation

MLE chooses parameters:

\[
\theta^*
=
\arg\max_\theta
P(D|\theta)
\]

or equivalently:

\[
\theta^*
=
\arg\max_\theta
\log P(D|\theta)
\]

```python
loss = -log_likelihood
```

This connects directly to deep-learning loss functions.

For classification:

> minimizing cross-entropy is closely related to maximizing likelihood.

Very important connection.

---

# 16. Entropy

Entropy measures **uncertainty** in a probability distribution.

\[
H(P)
=
-\sum_i p_i\log p_i
\]

```python
entropy = -(p * torch.log(p)).sum()
```

Examples:

\[
[0.99,0.01]
\]

has low entropy.

\[
[0.5,0.5]
\]

has high entropy.

So:

> higher entropy = more uncertainty.

---

# 17. Cross-entropy

Cross-entropy measures how well predicted distribution \(Q\) matches true distribution \(P\):

\[
H(P,Q)
=
-\sum_i P_i\log Q_i
\]

```python
loss = F.cross_entropy(logits, targets)
```

For one-hot labels, this effectively becomes:

\[
-\log P(\text{correct class})
\]

So if the correct-class probability is high, loss is low.

This is one of the most important concepts for neural networks.

---

# 18. KL divergence

KL divergence measures how different two probability distributions are:

\[
D_{KL}(P\|Q)
=
\sum_i P_i
\log
\frac{P_i}{Q_i}
\]

```python
kl = F.kl_div(q.log(), p, reduction="sum")
```

Properties:

- \(KL\ge0\)
- \(KL(P\|Q)\neq KL(Q\|P)\)

So it is **not a true distance metric**.

Useful in:
- VAEs
- distillation
- distribution matching
- RL/LLM training

---

# 19. Softmax

Softmax converts arbitrary scores/logits into a probability distribution.

\[
P_i=
\frac{e^{z_i}}
{\sum_j e^{z_j}}
\]

```python
probs = torch.softmax(logits, dim=-1)
```

Example:

```text
logits = [2, 1, 0]
```

becomes something like:

```text
[0.67, 0.24, 0.09]
```

All probabilities:
- are positive
- sum to 1

---

# 20. Sampling

Sometimes we don't choose the highest-probability output; we sample from the distribution.

```python
token = torch.multinomial(probs, 1)
```

This matters later for LLM generation.

---

# 21. Correlation

Correlation measures how strongly two variables move together.

\[
\rho\in[-1,1]
\]

```python
corr = torch.corrcoef(torch.stack([x, y]))
```

Important distinction:

> Correlation does not imply causation.

Also, two features can be strongly correlated and therefore contain redundant information.

---

# 22. Covariance

Covariance measures whether two variables tend to increase or decrease together.

\[
Cov(X,Y)
=
E[(X-\mu_X)(Y-\mu_Y)]
\]

```python
cov = torch.cov(torch.stack([x, y]))
```

Covariance is important conceptually for:
- PCA
- feature relationships
- Gaussian models

Lower priority than variance.

---

# What matters most

For your DL interview, focus most on:

1. **Probability distributions**
2. **Expectation**
3. **Mean / variance**
4. **Conditional probability**
5. **Likelihood**
6. **Maximum likelihood**
7. **Log-likelihood**
8. **Entropy**
9. **Cross-entropy**
10. **KL divergence**
11. **Softmax**

The key conceptual chain is:

\[
\text{Model outputs probabilities}
\]

\[
\downarrow
\]

\[
P(y|x;\theta)
\]

\[
\downarrow
\]

\[
\text{maximize likelihood}
\]

\[
\downarrow
\]

\[
\text{maximize log-likelihood}
\]

\[
\downarrow
\]

\[
\text{minimize negative log-likelihood / cross-entropy}
\]

That connection is especially important for deep learning.

Next topic: **Neuron → MLP**.
