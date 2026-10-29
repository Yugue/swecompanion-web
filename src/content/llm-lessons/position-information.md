# Position information

## 1. Make order available

**Position information** tells a sequence model where tokens occur. Without position signals or other order-sensitive structure, unmasked self-attention treats reordered inputs as a reordered set of states.

“Dog bites man” and “man bites dog” contain the same words but express different events.

## 2. Attach absolute positions

An **absolute position embedding** assigns a vector to each index. Adding it to the token embedding makes the input depend on both token identity and location.

The added vectors must have compatible widths. Learned absolute tables need a defined strategy for indices beyond their trained range.

## 3. Rotate query and key pairs

**Rotary position encoding (RoPE)** rotates coordinate pairs in queries and keys by position-dependent angles. A **rotation** turns a two-coordinate vector without changing its length.

Each coordinate pair uses its own rotation rate. RoPE changes query/key comparisons rather than adding a position vector to every value.

## 4. See the relative gap

For one coordinate pair:
\[
\begin{aligned}
q_m&=R_{m\omega}q,\quad k_n=R_{n\omega}k\\
q_m^\top k_n&=q^\top R_{(n-m)\omega}k
\end{aligned}
\]
q and k are unrotated content vectors; m and n their positions; ω a rotation rate; \(R_a\) rotates by angle a. Their comparison depends on the relative gap n−m.

```genai-visual
rotary-relative
```

Rotating both arrows together preserves their angle. Changing the gap changes their angle and therefore the dot product. The comparison holds the content vectors fixed.

## 5. Distinguish masks from position signals

A causal mask defines legal information access. Position encoding represents location within that access pattern.

Both can encode aspects of order, but they perform different jobs. A position signal cannot make an otherwise illegal future token safe to read.

## 6. Test longer contexts

A **context window** is the supported number of input and generated positions under a model’s configuration. Extrapolating beyond trained lengths can distort relative-position behavior and use of distant evidence.

Test evidence at different locations and distances. Accepting a long prompt is weaker evidence than using its relevant details correctly.
