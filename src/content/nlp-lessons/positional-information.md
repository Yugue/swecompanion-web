# Representing position and word order

## 1. Distinguish identity from position

A **position mechanism** represents where tokens occur or how positions relate.

Without order information, unrestricted self-attention rearranges its outputs when inputs are rearranged.

## 2. See the lost distinction

```nlp-visual
positions
```

“Dog bites man” and “man bites dog” use the same tokens.

**Equivariance** means input rearrangement produces corresponding output rearrangement. Mean pooling then gives the same summary for these permutations.

Restricting a position to its prefix already adds order information. This example instead permits unrestricted access.

## 3. Add absolute positions

An **absolute position embedding** assigns a vector per index:

\[
z_t=e_t+p_t
\]

e_t is token embedding, p_t position vector, z_t combined input; widths match. Moving a word changes which position vector it receives.

Learned tables fit these vectors; sinusoidal encodings use fixed sine/cosine patterns at several frequencies.

## 4. Compare relative mechanisms

| Mechanism | How order enters |
|---|---|
| Relative position | Scores or states depend on positional offsets |
| Rotary position embeddings (RoPE) | Position-dependent rotations of query/key coordinate pairs |

RoPE preserves each pair’s length while changing orientation; query–key dot products depend on relative rotation. It does not simply add a position vector to input embeddings.

## 5. Test extrapolation

Computing an encoding at position 20,000 does not establish useful reasoning at that distance.

Training lengths, position rules, and retained evidence affect long-context behavior. Test tasks requiring the claimed relationship.
