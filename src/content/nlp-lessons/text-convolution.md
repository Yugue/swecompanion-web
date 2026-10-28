# Convolutional models for text

## 1. Reuse a local detector

A **text convolution** applies one learned filter to successive token-vector windows. The same pattern can trigger at different positions.

Neural implementations usually use **cross-correlation**: applying weights directly rather than flipping a mathematical convolution kernel.

## 2. Combine local positions and features

\[
r_t=b+\sum_{u=0}^{k-1}\sum_{j=1}^{d}F_{u,j}X_{t+u,j}
\]

X is the sequence; F a [k,d] filter; k window length; d feature width; b bias; r_t response at start t. Indices u,j select window position and coordinate.

## 3. Slide a toy filter

```nlp-visual
text-convolution
```

Scalar inputs [1,2,−1,0], filter [1,−1] → responses [−1,3,−1] → ReLU [0,3,0].

The numbers illustrate shared computation, not predefined word meanings.

## 4. Pool responses

**Max pooling** retains the largest selected response: here 3. **Average pooling** retains the mean instead.

Multiple filters yield multiple features. Pooling can reduce sensitivity to exact location while losing ordering or occurrence information.

## 5. Count dimensions and weights

**Stride** is the spacing between starts. At stride one without padding, T≥k tokens yield T−k+1 responses per filter.

M filters contain M(kd+1) parameters including biases. More positions add computation, not independent weights.

Padding adds boundary positions; exclude invalid windows from summaries when needed.

## 6. Match the dependency

Short filters suit local phrases and character patterns. Stacked layers expand the **receptive field**, the input region influencing an output.

Global pooling alone cannot restore the order of distant matches.
