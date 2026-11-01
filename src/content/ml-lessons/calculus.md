# Calculus essentials

Calculus supplies the language for answering: **if a parameter changes slightly, how does the loss change?**

## 1. A derivative is a local slope

For f(x)=x², the derivative is f′(x)=2x. At x=3 the slope is 6: a small increase Δx changes f by approximately 6Δx.

Increasing x from 3 to 3.1 changes f by 0.61. The local estimate is 0.6; it becomes more accurate as the step shrinks.

```dl-visual
tangent
```

Picture a tangent touching a curved road. It describes the road's direction here, without describing every bend ahead.

## 2. A gradient collects partial derivatives

A **partial derivative** varies one input while holding the others fixed. For L(w,b)=(wx+b−y)², with x and y fixed:

\[
\frac{\partial L}{\partial w}=2(wx+b-y)x,
\qquad
\frac{\partial L}{\partial b}=2(wx+b-y)
\]

The **gradient** collects these sensitivities into a vector. A parameter tensor's gradient has the same shape as that tensor.

The gradient points toward steepest local increase under the ordinary Euclidean distance. Gradient descent takes a small step in the opposite direction; a large step can still increase the loss.

## 3. The chain rule connects operations

If z=2w and L=z², then:

\[
\frac{dL}{dw}=\frac{dL}{dz}\frac{dz}{dw}=(2z)(2)
\]

At w=3, z=6 and dL/dw=24. The intermediate z connects the two local slopes.

A neural network is a longer composition of operations. Backpropagation applies this same rule efficiently through its computation graph.

## 4. Vector outputs need a Jacobian

A **Jacobian** lists every output's derivative with respect to every input. It is useful notation for a layer with several outputs.

Training usually ends in a scalar loss. Automatic differentiation can propagate that loss's sensitivity backward through vector operations without constructing every full Jacobian. You need to understand the dependencies and shapes; the framework computes their derivatives.
