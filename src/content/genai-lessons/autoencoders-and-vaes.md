# Autoencoders and variational autoencoders

## 1. Generate through a hidden representation

An **autoencoder** maps an example into a compressed representation and reconstructs it. Its **encoder** produces a latent code; its **decoder** maps that code back to observable data.

A **variational autoencoder (VAE)** instead learns a distribution over latent codes and regularizes it toward a chosen prior.

## 2. Separate the two distributions

A **prior** is the latent distribution used before observing an example, often a standard Gaussian. An **approximate posterior** \(q_\phi(z\mid x)\) estimates plausible latent values z after observing example x.

φ denotes encoder parameters. The decoder defines a conditional data model \(p_\theta(x\mid z)\), with parameters θ.

## 3. Sample while retaining gradients

\[
z=\mu_\phi(x)+\sigma_\phi(x)\odot\epsilon,\qquad \epsilon\sim\mathcal N(0,I)
\]
μ is latent mean, σ positive coordinatewise standard deviation, ε independent standard Gaussian noise, and ⊙ elementwise multiplication. I denotes independent, unit-variance Gaussian coordinates.

This **reparameterization** places randomness in ε while retaining gradients through μ and σ. For μ=1, σ=0.5, ε=−2, the sampled latent is z=0.

## 4. Balance reconstruction and regularity

\[
L=-\mathbb E_{z\sim q_\phi(z\mid x)}\log p_\theta(x\mid z)+\beta D_{KL}(q_\phi(z\mid x)\Vert p(z))
\]
p(z) is the prior; β controls regularization. At β=1, minimizing this loss maximizes the **evidence lower bound (ELBO)**, a computable lower bound on log probability of the observed example. Increasing β emphasizes prior compatibility and can reduce detail.

## 5. Follow training and generation

```genai-visual
vae-latent
```

During training, encode an observed image and reconstruct a sampled code. During generation, sample directly from the prior and decode. A plain autoencoder does not necessarily organize unused latent regions for such sampling.

## 6. Recognize failure modes

A very weak bottleneck may mostly copy inputs. Excessive regularization can erase information; **posterior collapse** occurs when the latent code carries little useful information about the example.

Inspect reconstruction, sampled outputs, and latent use separately. A good reconstruction alone does not establish a good generator.
