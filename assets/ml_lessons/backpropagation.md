## Backpropagation + Chain Rule

Backpropagation exists to answer one question:

> **Which weights caused the prediction error, and how should each weight change to reduce it?**

Forward propagation computes the prediction.  
Backpropagation computes the **gradients** of the loss with respect to every trainable parameter.

---

## 1. Start with the training loop

For a simple network:

\[
x \rightarrow \text{network} \rightarrow \hat y \rightarrow L
\]

Training does:

\[
\boxed{
\text{forward} \rightarrow \text{loss} \rightarrow \text{backprop} \rightarrow \text{update weights}
}
\]

```python
loss.backward()
```

`backward()` computes gradients. It does **not** update the weights.

The optimizer later does:

```python
optimizer.step()
```

---

# 2. Why we need derivatives

Suppose one weight is \(w\).

We want:

\[
\frac{\partial L}{\partial w}
\]

This tells us:

> If I increase \(w\) slightly, how does the loss change?

If:

\[
\frac{\partial L}{\partial w}=+3
\]

increasing \(w\) increases the loss, so gradient descent decreases \(w\).

If:

\[
\frac{\partial L}{\partial w}=-3
\]

increasing \(w\) decreases the loss, so gradient descent increases \(w\).

Update:

\[
w \leftarrow w-\eta\frac{\partial L}{\partial w}
\]

```python
w -= lr * w.grad
```

---

# 3. The chain rule is the core of backpropagation

Suppose:

\[
x \rightarrow z \rightarrow a \rightarrow L
\]

where:

\[
z=wx+b
\]

\[
a=ReLU(z)
\]

\[
L=(a-y)^2
\]

We want:

\[
\frac{\partial L}{\partial w}
\]

But \(L\) doesn't directly use \(w\). There are intermediate steps:

\[
w \rightarrow z \rightarrow a \rightarrow L
\]

The chain rule says:

\[
\boxed{
\frac{\partial L}{\partial w}
=
\frac{\partial L}{\partial a}
\frac{\partial a}{\partial z}
\frac{\partial z}{\partial w}
}
\]

That's backpropagation.

> Follow the computational path backward and multiply the local derivatives.

---

# 4. Concrete example

Take:

\[
x=2,\quad w=3,\quad b=1,\quad y=10
\]

### Forward pass

First:

\[
z=wx+b
\]

\[
z=3(2)+1=7
\]

ReLU:

\[
a=ReLU(7)=7
\]

Loss:

\[
L=(a-y)^2
\]

\[
L=(7-10)^2=9
\]

```python
loss = (torch.relu(w*x + b) - y)**2
```

Now we want to know how \(w\) contributed to that loss.

---

# 5. Work backward

### Step 1: loss → activation

\[
L=(a-y)^2
\]

Therefore:

\[
\frac{\partial L}{\partial a}=2(a-y)
\]

Here:

\[
2(7-10)=-6
\]

---

### Step 2: activation → \(z\)

Because:

\[
a=ReLU(z)
\]

and \(z=7>0\):

\[
\frac{\partial a}{\partial z}=1
\]

---

### Step 3: \(z\) → weight

\[
z=wx+b
\]

Therefore:

\[
\frac{\partial z}{\partial w}=x=2
\]

---

### Combine them

\[
\frac{\partial L}{\partial w}
=
(-6)(1)(2)
=-12
\]

So:

\[
\boxed{\frac{\partial L}{\partial w}=-12}
\]

What does that mean?

> Increasing \(w\) slightly would reduce the loss.

Gradient descent therefore does:

\[
w_{new}=w-\eta(-12)
\]

If:

\[
\eta=0.01
\]

then:

\[
w_{new}=3.12
\]

And that makes sense: our prediction was **7**, but the target was **10**, so increasing \(w\) pushes the prediction upward.

---

# 6. Backprop through an MLP

Now consider:

\[
z_1=W_1x+b_1
\]

\[
h=ReLU(z_1)
\]

\[
z_2=W_2h+b_2
\]

\[
L=\text{loss}(z_2,y)
\]

Forward direction:

\[
x
\rightarrow W_1
\rightarrow h
\rightarrow W_2
\rightarrow L
\]

