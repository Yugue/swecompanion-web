## Part VII — Generative / Representation Models  
### Topic 1: Autoencoders

An **autoencoder** is a neural network trained to:

> **compress an input into a useful internal representation, then reconstruct the original input from that representation.**

The basic structure is:

```text
          Encoder             Decoder
x ─────────────────► z ─────────────────► x̂
input             latent                  reconstruction
                  representation
```

The training target is simply the input itself:

\[
\boxed{x \rightarrow \text{model} \rightarrow \hat{x}\approx x}
\]

So unlike classification:

```text
image → "cat"
```

an autoencoder learns:

```text
image → compressed representation → reconstructed image
```

### 1. Encoder

The **encoder** maps the high-dimensional input into a latent representation:

\[
z=f_\theta(x)
\]

For example:

```text
original image
28 × 28 = 784 numbers
        ↓
     Encoder
        ↓
z = 32 numbers
```

So:

\[
784\rightarrow32
\]

The vector \(z\) is often called the **latent representation**, **latent code**, or **bottleneck representation**.

The idea is:

> If the network must reconstruct 784 values using only 32 values, those 32 values should capture important structure in the input.

---

### 2. Decoder

The decoder tries to reconstruct the original input:

\[
\hat{x}=g_\phi(z)
\]

So overall:

\[
\boxed{
x
\xrightarrow{f_\theta}
z
\xrightarrow{g_\phi}
\hat{x}
}
\]

Example:

```text
784-dimensional image
        ↓
       256
        ↓
        32       ← bottleneck
        ↓
       256
        ↓
784-dimensional reconstructed image
```

The encoder compresses; the decoder expands.

---

## 3. How do we train it?

Suppose the original input is:

\[
x
\]

and reconstruction is:

\[
\hat{x}
\]

We minimize a **reconstruction loss**.

For continuous-valued data, a common choice is Mean Squared Error (MSE):

\[
L=\frac{1}{n}\sum_i(x_i-\hat{x}_i)^2
\]

Training looks like:

```text
x
│
▼
Encoder
│
▼
z
│
▼
Decoder
│
▼
x̂
│
▼
compare x̂ with x
│
▼
reconstruction loss
│
▼
backpropagation
```

Notice something interesting:

> We don't need a human to label the image.

The original \(x\) itself supplies the target.

---

## 4. Why doesn't it simply copy the input?

This is the important part.

Imagine:

\[
x\in\mathbb{R}^{1000}
\]

and:

\[
z\in\mathbb{R}^{20}
\]

The model has to pass everything through:

```text
1000 values
    ↓
 20 values
    ↓
1000 values
```

It cannot trivially preserve every input number.

So it is encouraged to learn a compressed representation of the important patterns.

For faces, \(z\) might implicitly capture things such as:

```text
face shape
hair
pose
lighting
expression
...
```

It isn't explicitly told what these concepts are; they emerge because they help reconstruction.

---

## 5. Mental model: lossy compression

Think of an autoencoder somewhat like learned JPEG compression:

```text
Raw image
   ↓
compress
   ↓
small representation
   ↓
decompress
   ↓
approximate image
```

But rather than humans designing the compression rules, the neural network learns them from data.

That's the main intuition.

---

## 6. Why is the bottleneck important?

Suppose instead:

\[
x\in\mathbb{R}^{100}
\]

and:

\[
z\in\mathbb{R}^{10,000}
\]

and the network has huge capacity.

Then it might learn something close to:

\[
\hat{x}=x
\]

without learning anything interesting.

Essentially:

```text
input
  │
  └──────── COPY ────────► output
```

Perfect reconstruction, useless representation.

So we usually impose some constraint:

