## Part III — Core Architectures  
### Topic 2: Receptive fields / stride / padding / pooling

The mental model is:

> A Convolutional Neural Network (CNN) repeatedly looks at **small local windows**, extracts features, and gradually lets deeper neurons “see” larger portions of the image.

The four ideas in this topic control **what each neuron sees** and **how the spatial size changes**.

---

## 1. Receptive field — “How much of the original image can this neuron see?”

Suppose we use a \(3\times3\) filter.

At the first convolutional layer, one output neuron sees only:

```text
Original image

. . . . . . .
. X X X . . .
. X X X . . .   ← one neuron sees this 3×3 region
. X X X . . .
. . . . . . .
```

So its receptive field is:

\[
3\times3
\]

But suppose we add another \(3\times3\) convolution.

A neuron in layer 2 looks at \(3\times3\) neurons from layer 1, and **each of those already looked at \(3\times3\) pixels**.

The effective receptive field becomes:

```text
Layer 1                 Layer 2

3×3 pixels              5×5 original pixels
┌─────┐                  ┌─────────┐
│ xxx │                  │ xxxxx   │
│ xxx │     →            │ xxxxx   │
│ xxx │                  │ xxxxx   │
└─────┘                  │ xxxxx   │
                         │ xxxxx   │
                         └─────────┘
```

For stride \(1\):

\[
3\times3
\rightarrow
5\times5
\rightarrow
7\times7
\rightarrow\cdots
\]

So stacking small convolutions gradually gives the network a larger view.

### Why this matters

Early neurons might see enough to detect:

> edge

Deeper neurons might see enough to detect:

> eye

Even deeper:

> face

So receptive field is one reason CNNs build hierarchical representations.

---

## 2. Stride — “How far does the filter jump?”

Normally:

\[
\text{stride}=1
\]

meaning move one pixel at a time.

```text
Stride = 1

[XXX] . . .
 . [XXX] . .
 . . [XXX] .
```

With:

\[
\text{stride}=2
\]

the filter jumps two pixels:

```text
Stride = 2

[XXX] . . . .
 . . [XXX] . .
 . . . . [XXX]
```

This means fewer filter positions → smaller output.

For example:

\[
7\times7 \text{ input}
\]

with \(3\times3\) kernel:

- stride 1 → \(5\times5\)
- stride 2 → \(3\times3\)

### Mental model

> **Stride controls spatial resolution.**

Larger stride:

\[
\text{smaller feature map}
\]

and less computation, but you may lose fine spatial information.

Typical:

- stride \(1\): preserve detail
- stride \(2\): downsample

```python
nn.Conv2d(64, 128, kernel_size=3, stride=2)
```

---

## 3. Padding — “What happens at the edges?”

Without padding, a \(3\times3\) filter can't center itself on the boundary pixels.

Example:

```text
Input: 5×5

x x x x x
x x x x x
x x x x x
x x x x x
x x x x x
```

A \(3\times3\) filter with stride 1 produces:

\[
3\times3
\]

So every convolution shrinks the image.

If we keep doing that:

\[
224\rightarrow222\rightarrow220\rightarrow218\rightarrow\cdots
\]

We may not want this.

### Padding adds pixels around the border

For \(p=1\):

```text
0 0 0 0 0 0 0
0 x x x x x 0
0 x x x x x 0
0 x x x x x 0
0 x x x x x 0
0 x x x x x 0
0 0 0 0 0 0 0
```

Now the \(3\times3\) filter can produce another \(5\times5\) feature map.

So:

\[
5\times5
\rightarrow
5\times5
\]

This is commonly called **same padding**.

For a \(3\times3\) kernel with stride 1:

\[
p=1
\]

is the common choice.

```python
nn.Conv2d(64, 64, kernel_size=3, padding=1)
```

### Why padding matters

It does two things:

- preserves spatial dimensions
- allows edge pixels to contribute more fairly

Without padding, boundary information disappears faster.

---

# 4. Output-size formula

This is very interview-relevant.

For one spatial dimension:

\[
\boxed{
O=
\left\lfloor
\frac{I+2P-K}{S}
\right\rfloor+1
}
\]

