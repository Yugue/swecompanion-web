# 1.3 Noise, uncertainty, and essential probability

## 1. Observations are uncertain

A **random variable** has an uncertain value. A distribution describes how likely its outcomes are.

```text
same scene → pixel readings: 98, 101, 99, 102
                         ↓
                  signal + variation
```

Discrete probabilities sum to one. A continuous density integrates to one; its height is not a point probability.

## 2. Mean and variance

**Mean:** the expected center.

**Variance:** squared spread around that center.

\[
\mu=\mathbb{E}[X],\qquad
\operatorname{Var}(X)=\mathbb{E}[(X-\mu)^2]
\]

Example: equally likely readings 98, 100, 102 have mean 100 and variance \(8/3\).

**Standard deviation** is the square root of variance, in the original units.

```python
readings = torch.tensor([98., 100., 102.])
mean = readings.mean()
variance = readings.var(unbiased=False)
```

A noisy measurement can still be unbiased.

## 3. Why averaging works

For n independent measurements of the same signal, each with variance \(\sigma^2\):

\[
\operatorname{Var}(\bar X)=\frac{\sigma^2}{n}
\]

Example: noise standard deviation 8 becomes **4** after averaging four captures.

But:

- Unaligned moving objects create ghosts.
- Spatial averaging across an edge blurs it.
- Correlated errors do not follow the independent-noise reduction.

## 4. Useful noise models

| Model | Mental image | Typical response |
|---|---|---|
| Gaussian additive | Small fluctuations everywhere | Mild smoothing |
| Poisson shot noise | Random photon arrivals | More light / signal-aware modeling |
| Impulse | A few extreme pixels | Median filter |
| Correlated | Shared stripes or errors | Address the shared source |

Real sensor noise can depend on brightness.

## 5. Bayes’ rule

Bayes combines **prior belief** with **observed evidence**:

\[
P(H\mid E)=\frac{P(E\mid H)P(H)}{P(E)}
\]

H is a hypothesis; E evidence.

Example: a bright spot could be a scratch or reflection. Its shape and the usual defect rate help interpret it.

- **Likelihood:** evidence given the hypothesis.
- **Posterior:** hypothesis after seeing evidence.

A smoothness prior helps reconstruction but may erase a real thin scratch.

## 6. Uncertainty in estimates

A sample mean estimates the population mean.

Example: 1,000 adjacent frames from one video contain less independent evidence than 1,000 separate scenes.

Distinguish:

- **Observation uncertainty:** noisy inputs.
- **Model uncertainty:** limited learned knowledge.

Confidence scores do not automatically capture either reliably.

## 7. Interview reasoning

**Question:** Why does averaging moving objects fail?

**Answer:** The frames contain different signals at the same pixel. Align them before combining, and handle occlusion and lighting changes.
