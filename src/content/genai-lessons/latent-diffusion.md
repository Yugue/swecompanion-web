# Latent diffusion and denoiser architectures

## 1. Denoise a compressed representation

**Latent diffusion** runs a diffusion process in a learned image representation rather than directly on full-resolution pixels. An image encoder compresses the data; a decoder converts the generated latent representation back to an image.

Compression reduces spatial work but can discard details.

## 2. Separate the stages

```genai-visual
latent-diffusion
```

First obtain an image autoencoder. Then train a denoiser on its latent representations. During generation, denoise a latent noise tensor and decode it.

The autoencoder and denoiser need compatible latent scales and shapes.

## 3. Introduce convolution

A **convolution** slides a learned local filter over an array, applying the same weights at each location. A **feature map** records the filter’s response across positions.

The same filter can detect a pattern at several locations. **Stride** is the step between filter positions; image **padding** extends the array border. Multiple channels and layers combine different patterns.

```genai-visual
image-convolution
```

## 4. Understand a U-Net

A **U-Net** reduces spatial resolution through an encoder path, then restores it through a decoder path. Connections between matching resolutions carry fine spatial information around the bottleneck.

These encoder–decoder connections are separate from Transformer residual additions. Text conditioning may enter through attention layers.

## 5. Understand a diffusion Transformer

A **diffusion Transformer (DiT)** splits a noisy latent grid into **patches**, small rectangular regions, maps them to vectors, and uses Transformer blocks to predict denoising outputs.

Position signals preserve grid location. Timestep and text conditioning supply the generation context. Attention and patch size change compute and spatial detail.

## 6. Locate the bottleneck

If reconstructing a real image already destroys small writing, a better denoiser cannot fully repair that compression limit. Inspect autoencoder reconstruction separately from generated samples.

For latency, measure denoising steps and decoder time as well as latent dimensions. Compression is one part of total cost.
