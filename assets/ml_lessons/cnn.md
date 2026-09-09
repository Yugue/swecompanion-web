## Part III — Core Architectures  
### Topic 24: Convolutional Neural Network (CNN) fundamentals

The reason **Convolutional Neural Networks (CNNs)** exist is that ordinary fully connected networks throw away an important property of images: **nearby pixels are related, and the same visual pattern can appear anywhere in the image**.

Suppose you have a \(224\times224\) RGB image. Flattening it gives:

\[
224\times224\times3 = 150{,}528
\]

input values. If the next fully connected layer had 1,000 neurons, you'd already need roughly **150 million weights**.

A CNN instead says:

> Rather than connecting every neuron to every pixel, look at a small local region and reuse the same detector everywhere.

That is the core idea.

---

### 1. The convolutional filter

Imagine this grayscale image:

\[
X =
\begin{bmatrix}
1&1&0&0\\
1&1&0&0\\
0&0&1&1\\
0&0&1&1
\end{bmatrix}
\]

A CNN might learn a small \(3\times3\) matrix called a **kernel/filter**:

\[
K =
\begin{bmatrix}
-1&0&1\\
-1&0&1\\
-1&0&1
\end{bmatrix}
\]

The filter slides across the image. At every position, we take the local pixels, multiply them element-by-element by the filter, and add them:

\[
z = \sum_{i,j} X_{i,j}K_{i,j}+b
\]

Then move the same filter somewhere else and repeat.

The important part is:

> **The exact same weights are reused across the entire image.**

This is called **weight sharing**.

So if that filter learns to detect a vertical edge, it can detect a vertical edge on the left, middle, or right side of the image.

---

### 2. What is the CNN actually learning?

The filter values are **parameters**, just like the weights in a normal neural network.

We do **not** manually specify:

> "This filter should detect edges."

Instead:

\[
\text{random filters}
\rightarrow
\text{forward pass}
\rightarrow
\text{loss}
\rightarrow
\text{backpropagation}
\rightarrow
\text{update filters}
\]

Eventually, useful filters emerge.

Early layers often learn simple patterns such as edges and textures. Deeper layers combine them into more complex patterns:

\[
\text{pixels}
\rightarrow
\text{edges}
\rightarrow
\text{textures/shapes}
\rightarrow
\text{object parts}
\rightarrow
\text{objects}
\]

This hierarchy is one of the central ideas behind CNNs.

---

### 3. One filter produces one feature map

Suppose the input is an image and we apply one filter.

We might get:

\[
\begin{bmatrix}
0.1&0.2&4.1\\
0.0&0.3&3.8\\
0.2&0.1&4.0
\end{bmatrix}
\]

This output is called a **feature map**.

Large values mean approximately:

> "The pattern this filter is looking for is strongly present here."

But we don't normally use just one filter.

Suppose a convolutional layer has **64 filters**. Each one learns something different.

Then:

\[
\text{input}
\rightarrow
64\text{ feature maps}
\]

That gives the output **64 channels**.

---

### 4. Channels are important

An RGB image has:

\[
3 \text{ channels}
\]

so its shape might be:

\[
3\times224\times224
\]

A convolutional layer might transform it into:

\[
64\times224\times224
\]

Now those 64 channels aren't colors anymore.

They are **64 learned feature representations**.

For example, conceptually:

\[
\text{channel 1} \approx \text{vertical edges}
\]

\[
\text{channel 2} \approx \text{horizontal edges}
\]

\[
\text{channel 3} \approx \text{texture}
\]

But real learned features are usually much harder to describe cleanly.

---

### 5. A filter looks through all input channels

This detail comes up frequently in interviews.

If your input has:

\[
C_{\text{in}}=3
\]

and your kernel spatial size is:

\[
3\times3
\]

then **one filter** actually has shape:

\[
3\times3\times3
\]

because it looks at all three input channels.

If we want 64 output channels, there are 64 such filters:

\[
64\times3\times3\times3
\]

So the number of weights is:

\[
64\times3\times3\times3=1728
\]

plus 64 biases.

Notice how small that is compared with millions of fully connected parameters.

---

## The three ideas you should associate with CNNs

1. **Local connectivity** — neurons only inspect a small spatial region rather than the entire image.
2. **Weight sharing** — the same filter is reused across different locations.
3. **Hierarchical features** — deeper layers combine simple patterns into increasingly complicated representations.

Those three ideas explain most of **why CNNs work well for images**.

---

### CNN layer mathematically

For output channel \(k\):

\[
Y_k = \sigma\left(\sum_c X_c * W_{k,c}+b_k\right)
\]

where \( * \) represents convolution and \(\sigma\) might be Rectified Linear Unit (ReLU).

Conceptually:

\[
\boxed{
\text{input feature maps}
\rightarrow
\text{convolution}
\rightarrow
\text{ReLU}
\rightarrow
\text{new feature maps}
}
\]

Then we repeat this many times.

Minimal PyTorch:

```python
conv = torch.nn.Conv2d(in_channels=3, out_channels=64, kernel_size=3)
```

That means:

> Take 3 input channels, learn 64 different \(3\times3\) filters, and produce 64 output feature maps.

---

### One important interview distinction

A CNN is **not inherently translation invariant**.

Convolution itself is approximately **translation equivariant**:

> If the object moves in the image, the resulting feature activation also moves.

Later operations and the architecture can make the final prediction more insensitive to exact position.

So a good interview statement is:

> **CNNs exploit spatial locality and weight sharing, allowing the same learned features to be detected at different positions with far fewer parameters than a fully connected network.**

That's the mental model I would lock in first.

The next topic is where this becomes much more concrete: **receptive fields, kernel size, stride, padding, and pooling**—especially calculating the output shape of a convolution.
