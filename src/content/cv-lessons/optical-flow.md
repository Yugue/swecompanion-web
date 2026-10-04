# 2.7 Motion estimation and optical flow

## 1. Flow is apparent image motion

**Optical flow** estimates pixel displacement between frames.

Example: (20,30) → (23,31) gives flow **(3,1)** pixels/frame.

It can reflect camera or object movement. It is not automatically 3D motion or persistent identity.

## 2. Brightness constancy

Assume a moving point keeps approximately the same intensity. For small motion:

\[
I_xu+I_yv+I_t=0
\]

\(I_x,I_y\): spatial derivatives; \(I_t\): temporal change; u,v: motion components.

Lighting changes, reflections, and occlusion break the assumption.

## 3. The aperture problem

One equation cannot determine both u and v.

Example: \(I_x=2,I_y=0,I_t=-6\) gives **u=3**, with v unconstrained.

```text
edge   → perpendicular motion visible; along-edge motion ambiguous
corner → two directions constrained
flat   → little motion evidence
```

## 4. Add neighborhood or global constraints

**Lucas–Kanade** combines nearby gradient equations, assuming shared local motion.

**Dense methods** add smoothness or learned correspondence.

- Sparse flow: selected points.
- Dense flow: broad spatial coverage.
- Smoothness: fills weak regions but may smear motion boundaries.

More output values do not guarantee more reliable evidence.

## 5. Coarse-to-fine estimation

A 32-pixel displacement becomes four pixels after 8× reduction.

Estimate coarse motion, then refine at higher resolution.

Tiny objects may disappear on the coarse grid. Large motion and occlusion can still defeat the method.

## 6. Occlusion and consistency

Forward flow followed by backward flow should return a visible point near its start.

Example: (20,30) → (23,31) → (20,30) is consistent.

A point leaving view has no valid counterpart. Repeated textures can produce consistent but incorrect matches.

## 7. Practical use

```python
next_points, valid, error = cv2.calcOpticalFlowPyrLK(
    previous_gray, next_gray, previous_points, None
)
```

Check validity before reusing points.

Flow helps stabilization, alignment, and short-term motion cues. Tracking additionally needs identity and lifecycle rules.

## 8. Interview reasoning

**Question:** Why track corners rather than straight edges?

**Answer:** Corners constrain both directions. Straight edges mainly constrain perpendicular motion; use additional context or reject weakly constrained points.
