# Diffusion models

## 1. Learn to reverse corruption

A **diffusion model** generates data by learning to undo progressive corruption. A forward process adds known noise to training examples; a learned reverse process transforms noise into a sample through multiple steps.

The reverse model learns statistical structure, not the exact history of one unseen clean image.

## 2. Represent an image numerically

An image is a tensor of pixel intensities, often [height,width,channels]. Three color channels can encode red, green, and blue. Normalize values consistently before adding noise.

Noise adds random perturbations to these coordinates. Strong noise eventually obscures visible image structure.

## 3. Sample a noisy training state

\[
x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\epsilon
\]
\(x_0\) is clean data; ε standard Gaussian noise of matching shape; t a noise level; \(\bar\alpha_t\) the cumulative signal-retention factor. Smaller \(\bar\alpha_t\) leaves less original signal and more noise.

## 4. See both directions

```genai-visual
diffusion-path
```

Training can construct \(x_t\) directly from \(x_0\) at a sampled t. It need not simulate every earlier corruption step.

Generation instead starts near pure Gaussian noise and applies learned reverse transitions.

## 5. Condition the denoiser

A **denoiser** predicts noise or clean-data information from a noisy state. It receives the state and noise level; it can also receive text or other conditions.

The same grid requires different corrections at different noise levels. The timestep tells the network how to interpret the visible corruption.

## 6. Use seeds to diagnose variation

A random **seed** initializes the pseudorandom generator. With the same configuration, it can help reproduce a starting noise realization; different numerical implementations can still differ.

Changing the seed explores alternative samples. It does not strengthen a model’s prompt understanding. If every seed misses the same requested object, inspect conditioning and model capability rather than only sampling more images.
