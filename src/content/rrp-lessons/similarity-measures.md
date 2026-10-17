## Similarity and co-occurrence

A **similarity measure** turns representations into a numeric comparison. **Co-occurrence** is shared participation in a stated observation unit, such as users consuming both items during a month.

Different measures reward different relationships. No normalization removes every bias in the log.

## 1. Raw overlap and relative overlap differ

Suppose 1,000 users form the reference population:

| Item | Users consuming it | Users also consuming A |
|---|---|---|
| A | 100 | 100 |
| B | 400 | 20 |
| C | 20 | 10 |

Raw overlap prefers B: 20 versus 10. C shares half its audience with A; B shares only one twentieth. Relative association can therefore tell a different story from absolute reach.

## 2. Three common measures

For binary user-incidence vectors:

\[
\operatorname{cosine}(A,B)=\frac{n_{AB}}{\sqrt{n_A n_B}},\qquad
\operatorname{Jaccard}(A,B)=\frac{n_{AB}}{n_A+n_B-n_{AB}}
\]

**Cosine similarity** compares vector direction. Its overlap-count form above assumes binary coordinates; general vectors use a dot product divided by vector lengths.

**Jaccard similarity** divides set intersection size by union size. Here cosine is 0.10 for A–B and about 0.224 for A–C.

**Pointwise mutual information (PMI)** compares joint occurrence with what independence would predict:

\[
\operatorname{PMI}(A,B)=\log\frac{P(A,B)}{P(A)P(B)}
\]

Use one consistent population and window for these probabilities. Positive PMI means more shared occurrence than the independence reference, not proof of useful recommendations.

## 3. Small overlaps need caution

Two items consumed by the same single user can have cosine 1. Their apparent perfect similarity has little support.

**Shrinkage** reduces reliance on small samples. One heuristic multiplies a similarity by \(n_{AB}/(n_{AB}+\alpha)\). With \(\alpha=10\), one shared user retains 1/11 of its score; 100 retain 100/110. Tune this choice against the intended task.

Minimum-support rules and smoothing can help too, but can reduce discovery of rare useful pairs.

## 4. Match the measure to the use

Raw counts can be useful when total demand matters. Normalized association can reveal smaller related audiences. PMI can emphasize surprising rare pairs and therefore needs careful support checks.

Evaluate candidate quality and coverage, not just visually appealing neighbors. All measures inherit exposure and eligibility patterns: items displayed together often can look associated because the system repeatedly provided that opportunity.
