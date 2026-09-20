## Gaussian mixture models

A GMM treats the data as coming from several Gaussian distributions mixed together. It is the probabilistic generalization of k-means, and it gives **soft** cluster memberships.

### 1. The model

\[
p(x) = \sum_{k=1}^{K}\pi_k\,\mathcal{N}(x \mid \mu_k, \Sigma_k), \qquad \sum_k \pi_k = 1
\]

Each component has a weight \(\pi_k\), a mean \(\mu_k\), and a covariance \(\Sigma_k\). Because it defines a full probability density over x, a GMM is a **generative** model: you can sample from it, score the likelihood of a new point, and use it for density estimation - none of which k-means can do.

```python
GaussianMixture(n_components=5, covariance_type="full").fit(X)
```

---

### 2. Soft assignment

Instead of "point i is in cluster 3", a GMM gives a **responsibility**:

\[
\gamma_{ik} = P(z_i = k \mid x_i) = \frac{\pi_k\,\mathcal{N}(x_i\mid\mu_k,\Sigma_k)}{\sum_j \pi_j\,\mathcal{N}(x_i\mid\mu_j,\Sigma_j)}
\]

```text
point A → [0.97, 0.02, 0.01]   clearly cluster 1
point B → [0.48, 0.51, 0.01]   genuinely on a boundary
```

Point B is the interesting one. A hard assignment hides that ambiguity; a responsibility of roughly 0.5 says "this customer sits between two segments" - which may be exactly what the business needs to know, and is a good reason to route it to a human.

---

### 3. Fitting with EM

There is no closed form, so expectation-maximization alternates:

```text
E-step: given the current parameters, compute responsibilities γ
M-step: given γ, re-estimate π, μ, Σ as weighted averages
repeat until the log-likelihood stops improving
```

Each iteration is guaranteed not to decrease the likelihood - but like k-means, EM converges to a **local** optimum, so initialization (usually from k-means) and multiple restarts matter.

---

### 4. Covariance type is the capacity knob

| `covariance_type` | Shape allowed | Parameters per component |
|---|---|---|
| `spherical` | circles, one variance | 1 |
| `diag` | axis-aligned ellipses | d |
| `tied` | one shared full covariance | d(d+1)/2 total |
| `full` | arbitrary ellipses, any orientation | d(d+1)/2 each |

`full` is the most expressive and needs the most data - with d = 50 that is 1,275 parameters per component, which overfits quickly. `diag` is the common compromise in higher dimensions.

### Rule of thumb

> The relationship to remember: k-means is a GMM with spherical, equal covariances and hard assignments.

---

### 5. Choosing the number of components

Because a GMM is a likelihood model, you can use information criteria - an advantage over k-means, where inertia always improves with k:

\[
\text{BIC} = -2\log \hat L + p\log n, \qquad \text{AIC} = -2\log\hat L + 2p
\]

Both penalize parameter count p; pick the K that minimizes them.

```python
[GaussianMixture(k).fit(X).bic(X) for k in range(2, 12)]
```

BIC penalizes complexity more heavily than AIC and usually gives the more conservative, more defensible answer.

---

### 6. What it is good and bad at

**Good**: elliptical clusters of different sizes and orientations; soft memberships; density estimation and anomaly detection via low likelihood; a principled criterion for K; sampling new data.

**Bad**: assumes Gaussian components, which is often wrong for skewed or heavy-tailed data; struggles in high dimensions with `full` covariance; sensitive to initialization; a component can collapse onto a single point and drive the likelihood to infinity (regularized in practice by `reg_covar`).

---

## What matters most

- **A GMM is k-means made probabilistic.** In fact k-means *is* a GMM with round, equal-sized components and hard assignments.
- **Soft assignment is the payoff.** A point that is 0.48 / 0.51 between two clusters is flagged as genuinely ambiguous, which a hard label hides.
- **It defines a probability density,** so unlike k-means it can score how likely a new point is - useful for anomaly detection - and generate new samples.
- **`covariance_type` is the capacity dial:** `full` fits ellipses at any angle but needs a lot of data; `diag` is the usual compromise in higher dimensions.
- **Because it is a likelihood model, BIC and AIC can choose the number of components** - a real advantage over k-means, where the objective always improves with more clusters.
- **EM converges only to a local optimum,** so initialization (usually from k-means) and restarts matter.

Next topic is **Choosing k and evaluating clusters**.
