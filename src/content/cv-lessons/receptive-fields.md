# 4.2 Spatial dimensions, receptive fields, and resolution

## 1. Count locations and context separately

- **Output size:** how many cells remain.
- **Receptive field:** which input region can influence one cell.

> Picture each output cell as a window looking onto the original image.

A small output map does not automatically imply full-image context.

## 2. Output size

For one dimension:

\[
O=\left\lfloor\frac{I+2P-D(K-1)-1}{S}\right\rfloor+1
\]

I=input size, P=padding, D=dilation, K=kernel, S=stride.

Example: I=32,P=1,D=1,K=3,S=2 → **O=16**.

At stride one → 32. Apply separately to height/width; special padding/ceil modes need their own rules.

## 3. Receptive-field growth

Track field r and input-space jump j:

\[
r_l=r_{l-1}+(K_l-1)D_lj_{l-1},\qquad
j_l=j_{l-1}S_l
\]

Start r=1,j=1.

A 3 × 3 stride-two layer gives r=3,j=2. Later neighbors are now two input pixels apart.

## 4. Worked example

```text
32 × 32 input       field 1, jump 1
 → 3×3, stride 2    field 3, jump 2; output 16 × 16
 → 3×3, stride 1    field 7, jump 2; output 16 × 16
```

The second layer adds \(2\times2=4\), giving **seven**, not five.

The theoretical field describes possible influence. Learned influence can concentrate within it.

## 5. Pooling and aggregation

- **Max pooling:** retain the strongest nearby value.
- **Average pooling:** summarize nearby values.
- **Global average:** one value per channel.

Example: [1,3,2,4] → max 4, average 2.5.

Pooling typically loses precise location. Global aggregation suits classification but may remove evidence needed for masks/boxes.

## 6. Dilation

A 3 × 3 kernel with dilation two spans **five pixels**, using nine spatial weights per channel pair.

It increases context without matching downsampling. Sparse coverage can create gridding or miss intermediate detail.

## 7. Small objects

At output stride 16, a six-pixel object can occupy less than one feature cell.

Consider:
- Higher input resolution.
- Lower output stride.
- Tiling or fine feature paths.

Track padding and coordinate offsets for localization.

## 8. Interview reasoning

**Question:** Two 3 × 3 layers, strides two then one—field?

**Answer:** Start r=j=1. First gives r=3,j=2; second adds four, giving r=7. Calculate output size separately.
