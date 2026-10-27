# Neurons, activations, and the forward pass

## 1. Learn intermediate features

A **neural network** composes learned transformations of an input. A **neuron** computes a weighted combination followed by an optional nonlinear function.

A **hidden layer** produces intermediate features rather than the final task answer. A **multilayer perceptron (MLP)** stacks dense layers and activations.

## 2. Compute a dense layer

\[
z=Wx+b,\qquad h=\phi(z)
\]

\(x\) is an input vector; \(W\) learned weights; \(b\) learned offsets; \(z\) pre-activation scores; \(\phi\) an activation applied coordinate by coordinate; \(h\) the hidden output.

With \(d\) inputs and \(m\) outputs, \(W\) has shape [m,d]. A **dense layer** allows every output to use every input coordinate.

## 3. Add a nonlinearity

**ReLU**, rectified linear unit, maps a scalar to \(\max(0,z)\).

```text
x=[1,2], W=[[1,−1],[2,0]], b=[0,1]
z=[−1,3]
h=ReLU(z)=[0,3]
```

The negative coordinate is suppressed while the positive one survives. Other activations have different shapes and gradient behavior.

## 4. Follow the complete path

```nlp-visual
neural-forward
```

A **task head** maps learned features to the required output scores: one score for a binary task, several competing class scores, or scores at every token position.

The **forward pass** computes those values using the current parameters. It does not itself change them.

## 5. See why stacking linear maps is insufficient

Two linear layers without a nonlinearity compose into another linear map:

\[
W_2(W_1x+b_1)+b_2=(W_2W_1)x+(W_2b_1+b_2)
\]

Subscripts 1 and 2 identify successive layers. Learned nonlinearities between layers let the composition express relationships that one weighted sum cannot.

## 6. Match the representation to the task

A network can combine features nonlinearly, but cannot recover distinctions entirely absent from its input. Identical bag-of-words vectors remain identical inputs even to a large MLP.

Training chooses parameters; inference applies them. Some layers, such as dropout, also change behavior between training and evaluation modes, so use the appropriate mode.

## 7. Interview reasoning

**Question:** Does adding ten dense layers guarantee sensitivity to word order?

**Answer:** No. Order must be represented in the inputs or computation. Depth adds transformations, not information that the representation has already discarded.
