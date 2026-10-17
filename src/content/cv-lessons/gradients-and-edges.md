# 2.1 Image gradients and edge detection

## 1. An edge is an intensity change

An **edge** is a sharp local change in image intensity. An **image gradient** measures the size and direction of that change.

Example: [20,20,180,180] contains a strong transition. A shadow can produce the same kind of response as an object boundary.

> Picture an edge as a steep slope in brightness.

## 2. Finite differences

A horizontal difference approximates a derivative:

\[
I_x(x,y)\approx I(x+1,y)-I(x,y)
\]

Horizontal and vertical derivatives give:

\[
M=\sqrt{I_x^2+I_y^2},\qquad
\theta=\operatorname{atan2}(I_y,I_x)
\]

Example: \(I_x=3,I_y=4\) → magnitude 5.

The gradient points **across** the edge, toward brighter values. These are image derivatives, separate from weight gradients during training.

## 3. Noise and scale

Noise also changes rapidly, so differentiation emphasizes it.

- Smooth first to suppress small fluctuations.
- Larger smoothing removes more texture.
- Too much smoothing merges nearby boundaries.

Example: two thin parallel lines may become one blurred band.

## 4. Canny edge detection

**Canny** is an edge-detection algorithm: it takes an intensity image and produces a **binary edge map**, marking selected boundary pixels as edges and the rest as non-edges. It aims to keep boundaries thin while rejecting noise.

```text
smooth → gradients → thin responses → hysteresis → binary edges
```

**Non-maximum suppression (thinning)** keeps a response only if its gradient magnitude is locally largest along the gradient direction. This narrows a broad response to a thin edge.

**Hysteresis thresholding** uses two cutoffs: accept strong responses, reject very weak ones, and retain intermediate responses only when linked to a strong edge through connected candidate pixels.

Example: with thresholds 50/150, response 100 survives when connected to a strong edge but is rejected when isolated.

```cv-visual
canny
```

## 5. Compare the tools

| Method | Output | Main limitation |
|---|---|---|
| Sobel: small weighted filters estimating horizontal/vertical intensity changes | First derivatives | Broad responses |
| Laplacian: sum of second spatial derivatives, measuring changes in the gradient | Second derivative | Noise sensitivity |
| Canny | Thin binary edges | Scale/threshold sensitivity |

A binary edge map discards magnitude and direction. Keep those measurements when later geometry needs them.

## 6. Practical use

```python
gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
gray = cv2.GaussianBlur(gray, (5, 5), sigmaX=1.0)
edges = cv2.Canny(gray, threshold1=50, threshold2=150, L2gradient=True)
```

L2gradient=True uses the Euclidean gradient magnitude defined above. Thresholds are illustrative. Test with the actual input range, lighting, and resolution.

## 7. Common failures

- Texture, shadows, reflections → unwanted edges.
- Low contrast, blur → missing boundaries.
- JPEG artifacts → artificial edges.

Inspect gradient magnitude before tuning the binary threshold.

## 8. Interview reasoning

**Question:** Why find wallpaper edges but miss an object?

**Answer:** Gradients measure contrast. Wallpaper may have stronger local changes than the object. Adjust capture/scale or add region and semantic evidence.
