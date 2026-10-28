# How a neural network works

## 1. Compose learned operations

A **neural network** composes learned transformations. A **layer** transforms its input; a **hidden representation** is an intermediate feature vector. A multilayer perceptron, or **MLP**, stacks learned affine maps and nonlinear activations. An **affine map** is a linear transformation plus a bias.

Think of successive layers as recombining features rather than storing complete examples in individual neurons.

## 2. Compute a hidden layer

\[
h=\operatorname{ReLU}(Wx+b)
\]
x is a column input vector, W a learned matrix, b a learned bias, and h the hidden output. **ReLU** replaces negative coordinates with zero and preserves positive ones.

This column convention differs from the row convention in the tensor lesson; shapes reveal which convention is used.

## 3. Follow actual numbers

For column input x=[1,2], take W=[[-1,0],[1,1]] and b=[0,0]. Then Wx+b=[−1,3], and ReLU produces h=[0,3]. Each hidden coordinate is a **unit**, also called a neuron.

```genai-visual
neural-forward
```

The zero coordinate suppresses that feature for this input. It does not delete the corresponding parameter.

## 4. Understand nonlinearity

An **activation function** transforms coordinates between learned maps. Without a nonlinear activation, two affine layers combine into one affine layer.

ReLU and smooth alternatives let different inputs activate different transformations, enabling curved decision boundaries and richer representations.

## 5. Produce a task output

An **output head** maps hidden features to the required prediction. A language head produces one logit for each possible next text unit. An image model can instead output a grid of predicted noise values.

The output’s meaning determines its loss; not every head needs softmax.

## 6. Separate capacity from learning

**Capacity** is a model’s ability to represent varied mappings. Increasing width or depth can add capacity, but useful behavior still requires suitable data, objectives, and optimization.

A large network can fit an incorrect target perfectly. Verify what the labels and loss actually reward.
