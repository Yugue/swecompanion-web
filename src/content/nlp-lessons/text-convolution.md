# Convolutional models for text

## 1. Reuse a local pattern detector

A **text convolution** applies the same learned filter to successive token-vector windows. Each filter can detect a local pattern wherever it occurs.

Neural implementations usually apply the weight window directly, technically cross-correlation rather than a flipped mathematical convolution.

## 2. Combine positions and coordinates

For sequence matrix \(X\), window length \(k\), and embedding width \(d\):

\[
r_t=b+\sum_{u=0}^{k-1}\sum_{j=1}^{d}F_{u,j}X_{t+u,j}
\]

\(F\) is one learned [k,d] filter, \(b\) its bias, and \(r_t\) its response at start position \(t\). Index \(u\) selects a window position and \(j\) a feature coordinate.

One response combines all coordinates in its window.

## 3. Slide one toy filter

```nlp-visual
text-convolution
```

The figure uses one feature per token and filter [1,−1]. The responses [−1,3,−1] become [0,3,0] after ReLU.

These values illustrate a numeric operation; they are not predefined sentiment scores for real words. Training determines useful filters.

## 4. Keep a strong response with pooling

**Max pooling** retains the largest response over selected positions. The toy sequence becomes one feature, 3.

Multiple filters produce multiple features. **Average pooling** instead summarizes average response and has a different sensitivity to repeated patterns.

Pooling can make a feature less dependent on exact location while discarding useful ordering and occurrence counts.

## 5. Account for dimensions and work

At stride one without padding, a sequence of \(T\ge k\) tokens produces \(T-k+1\) responses per filter.

With \(M\) filters, the layer has \(M(kd+1)\) parameters including biases. More sequence positions add response computation, not a separate weight set at each position.

**Stride** is the spacing between window starts. Padding adds boundary positions; exclude artificial or invalid windows from later summaries as needed.

## 6. Choose it for the right dependency

Convolution can efficiently learn local phrases and character patterns. One short window cannot directly connect widely separated tokens.

Stacking layers broadens the **receptive field**, the input region able to influence an output. Global pooling alone does not recover the order of distant pattern matches.

## 7. Interview reasoning

**Question:** How can a pooled text CNN detect a phrase anywhere but still miss who did what to whom?

**Answer:** Shared filters detect local patterns, while pooling can remove their locations. The final representation may omit the global relationships needed to distinguish reversed participants.
