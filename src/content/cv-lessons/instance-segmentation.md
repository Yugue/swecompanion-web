# 5.5 Instance and panoptic segmentation

## 1. Categories versus individuals

```text
semantic → all person pixels
instance → person #1 + person #2
panoptic → #1 + #2 + road + sky
```

Instance segmentation separates object masks. Panoptic output combines object identities and category-level regions into a final scene assignment.

## 2. Things and stuff

- **Things:** countable instances, such as cars.
- **Stuff:** category regions, such as road.

The annotation policy defines the distinction.

Example: one dataset labels “vegetation”; a tree-counting task needs individual trees.

Define overlap and ambiguity rules before labeling.

## 3. Region-based masks

Mask R-CNN-style processing:

**Propose region → refine box/class → predict aligned mask.**

A missed proposal means a missed mask. Feature alignment and mask resolution affect boundaries.

Finding the object and outlining it are distinct failure stages.

## 4. Direct mask prediction

Other designs use:
- Centers.
- Learned object slots.
- Shared mask features with instance-specific coefficients.

Ask how each prediction owns an object and avoids duplicates.

More output masks cannot fix supervision that merges touching people.

## 5. Evaluation

Mask AP uses ranked matching with mask overlap. Strong box AP does not guarantee accurate contours.

Panoptic Quality:

\[
PQ=\frac{\sum_{(p,g)\in TP}\mathrm{IoU}(p,g)}
{|TP|+\tfrac12|FP|+\tfrac12|FN|}
\]

Example: two matched segments at IoU 0.8, one extra, one missed:

**PQ=1.6/3≈0.533.**

TP is eligible matched segments; FP/FN are extras/misses. Follow benchmark category, overlap, and ignored-region rules.

## 6. Assemble a complete scene

Panoptic output assigns each included pixel a category and applicable instance ID. Resolve overlapping masks with a defined priority or joint rule.

| Failure | Investigate |
|---|---|
| People merged | Instance separation/supervision |
| One object fragmented | Representation/duplicates |
| Weak boundaries | Resolution/alignment/labels |
| Right mask, wrong class | Recognition |

## 7. Choose necessary outputs

- Class area → semantic mask.
- Individual contours → instance masks.
- Complete categories/IDs → panoptic output.
- Simple counting/location → boxes may suffice.

Richer output adds labeling and serving cost.

## 8. Interview reasoning

**Question:** Count people and label the road—what output?

**Answer:** Person instances plus road semantics. Use panoptic output if complete pixel assignments matter; boxes plus a road mask may satisfy the decision more cheaply.
