# Neurons, activations, and the forward pass

## 1. Learn intermediate features

A **neural network** composes learned transformations. A **neuron** forms a weighted sum, optionally followed by a nonlinear function.

A **hidden layer** supplies intermediate features. A **multilayer perceptron (MLP)** stacks dense layers and activations.

## 2. Compute a dense layer

\[
z=Wx+b,\qquad h=\phi(z)
\]

\(x\): input; W: weights; b: offsets; z: pre-activation scores; phi: activation; h: hidden features.

A **dense layer** lets every output use every input coordinate. With d inputs and m outputs, W is [m,d].

## 3. Apply a nonlinearity

**ReLU**, rectified linear unit, maps z to max(0,z):

```text
x=[1,2], W=[[1,−1],[2,0]], b=[0,1]
z=[−1,3] → ReLU → h=[0,3]
```

ReLU itself is fixed. Training learns the surrounding weights and offsets.

## 4. Follow the forward pass

```nlp-visual
neural-forward
```

An **output head**, also called a task head, maps hidden features to required predictions: a document category or scores at each token.

The **forward pass** computes these values with current parameters; it does not update them.

## 5. Explain why depth needs activation

Without nonlinear activation:

\[
W_2(W_1x+b_1)+b_2=(W_2W_1)x+(W_2b_1+b_2)
\]

Subscripts identify layers. The composition is still one affine transformation: a matrix multiplication plus an offset.

Nonlinear activations enable relationships one weighted sum cannot express.

## 6. Preserve useful inputs

An MLP receiving identical bag-of-words vectors cannot distinguish their original word orders. More layers cannot recover information already discarded.

Use suitable input features as well as useful transformations.
