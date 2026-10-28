# Vectors, matrices, and tensors

## 1. Represent quantities

A **vector** is an ordered list of numbers. A **matrix** is a rectangular array. A **tensor** generalizes arrays to any number of axes. Their **shape** lists the size of each axis.

A **feature** is a measured or learned attribute. A **batch** is a group of examples processed together. Three examples with four features have shape [3,4].

## 2. Multiply compatible shapes

A learned map combines input coordinates with weights and a bias:
\[
y=xW+b
\]
For a row vector x of width d, W has shape [d,h], bias b has width h, and output y has width h. Each output coordinate is a weighted sum plus its bias.

## 3. Calculate one result

With x=[1,2], W=[[1,0],[0,3]], and b=[0,1], the output is [1,7]. Changing the second input affects the second output through weight 3.

For a batch, [B,d] multiplied by [d,h] gives [B,h]. B is the number of examples.

## 4. Compare vectors

The **dot product** sums coordinatewise products. For [1,1] and [2,2], it is 4.

A vector’s **norm** measures its length. **Cosine similarity** divides a dot product by both lengths: these vectors have cosine 1 because their directions match. Cosine requires nonzero vectors.

```genai-visual
vectors
```

## 5. Track sequence shapes

A sequence batch often has shape [B,T,d]: examples, positions, and features. A learned map [d,h] changes feature width while retaining B and T.

A **transpose** exchanges axes. It changes how coordinates are arranged, not their numerical values.

## 6. Avoid silent mistakes

**Broadcasting** repeats compatible smaller arrays across larger shapes. Adding a width-h bias to every row is useful broadcasting; accidentally mixing examples is not.

Check semantic axis names as well as numerical sizes. Equal-sized axes can still represent different things.
