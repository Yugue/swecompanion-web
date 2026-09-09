## Neuron → MLP

The key idea is simple:

> A neuron computes a weighted sum of inputs, adds a bias, then usually applies a nonlinear activation.

### 1. Single neuron

Suppose the input is:

\[
x = [x_1, x_2, x_3]
\]

A neuron has weights:

\[
w = [w_1, w_2, w_3]
\]

and bias \(b\).

It computes:

\[
z = w^T x + b
\]

then:

\[
a = f(z)
\]

where \(f\) is an activation function.

In PyTorch:

```python
a = torch.relu(w @ x + b)
```

### Intuition

Each weight says:

> How much should this input feature matter?

Positive weight:
- increasing that feature tends to increase the neuron's output

Negative weight:
- increasing that feature tends to decrease it

Large magnitude:
- strong influence

Bias shifts the threshold.

---

## 2. Why the bias matters

Without bias:

\[
z = w^Tx
\]

the decision boundary must pass through the origin.

With bias:

\[
z = w^Tx+b
\]

the model can shift that boundary.

Simple analogy:

\[
y = mx+b
\]

The bias in a neuron plays the same role as the intercept \(b\).

Rule of thumb:

> Almost every standard linear layer includes a bias unless normalization or architecture design makes it unnecessary.

```python
layer = nn.Linear(128, 64, bias=True)
```

---

# 3. From one neuron to a layer

One neuron produces one scalar.

If you want 256 neurons, stack their weight vectors into a matrix:

\[
W \in \mathbb{R}^{256 \times 128}
\]

For:

\[
x \in \mathbb{R}^{128}
\]

the whole layer computes:

\[
z = Wx+b
\]

giving:

\[
z \in \mathbb{R}^{256}
\]

Then apply the activation element-wise:

\[
a = ReLU(z)
\]

```python
a = torch.relu(W @ x + b)
```

So a neural-network layer is basically:

> many neurons operating in parallel.

---

# 4. MLP

An **MLP — multilayer perceptron** — is just multiple fully connected layers stacked together.

For example:

\[
x
\rightarrow
W_1x+b_1
\rightarrow ReLU
\rightarrow
W_2h+b_2
\rightarrow output
\]

Mathematically:

\[
h = ReLU(W_1x+b_1)
\]

\[
y = W_2h+b_2
\]

```python
y = layer2(torch.relu(layer1(x)))
```

A basic PyTorch version:

```python
mlp = nn.Sequential(nn.Linear(128, 256), nn.ReLU(), nn.Linear(256, 10))
```

---

# 5. What the hidden layer is actually doing

This is more important than memorizing the equation.

Suppose the raw input has 128 features.

The first layer transforms:

\[
128 \rightarrow 256
\]

Those 256 values are not necessarily directly interpretable.

They are **learned features**.

The network is learning:

> What intermediate representation makes the final prediction easier?

This is **representation learning**.

For images, earlier layers might learn:
- edges
- textures

Later layers might learn:
- shapes
- object parts

For language:
- lexical patterns
- syntax
- semantic concepts

The power of neural networks largely comes from learning these intermediate representations automatically.

---

# 6. Why nonlinear activations are essential

Suppose you stack two layers without activation:

\[
y = W_2(W_1x)
\]

Then:

\[
y = (W_2W_1)x
\]

Let:

\[
W_3 = W_2W_1
\]

So:

\[
y=W_3x
\]

You could replace the entire deep network with **one linear layer**.

That's why:

> Stacking linear layers without nonlinear activations gives you no extra expressive power.

Adding ReLU:

\[
y=W_2ReLU(W_1x)
\]

breaks that collapse.

```python
h = torch.relu(layer1(x))
```

This is one of the most fundamental neural-network concepts.

---

# 7. Width vs depth

### Width
Number of neurons in a layer.

Example:

```text
128 → 1024 → 10
```

The hidden layer has width 1024.

### Depth
Number of layers.

Example:

```text
128 → 512 → 256 → 128 → 10
```

is deeper.

### Intuition

More width:
- more capacity within a stage

More depth:
- lets the model build hierarchical/compositional features

In practice, deeper networks often represent complex functions more efficiently than extremely wide shallow ones.

But deeper networks are harder to train, which leads later to:
- initialization
- normalization
- residual connections

---

# 8. How many parameters?

Suppose:

```text
128 → 256
```

Weight matrix:

\[
128 \times 256
\]

plus 256 biases.

Total:

\[
128(256)+256
=33024
\]

```python
params = 128 * 256 + 256
```

Rule:

For a dense layer:

\[
\boxed{n_{in}n_{out}+n_{out}}
\]

This matters because large fully connected layers can become expensive very quickly.

---

# 9. Output layer depends on the task

The hidden layers build representations.

The **output layer** depends on what you're predicting.

### Binary classification

Usually one logit:

```python
logit = nn.Linear(hidden_dim, 1)(h)
```

Then use binary cross entropy with logits.

### Multiclass classification

If there are 10 classes:

```python
logits = nn.Linear(hidden_dim, 10)(h)
```

One score per class.

### Regression

Usually one or several continuous outputs:

```python
prediction = nn.Linear(hidden_dim, 1)(h)
```

Important rule:

> The output layer should match the target structure.

---

# 10. Practical rules of thumb

For a plain MLP:

### Hidden width
A reasonable starting point for small tabular/simple problems might be:

```text
64–512 hidden units
```

There is no universal correct value.

Start simple and increase capacity only if the model is underfitting.

### Number of hidden layers
For simple problems:

```text
1–3 hidden layers
```

is often enough.

For modern large models, architectures can be much deeper, but that's a different regime.

### Activation
Default:

```text
ReLU
```

For Transformers:

```text
GELU
```

is common.

We'll cover activations separately.

---

# 11. What can go wrong?

### Too little capacity

Training loss remains high.

Likely:

> underfitting

Possible fix:
- wider/deeper model
- better features
- train longer

### Too much capacity

Training performs extremely well, validation poorly.

Likely:

> overfitting

Possible fix:
- regularization
- more data
- smaller model
- dropout

### No nonlinearity

Multiple layers effectively collapse into one linear transformation.

### Extremely deep plain MLP

Can become difficult to optimize because of poor gradient flow.

We'll later solve that with techniques like residual connections.

---

# The mental model

Think of an MLP as repeated:

\[
\boxed{
\text{transform} \rightarrow \text{nonlinearity}
}
\]

For example:

\[
x
\xrightarrow{W_1x+b_1}
z_1
\xrightarrow{ReLU}
h_1
\xrightarrow{W_2h_1+b_2}
z_2
\xrightarrow{ReLU}
h_2
\xrightarrow{W_3h_2+b_3}
y
\]

Each layer builds a new representation from the previous one.

The three things you should deeply understand here are:

1. **A neuron = weighted sum + bias + activation**
2. **A layer = many neurons in parallel**
3. **An MLP = stacked layers that learn increasingly useful representations**

And the most important conceptual point:

> **Without nonlinear activation functions, a deep MLP is still just a linear model.**

Next topic should be **Activation functions**, because that's the missing piece that gives MLPs their expressive power.