Backprop goes in reverse:

\[
L
\rightarrow W_2
\rightarrow h
\rightarrow W_1
\]

To find the gradient for \(W_1\):

\[
\frac{\partial L}{\partial W_1}
=
\frac{\partial L}{\partial z_2}
\frac{\partial z_2}{\partial h}
\frac{\partial h}{\partial z_1}
\frac{\partial z_1}{\partial W_1}
\]

The same chain rule, just across more operations.

```python
loss.backward()  # computes gradients for W2, b2, W1, b1
```

---

# 7. Why it's called "backpropagation"

Because gradients are propagated **backward**.

Each layer receives:

> How much did my output affect the final loss?

Then it uses its local derivative to calculate:

1. gradients for its own parameters
2. gradient to send to the previous layer

Conceptually:

```text
Forward:
x → Layer 1 → Layer 2 → Loss

Backward:
x ← Layer 1 ← Layer 2 ← Loss
```

This lets a network with billions of parameters calculate all its gradients efficiently.

---

# 8. A very important insight: gradients are reused

Suppose:

\[
L \rightarrow z_3 \rightarrow z_2 \rightarrow z_1
\]

Once we calculate:

\[
\frac{\partial L}{\partial z_2}
\]

we reuse it when calculating earlier gradients.

We don't recompute the entire derivative independently for every weight.

That's why backprop is computationally efficient.

Think:

> **Dynamic programming for derivatives.**

---

# 9. What happens at branches?

Suppose one variable affects the loss through multiple paths:

\[
x \rightarrow a \rightarrow L
\]

and

\[
x \rightarrow b \rightarrow L
\]

Then:

\[
\frac{\partial L}{\partial x}
=
\frac{\partial L}{\partial a}
\frac{\partial a}{\partial x}
+
\frac{\partial L}{\partial b}
\frac{\partial b}{\partial x}
\]

So:

> **Multiply gradients along a path; add gradients from multiple paths.**

This becomes important in things like **residual connections**.

---

# 10. PyTorch autograd

PyTorch records the operations performed during the forward pass.

```python
y = model(x)
```

This builds a computational graph.

Then:

```python
loss.backward()
```

PyTorch walks that graph backward and calculates:

```python
parameter.grad
```

For example:

```python
print(layer.weight.grad)
```

### Important

PyTorch **accumulates** gradients.

So before another training iteration:

```python
optimizer.zero_grad()
```

Typical loop:

```python
optimizer.zero_grad(); loss.backward(); optimizer.step()
```

---

# 11. Why activation derivatives matter

Remember:

\[
\frac{\partial L}{\partial W_1}
=
\cdots
\frac{\partial h}{\partial z_1}
\cdots
\]

The activation derivative becomes part of the gradient chain.

This explains why sigmoid can cause trouble.

If each layer contributes something like:

\[
0.1
\]

then through 10 layers:

\[
0.1^{10}
\]

is tiny.

That's the **vanishing-gradient problem**.

ReLU helps because for positive inputs:

\[
ReLU'(x)=1
\]

So gradients can flow much more easily.

We'll study this deeply later.

---

# Practical mental model

Don't think of backprop as a giant formula.

Think:

### Forward

> What did every operation calculate?

### Backward

> How sensitive is the final loss to that operation?

At every node:

\[
\boxed{
\text{incoming gradient}
\times
\text{local derivative}
=
\text{outgoing gradient}
}
\]

That's essentially the whole algorithm.

---

## Rule of thumb for interviews

You should be able to draw:

\[
x \rightarrow z_1 \rightarrow ReLU \rightarrow z_2 \rightarrow L
\]

and explain how you calculate:

\[
\frac{\partial L}{\partial W_1}
\]

using the chain rule.

You **do not** need to manually derive backprop for a 100-layer Transformer.

What Google is much more likely to care about is whether you understand:

- why gradients are needed
- why backprop works
- how the chain rule connects layers
- why gradients can vanish/explode
- how autograd relates to backprop
- why gradients accumulate at branches

The core sentence to remember:

> **Backpropagation efficiently computes the gradient of the loss with respect to every parameter by applying the chain rule backward through the computational graph.**
