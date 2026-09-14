# Calculus Essentials

For deep learning, calculus is mainly about **how changing a parameter changes the loss**.

## 1. Function

A function maps input to output:

\[
y=f(x)
\]

Example:

\[
f(x)=x^2
\]

```python
y = x**2
```

In ML:

\[
\hat y=f(x; \theta)
\]

where \(\theta\) are model parameters.

---

## 2. Derivative

A derivative tells you:

> If \(x\) changes a little, how much does \(y\) change?

For:

\[
f(x)=x^2
\]

\[
\frac{df}{dx}=2x
\]

At \(x=3\):

\[
\frac{df}{dx}=6
\]

```python
dy_dx = 2 * x
```

Intuition: the derivative is the **slope**.

---

## 3. Partial derivative

ML functions usually depend on many variables.

Example:

\[
f(x,y)=x^2+3y
\]

Partial derivative with respect to \(x\):

\[
\frac{\partial f}{\partial x}=2x
\]

With respect to \(y\):

\[
\frac{\partial f}{\partial y}=3
\]

```python
df_dx, df_dy = 2*x, 3
```

In neural networks, we calculate partial derivatives of loss with respect to every parameter:

\[
\frac{\partial L}{\partial w_i}
\]

---

# 4. Gradient

The **gradient** collects all partial derivatives into a vector.

If:

\[
f(x,y)=x^2+y^2
\]

then:

\[
\nabla f=
\begin{bmatrix}
2x\\
2y
\end{bmatrix}
\]

```python
grad = torch.tensor([2*x, 2*y])
```

The gradient points in the direction of **steepest increase**.

Therefore:

\[
-\nabla f
\]

points toward steepest decrease.

That is why gradient descent works.

---

# 5. Gradient descent

To minimize loss:

\[
\theta_{new}
=
\theta_{old}
-
\eta \nabla_\theta L
\]

where:

- \(\theta\) = parameters
- \(L\) = loss
- \(\eta\) = learning rate

```python
w = w - lr * w.grad
```

If the gradient says increasing \(w\) increases the loss, we move \(w\) downward.

---

# 6. Chain rule

This is the foundation of **backpropagation**.

Suppose:

\[
y=f(u)
\]

and:

\[
u=g(x)
\]

Then:

\[
\frac{dy}{dx}
=
\frac{dy}{du}
\frac{du}{dx}
\]

Example:

\[
y=(3x+1)^2
\]

Let:

\[
u=3x+1
\]

Then:

\[
\frac{dy}{du}=2u
\]

and:

\[
\frac{du}{dx}=3
\]

Therefore:

\[
\frac{dy}{dx}
=
2u\cdot3
=
6(3x+1)
\]

```python
dy_dx = 2 * (3*x + 1) * 3
```

A neural network is basically one giant composition of functions, so backprop repeatedly applies the chain rule.

---

# 7. Computational graph

Consider:

\[
z=wx+b
\]

\[
a=ReLU(z)
\]

\[
L=(a-y)^2
\]

The computation is:

\[
w \rightarrow z \rightarrow a \rightarrow L
\]

To calculate:

\[
\frac{\partial L}{\partial w}
\]

we use:

\[
\frac{\partial L}{\partial w}
=
\frac{\partial L}{\partial a}
\frac{\partial a}{\partial z}
\frac{\partial z}{\partial w}
\]

```python
loss.backward()
```

PyTorch automatically applies this chain rule through the computational graph.

---

# 8. Local gradients

Backprop works efficiently because every operation only needs its **local derivative**.

For multiplication:

\[
z=wx
\]

\[
\frac{\partial z}{\partial w}=x
\]

For addition:

\[
z=x+b
\]

\[
\frac{\partial z}{\partial b}=1
\]

For ReLU:

\[
ReLU(x)=\max(0,x)
\]

\[
\frac{d}{dx}ReLU(x)=
\begin{cases}
1 & x>0\\
0 & x<0
\end{cases}
\]

```python
grad_relu = (x > 0).float()
```

Backprop combines these local derivatives using the chain rule.

---

# 9. Jacobian

If a function outputs a vector instead of one scalar, derivatives form a **Jacobian matrix**.

If:

\[
y=f(x)
\]

where both \(x\) and \(y\) are vectors:

\[
J_{ij}
=
\frac{\partial y_i}{\partial x_j}
\]

```python
J = torch.autograd.functional.jacobian(f, x)
```

You mostly need the concept.

In deep learning, frameworks usually avoid explicitly building huge Jacobian matrices.

---

# 10. Why loss is usually scalar

A network might output millions of values, but training typically reduces everything to one scalar:

\[
L
\]

Then we calculate:

\[
\nabla_\theta L
\]

for every parameter.

```python
loss = criterion(pred, target)
```

This makes optimization conceptually simple:

> How should every parameter change to reduce this one number?

---

# 11. Higher-order derivatives

The second derivative measures how the slope itself changes:

\[
\frac{d^2f}{dx^2}
\]

This is related to **curvature**.

```python
second_derivative = torch.autograd.grad(first_derivative, x)
```

Useful in advanced optimization, but **low priority** for your interview.

You should know the intuition, not spend much time deriving Hessians.

---

# 12. Automatic differentiation

PyTorch tracks operations performed on tensors.

```python
x = torch.tensor(3.0, requires_grad=True)
```

Then:

```python
y = x**2
```

and:

```python
y.backward()
```

produces:

\[
x.grad=6
\]

because:

\[
\frac{d(x^2)}{dx}=2x=6
\]

The important idea:

> Autograd doesn't replace calculus. It automatically applies the calculus rules for you.

---

# What matters most

For neural networks, be very comfortable with:

1. **Derivative = local rate of change**
2. **Partial derivative = derivative with respect to one variable**
3. **Gradient = all partial derivatives**
4. **Negative gradient = direction to reduce loss**
5. **Chain rule = derivative through composed functions**
6. **Backprop = repeated chain rule**
7. **Autograd = automatic backprop computation**

The most important equation is:

\[
\boxed{
\theta
\leftarrow
\theta-\eta\nabla_\theta L
}
\]

and the most important calculus concept is:

\[
\boxed{
\frac{\partial L}{\partial x}
=
\frac{\partial L}{\partial y}
\frac{\partial y}{\partial x}
}
\]

If these are intuitive, you have enough calculus foundation to move into **Probability/Statistics essentials** and then neural networks.
