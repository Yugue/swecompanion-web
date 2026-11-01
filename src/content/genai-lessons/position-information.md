# Position information

## 1. Make order available

**Position information** represents location. Text uses sequence positions; image and video inputs may require spatial and temporal distinctions.

“Dog bites man” and “man bites dog” contain the same words but express different events.

## 2. Attach absolute positions

An **absolute position embedding** adds an index-specific vector. Flattened image inputs need a defined correspondence between indices and spatial layout.

Compatible feature widths permit addition; they do not make a learned position table valid at unseen image resolutions or sequence lengths.

## 3. Rotate query and key pairs

**Rotary position encoding (RoPE)** applies position-dependent query/key rotations. A **rotation** changes a coordinate pair's direction while preserving its length.

Coordinate pairs use different angular rates. For media inputs, any extension to multiple position axes must specify how those axes enter rotations.

## 4. See the relative gap

For one coordinate pair:
\[
\begin{aligned}
q_m&=R_{m\omega}q,\quad k_n=R_{n\omega}k\\
q_m^\top k_n&=q^\top R_{(n-m)\omega}k
\end{aligned}
\]
Rₐ denotes rotation by a; q and k are content vectors, m and n positions, and ω angular rate. The resulting comparison depends on n−m.

```genai-visual
rotary-relative
```

The two-arrow figure isolates relative position with fixed content. Real visual patches also change their content descriptors, so position alone does not determine similarity.

## 5. Distinguish masks from position signals

A causal mask defines legal information access. Position encoding represents location within that access pattern.

A location representation does not override an access mask. For example, adding time coordinates cannot authorize future frames in a causal streaming task.

## 6. Test longer contexts

A **context window** is the supported number of input and generated positions under a model’s configuration. Extrapolating beyond trained lengths can distort relative-position behavior and retrieval quality.

Test changed resolutions, longer clips, and displaced evidence separately. More accepted positions do not establish useful generalization across those changes.

Image patches have row and column locations; video also adds time. A useful position design must distinguish the relevant axes rather than flattening them and assuming sequence distance fully describes their relationship.
