# How a neural network works

## 1. Compose learned operations

A **neural network** composes learned transformations. A **layer** transforms its input; a **hidden representation** is an intermediate feature vector. A multilayer perceptron, or **MLP**, stacks learned affine maps and nonlinear activations. An **affine map** is a linear transformation plus a bias.

Think of successive layers as recombining features rather than storing complete examples in individual neurons.

## 2. Compute a hidden layer

\[
h=\operatorname{ReLU}(Wx+b)
\]
In h = ReLU(Wx+b), x supplies input features, W and b are learned, and h is the hidden state. **ReLU** zeros negative coordinates.

This column convention differs from the row convention in the tensor lesson; shapes reveal which convention is used.

## 3. Follow actual numbers

The figure uses x=[1,2], W=[[-1,0],[1,1]], and zero bias: h=[0,3]. A hidden coordinate is a **unit**; zero activation does not delete it.

```genai-visual
neural-forward
```

The zero coordinate suppresses that feature for this input. It does not delete the corresponding parameter.

## 4. Understand nonlinearity

An **activation function** changes intermediate coordinates. Nonlinear choices let image or text features trigger different responses across inputs.

ReLU and smooth alternatives let different inputs activate different transformations, enabling curved decision boundaries and richer representations.

## 5. Produce a task output

An **output head** maps hidden features to the required prediction. A language head produces one logit for each possible next text unit. An image model can instead output a grid of predicted noise values.

The output’s meaning determines its loss; not every head needs softmax.

## 6. Separate capacity from learning

**Capacity** describes representable mappings. More capacity cannot recover a visual detail removed by preprocessing or correct contradictory targets.

A large network can fit an incorrect target perfectly. Verify what the labels and loss actually reward.

The same sequence of learned maps and nonlinear transformations can operate on text states or image features. What those states represent depends on the inputs and training objective, not the layer names alone.