\[
\boxed{\text{Don't let the model trivially learn identity.}}
\]

A small bottleneck is one way.

Other autoencoder variants impose different constraints, but we'll keep those separate for now.

---

# 7. Autoencoders learn representations

This connects directly to representation learning.

Suppose:

```text
image x
   ↓
Encoder
   ↓
latent z
```

Instead of using the decoder, we can sometimes take \(z\) and use it as features for another task:

```text
          ┌─► Decoder → reconstruct image
Encoder → z
          └─► Classifier → classify image
```

The hope is that \(z\) contains more useful structure than the raw input.

---

# 8. Dimensionality reduction

An autoencoder can perform nonlinear dimensionality reduction.

You've probably seen **Principal Component Analysis (PCA)**:

\[
1000D\rightarrow20D
\]

A basic linear autoencoder is closely related to PCA.

But neural autoencoders can use nonlinear functions:

```text
x
↓
Linear
↓
ReLU
↓
Linear
↓
z
```

and therefore potentially learn nonlinear structure.

Conceptually:

\[
\boxed{
\text{PCA: linear compression}
}
\]

versus:

\[
\boxed{
\text{autoencoder: potentially nonlinear learned compression}
}
\]

---

# 9. Denoising

A particularly intuitive use is denoising.

Instead of giving the model:

\[
x\rightarrow x
\]

we corrupt the input:

\[
\tilde{x}=x+\text{noise}
\]

and ask it to reconstruct clean \(x\):

```text
noisy image
    ↓
 Encoder
    ↓
    z
    ↓
 Decoder
    ↓
clean image
```

Training:

\[
\boxed{\tilde{x}\rightarrow x}
\]

Now the model cannot simply memorize every pixel—it needs to learn underlying structure.

This is called a **denoising autoencoder**.

---

# 10. Anomaly detection

Another useful application:

Suppose you train only on normal examples:

```text
normal
normal
normal
normal
        ↓
   Autoencoder
```

The model becomes good at reconstructing normal patterns.

At inference:

```text
normal input
→ good reconstruction
→ low reconstruction error
```

but:

```text
unusual input
→ poor reconstruction
→ high reconstruction error
```

So:

\[
\boxed{
\text{high reconstruction error}
\Rightarrow
\text{possibly anomalous}
}
\]

This can be useful for:

- manufacturing defects
- unusual network traffic
- sensor failures

though it is not guaranteed that every anomaly will reconstruct poorly.

---

# 11. Is an autoencoder generative?

This is an important distinction.

A plain autoencoder gives you latent representations:

\[
z=f(x)
\]

But suppose you generate a random vector:

\[
z_{\text{random}}
\]

and feed it into the decoder.

You might hope:

```text
random z
   ↓
decoder
   ↓
realistic new image
```

But ordinary autoencoders **do not guarantee that arbitrary points in latent space decode into meaningful samples**.

The encoder may create latent representations like:

```text
● ● ●

             ● ●

      ●
```

with empty regions between them.

Randomly sampling an empty region may produce garbage.

This limitation motivates the **Variational Autoencoder (VAE)**, which is the next topic in this chapter.

---

# 12. Autoencoder vs ordinary supervised network

Ordinary classifier:

```text
x → neural network → label y
```

Training requires:

\[
(x,y)
\]

Autoencoder:

```text
x → encoder → z → decoder → x̂
```

Target:

\[
x
\]

So training examples are essentially:

\[
(x,x)
\]

That's why autoencoders are commonly described as a form of **self-supervised representation learning**.

---

## Minimal PyTorch idea

The entire forward pass conceptually is:

```python
x_hat = decoder(encoder(x))
```

and training:

```python
loss = F.mse_loss(x_hat, x)
```

That's essentially the core of an autoencoder.

---

# Interview-level answer

If Google asks:

> What is an autoencoder?

A strong concise answer is:

> An autoencoder is a neural network trained to reconstruct its input. An encoder maps the input into a latent representation \(z\), usually under some bottleneck or other constraint, and a decoder reconstructs the original input from \(z\). The reconstruction objective encourages the latent representation to capture useful structure in the data. Autoencoders can be used for dimensionality reduction, representation learning, denoising, and anomaly detection. A standard autoencoder is not necessarily a good generative model because its latent space is not explicitly constrained to have a sampleable distribution.

The mental model to remember is:

```text
               COMPRESSION
                    ↓
x ─────► Encoder ──► z ──► Decoder ─────► x̂
                                         ↑
                              reconstruct original x
```

\[
\boxed{\text{Encoder learns: "What information do I need to keep?"}}
\]

\[
\boxed{\text{Decoder learns: "Can I reconstruct the input from it?"}}
\]

The next topic, **Variational Autoencoders (VAEs)**, modifies this idea so that the latent space becomes structured enough that we can actually **sample from it to generate new examples**.
