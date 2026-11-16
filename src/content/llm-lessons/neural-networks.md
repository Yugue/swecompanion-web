# How a neural network works

## 1. Compose learned operations

A **layer** transforms inputs. An **MLP** (multilayer perceptron) stacks **affine maps**—linear transforms plus biases—with nonlinear activations.

Picture each layer recombining features rather than individual neurons storing complete examples.

## 2. Compute a hidden layer

\[
h=\operatorname{ReLU}(Wx+b)
\]

x is a column input vector, W a learned matrix, b a learned bias, and h the hidden output. **ReLU** replaces negative coordinates with zero and preserves positive ones.

This lesson uses column vectors; implementations may use row vectors and transpose the weight matrix.

## 3. Follow actual numbers

For column input x=[1,2], take W=[[-1,0],[1,1]] and b=[0,0]. Then Wx+b=[−1,3], and ReLU produces h=[0,3]. Each hidden coordinate is a **unit**, also called a neuron.

```genai-visual
neural-forward
```

The zero coordinate suppresses that feature for this input. It does not delete the corresponding parameter.

## 4. Understand nonlinearity

An **activation function** transforms coordinates between maps. Without a nonlinear activation, stacked affine layers collapse into one affine map.

Nonlinearity lets inputs activate different feature combinations.

## 5. Produce a task output

A language head produces one logit for each possible next text unit. For next-token prediction, its output width equals the tokenizer’s vocabulary size.

The output’s meaning determines its loss; not every head needs softmax.

## 6. Separate capacity from learning

**Capacity** is the range of mappings a model can represent. More width or depth can add capacity, but cannot fix incorrect targets.

> **Reason it through:** What changes in expressiveness if you remove every activation between the learned affine maps?
