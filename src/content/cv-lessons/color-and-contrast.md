# 1.5 Color, intensity, and contrast transformations

## 1. Choose which signal to preserve

A **color space** changes how color is represented.

Example: red and green lights may have similar grayscale brightness. Removing color could erase the distinction you need.

> Keep color when it defines the answer; simplify it when it does not.

## 2. RGB, BGR, and HSV

| Representation | Meaning / use |
|---|---|
| RGB | Red, green, blue; common model convention |
| BGR | OpenCV’s common decoding order |
| Grayscale | One brightness-like channel |
| HSV | Hue, saturation, value; simple color rules |

**Hue** is a circular color angle. Red may need two intervals around the range endpoints.

Low saturation makes hue unreliable. Lighting and white balance can shift colors.

## 3. Gamma

A power transform changes midtones:

\[
y=x^\gamma,\qquad x\in[0,1]
\]

Example:

\[
x=0.25,\quad\gamma=0.5\quad\Rightarrow\quad y=0.5
\]

Under this convention:

- Gamma below 1 → brighter midtones.
- Gamma above 1 → darker midtones.

Some APIs use the inverse exponent. Physical averaging needs linear-light values, not uncorrected display-encoded bytes.

## 4. Histograms and contrast

A **histogram** counts pixels in intensity bins. It ignores where those pixels occur.

Example: rearranging every pixel leaves the histogram unchanged.

- **Contrast stretching:** expand a chosen intensity range.
- **Equalization:** redistribute values using the cumulative histogram.
- **CLAHE:** local equalization with limited amplification.

These can amplify noise. None recovers clipped detail.

## 5. A color pipeline

```text
decode BGR → choose representation → apply transform → inspect result
```

For an OpenCV-decoded image:

```python
rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
```

Convert once. Reversing channels twice returns to BGR.

## 6. Scaling versus normalization

These operations do different things:

| Operation | Example |
|---|---|
| Divide by 255 | 128 → about 0.502 |
| Standardize | Subtract channel mean, divide by standard deviation |
| Equalize | Change the intensity distribution |

Input standardization is separate from internal BatchNorm/LayerNorm. Match pretrained preprocessing.

## 7. Interview reasoning

**Question:** When would grayscale help?

**Answer:** When shape or intensity determines the target, such as controlled component counting. Retain color for color-defined categories; compare representative examples before choosing.
