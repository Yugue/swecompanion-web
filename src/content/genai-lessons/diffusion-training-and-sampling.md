# Training and sampling diffusion models

## 1. Train a denoising predictor

A **noise-prediction objective** trains the denoiser to estimate the Gaussian perturbation used to create each noisy training state. A **sampler** converts successive predictions into a generated trajectory.

Training supplies a known noise target. During generation, the model must estimate that information from the current state and timestep.

## 2. Predict the injected noise

\[
L=\mathbb E_{x_0,t,\epsilon}\left[\|\epsilon-\epsilon_\theta(x_t,t)\|_2^2\right]
\]
\(x_0\) is clean data; t a sampled noise level; ε sampled noise; \(x_t\) their noisy mixture; \(\epsilon_\theta\) the network’s prediction. The squared norm sums coordinatewise prediction errors.

The chosen timestep distribution and loss weighting affect which noise levels receive emphasis.

## 3. Interpret a prediction

Rearrange the forward mixture to estimate clean data:
\[
\hat x_0=\frac{x_t-\sqrt{1-\bar\alpha_t}\,\hat\epsilon}{\sqrt{\bar\alpha_t}}
\]
x̂₀ is the clean estimate; ε̂ the predicted noise; require \(\bar\alpha_t\)>0. With \(\bar\alpha_t\)=0.36, noisy value 1.6 and noise prediction 0.5 recover 2.

```genai-visual
denoising-target
```

The sampler uses this information in its specified lower-noise transition. The clean estimate is not itself a guarantee that one update completes generation.

## 4. Compare sampling paths

**Denoising diffusion probabilistic model (DDPM) sampling** commonly uses stochastic reverse steps. **Denoising diffusion implicit model (DDIM) sampling** permits alternative trajectories, including deterministic sampling under its zero-noise setting.

Fewer network evaluations can reduce latency while changing discretization error and quality.

## 5. Choose a schedule

A **noise schedule** controls signal-to-noise levels during training. An **inference schedule** chooses the levels visited by the sampler. These related choices need compatible parameterization.

```python
noise = torch.randn_like(clean)
noisy = alpha_bar.sqrt() * clean + (1 - alpha_bar).sqrt() * noise
loss = (denoiser(noisy, timestep) - noise).square().mean()
```
This illustrates one training target, not a complete sampling loop.

## 6. Evaluate the operating point

Compare prompt adherence, detail, artifacts, and diversity at matched time or denoiser-call budgets. A faster scheduler is useful only if quality remains adequate.

Do not assume an arbitrary one-step replacement preserves a model trained for iterative denoising.
