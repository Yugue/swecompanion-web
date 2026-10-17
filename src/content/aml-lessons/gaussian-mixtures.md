## Gaussian mixture models

A **Gaussian mixture model (GMM)** represents a data distribution as a weighted combination of Gaussian components. Each component has a center and a spread; a point can partly belong to several components.

## 1. Add distributions instead of drawing hard regions

\[
p(x)=\sum_{j=1}^{K}\pi_j\mathcal N(x\mid\mu_j,\Sigma_j),\qquad \sum_j\pi_j=1
\]

\(\pi_j\) is a nonnegative component weight, \(\mu_j\) its mean, and \(\Sigma_j\) its **covariance**, describing spread and relationships between feature directions. A Gaussian is a bell-shaped density in one dimension and an elliptical density in several dimensions.

```aml-visual
gaussian-mixture
```

A **density** is not an individual point's probability. Probabilities come from integrating density over a region.

## 2. Soft membership is conditional on the model

A **responsibility** is a component's share of the density at a point:

\[
\gamma_{ij}=\frac{\pi_j\mathcal N(x_i\mid\mu_j,\Sigma_j)}{\sum_l\pi_l\mathcal N(x_i\mid\mu_l,\Sigma_l)}
\]

A result [0.5, 0.5] means the two fitted components are equally plausible sources of that point. It does not establish two equally likely real-world customer identities.

Hard labels choose the largest responsibility and hide this ambiguity.

## 3. Expectation-maximization fits the components

**Expectation-maximization (EM)** alternates two steps:

```text
E-step: compute responsibilities from current components
M-step: update weights, means, and covariances using those responsibilities
```

Exact EM updates do not decrease likelihood, but do not guarantee a global optimum. Try suitable initialization and restarts. Covariance regularization helps prevent a component collapsing onto one observation with vanishing spread.

**Likelihood** measures how well the fitted distribution accounts for the observed data.

## 4. Choose flexibility and component count

Spherical covariance allows round components. Diagonal covariance allows axis-aligned spreads. Full covariance allows rotated ellipses but needs \(d(d+1)/2\) covariance parameters per component in \(d\) dimensions.

```python
GaussianMixture(n_components=2, covariance_type="full", n_init=5)
```

The **Bayesian information criterion (BIC)** and **Akaike information criterion (AIC)** compare fit with a parameter-count penalty; lower is preferred under the criterion. Held-out likelihood and downstream usefulness provide other evidence. None proves components are natural semantic groups.

k-means is closely related to a small-variance limit with equal spherical components and hard assignments. Ordinary soft GMM fitting is not simply identical to k-means.

> **Mental image:** overlapping transparent hills explain the cloud. Responsibilities say how much each hill contributes at one location.
