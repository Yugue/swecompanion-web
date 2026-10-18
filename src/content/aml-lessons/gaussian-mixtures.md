## Gaussian mixture models

## 1. Explain a cloud with overlapping components

A **Gaussian mixture model (GMM)** combines several Gaussian densities. A **Gaussian** is bell-shaped in one dimension and elliptical in several dimensions.

Each component has a center, spread, and weight. Membership can remain uncertain.

## 2. Add weighted densities

\[
p(x)=\sum_{j=1}^{K}\pi_j\mathcal N(x\mid\mu_j,\Sigma_j),\qquad \sum_j\pi_j=1
\]

\(x\) is an observation; \(K\) the component count; \(\pi_j\ge0\) its weight; \(\mu_j\) its mean; \(\Sigma_j\) its **covariance**, describing spread and directional relationships. \(\mathcal N\) denotes Gaussian density.

A density's height is not a point probability; probabilities integrate over regions.

```aml-visual
gaussian-mixture
```

## 3. Calculate soft membership

A **responsibility** is a component's conditional share at an observation:

\[
\gamma_{ij}=\frac{\pi_j\mathcal N(x_i\mid\mu_j,\Sigma_j)}{p(x_i)}
\]

\(\gamma_{ij}\) measures component \(j\)'s share for example \(i\). Values [0.5, 0.5] mean equally plausible fitted sources, not established real-world identities. A hard label hides that uncertainty.

## 4. Fit with alternating steps

**Expectation-maximization (EM)** alternates:

```text
E-step → compute responsibilities from current components
M-step → update weights, means, and spreads using those responsibilities
```

For example, a component mean becomes the responsibility-weighted average of observations. **Likelihood** measures how well a distribution accounts for the data. Exact EM updates do not decrease it, but can reach a local optimum.

## 5. Control flexibility

Spherical covariance gives round components; diagonal gives axis-aligned spreads; full covariance allows rotation. For \(d\) features, full covariance needs \(d(d+1)/2\) values per component.

Use restarts and covariance regularization to avoid poor starts or collapse onto one observation. **Akaike information criterion (AIC)** and **Bayesian information criterion (BIC)** compare likelihood with parameter-count penalties; lower is preferred under each criterion. Held-out likelihood and usefulness offer separate evidence.

## 6. Interview reasoning

**Question:** Why prefer soft assignments for overlapping groups?

**Answer:** They expose model-based ambiguity that a single cluster ID hides. They still depend on the fitted distribution and do not prove natural group identities.