where:

- \(I\) = input size
- \(K\) = kernel size
- \(P\) = padding
- \(S\) = stride

Example:

\[
I=32,\ K=3,\ P=1,\ S=1
\]

Then:

\[
O=
\frac{32+2-3}{1}+1
=32
\]

So:

\[
32\times32
\rightarrow
32\times32
\]

Now stride 2:

\[
O=
\left\lfloor
\frac{32+2-3}{2}
\right\rfloor+1
\]

\[
=
\lfloor15.5\rfloor+1
=16
\]

So:

\[
32\times32
\rightarrow
16\times16
\]

This is why stride 2 is commonly used to roughly halve resolution.

---

# 5. Pooling — downsampling without learned weights

Pooling is another way to shrink feature maps.

### Max pooling

Take a small region:

```text
1  5
2  3
```

Max pooling outputs:

\[
5
\]

For a larger feature map:

```text
1  5 | 2  1
2  3 | 4  8
-----+-----
7  1 | 3  2
0  6 | 9  4
```

Using \(2\times2\) max pooling with stride 2:

```text
5  8
7  9
```

So:

\[
4\times4 \rightarrow 2\times2
\]

### Intuition

Max pooling asks:

> “Was this feature strongly detected somewhere in this region?”

It cares less about the exact pixel position.

```python
pool = nn.MaxPool2d(kernel_size=2, stride=2)
```

---

## Average pooling

Instead of maximum:

\[
\begin{bmatrix}
1&5\\
2&4
\end{bmatrix}
\]

becomes:

\[
\frac{1+5+2+4}{4}=3
\]

So it summarizes the average activation.

```python
pool = nn.AvgPool2d(kernel_size=2, stride=2)
```

---

# 6. Global average pooling

Modern CNNs often use **Global Average Pooling (GAP)** near the end.

Suppose one feature map is:

\[
7\times7
\]

GAP averages all 49 values:

\[
7\times7\rightarrow1
\]

If there are 512 channels:

\[
512\times7\times7
\rightarrow
512
\]

So every channel becomes one number.

This is often used before the final classifier.

```python
nn.AdaptiveAvgPool2d((1, 1))
```

It avoids needing a huge fully connected layer.

---

# Put everything together

Suppose:

\[
3\times224\times224
\]

RGB image.

We might do:

```text
Input
3 × 224 × 224
       │
       ▼
3×3 convolution
stride=1, padding=1
       │
       ▼
64 × 224 × 224
       │
       ▼
3×3 convolution
stride=2, padding=1
       │
       ▼
128 × 112 × 112
       │
       ▼
3×3 convolution
stride=2, padding=1
       │
       ▼
256 × 56 × 56
```

Notice what happens as the network gets deeper:

```text
Spatial resolution ↓
224 → 112 → 56

Channels ↑
3 → 64 → 128 → 256

Receptive field ↑
small → medium → large
```

That pattern is extremely common in CNNs.

---

## The mental picture to remember

Think of the network as progressively **zooming out conceptually**:

```text
Early layer
┌───┐
│edge│
└───┘

      ↓ larger receptive field

Middle layer
┌─────────┐
│ texture │
│ / shape │
└─────────┘

      ↓ larger receptive field

Deep layer
┌─────────────────┐
│ object / object │
│      part       │
└─────────────────┘
```

Meanwhile:

> **Padding** controls borders/size.  
> **Stride** controls how far we jump.  
> **Pooling** deliberately downsamples.  
> **Receptive field** tells us how much of the original input a neuron can use.

### Interview-level rule of thumb

For a typical CNN:

\[
\boxed{\text{3×3 kernel, stride 1, padding 1}}
\]

is a very common feature-extraction block because it preserves spatial size.

To downsample:

\[
\boxed{\text{stride 2}}
\]

or pooling.

And as layers accumulate:

\[
\boxed{\text{receptive field grows}}
\]

The next topic is **ResNet as a CNN architecture**. Since you've already learned residual connections, we won't repeat their mechanics—we'll focus specifically on **why ResNet changed CNN design and how a ResNet block is structured**.
