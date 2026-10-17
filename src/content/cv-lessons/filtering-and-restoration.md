# 1.6 Filtering, frequency intuition, and image restoration

## 1. A filter combines neighbors

A **filter** computes a new pixel from a neighborhood.

Example: averaging [9, 10, 11] gives 10, reducing small fluctuations.

```text
nearby pixels → combine → new pixel
```

At a boundary, neighbors may belong to different surfaces.

> Smoothing reduces noise by mixing neighbors; it can also mix away detail.

## 2. Convolution and correlation

A **kernel** is a small grid of weights moved across the image. For image I and kernel K:

\[
(I*K)(x,y)=\sum_{u,v}K(u,v)I(x-u,y-v)
\]

- **Convolution:** flip the kernel.
- **Correlation:** use it directly.

Many “convolution” APIs compute correlation. A symmetric Gaussian gives the same result; an asymmetric derivative kernel may change sign.

Padding supplies missing border values. Zero padding can darken borders.

## 3. Choose a filter

| Filter | Useful for | Main cost |
|---|---|---|
| Gaussian: center-weighted average with bell-shaped spatial weights | Widespread fluctuations | Blurred edges |
| Median: neighborhood's middle sorted value | Isolated extreme pixels | Lost thin structures |
| Bilateral: weight by spatial distance and intensity similarity | Smooth within similar-intensity regions | More computation |
| Sharpening: boost rapid changes | Emphasize detail | Stronger noise / halos |

Example: [10,10,250,10,10] has **mean 58**, but **median 10**. Median rejects the isolated spike.

Gaussian **sigma** is the spatial standard deviation controlling the weight spread; larger sigma means broader smoothing.

## 4. Frequency intuition

- **Low-pass:** suppress rapid changes; Gaussian blur.
- **High-pass:** emphasize rapid changes; derivatives and sharpening.

Rapid changes include **edges, texture, and noise**.

Example: sharpening a compressed image can strengthen JPEG blocks along with real edges.

For ideal Gaussians, repeated smoothing adds their variances.

## 5. Sharpen by adding a residual

**Unsharp masking** is a sharpening method that adds a scaled **residual**, the difference between the original and blurred image:

\[
I_{\mathrm{sharp}}=I+\alpha(I-G(I))
\]

G is blur; alpha is strength.

Example: original 120, blurred 100, alpha 0.5 → **130**.

The residual also contains noise. Larger alpha can create halos.

## 6. Restoration is an inverse problem

An **inverse problem** estimates a hidden cause from its observed effect. Here, estimate a clean image from its blurred, noisy observation:

\[
Y=K*X+N
\]

Y is observed, X clean, K blur, N noise.

Deblurring tries to estimate X. Boosting frequencies suppressed by blur also boosts noise.

**Regularization** adds constraints or penalties to favor stable plausible solutions. A **prior** is an assumption about likely clean images; learned priors acquire those patterns from data. Learned priors can produce plausible detail that was not actually present.

## 7. Minimal filtering example

```python
smooth = cv2.GaussianBlur(image, (5, 5), sigmaX=1.0)
clean = cv2.medianBlur(image, 3)
```

Start with Gaussian for mild additive noise, median for impulse corruption. Compare with no filtering when tiny structures matter.

## 8. Interview reasoning

**Question:** Why can deblurring make an image noisier?

**Answer:** It amplifies weakened frequencies, including noise. Regularize the inverse and evaluate reliable task detail, not just apparent sharpness.
