## Part III — Core Architectures  
### Topic 3: ResNet as a CNN architecture

You already know how residual connections work, so here the important question is:

> **How did ResNet use residual connections to make very deep CNNs trainable?**

---

## 1. The problem ResNet was solving

Before ResNet, researchers noticed something surprising.

You might expect:

\[
20\text{-layer CNN}
<
50\text{-layer CNN}
<
100\text{-layer CNN}
\]

because deeper networks have more capacity.

But in practice, simply stacking more convolutional layers could make **training accuracy itself get worse**.

This wasn't just overfitting.

The deeper network could actually become **harder to optimize**.

So the problem was:

> How can we make a CNN hundreds of layers deep without making optimization progressively harder?

ResNet = **Residual Network**.

Its answer was:

> Don't force every block to learn an entirely new representation. Let it learn a **correction** to the existing representation.

---

# 2. Ordinary CNN block vs ResNet block

An ordinary block essentially does:

```text
x
│
▼
Conv
│
ReLU
│
Conv
│
▼
F(x)
```

The network must learn:

\[
x \rightarrow F(x)
\]

A ResNet block instead does:

```text
                 ┌─────────────────────┐
                 │                     │
                 │       shortcut      │
                 │                     ▼
x ──► Conv ──► ReLU ──► Conv ──►  +  ──► ReLU
│                                  ▲
└──────────────────────────────────┘
```

So the output is:

\[
y = x + F(x)
\]

You've already learned why this helps gradients.

The architectural insight is:

> Each block can keep the existing representation \(x\), and only learn what needs to change.

---

# 3. Think of a ResNet as progressive refinement

This is the best mental picture.

Suppose an earlier layer already represents:

```text
"Looks somewhat like a dog"
```

An ordinary CNN layer may have to construct the next representation from scratch.

A residual block instead learns something conceptually like:

```text
Current representation:
"animal + fur + four legs"

            +

Residual learned by next block:
"pointy ears + dog-like face"

            ↓

Better representation:
"probably a dog"
```

The residual branch \(F(x)\) is therefore like:

> **What correction should I make to what I already know?**

That makes very deep networks easier to optimize.

---

# 4. A basic ResNet block

For something like ResNet-18 or ResNet-34, a block commonly looks approximately like:

```text
                x
                │
        ┌───────┴─────────┐
        │                 │
        │             shortcut
        │                 │
        ▼                 │
      3×3 Conv            │
        │                 │
   BatchNorm              │
        │                 │
      ReLU                │
        │                 │
      3×3 Conv            │
        │                 │
   BatchNorm              │
        │                 │
        └──────►  +  ◄────┘
                  │
                ReLU
```

The important feature isn't the exact ordering.

It's:

\[
\boxed{\text{convolutions} + \text{identity shortcut}}
\]

---

# 5. But what if the shapes don't match?

This is important.

Suppose:

\[
x:
64\times56\times56
\]

but the residual branch produces:

\[
F(x):
128\times28\times28
\]

We cannot do:

\[
x+F(x)
\]

because their shapes differ.

So ResNet can transform the shortcut:

```text
                 x
                 │
        ┌────────┴─────────┐
        │                  │
        ▼                  ▼
     Conv layers        1×1 Conv
        │              stride = 2
        ▼                  │
     F(x)             projected x
        │                  │
        └────────► + ◄─────┘
```

Now both might be:

\[
128\times28\times28
\]

and can be added.

This is called a **projection shortcut**.

Usually a \(1\times1\) convolution is used because it can efficiently change the number of channels.

---

# 6. Why \(1\times1\) convolution?

A \(1\times1\) convolution sounds strange because it doesn't inspect neighboring pixels.

But it can combine/change the **channels**.

Suppose one location contains:

\[
64 \text{ features}
\]

A \(1\times1\) convolution can transform those into:

\[
128 \text{ features}
\]

at the same spatial location.

So:

\[
64\times H\times W
\rightarrow
128\times H\times W
\]

Minimal PyTorch:

```python
nn.Conv2d(64, 128, kernel_size=1)
```

Think:

> **3×3 convolution mixes spatial + channel information.**  
> **1×1 convolution mainly mixes channel information.**

---

# 7. ResNet architecture gets deeper while shrinking spatial size

A typical ResNet roughly follows:

```text
Input
3 × 224 × 224
      │
      ▼
Initial convolution
      │
      ▼
64 × 56 × 56
      │
      ▼
Residual blocks
64 × 56 × 56
      │
      ▼
Residual blocks
128 × 28 × 28
      │
      ▼
Residual blocks
256 × 14 × 14
      │
      ▼
Residual blocks
512 × 7 × 7
      │
      ▼
Global Average Pooling
      │
      ▼
512
      │
      ▼
Classifier
```

Notice the CNN pattern from the previous topic:

\[
\text{spatial resolution}\downarrow
\]

\[
\text{channels}\uparrow
\]

\[
\text{receptive field}\uparrow
\]

ResNet doesn't replace normal CNN ideas.

It builds **residual blocks on top of them**.

---

# 8. ResNet-18 vs ResNet-50

You don't need to memorize every architecture, but know this distinction.

### ResNet-18 / ResNet-34

Usually use **basic blocks**:

\[
3\times3
\rightarrow
3\times3
\]

### ResNet-50 / 101 / 152

Usually use a **bottleneck block**:

\[
1\times1
\rightarrow
3\times3
\rightarrow
1\times1
\]

Mental picture:

```text
many channels
     │
     ▼
1×1: compress channels
     │
     ▼
3×3: spatial processing
     │
     ▼
1×1: expand channels
```

Why?

A \(3\times3\) convolution over hundreds of channels is expensive.

So:

> shrink channels → expensive spatial convolution → expand again

This lets ResNet become very deep without exploding computation.

---

# 9. Don't confuse two meanings of “deep”

A deeper ResNet doesn't mean each convolution sees a larger kernel.

We still commonly use:

\[
3\times3
\]

Instead, we stack many small convolutions:

```text
3×3 → 3×3 → 3×3 → 3×3 → ...
```

As you learned previously, the **receptive field grows through depth**.

So deeper ResNet blocks progressively build larger and more abstract features.

---

## What you should know for an interview

If someone asks:

> Why was ResNet important?

A strong answer is:

> ResNet introduced residual blocks where a block learns \(F(x)\) and outputs \(x+F(x)\). The identity shortcut provides an easy path for information and gradients and allows blocks to learn corrections rather than completely new representations. This made much deeper CNNs significantly easier to optimize.

If they ask:

> What happens when dimensions change?

Answer:

> Use a projection shortcut, commonly a \(1\times1\) convolution, possibly with stride 2, so the shortcut and residual branch have compatible shapes.

And the architecture mental model is simply:

\[
\boxed{
\text{CNN}
+
\text{residual blocks}
=
\text{ResNet}
}
\]

We don't need to spend more time on the residual-gradient derivation because you already covered it in Part II.

**Next topic: Recurrent Neural Network (RNN) fundamentals.** That's a genuinely different architecture: instead of spatial structure in images, we'll start exploiting **order and history in sequences**.
