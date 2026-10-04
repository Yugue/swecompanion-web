# 1.1 Image formation and digital representation

## 1. Start with a measurement of light

A camera records **light measurements**, which become pixel values.

```text
scene + lighting → lens → sensor → processing → image
```

The same object can look different under another light, exposure, or camera.

> Think of an image as a measurement of the scene, not the scene itself.

## 2. Exposure, blur, and clipping

- **Longer exposure:** more light, but more motion blur.
- **Larger aperture:** more light; changes depth of field.
- **Gain:** amplifies the signal and existing noise.

Example: a conveyor moves at 800 pixels/second during a 10 ms exposure.

\[
\text{blur}\approx800\times0.01=8\text{ pixels}
\]

A two-pixel scratch may disappear.

**Clipping:** two different bright surfaces both become 255. Contrast adjustment cannot recover their difference.

## 3. Digital images are arrays

| Representation | Shape |
|---|---|
| RGB image | H × W × 3 |
| PyTorch batch | B × C × H × W |
| Grayscale image | H × W |
| Grayscale batch | B × 1 × H × W |

H/W are height/width, C channels, B batch size.

Example: 32 RGB images at 224 × 224 become **[32, 3, 224, 224]**.

Eight-bit values use 0–255; model floats may use 0–1 or standardized values.

## 4. Encoding and orientation

- **JPEG:** lossy; can remove detail or introduce blocks.
- **PNG:** preserves stored pixels, including any existing blur.
- **EXIF:** may specify a rotation.
- **Alpha:** transparency, not automatically a model feature.

Decoded RGB may already include white balance and tone mapping.

## 5. Convert an image into a tensor

For an RGB uint8 array, with PyTorch imported:

```python
x = torch.from_numpy(image).permute(2, 0, 1).float() / 255
x = x.unsqueeze(0)  # HWC → CHW → BCHW
```

**Permute** reorders axes. Reshape alone does not move channels into the right positions.

## 6. Practical diagnosis

Inspect the actual input:

- Is the object sharp and large enough?
- Are bright/dark regions clipped?
- Are colors and orientation correct?
- Do shape and numeric range match the model?

Compare successful and failing captures of the same scene.

## 7. Interview reasoning

**Question:** Why might a daytime model fail at night?

**Answer:** Check light, noise, exposure, blur, and color first. Improve capture if evidence is missing; add representative night data if useful evidence remains.
